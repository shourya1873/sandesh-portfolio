import Script from "next/script"
import { db } from "@/server/db"
import { siteConfig } from "@/server/db/schema"

export async function AnalyticsScripts() {
    let gtmId = ""
    let gaId = ""
    let adsenseId = ""

    try {
        const configs = await db.select().from(siteConfig)
        const configMap: Record<string, string> = {}
        configs.forEach((config) => {
            configMap[config.key] = config.value ?? ""
        })
        gtmId = configMap.gtm_id || ""
        gaId = configMap.ga_id || ""
        adsenseId = configMap.adsense_id || ""
    } catch (error) {
        console.error("Error fetching analytics config:", error)
    }

    return (
        <>
            {/* Google Tag Manager */}
            {gtmId && (
                <>
                    <Script
                        id="gtm-script"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
                        }}
                    />
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                            height="0"
                            width="0"
                            style={{ display: "none", visibility: "hidden" }}
                        />
                    </noscript>
                </>
            )}

            {/* Google Analytics */}
            {gaId && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                        strategy="afterInteractive"
                    />
                    <Script
                        id="ga-script"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${gaId}');
                            `,
                        }}
                    />
                </>
            )}

            {/* Google AdSense */}
            {adsenseId && (
                <Script
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
                    strategy="afterInteractive"
                    crossOrigin="anonymous"
                />
            )}
        </>
    )
}
