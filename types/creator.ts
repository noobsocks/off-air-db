export type Platform = "youtube" | "tiktok" | "instagram" | "xiaohongshu";

export type CreatorPlatformAccount = {
  platform: Platform;
  url: string;
};

export type Creator = {
  id: string;
  name: string;
  nameNormalized: string;
  accounts: CreatorPlatformAccount[];
  createdAt: string;
  creatredTokenCode?: string | null;
};