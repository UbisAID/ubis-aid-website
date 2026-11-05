import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { Info } from "lucide-react";

/**
 * Components available inside MDX files. Editors can write
 * <Callout>…</Callout> and <Tip>…</Tip> in addition to normal Markdown.
 */
const components = {
  a: ({ href = "", ...props }: React.ComponentProps<"a">) =>
    href.startsWith("/") ? (
      <Link href={href} {...props} />
    ) : (
      <a href={href} rel="noopener noreferrer" {...props} />
    ),
  Callout: ({ children }: { children: React.ReactNode }) => (
    <div className="flex gap-3 rounded-2xl bg-sage p-5">
      <Info aria-hidden="true" className="mt-1 size-5 shrink-0 text-secondary" />
      <div className="[&>p]:m-0">{children}</div>
    </div>
  ),
  Tip: ({ title, children }: { title?: string; children: React.ReactNode }) => (
    <div className="rounded-2xl bg-butter p-5">
      {title && <p className="m-0 font-heading font-bold">{title}</p>}
      <div className="mt-1 [&>p]:m-0">{children}</div>
    </div>
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose-warm">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
