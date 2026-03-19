import type { Creator, Platform } from "@/types/creator";
import { checkDuplicate } from "@/lib/duplicate-check";
import { normalizeUrl } from "@/lib/normalize-url";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { normalizeText } from "@/lib/utils";
import type { ImportPreviewRow, ImportRowInput } from "@/types/import";

type DbAccountRow = {
  platform: Platform;
  url_original: string;
  url_normalized: string;
};

type DbCreatorRow = {
  id: string;
  name: string;
  name_normalized: string;
  created_at: string;
  created_token_code: string | null;
  creator_platform_accounts: DbAccountRow[] | null;
};

export type CreateCreatorInput = {
  name: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  xiaohongshuUrl?: string;
  createdTokenCode?: string;
};

function mapCreator(row: DbCreatorRow): Creator {
  return {
    id: row.id,
    name: row.name,
    nameNormalized: row.name_normalized,
    createdAt: row.created_at,
    createdTokenCode: row.created_token_code,
    accounts: (row.creator_platform_accounts ?? []).map((account) => ({
      platform: account.platform,
      url: account.url_original,
    })),
  };
}

function buildAccounts(input: CreateCreatorInput) {
  const rows = [
    { platform: "youtube" as const, url: input.youtubeUrl?.trim() ?? "" },
    { platform: "tiktok" as const, url: input.tiktokUrl?.trim() ?? "" },
    { platform: "instagram" as const, url: input.instagramUrl?.trim() ?? "" },
    { platform: "xiaohongshu" as const, url: input.xiaohongshuUrl?.trim() ?? "" },
  ];

  return rows
    .filter((row) => row.url.length > 0)
    .map((row) => ({
      platform: row.platform,
      url_original: row.url,
      url_normalized: normalizeUrl(row.url),
    }));
}

export async function getAllCreators() {
  const { data, error } = await supabaseAdmin
    .from("creators")
.select(
  `
  id,
  name,
  name_normalized,
  created_at,
  created_token_code,
  creator_platform_accounts (
    platform,
    url_original,
    url_normalized
  )
`
)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => mapCreator(row as DbCreatorRow));
}

export async function getCreatorById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("creators")
    .select(
      `
      id,
      name,
      name_normalized,
      created_at,
      creator_platform_accounts (
        platform,
        url_original,
        url_normalized
      )
    `
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return mapCreator(data as DbCreatorRow);
}

export async function findDuplicateCreators(input: {
  name?: string;
  urls?: string[];
}) {
  const allCreators = await getAllCreators();
  const resultMap = new Map<string, Creator>();

  const name = input.name?.trim() ?? "";
  const urls = (input.urls ?? []).map((url) => url.trim()).filter(Boolean);

  if (name) {
    checkDuplicate(allCreators, name, undefined).forEach((creator) => {
      resultMap.set(creator.id, creator);
    });
  }

  urls.forEach((url) => {
    checkDuplicate(allCreators, undefined, url).forEach((creator) => {
      resultMap.set(creator.id, creator);
    });
  });

  return Array.from(resultMap.values());
}

export async function createCreator(input: CreateCreatorInput) {
  const trimmedName = input.name.trim();
  const accounts = buildAccounts(input);

  if (!trimmedName) {
    return {
      ok: false,
      message: "이름은 필수입니다.",
      duplicates: [],
    };
  }

  if (accounts.length === 0) {
    return {
      ok: false,
      message: "최소 1개 이상의 플랫폼 URL이 필요합니다.",
      duplicates: [],
    };
  }

  const duplicates = await findDuplicateCreators({
    name: trimmedName,
    urls: accounts.map((account) => account.url_original),
  });

  if (duplicates.length > 0) {
    return {
      ok: false,
      message: "중복 가능성이 있어 저장할 수 없습니다.",
      duplicates,
    };
  }

  const { data: creatorRow, error: creatorError } = await supabaseAdmin
    .from("creators")
    .insert({
  name: trimmedName,
  name_normalized: normalizeText(trimmedName),
  created_token_code: input.createdTokenCode ?? null,
    })
    .select("id")
    .single();

  if (creatorError || !creatorRow) {
    return {
      ok: false,
      message: creatorError?.message ?? "크리에이터 저장에 실패했습니다.",
      duplicates: [],
    };
  }

  const accountRows = accounts.map((account) => ({
    creator_id: creatorRow.id,
    platform: account.platform,
    url_original: account.url_original,
    url_normalized: account.url_normalized,
  }));

  const { error: accountError } = await supabaseAdmin
    .from("creator_platform_accounts")
    .insert(accountRows);

  if (accountError) {
    await supabaseAdmin.from("creators").delete().eq("id", creatorRow.id);

    return {
      ok: false,
      message: accountError.message,
      duplicates: [],
    };
  }

  return {
    ok: true,
    id: creatorRow.id,
    message: "정상적으로 저장되었습니다.",
    duplicates: [],
  };
}

export type ImportCreatorInput = {
  creatorName: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  instagramUrl?: string;
  xiaohongshuUrl?: string;
  memo?: string;
};

export async function importCreators(rows: ImportCreatorInput[]) {
  const results = [];

  for (const row of rows) {
    const result = await createCreator({
      name: row.creatorName ?? "",
      youtubeUrl: row.youtubeUrl ?? "",
      tiktokUrl: row.tiktokUrl ?? "",
      instagramUrl: row.instagramUrl ?? "",
      xiaohongshuUrl: row.xiaohongshuUrl ?? "",
    });

    results.push({
      creatorName: row.creatorName,
      ok: result.ok,
      id: result.ok ? result.id : undefined,
      message: result.message,
      duplicates: result.duplicates ?? [],
    });
  }

  const successCount = results.filter((item) => item.ok).length;
  const failedCount = results.length - successCount;

  return {
    ok: true,
    successCount,
    failedCount,
    results,
  };
}

function collectDuplicateCreators(
  allCreators: Creator[],
  creatorName: string,
  urls: string[]
) {
  const resultMap = new Map<string, Creator>();

  if (creatorName.trim()) {
    checkDuplicate(allCreators, creatorName.trim(), undefined).forEach((creator) => {
      resultMap.set(creator.id, creator);
    });
  }

  urls
    .map((url) => url.trim())
    .filter(Boolean)
    .forEach((url) => {
      checkDuplicate(allCreators, undefined, url).forEach((creator) => {
        resultMap.set(creator.id, creator);
      });
    });

  return Array.from(resultMap.values());
}

export async function previewImportRows(rows: ImportRowInput[]) {
  const allCreators = await getAllCreators();

  const previewRows: ImportPreviewRow[] = rows.map((row) => {
    const urls = [
      row.youtubeUrl,
      row.tiktokUrl,
      row.instagramUrl,
      row.xiaohongshuUrl,
    ].filter(Boolean);

    if (!row.creatorName.trim()) {
      return {
        ...row,
        status: "error",
        reason: "이름이 비어 있습니다.",
        duplicates: [],
      };
    }

    if (urls.length === 0) {
      return {
        ...row,
        status: "error",
        reason: "최소 1개 이상의 플랫폼 URL이 필요합니다.",
        duplicates: [],
      };
    }

    const duplicates = collectDuplicateCreators(
      allCreators,
      row.creatorName,
      urls
    );

    if (duplicates.length > 0) {
      return {
        ...row,
        status: "duplicate",
        reason: "기존 DB와 이름 또는 URL이 일치합니다.",
        duplicates,
      };
    }

    return {
      ...row,
      status: "new",
      reason: "신규 등록 가능한 행입니다.",
      duplicates: [],
    };
  });

  return previewRows;
}