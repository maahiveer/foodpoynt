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
            apiFreeModel: 'gpt-4o-mini',
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
            apiFreeModel: 'gpt-4o-mini',
            apiFreeImageModel: 'dall-e-3'
        }
    }
}

async function generateArticleContent(topic: string, cleanTopic: string, itemCount: number, keywords?: string) {
    const { openrouterKey, openrouterModel, apiFreeKey, apiFreeModel } = await getApiKeys()

    const keywordsSection = keywords ? `\n\nSEO KEYWORDS TO INCORPORATE:\n${keywords}\n\nNaturally weave these keywords throughout the article for SEO optimization.` : ''

    // Construct Prompt (Same for both providers)
    const prompt = `Write a high-quality SEO article titled "${topic}" that is both engaging and informative. The article must be written as if you are having a friendly, informal conversation with a fellow enthusiast.${keywordsSection}

STYLE & TONE:
- Conversational and Informal: Write like you're talking to a friend.
- Use everyday language, avoid formal/academic tone.
- Inject light sarcasm and humor sparingly.
- Active voice ONLY.
- Use rhetorical questions to engage readers.
- Occasionally use slang (FYI, IMO) and emoticons - limit to 2-3 times total.

STRUCTURE:
1. Intro: 2-3 paragraph hook (150-200 words).
2. Items: Create ${itemCount} items based on the topic. Each item should have a title, a 200-word description, and a detailed image prompt.
3. Conclusion: 100-150 words summarizing key points.

RESPONSE FORMAT:
You MUST respond with ONLY a valid JSON object. Do not include any text before or after the JSON.

JSON SCHEMA:
{
  "title": "String - SEO Title",
  "intro": "String - HTML formatted introduction",
  "items": [
    {
      "title": "String - Item Title",
      "content": "String - HTML formatted content (approx 200 words)",
      "imagePrompt": "String - Detailed prompt for image generation"
    }
  ],
  "conclusion": "String - HTML formatted conclusion"
}

Remember: Output ONLY the JSON object.`

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
                model: apiFreeModel || 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 8000
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
                temperature: 0.7,
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

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Unexpected AI response format:', data)
        const apiError = data.error?.message || data.error || data.message || JSON.stringify(data)
        throw new Error(`AI API Error (${provider}): ${apiError}`)
    }

    const content = data.choices[0].message.content

    // Robust JSON Extraction
    let jsonContent = content.trim()

    // 1. Try extracting content within markdown code blocks
    const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (codeBlockMatch) {
        jsonContent = codeBlockMatch[1].trim()
    } else {
        // 2. Try finding the first '{' and last '}'
        const firstBrace = content.indexOf('{')
        const lastBrace = content.lastIndexOf('}')
        if (firstBrace !== -1 && lastBrace !== -1) {
            jsonContent = content.substring(firstBrace, lastBrace + 1).trim()
        }
    }

    try {
        // Simple Cleanup: Remove potentially breaking characters/formatting if common
        // (Like trailing commas before closing braces/brackets)
        const sanitizedJson = jsonContent
            .replace(/,\s*}/g, '}')
            .replace(/,\s*\]/g, ']')

        const parsed = JSON.parse(sanitizedJson)

        return {
            title: parsed.title || topic,
            slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            excerpt: (parsed.intro || '').substring(0, 160).replace(/<[^>]*>/g, '') + '...',
            intro: parsed.intro || '',
            items: parsed.items || [],
            conclusion: parsed.conclusion || '',
            tags: [cleanTopic.split(' ')[0], 'Guide', 'Ideas', 'Inspiration', '2024']
        }
    } catch (e) {
        console.error("JSON Parse Error:", e)
        console.error("Raw Content Sample:", content.substring(0, 500) + "...")
        throw new Error(`Failed to parse AI response. The model didn't return valid JSON. Error: ${e instanceof Error ? e.message : 'Unknown'}`)
    }
}

async function generateImages(items: ListicleItem[] = []) {
    const { replicateToken, apiFreeKey, apiFreeImageModel } = await getApiKeys()

    if (!items || !Array.isArray(items)) return []

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
        if (prediction.status === 'succeeded') {
            return (prediction.output && prediction.output.length > 0) ? prediction.output[0] : null
        }
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
