'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

export function BannerAd() {
    const [showAds, setShowAds] = useState(false)

    useEffect(() => {
        // Don't show ads in development (localhost)
        if (window.location.hostname === 'localhost') {
            setShowAds(false)
            return
        }

        // Check URL for hideads=1
        const urlParams = new URLSearchParams(window.location.search)
        const urlHide = urlParams.get('hideads') === '1'

        // Check for "hide-ads" flag in localStorage
        const hideAds = localStorage.getItem('hide-ads') === 'true'

        // Hide ads when on admin paths
        const isAdminPath = window.location.pathname.toLowerCase().includes('/admin')

        if (!hideAds && !isAdminPath && !urlHide) {
            setShowAds(true)
        } else {
            setShowAds(false)
        }
    }, [])

    if (!showAds) return null

    return (
        <div className="w-full flex justify-center my-4">
            <div id="banner-ad-container" className="max-w-[728px] w-full">
                <Script
                    id="banner-ad-config"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            atOptions = {
                                'key' : '52813a46cbe04fab2ed2ab6687156450',
                                'format' : 'iframe',
                                'height' : 90,
                                'width' : 728,
                                'params' : {}
                            };
                        `
                    }}
                />
                <Script
                    src="https://www.highperformanceformat.com/52813a46cbe04fab2ed2ab6687156450/invoke.js"
                    strategy="afterInteractive"
                />
            </div>
        </div>
    )
}
