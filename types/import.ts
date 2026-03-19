import type { Creator } from "@/types/creator";

export type ImportPreviewStatus = "new" | "duplicate" | "error";

export type ImportRowInput = {
  rowNumber: number;
  creatorName: string;
  youtubeUrl: string;
  tiktokUrl: string;
  instagramUrl: string;
  xiaohongshuUrl: string;
  memo: string;
};

export type ImportPreviewRow = ImportRowInput & {
  status: ImportPreviewStatus;
  reason: string;
  duplicates: Creator[];
};

export type ImportPreviewResponse = {
  ok: boolean;
  rows: ImportPreviewRow[];
  message?: string;
};

export type ImportSaveResult = {
  creatorName: string;
  ok: boolean;
  id?: string;
  message: string;
};

export type ImportSaveResponse = {
  ok: boolean;
  successCount?: number;
  failedCount?: number;
  results?: ImportSaveResult[];
  message?: string;
};