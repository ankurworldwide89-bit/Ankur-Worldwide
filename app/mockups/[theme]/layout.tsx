import Link from "next/link";
import { Logo } from "@/components/Logo";

export const dynamicParams = false;
export const generateStaticParams = () => [{ theme: "a" }, { theme: "b" }];

export default async function ThemeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ theme: string }>;
}) {
  const { theme } = await params;
  const base = `/mockups/${theme}`;
  return (
    <div data-theme={theme} className="min-h-screen bg-bg font-body text-fg">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <Link href={base} aria-label="Ankur Worldwide, home">
          <Logo className="h-3.5 w-auto md:h-4" />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-8 text-sm">
          <Link href={`${base}/product`} className="hidden text-muted hover:text-fg md:inline">
            Products
          </Link>
          <Link href={base} className="hidden text-muted hover:text-fg md:inline">
            About
          </Link>
          <Link href={base} className="hidden text-muted hover:text-fg md:inline">
            Compliance
          </Link>
          <Link href={base} className="border-b border-accent pb-0.5">
            Contact
          </Link>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="mx-auto max-w-7xl border-t border-line px-6 py-10 text-sm text-muted md:px-10">
        Ankur Worldwide · Gujarat, India
      </footer>
    </div>
  );
}
