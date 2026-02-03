'use client'

import { useEffect, useRef } from 'react'

interface ArticleRendererProps {
    content: string
}

export function ArticleRenderer({ content }: ArticleRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return

        // Re-execute any scripts found in the content
        const scripts = containerRef.current.querySelectorAll('script')
        scripts.forEach((oldScript) => {
            const newScript = document.createElement('script')
            Array.from(oldScript.attributes).forEach((attr) => {
                newScript.setAttribute(attr.name, attr.value)
            })
            newScript.appendChild(document.createTextNode(oldScript.innerHTML))
            oldScript.parentNode?.replaceChild(newScript, oldScript)
        })

        // Add support for "Print" buttons if they exist in the HTML
        const printButtons = containerRef.current.querySelectorAll('.print-recipe, #print-recipe, .print-guide, #print-guide, .print-article, #print-article, [href*="print"]')
        printButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.tagName === 'A' && btn.getAttribute('href')?.includes('print')) {
                    // If it's a link, we might want to prevent default and just print the current page 
                    // but often these are specific print URLs. For now, let's just make sure window.print works
                }
                // Common trigger for recipe/guide tool print
                if (btn.classList.contains('print-recipe') || btn.id === 'print-recipe' ||
                    btn.classList.contains('print-guide') || btn.id === 'print-guide' ||
                    btn.classList.contains('print-article') || btn.id === 'print-article') {
                    e.preventDefault()
                    window.print()
                }
            })
        })

        // Add smooth scroll for "Jump to Recipe/Guide" links
        const jumpLinks = containerRef.current.querySelectorAll('a[href^="#"]')
        jumpLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href')
                if (href?.startsWith('#')) {
                    const target = document.querySelector(href)
                    if (target) {
                        e.preventDefault()
                        target.scrollIntoView({ behavior: 'smooth' })
                    }
                }
            })
        })

    }, [content])

    return (
        <div
            ref={containerRef}
            className="article-content w-full m-0 p-0"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    )
}
