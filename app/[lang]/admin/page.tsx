import type { Metadata } from "next";
import { Admin } from "@/components/Admin";

export const metadata: Metadata = { title: "Blog admin", robots: { index: false, follow: false } };

// English only, never indexed. A static page: all data is loaded in the browser after sign-in.
export const dynamicParams = false;
export const generateStaticParams = () => [{ lang: "en" }];

export default function AdminPage() {
  return <Admin />;
}
