import type { Creator } from "@/types/creator";
import { normalizeUrl } from "./normalize-url";
import { normalizeText } from "./utils";

export function checkDuplicate(creators: Creator[], name?: string, url?: string) {
  const normalizedName = name ? normalizeText(name) : "";
  const normalizedUrl = url ? normalizeUrl(url) : "";

  return creators.filter((creator) => {
    const sameName =
      normalizedName.length > 0 && creator.nameNormalized === normalizedName;

    const sameUrl =
      normalizedUrl.length > 0 &&
      creator.accounts.some((account) => normalizeUrl(account.url) === normalizedUrl);

    return sameName || sameUrl;
  });
}