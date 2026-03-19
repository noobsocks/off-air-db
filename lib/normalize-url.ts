function toUrl(raw: string) {
  const value = raw.trim();

  if (/^https?:\/\//i.test(value)) {
    return new URL(value);
  }

  return new URL(`https://${value}`);
}

export function normalizeUrl(raw: string) {
  try {
    const url = toUrl(raw);

    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();
    const pathname = url.pathname.replace(/\/+$/, "").toLowerCase();
    const segments = pathname.split("/").filter(Boolean);

    if (hostname.includes("youtube.com")) {
      if (segments[0]?.startsWith("@")) {
        return `${hostname}/${segments[0]}`;
      }

      if (
        ["channel", "c", "user"].includes(segments[0] || "") &&
        segments[1]
      ) {
        return `${hostname}/${segments[0]}/${segments[1]}`;
      }
    }

    if (hostname.includes("tiktok.com")) {
      const handle = segments.find((segment) => segment.startsWith("@"));
      if (handle) {
        return `${hostname}/${handle}`;
      }
    }

    if (hostname.includes("instagram.com")) {
      const first = segments[0];

      if (
        first &&
        !["p", "reel", "reels", "stories", "explore"].includes(first)
      ) {
        return `${hostname}/${first}`;
      }
    }

    if (hostname.includes("xiaohongshu.com")) {
      if (
        segments[0] === "user" &&
        segments[1] === "profile" &&
        segments[2]
      ) {
        return `${hostname}/user/profile/${segments[2]}`;
      }
    }

    return `${hostname}${pathname}`;
  } catch {
    return raw.trim().toLowerCase();
  }
}