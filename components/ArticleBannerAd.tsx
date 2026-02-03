import Script from 'next/script'

export function ArticleBannerAd() {
    return (
        <div className="my-8 flex justify-center overflow-hidden w-full">
            <div className="max-w-full overflow-x-auto">
                <ins
                    style={{ width: '728px', height: '90px', display: 'block', margin: '0 auto' }}
                    data-width="728"
                    data-height="90"
                    className="qeed48d325b"
                    data-domain="//data527.click"
                    data-affquery="/1b1bc0e9955c4dbdd935/eed48d325b/?placementName=default"
                />
                <Script src="//data527.click/js/responsive.js" strategy="afterInteractive" />
            </div>
        </div>
    )
}
