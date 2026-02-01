import { NextResponse } from 'next/server'

interface ListicleItem {
    title: string
    content: string
    imagePrompt: string
}

export async function POST(request: Request) {
    try {
        const { topic, keywords } = await request.json()

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
        }

        console.log(`Generating listicle for topic: ${topic}`)

        // Extract number from topic (e.g., "12 cozy sweater outfits" -> 12)
        const listMatch = topic.match(/^(\d+)/)
        const itemCount = listMatch ? parseInt(listMatch[1]) : 10
        const cleanTopic = topic.replace(/^\d+\s*/, '')

        // Step 1: Generate article structure and content using OpenRouter
        const articleContent = await generateArticleContent(topic, cleanTopic, itemCount, keywords)

        // Step 2: Generate images for each item using Replicate
        const itemsWithImages = await generateImages(articleContent.items)

        // Step 3: Construct final HTML
        const htmlContent = constructHTML(articleContent, itemsWithImages)

        return NextResponse.json({
            title: articleContent.title,
            slug: articleContent.slug,
            excerpt: articleContent.excerpt,
            content: htmlContent,
            tags: articleContent.tags,
            featured_image: itemsWithImages[0]?.imageUrl || '',
            status: 'draft'
        })

    } catch (error: any) {
        console.error('Generation error:', error)
        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 })
    }
}

async function generateArticleContent(topic: string, cleanTopic: string, itemCount: number, keywords?: string) {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

    if (!OPENROUTER_API_KEY) {
        throw new Error('OPENROUTER_API_KEY not configured')
    }

    const keywordsSection = keywords ? `

SEO KEYWORDS TO INCORPORATE:
${keywords}

Naturally weave these keywords throughout the article for SEO optimization.` : ''

    const prompt = `Write a 1,500-word SEO article titled "${topic}" that is both engaging and informative. The article must be written as if you are having a friendly, informal conversation with a fellow enthusiast.${keywordsSection}

CRITICAL FORMATTING REQUIREMENT: You MUST respond with ONLY valid JSON in this exact structure (no markdown, no code blocks, just pure JSON):

{
  "title": "SEO-optimized title",
  "intro": "2-3 paragraph introduction (150-200 words)",
  "items": [
    {
      "title": "Item title",
      "content": "200-word description",
      "imagePrompt": "detailed image prompt"
    }
  ],
  "conclusion": "Conclusion paragraph (100-150 words)"
}

Style & Tone Requirements:
1. Conversational and Informal - Write as if talking to a friend
2. Use everyday language, avoid formal/academic tone
3. Inject light sarcasm and humor sparingly
4. Include personal opinions or anecdotes
5. Active voice ONLY - "I love this" not "This is loved"
6. Use rhetorical questions to engage readers
7. Occasionally use slang (FYI, IMO) and emoticons (:) or :/) - limit to 2-3 times total

Content Requirements:
- Create ${itemCount} items, each with EXACTLY 200 words
- Keep paragraphs short (3-4 sentences)
- Bold key information using <strong> tags
- Be concise and clear - no filler phrases
- Include honest comparisons and genuine insights
- Each item should have a detailed, specific image prompt for photorealistic generation

Introduction Requirements:
- Start with a punchy hook
- Avoid generic openers like "In today's world" or "dive into"
- Immediately address reader's needs

Conclusion Requirements:
- Concise summary of key points
- Engaging final thought or call to action
- Memorable impression with personal touch

Remember: Output ONLY the JSON object, nothing else.`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://pickpoynt.com',
            'X-Title': 'PickPoynt Article Generator'
        },
        body: JSON.stringify({
            model: 'anthropic/claude-3.5-sonnet',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.8,
            max_tokens: 8000
        })
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Extract JSON from response (handle markdown code blocks)
    let jsonContent = content.trim()

    // Remove markdown code blocks if present
    if (jsonContent.startsWith('```')) {
        const jsonMatch = jsonContent.match(/```(?:json)?\n([\s\S]*?)\n```/)
        if (jsonMatch) {
            jsonContent = jsonMatch[1]
        }
    }

    const parsed = JSON.parse(jsonContent)

    return {
        title: parsed.title,
        slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        excerpt: parsed.intro.substring(0, 160).replace(/<[^>]*>/g, '') + '...',
        intro: parsed.intro,
        items: parsed.items,
        conclusion: parsed.conclusion,
        tags: [cleanTopic.split(' ')[0], 'Guide', 'Ideas', 'Inspiration', '2024']
    }
}

async function generateImages(items: ListicleItem[]) {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

    if (!REPLICATE_API_TOKEN) {
        console.warn('REPLICATE_API_TOKEN not configured, using fallback images')
        return items.map((item, index) => ({
            ...item,
            imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(item.imagePrompt + " professional photography 4k high quality")}`
        }))
    }

    // Generate images in parallel
    const imagePromises = items.map(async (item, index) => {
        try {
            const response = await fetch('https://api.replicate.com/v1/predictions', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${REPLICATE_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
                    input: {
                        prompt: item.imagePrompt + ", professional photography, high quality, 4k, detailed, photorealistic",
                        negative_prompt: "ugly, blurry, low quality, distorted, watermark, text, cartoon, anime",
                        width: 1024,
                        height: 1024
                    }
                })
            })

            if (!response.ok) {
                throw new Error(`Replicate API error: ${response.status}`)
            }

            const prediction = await response.json()

            // Poll for completion
            let imageUrl = await pollPrediction(prediction.id, REPLICATE_API_TOKEN)

            return {
                ...item,
                imageUrl: imageUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(item.imagePrompt)}`
            }
        } catch (error) {
            console.error(`Error generating image for item ${index}:`, error)
            return {
                ...item,
                imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(item.imagePrompt)}`
            }
        }
    })

    return await Promise.all(imagePromises)
}

async function pollPrediction(predictionId: string, token: string, maxAttempts = 30): Promise<string | null> {
    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds

        const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })

        const prediction = await response.json()

        if (prediction.status === 'succeeded') {
            return prediction.output[0] // Return first image URL
        }

        if (prediction.status === 'failed') {
            throw new Error('Image generation failed')
        }
    }

    return null // Timeout
}

function constructHTML(articleContent: any, itemsWithImages: any[]) {
    let html = `<div class="article-intro">${articleContent.intro}</div>\n\n`

    itemsWithImages.forEach((item, index) => {
        html += `
<h2>${index + 1}. ${item.title}</h2>

<figure style="margin: 30px 0;">
  <img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);" />
  <figcaption style="text-align: center; margin-top: 12px; color: #64748b; font-size: 0.9rem; font-style: italic;">${item.title}</figcaption>
</figure>

<div class="item-content">${item.content}</div>

${index < itemsWithImages.length - 1 ? '<hr style="margin: 50px 0; border: 0; border-top: 1px solid #e2e8f0;" />' : ''}
`
    })

    html += `\n<h2>Final Thoughts</h2>\n<div class="conclusion">${articleContent.conclusion}</div>`

    return html
}
