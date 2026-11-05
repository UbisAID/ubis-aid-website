/**
 * Base path the site is served under. Empty in normal deployments; set to e.g.
 * "/ubis-aid-preview" for the static GitHub Pages preview build.
 * next/link and next/image add it automatically; use withBase() for plain
 * <a href> to files in /public and for fetch() calls.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  return `${basePath}${path}`;
}
