import { headers } from "next/headers";

// Microsoft Clarity loader — heatmaps, session recordings, funnels.
// Injected as a server component so the per-request CSP nonce (set in
// middleware.ts) reaches the inline bootstrap. Without the nonce the
// strict-dynamic CSP would block it.
//
// Renders nothing if NEXT_PUBLIC_CLARITY_ID is unset — keeps preview /
// local builds clean of third-party traffic.
export default async function Clarity() {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  if (!id) return null;

  const nonce = (await headers()).get("x-nonce") || undefined;

  // Standard Clarity bootstrap — appends a <script> tag for the loader
  // shim and queues calls until it arrives. Same shape Microsoft ships.
  const snippet = `(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window,document,"clarity","script","${id}");`;

  return (
    <script
      id="ms-clarity"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: snippet }}
    />
  );
}
