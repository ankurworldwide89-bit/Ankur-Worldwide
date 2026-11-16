import type { ReactNode } from "react";

// A deliberately small Markdown subset for blog posts, turned into React elements (never raw HTML),
// so nothing typed in the admin page can inject scripts or markup into the site.
// Supported: "## Heading", "### Subheading", "- list item", "1. list item", "> quote", blank-line paragraphs,
// **bold**, *italic*, and [link text](https://address). Anything else shows as plain text.

const INLINE = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\([^)\s]+\))/g;

export function safeHref(url: string): string | null {
  if (url.startsWith("/") && !url.startsWith("//")) return url; // a page on this site
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" || u.protocol === "mailto:" ? u.href : null;
  } catch {
    return null;
  }
}

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const href = safeHref(link[2]!);
      if (!href) return link[1];
      const external = !href.startsWith("/");
      return (
        <a key={i} href={href} {...(external && { rel: "noopener noreferrer nofollow", target: "_blank" })}>
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.replace(/\r\n?/g, "\n").trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (block.startsWith("### ")) return <h3 key={i}>{inline(block.slice(4))}</h3>;
        if (block.startsWith("## ")) return <h2 key={i}>{inline(block.slice(3))}</h2>;
        if (lines.every((l) => /^[-*] /.test(l)))
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.slice(2))}</li>
              ))}
            </ul>
          );
        if (lines.every((l) => /^\d+\. /.test(l)))
          return (
            <ol key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\d+\. /, ""))}</li>
              ))}
            </ol>
          );
        if (lines.every((l) => l.startsWith(">"))) return <blockquote key={i}>{inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "))}</blockquote>;
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}
