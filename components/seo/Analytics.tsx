import Script from "next/script";
import { siteConfig, isDev } from "@/data/site-config";

/** Google Analytics 4. Loads only in production builds, and only once a real ID is set in site-config. */
export function Analytics() {
  const id = siteConfig.integrations.ga4Id;
  if (!id || isDev || !/^G-[A-Z0-9]+$/.test(id)) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');`}
      </Script>
    </>
  );
}
