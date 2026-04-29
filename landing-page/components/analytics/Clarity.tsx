import { headers } from "next/headers";
import Script from "next/script";
import { readConsent } from "@/lib/consent-server";

// Microsoft Clarity loader — heatmaps, session recordings, funnels.
// Server component so the per-request CSP nonce (set in middleware.ts)
// is read and forwarded to the script tag.
//
// Uses next/script with strategy="afterInteractive" so the bootstrap
// runs AFTER React hydrates the body. A raw inline <script> fires earlier
// and synchronously mutates <head>, which caused a React hydration
// mismatch (#418) on the live site.
//
// Renders nothing if:
//   - NEXT_PUBLIC_CLARITY_ID is unset (preview / local stays clean), or
//   - the visitor has not granted "all" cookie consent. GDPR / DPDPA-friendly
//     default is no tracking until explicit opt-in.
export default async function Clarity() {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!id) return null;

  const consent = await readConsent();
  if (consent !== "all") return null;

  const nonce = (await headers()).get("x-nonce") || undefined;

  const snippet = `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window,document,"clarity","script","${id}");`;

  return (
    <Script
      id="ms-clarity"
      strategy="afterInteractive"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: snippet }}
    />
  );
}
