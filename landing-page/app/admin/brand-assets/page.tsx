import type { Metadata } from "next";
import BrandAssetsClient from "./BrandAssetsClient";

export const metadata: Metadata = {
  title: "Brand assets · Admin",
  robots: { index: false, follow: false },
};

export default function BrandAssetsPage() {
  return <BrandAssetsClient />;
}
