import type { Platform } from "@/types/creator";

export const PLATFORM_ORDER: Platform[] = [
  "youtube",
  "tiktok",
  "instagram",
  "xiaohongshu",
];

export const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  xiaohongshu: "Xiaohongshu",
};