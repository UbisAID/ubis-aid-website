import { notFound } from "next/navigation";

/** Sends every unknown path under a locale to the localized 404 page. */
export default function CatchAll() {
  notFound();
}
