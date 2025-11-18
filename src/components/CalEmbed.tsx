"use client"

import { useEffect } from "react"

declare global {
    interface Window {
        Cal?: any
    }
}

export function CalEmbed() {
    useEffect(() => {
        // Cal inline embed code
        ;(function (C: any, A: string, L: string) {
            let p = function (a: any, ar: any) {
                a.q.push(ar)
            }
            let d = C.document
            C.Cal = C.Cal || function () {
                let cal = C.Cal
                let ar = arguments
                if (!cal.loaded) {
                    cal.ns = {}
                    cal.q = cal.q || []
                    d.head.appendChild(d.createElement("script")).src = A
                    cal.loaded = true
                }
                if (ar[0] === L) {
                    const api = function () {
                        p(api, arguments)
                    }
                    const namespace = ar[1]
                    api.q = api.q || []
                    if (typeof namespace === "string") {
                        cal.ns[namespace] = cal.ns[namespace] || api
                        p(cal.ns[namespace], ar)
                        p(cal, ["initNamespace", namespace])
                    } else p(cal, ar)
                    return
                }
                p(cal, ar)
            }
        })(window, "https://app.cal.com/embed/embed.js", "init")

        Cal("init", "15min", { origin: "https://app.cal.com" })

        // Wait for Cal to be ready
        const initCal = () => {
            if (window.Cal?.ns?.["15min"]) {
                window.Cal.ns["15min"]("inline", {
                    elementOrSelector: "#my-cal-inline-15min",
                    config: { layout: "month_view" },
                    calLink: "sandesh-s-yhfchh/15min",
                })

                window.Cal.ns["15min"]("ui", {
                    hideEventTypeDetails: false,
                    layout: "month_view",
                })
            } else {
                // Retry if Cal is not ready yet
                setTimeout(initCal, 100)
            }
        }

        // Start initialization after a short delay to ensure script is loaded
        setTimeout(initCal, 200)
    }, [])

    return (
        <div className="w-full rounded-lg border bg-background p-4">
            <div
                style={{ width: "100%", height: "100%", overflow: "scroll" }}
                id="my-cal-inline-15min"
            />
        </div>
    )
}
