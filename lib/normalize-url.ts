export function normalizeUrl(raw: string) {
  try {
    const url = new URL(raw.trim());

    url.search = "";
    url.hash = "";

    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();
    const pathname = url.pathname.replace(/\/+$/, "").toLowerCase();

    return `${hostname}${pathname}`;
  } catch {
    return raw.trim().toLowerCase();
  }
}