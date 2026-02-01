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

        console.log(`Generating article with Gemini for topic: ${topic}`)

        // Extract number from topic
        const listMatch = topic.match(/^(\d+)/)
        const itemCount = listMatch ? parseInt(listMatch[1]) : 10
        const cleanTopic = topic.replace(/^\d+\s*/, '')

        // Get Gemini API key
        const GEMINI_API_KEY = await getGeminiKey()

        if (!GEMINI_API_KEY) {
            return NextResponse.json({
                error: 'Gemini API key not configured. Please add it in Settings.'
            }, { status: 400 })
        }

        // Generate article with Gemini
        const articleContent = await generateWithGemini(topic, cleanTopic, itemCount, keywords, GEMINI_API_KEY)

        // Generate images with Pollinations (free) - using sequential processing to be safe
        const itemsWithImages = await Promise.all(articleContent.items.map(async (item: ListicleItem, index: number) => {
            // Add a random seed to prevent caching and ensure variety
            const randomSeed = Math.floor(Math.random() * 1000000)
            const enhancedPrompt = `${item.imagePrompt}, professional photography, 4k, high quality, realistic, detailed`
            const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?seed=${randomSeed}&width=1024&height=1024&nologo=true`

            // Validate image URL (optional, but good for debugging if needed)
            // checkImage(imageUrl) 

            return {
                ...item,
                imageUrl
            }
        }))

        // Construct HTML
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
        console.error('Gemini generation error:', error)
        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 })
    }
}

async function getGeminiKey() {
    try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
            return process.env.GEMINI_API_KEY
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data, error } = await supabase
            .from('site_settings')
            .select('setting_value')
            .eq('setting_key', 'gemini_api_key')
            .single()

        if (error || !data) {
            return process.env.GEMINI_API_KEY
        }

        return data.setting_value || process.env.GEMINI_API_KEY
    } catch (error) {
        console.error('Error fetching Gemini key:', error)
        return process.env.GEMINI_API_KEY
    }
}

// Helper to find a working model for the specific API key
async function getWorkingGeminiModel(apiKey: string): Promise<string> {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) return 'gemini-1.5-flash'; // Fallback

        const data = await response.json();
        const models = data.models || [];

        // Filter for models that support text generation
        const generateModels = models.filter((m: any) =>
            m.supportedGenerationMethods &&
            m.supportedGenerationMethods.includes('generateContent') &&
            m.name.includes('gemini')
        );

        // Sort preference: 1.5-flash -> 1.5-pro -> 1.0-pro -> any gemini
        const preferredOrder = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];

        for (const pref of preferredOrder) {
            const found = generateModels.find((m: any) => m.name.includes(pref));
            if (found) return found.name.replace('models/', '');
        }

        if (generateModels.length > 0) {
            return generateModels[0].name.replace('models/', '');
        }

        return 'gemini-1.5-flash'; // Ultimate fallback
    } catch (e) {
        console.error("Error listing models:", e);
        return 'gemini-1.5-flash';
    }
}

async function generateWithGemini(topic: string, cleanTopic: string, itemCount: number, keywords: string | undefined, apiKey: string) {
    const keywordsSection = keywords ? `\n\nSEO KEYWORDS TO INCORPORATE:\n${keywords}\n\nNaturally weave these keywords throughout the article for SEO optimization.` : ''

    const prompt = `Write a 1,500-word SEO article titled "${topic}" that is both engaging and informative. The article must be written as if you are having a friendly, informal conversation with a fellow enthusiast.${keywordsSection}

CRITICAL: You MUST respond with ONLY valid JSON in this exact structure (no markdown, no code blocks, just pure JSON):

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
- Be concise and clear - no filler phrases like "dive into"
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

    // List of models to try in order
    // 1. Dynamic discovery (best match)
    // 2. Flash (fastest, best free limits)
    // 3. Pro (stable, standard)
    const discoveredModel = await getWorkingGeminiModel(apiKey);
    console.log(`Discovered best model: ${discoveredModel}`);

    const modelsToTry = [
        discoveredModel,
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.0-pro',
        'gemini-pro'
    ];

    // Remove duplicates
    const uniqueModels = [...new Set(modelsToTry)];

    let lastError: any = null;

    for (const modelName of uniqueModels) {
        try {
            console.log(`Attempting generation with model: ${modelName}`);

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 8192,
                        // Only use responseMimeType if it's a 1.5 model
                        responseMimeType: modelName.includes('1.5') ? "application/json" : undefined
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                // If 404 (Not Found) or 429 (Rate Limit/Quota), try next model
                if (response.status === 404 || response.status === 429) {
                    console.warn(`Model ${modelName} failed with ${response.status}: ${errorText}`);
                    lastError = new Error(`Gemini API error (${modelName} - ${response.status}): ${errorText}`);
                    continue; // Try next model
                }
                // For other errors (500, 400), throw immediately
                throw new Error(`Gemini API error (${modelName} - ${response.status}): ${errorText}`);
            }

            const data = await response.json();

            if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                console.warn(`Model ${modelName} returned empty response`);
                continue;
            }

            const content = data.candidates[0].content.parts[0].text;

            // Extract JSON from response
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

        } catch (error) {
            console.error(`Attempt failed with ${modelName}:`, error);
            lastError = error;
            // Continue to next model in loop if available
        }
    }

    // If we get here, all models failed
    throw lastError || new Error("All Gemini models failed to generate content.");
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
