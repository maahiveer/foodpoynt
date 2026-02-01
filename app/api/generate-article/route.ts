import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    console.log(`Generating article for topic: ${topic}`)

    // ------------------------------------------------------------------
    // INTELLIGENT MOCK GENERATION
    // ------------------------------------------------------------------
    // We simulate a smart generation that adapts to the topic structure

    // 1. Generate SEO Title & Slug
    const title = topic.replace(/\b\w/g, (l: string) => l.toUpperCase()); // Capitalize
    const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // 2. Analyze Topic Type (Listicle vs Guide)
    const listMatch = topic.match(/^(\d+)/);
    const isListicle = !!listMatch;
    const listCount = listMatch ? parseInt(listMatch[1]) : 0;

    // 3. Generate Hero Image
    const heroImage = `https://image.pollinations.ai/prompt/${encodeURIComponent("editorial photography of " + topic + ", cinematic lighting, 4k, aesthetics")}`;

    let content = '';

    // 4. Generate Intro
    content += `
      <p class="lead">Looking for the best <strong>${topic}</strong>? You've come to the right place. In this comprehensive guide, we've curated everything you need to know to make the perfect choice.</p>
      <p>Whether you're looking to upgrade your style, improve your home, or just find inspiration, these ideas are designed to impress.</p>
    `;

    // 5. Generate Body Content (Dynamic List or Sections)
    if (isListicle && listCount > 0) {
      const displayCount = Math.min(listCount, 15); // Cap at 15 to avoid massive HTML

      content += `<h2>Top ${displayCount} Picks for ${topic}</h2>`;

      for (let i = 1; i <= displayCount; i++) {
        const itemImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(topic + " variation " + i + ", realistic, detailed, high quality photo")}`;

        content += `
          <h3>${i}. The Perfect Style Variant ${i}</h3>
          <p>This option stands out because of its unique versatility and timeless appeal. It's perfect for those who value both aesthetics and functionality.</p>
          <figure>
            <img src="${itemImage}" alt="${topic} idea ${i}" style="width:100%; border-radius: 8px; margin: 20px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" />
            <figcaption class="text-center text-sm text-gray-500 italic">Idea #${i}: A stunning example of what's possible</figcaption>
          </figure>
          <p><strong>Why we love it:</strong> It combines modern trends with classic elements, making it a safe yet stylish bet for any occasion.</p>
          <hr style="margin: 40px 0; border: 0; border-top: 1px solid #eee;" />
        `;
      }
    } else {
      // Standard Guide Structure
      const section1Image = `https://image.pollinations.ai/prompt/${encodeURIComponent(topic + " detailed close up shot")}`;
      const section2Image = `https://image.pollinations.ai/prompt/${encodeURIComponent(topic + " wider angle lifestyle shot")}`;

      content += `
        <h2>Understanding the Basics</h2>
        <p>Before diving deep, it's essential to grasp the fundamentals. <strong>${topic}</strong> isn't just about following trends; it's about finding what resonates with your personal taste.</p>
        
        <figure>
          <img src="${section1Image}" alt="${topic} details" style="width:100%; border-radius: 8px; margin: 20px 0;" />
        </figure>

        <h2>Key Benefits</h2>
        <ul>
          <li><strong>Versatility:</strong> Adapts to various situations easily.</li>
          <li><strong>Durability:</strong> Stands the test of time.</li>
          <li><strong>Aesthetics:</strong> Looks good in any setting.</li>
        </ul>

        <h2>Expert Tips</h2>
        <p>Professionals recommend focusing on quality materials and lighting. As seen below, the difference is in the details.</p>

        <figure>
          <img src="${section2Image}" alt="${topic} lifestyle" style="width:100%; border-radius: 8px; margin: 20px 0;" />
        </figure>
      `;
    }

    // 6. Generate Conclusion
    content += `
      <h2>Conclusion</h2>
      <p>We hope this guide on <strong>${topic}</strong> has proven helpful. Remember, the best choice is the one that makes you feel confident and comfortable.</p>
      <p>Have you tried any of these ideas? Let us know your thoughts!</p>
    `;

    // 7. Generate Excerpt & Tags
    const excerpt = `Explore our curated list of ${topic}. We break down the best options with high-quality images and expert advice to help you decide.`;
    const tags = [topic.split(' ')[0], 'Inspiration', 'Guide', 'Trends', '2024'];

    // Simulate delay for "AI Thinking"
    await new Promise(resolve => setTimeout(resolve, 4000));

    return NextResponse.json({
      title,
      slug,
      excerpt,
      content,
      tags,
      featured_image: heroImage,
      status: 'draft'
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
