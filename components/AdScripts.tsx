'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export function AdScripts() {
    const [showAds, setShowAds] = useState(false)

    useEffect(() => {
        // 1. Don't show ads in development (localhost)
        if (window.location.hostname === 'localhost') {
            setShowAds(false)
            return
        }

        // 2. Check URL for hideads=1
        const urlParams = new URLSearchParams(window.location.search)
        const urlHide = urlParams.get('hideads') === '1'

        // 3. Check for "hide-ads" flag in localStorage
        const hideAds = localStorage.getItem('hide-ads') === 'true'

        // 4. Hide ads when on admin paths (ANY admin subpath)
        const isAdminPath = window.location.pathname.toLowerCase().includes('/admin')

        // 5. Check if it's the main creator (you) via a special session flag if needed
        // For now, these 3 are usually enough.

        if (!hideAds && !isAdminPath && !urlHide) {
            setShowAds(true)
        } else {
            setShowAds(false)
            // If we are hiding ads, try to remove any existing ad scripts that might have sneaked in
            const existingScripts = document.querySelectorAll('script[id^="monetag-"]')
            existingScripts.forEach(s => s.remove())
        }
    }, [])

    if (!showAds) return null

    return (
        <>
            {/* Social Bar Script */}
            <Script
                src="https://pl28711654.effectivegatecpm.com/1d/54/f7/1d54f7eca0512bc08faa2af5d9e11b20.js"
                strategy="afterInteractive"
            />
        </>
    )
}
