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

        // 2. Check for "hide-ads" flag in localStorage
        // You can set this by running: localStorage.setItem('hide-ads', 'true') in your console
        const hideAds = localStorage.getItem('hide-ads') === 'true'

        // 3. Optional: Hide ads when on admin paths
        const isAdminPath = window.location.pathname.startsWith('/admin')

        if (!hideAds && !isAdminPath) {
            setShowAds(true)
        }
    }, [])

    if (!showAds) return null

    return (
        <>
            {/* Monetag Interstitial Ads */}
            <Script id="monetag-interstitial" strategy="afterInteractive">
                {`(function(s){s.dataset.zone='10327495',s.src='https://groleegni.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
            </Script>

            {/* Monetag Inpage Push Ads */}
            <Script id="monetag-inpage-push" strategy="afterInteractive">
                {`(function(s){s.dataset.zone='10450838',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`}
            </Script>
        </>
    )
}
