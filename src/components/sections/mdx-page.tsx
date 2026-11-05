import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/fill";
import type { Dictionary } from "@/i18n/dictionaries/sv";
import type { Entry, PageMeta } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { MdxContent } from "@/components/mdx/mdx-content";
import { ArticleLayout } from "./article-layout";

/** Renders a page from /content/pages (bylaws, privacy policy…). */
export function MdxPage({
  page,
  locale,
  dict,
  backHref,
  backLabel,
}: {
  page: Entry<PageMeta>;
  locale: Locale;
  dict: Dictionary;
  backHref: string;
  backLabel: string;
}) {
  return (
    <ArticleLayout
      dict={dict}
      backHref={backHref}
      backLabel={backLabel}
      lang={page.fallback ? "sv" : undefined}
      fallback={page.fallback}
      title={page.meta.title}
      lead={page.meta.description}
      meta={
        <span>
          {fill(locale === "sv" ? "Senast uppdaterad {date}" : "Last updated {date}", {
            date: formatDate(locale, page.meta.updated),
          })}
        </span>
      }
    >
      <MdxContent source={page.body} />
    </ArticleLayout>
  );
}
