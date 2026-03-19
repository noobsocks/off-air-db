import type { Creator } from "@/types/creator";
import { normalizeText } from "./utils";

export const creators: Creator[] = [
  {
    id: "1",
    name: "짐승철",
    nameNormalized: normalizeText("짐승철"),
    createdAt: "2026-03-18",
    accounts: [
      { platform: "youtube", url: "https://www.youtube.com/@jimseungcheol" },
      { platform: "instagram", url: "https://www.instagram.com/jimseungcheol" },
    ],
  },
  {
    id: "2",
    name: "코뚱잉",
    nameNormalized: normalizeText("코뚱잉"),
    createdAt: "2026-03-17",
    accounts: [
      { platform: "youtube", url: "https://www.youtube.com/@koddoong" },
      { platform: "tiktok", url: "https://www.tiktok.com/@koddoong" },
    ],
  },
  {
    id: "3",
    name: "노익스강",
    nameNormalized: normalizeText("노익스강"),
    createdAt: "2026-03-16",
    accounts: [
      { platform: "youtube", url: "https://www.youtube.com/@noexgang" },
      { platform: "instagram", url: "https://www.instagram.com/noexgang" },
      { platform: "xiaohongshu", url: "https://www.xiaohongshu.com/user/profile/noexgang" },
    ],
  },
  {
    id: "4",
    name: "과즙세연",
    nameNormalized: normalizeText("과즙세연"),
    createdAt: "2026-03-15",
    accounts: [
      { platform: "instagram", url: "https://www.instagram.com/example.seyeon" },
      { platform: "tiktok", url: "https://www.tiktok.com/@example.seyeon" },
      { platform: "xiaohongshu", url: "https://www.xiaohongshu.com/user/profile/seyeon" },
    ],
  },
  {
    id: "5",
    name: "박가을",
    nameNormalized: normalizeText("박가을"),
    createdAt: "2026-03-14",
    accounts: [
      { platform: "instagram", url: "https://www.instagram.com/parkgaul" },
      { platform: "xiaohongshu", url: "https://www.xiaohongshu.com/user/profile/parkgaul" },
    ],
  },
  {
    id: "6",
    name: "오영주",
    nameNormalized: normalizeText("오영주"),
    createdAt: "2026-03-13",
    accounts: [
      { platform: "youtube", url: "https://www.youtube.com/@youngjoo" },
      { platform: "instagram", url: "https://www.instagram.com/youngjoo" },
    ],
  },
  {
    id: "7",
    name: "DJ Aster",
    nameNormalized: normalizeText("DJ Aster"),
    createdAt: "2026-03-12",
    accounts: [
      { platform: "instagram", url: "https://www.instagram.com/djaster" },
      { platform: "tiktok", url: "https://www.tiktok.com/@djaster" },
      { platform: "youtube", url: "https://www.youtube.com/@djaster" },
    ],
  },
  {
    id: "8",
    name: "고여름",
    nameNormalized: normalizeText("고여름"),
    createdAt: "2026-03-11",
    accounts: [
      { platform: "youtube", url: "https://www.youtube.com/@goyeoreum" },
      { platform: "instagram", url: "https://www.instagram.com/goyeoreum" },
      { platform: "xiaohongshu", url: "https://www.xiaohongshu.com/user/profile/goyeoreum" },
    ],
  },
  {
    id: "9",
    name: "이승철",
    nameNormalized: normalizeText("이승철"),
    createdAt: "2026-03-10",
    accounts: [
      { platform: "youtube", url: "https://www.youtube.com/@lee-seungcheol" },
      { platform: "instagram", url: "https://www.instagram.com/lee.seungcheol" },
    ],
  },
  {
    id: "10",
    name: "김민수",
    nameNormalized: normalizeText("김민수"),
    createdAt: "2026-03-09",
    accounts: [
      { platform: "youtube", url: "https://www.youtube.com/@kimminsoo" },
      { platform: "instagram", url: "https://www.instagram.com/kimminsoo" },
      { platform: "tiktok", url: "https://www.tiktok.com/@kimminsoo" },
    ],
  },
  {
    id: "11",
    name: "문복희",
    nameNormalized: normalizeText("문복희"),
    createdAt: "2026-03-08",
    accounts: [
      { platform: "youtube", url: "https://www.youtube.com/@moonbokhee" },
      { platform: "instagram", url: "https://www.instagram.com/moonbokhee" },
      { platform: "xiaohongshu", url: "https://www.xiaohongshu.com/user/profile/moonbokhee" },
    ],
  },
  {
    id: "12",
    name: "맥스킴",
    nameNormalized: normalizeText("맥스킴"),
    createdAt: "2026-03-07",
    accounts: [
      { platform: "instagram", url: "https://www.instagram.com/maxkim" },
      { platform: "youtube", url: "https://www.youtube.com/@maxkim" },
    ],
  },
];