import { PLATFORM_ORDER, PLATFORM_LABELS } from "./constants";
import type { Creator, Platform } from "@/types/creator";
import { normalizeText } from "./utils";

export function hasPlatform(creator: Creator, platform: Platform) {
  return creator.accounts.some((account) => account.platform === platform);
}

export function countCreatorsByPlatform(creators: Creator[], platform: Platform) {
  return creators.filter((creator) => hasPlatform(creator, platform)).length;
}

export function getDashboardStats(creators: Creator[]) {
  const platformStats = PLATFORM_ORDER.map((platform) => ({
    key: platform,
    label: PLATFORM_LABELS[platform],
    count: countCreatorsByPlatform(creators, platform),
  }));

  return {
    total: creators.length,
    platforms: platformStats,
  };
}

export function getRecentCreators(creators: Creator[], limit = 5) {
  return [...creators]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function filterCreators(
  creators: Creator[],
  query?: string,
  platform?: string
) {
  const normalizedQuery = query ? normalizeText(query) : "";

  return creators.filter((creator) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      creator.nameNormalized.includes(normalizedQuery);

    const matchesPlatform =
      !platform ||
      platform === "all" ||
      creator.accounts.some((account) => account.platform === platform);

    return matchesQuery && matchesPlatform;
  });
}

export function paginateCreators(
  creators: Creator[],
  currentPage: number,
  pageSize: number
) {
  const totalCount = creators.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: creators.slice(startIndex, endIndex),
    totalCount,
    totalPages,
    currentPage: safePage,
    pageSize,
  };
}