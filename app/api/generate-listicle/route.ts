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

async function getApiKeys() {
    try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        const envKeys = {
            openrouterKey: process.env.OPENROUTER_API_KEY,
            replicateToken: process.env.REPLICATE_API_TOKEN,
            openrouterModel: 'anthropic/claude-3.5-sonnet',
            apiFreeKey: process.env.APIFREE_API_KEY,
            apiFreeModel: 'gpt-4o',
            apiFreeImageModel: 'dall-e-3'
        }

        if (!supabaseUrl || !supabaseKey) {
            return envKeys
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data, error } = await supabase
            .from('site_settings')
            .select('setting_key, setting_value')
            .in('setting_key', ['openrouter_api_key', 'replicate_api_token', 'openrouter_model', 'apifree_api_key', 'apifree_model'])

        if (error || !data) {
            return envKeys
        }

        const openrouterSetting = data.find(s => s.setting_key === 'openrouter_api_key')
        const replicateSetting = data.find(s => s.setting_key === 'replicate_api_token')
        const modelSetting = data.find(s => s.setting_key === 'openrouter_model')

        const apiFreeKeySetting = data.find(s => s.setting_key === 'apifree_api_key')
        const apiFreeModelSetting = data.find(s => s.setting_key === 'apifree_model')
        const apiFreeImageModelSetting = data.find(s => s.setting_key === 'apifree_image_model')

        return {
            openrouterKey: openrouterSetting?.setting_value || envKeys.openrouterKey,
            replicateToken: replicateSetting?.setting_value || envKeys.replicateToken,
            openrouterModel: modelSetting?.setting_value || envKeys.openrouterModel,
            apiFreeKey: apiFreeKeySetting?.setting_value || envKeys.apiFreeKey,
            apiFreeModel: apiFreeModelSetting?.setting_value || envKeys.apiFreeModel,
            apiFreeImageModel: apiFreeImageModelSetting?.setting_value || 'dall-e-3'
        }
    } catch (error) {
        console.error('Error fetching API keys from database:', error)
        return {
            openrouterKey: process.env.OPENROUTER_API_KEY,
            replicateToken: process.env.REPLICATE_API_TOKEN,
            openrouterModel: 'anthropic/claude-3.5-sonnet',
            apiFreeKey: process.env.APIFREE_API_KEY,
            apiFreeModel: 'gpt-4o',
            apiFreeImageModel: 'dall-e-3'
        }
    }
}

async function generateArticleContent(topic: string, cleanTopic: string, itemCount: number, keywords?: string) {
    const { openrouterKey, openrouterModel, apiFreeKey, apiFreeModel } = await getApiKeys()

    const keywordsSection = keywords ? `\n\nSEO KEYWORDS TO INCORPORATE:\n${keywords}\n\nNaturally weave these keywords throughout the article for SEO optimization.` : ''

    // Construct Prompt (Same for both providers)
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

    let response;
    let provider = '';

    // Prefer APIFree if available
    if (apiFreeKey) {
        console.log(`Generating text using APIFree.ai (Model: ${apiFreeModel})`)
        response = await fetch('https://api.apifree.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiFreeKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: apiFreeModel || 'gpt-4o',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.8,
                max_tokens: 4000
            })
        })
        provider = 'APIFree';
    } else if (openrouterKey) {
        console.log(`Generating text using OpenRouter (Model: ${openrouterModel})`)
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${openrouterKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://pickpoynt.com',
                'X-Title': 'PickPoynt Article Generator'
            },
            body: JSON.stringify({
                model: openrouterModel,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.8,
                max_tokens: 8000
            })
        })
        provider = 'OpenRouter';
    } else {
        throw new Error('No API Key configured! Please add APIFree.ai Key OR OpenRouter Key in Settings.')
    }

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`${provider} API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Extract JSON from response (handle markdown code blocks and conversational text)
    let jsonContent = content.trim()
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
        jsonContent = jsonMatch[1].trim()
    } else if (content.indexOf('{') > -1 && content.lastIndexOf('}') > -1) {
        // Fallback: search for outermost braces
        const start = content.indexOf('{')
        const end = content.lastIndexOf('}') + 1
        jsonContent = content.substring(start, end).trim()
    }

    try {
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
    } catch (e) {
        console.error("JSON Parse Error:", e)
        console.error("Raw Content:", jsonContent)
        throw new Error(`Failed to parse AI response. The model didn't return valid JSON.`)
    }
}

async function generateImages(items: ListicleItem[]) {
    const { replicateToken, apiFreeKey, apiFreeImageModel } = await getApiKeys()

    // Generate images in parallel
    const imagePromises = items.map(async (item, index) => {
        try {
            // Option 1: APIFree (DALL-E 3)
            if (apiFreeKey) {
                const response = await fetch('https://api.apifree.ai/v1/images/generations', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiFreeKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: apiFreeImageModel,
                        prompt: item.imagePrompt + ", professional photography, 4k, photorealistic",
                        n: 1,
                        size: "1024x1024"
                    })
                })


                if (response.ok) {
                    const data = await response.json()
                    if (data.data && data.data[0] && data.data[0].url) {
                        return { ...item, imageUrl: data.data[0].url }
                    }
                } else {
                    console.warn(`APIFree Image Error: ${response.status}`)
                }
            }

            // Option 2: Replicate (Stable Diffusion)
            if (replicateToken) {
                const response = await fetch('https://api.replicate.com/v1/predictions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${replicateToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        version: 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
                        input: {
                            prompt: item.imagePrompt + ", professional photography, high quality, 4k",
                            negative_prompt: "ugly, blurry, low quality, distorted, watermark, text",
                            width: 1024,
                            height: 1024
                        }
                    })
                })

                if (response.ok) {
                    const prediction = await response.json()
                    const imageUrl = await pollPrediction(prediction.id, replicateToken)
                    if (imageUrl) return { ...item, imageUrl }
                }
            }

            // Fallback: Pollinations
            return {
                ...item,
                imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(item.imagePrompt + " professional photography 4k")}`
            }

        } catch (error) {
            console.error(`Error generating image for item ${index}:`, error)
            // Fallback: Pollinations
            return {
                ...item,
                imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent(item.imagePrompt + " professional photography 4k")}`
            }
        }
    })

    return await Promise.all(imagePromises)
}

async function pollPrediction(predictionId: string, token: string, maxAttempts = 30): Promise<string | null> {
    for (let i = 0; i < maxAttempts; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
            headers: { 'Authorization': `Token ${token}` }
        })
        const prediction = await response.json()
        if (prediction.status === 'succeeded') return prediction.output[0]
        if (prediction.status === 'failed') throw new Error('Image generation failed')
    }
    return null
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
