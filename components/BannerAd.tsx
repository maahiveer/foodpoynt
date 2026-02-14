'use client'

import { useEffect, useState } from 'react'

export function BannerAd() {
    const [showAds, setShowAds] = useState(false)

    useEffect(() => {
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
        <div className="w-full flex justify-center my-4 overflow-hidden">
            <div id="banner-ad-container" className="max-w-[728px] w-full mx-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center min-h-[90px]">
                <iframe
                    title="Advertisement"
                    width="728"
                    height="90"
                    frameBorder="0"
                    scrolling="no"
                    style={{ border: 'none', overflow: 'hidden' }}
                    srcDoc={`
                        <html>
                            <head>
                                <style>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;height:100%;background:transparent;}</style>
                            </head>
                            <body>
                                <script type="text/javascript">
                                    atOptions = {
                                        'key' : '52813a46cbe04fab2ed2ab6687156450',
                                        'format' : 'iframe',
                                        'height' : 90,
                                        'width' : 728,
                                        'params' : {}
                                    };
                                </script>
                                <script type="text/javascript" src="//www.highperformanceformat.com/52813a46cbe04fab2ed2ab6687156450/invoke.js"></script>
                            </body>
                        </html>
                    `}
                />
            </div>
        </div>
    )
}
