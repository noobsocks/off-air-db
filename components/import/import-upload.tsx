"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import type {
  ImportPreviewResponse,
  ImportPreviewRow,
  ImportRowInput,
  ImportSaveResponse,
  ImportSaveResult,
} from "@/types/import";
import ImportPreview from "./import-preview";

type RawRow = Record<string, unknown>;

function readString(value: unknown) {
  if (value == null) return "";
  return String(value).trim();
}

function pickValue(row: RawRow, keys: string[]) {
  for (const key of keys) {
    if (key in row) {
      return readString(row[key]);
    }
  }
  return "";
}

function getMappedRow(row: RawRow) {
  return {
    creatorName: pickValue(row, [
      "creator_name",
      "name",
      "creator",
      "크리에이터 이름",
      "이름",
    ]),
    youtubeUrl: pickValue(row, ["youtube_url", "youtube", "유튜브", "유튜브 URL"]),
    tiktokUrl: pickValue(row, ["tiktok_url", "tiktok", "틱톡", "틱톡 URL"]),
    instagramUrl: pickValue(row, [
      "instagram_url",
      "instagram",
      "인스타",
      "인스타그램",
      "인스타그램 URL",
    ]),
    xiaohongshuUrl: pickValue(row, [
      "xiaohongshu_url",
      "xiaohongshu",
      "xhs",
      "샤오홍슈",
      "샤오홍슈 URL",
    ]),
    memo: pickValue(row, ["memo", "note", "비고", "메모"]),
  };
}

function toPreviewInputs(rows: ImportPreviewRow[]): ImportRowInput[] {
  return rows.map((row) => ({
    rowNumber: row.rowNumber,
    creatorName: row.creatorName,
    youtubeUrl: row.youtubeUrl,
    tiktokUrl: row.tiktokUrl,
    instagramUrl: row.instagramUrl,
    xiaohongshuUrl: row.xiaohongshuUrl,
    memo: row.memo,
  }));
}

export default function ImportUpload() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ImportPreviewRow[]>([]);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveResults, setSaveResults] = useState<ImportSaveResult[]>([]);

  const newRows = useMemo(
    () => rows.filter((row) => row.status === "new"),
    [rows]
  );

  async function requestPreview(previewRows: ImportRowInput[]) {
    const response = await fetch("/api/creators/import/preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rows: previewRows,
      }),
    });

    const data = (await response.json()) as ImportPreviewResponse;

    if (!response.ok || !data.ok) {
      throw new Error(data.message ?? "Import 미리보기 생성에 실패했습니다.");
    }

    return data.rows ?? [];
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setMessage("");
      setSaveResults([]);
      setFileName(file.name);

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const firstSheetName = workbook.SheetNames[0];

      if (!firstSheetName) {
        setRows([]);
        setMessage("시트가 비어 있습니다.");
        return;
      }

      const worksheet = workbook.Sheets[firstSheetName];
      const jsonRows = XLSX.utils.sheet_to_json<RawRow>(worksheet, {
        defval: "",
      });

      const previewInputs: ImportRowInput[] = jsonRows.map((rawRow, index) => {
        const mapped = getMappedRow(rawRow);

        return {
          rowNumber: index + 2,
          creatorName: mapped.creatorName,
          youtubeUrl: mapped.youtubeUrl,
          tiktokUrl: mapped.tiktokUrl,
          instagramUrl: mapped.instagramUrl,
          xiaohongshuUrl: mapped.xiaohongshuUrl,
          memo: mapped.memo,
        };
      });

      if (previewInputs.length === 0) {
        setRows([]);
        setMessage("데이터 행이 없습니다. 헤더와 내용을 확인해주세요.");
        return;
      }

      const previewRows = await requestPreview(previewInputs);
      setRows(previewRows);
      setMessage(`"${file.name}" 파일을 불러와 DB 기준 미리보기를 완료했습니다.`);
    } catch (error) {
      console.error(error);
      setRows([]);
      setSaveResults([]);
      setMessage("파일을 읽는 중 오류가 발생했습니다. CSV/XLSX 형식을 확인해주세요.");
    }
  }

  async function handleSaveNewRows() {
    if (newRows.length === 0) {
      setMessage("저장 가능한 신규 행이 없습니다.");
      return;
    }

    setIsSaving(true);
    setSaveResults([]);
    setMessage("");

    try {
      const payload = newRows.map((row) => ({
        creatorName: row.creatorName,
        youtubeUrl: row.youtubeUrl,
        tiktokUrl: row.tiktokUrl,
        instagramUrl: row.instagramUrl,
        xiaohongshuUrl: row.xiaohongshuUrl,
        memo: row.memo,
      }));

      const response = await fetch("/api/creators/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rows: payload,
        }),
      });

      const data = (await response.json()) as ImportSaveResponse;

      if (!response.ok || !data.ok) {
        setMessage(data.message ?? "Import 저장 중 오류가 발생했습니다.");
        return;
      }

      setSaveResults(data.results ?? []);
      setMessage(
        `저장 완료: 성공 ${data.successCount ?? 0}건 / 실패 ${data.failedCount ?? 0}건`
      );

      const refreshedRows = await requestPreview(toPreviewInputs(rows));
      setRows(refreshedRows);
    } catch (error) {
      console.error(error);
      setMessage("Import 저장 중 네트워크 또는 서버 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="import-stack">
      <div className="import-dropzone">
        <div>
          <h3 className="import-dropzone__title">파일 업로드</h3>
          <p className="import-dropzone__description">
            권장 컬럼: creator_name, youtube_url, tiktok_url, instagram_url,
            xiaohongshu_url, memo
          </p>
          <p className="import-dropzone__description">
            한글 컬럼명도 일부 지원합니다.
          </p>
        </div>

        <label className="primary-button import-file-button">
          파일 선택
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="import-file-input"
          />
        </label>
      </div>

      <div className="status-box status-box--success">
        현재 파일: {fileName || "선택된 파일 없음"}
      </div>

      {rows.length > 0 && (
        <div className="form-actions">
          <button
            type="button"
            onClick={handleSaveNewRows}
            className="primary-button"
            disabled={isSaving}
          >
            {isSaving ? "저장 중..." : `신규 ${newRows.length}건 저장`}
          </button>
        </div>
      )}

      {message && (
        <div
          className={`status-box ${
            message.includes("오류") || message.includes("실패")
              ? "status-box--warning"
              : "status-box--success"
          }`}
        >
          {message}
        </div>
      )}

      <ImportPreview rows={rows} />

      {saveResults.length > 0 && (
        <section className="form-section">
          <div className="form-section__header">
            <h2 className="form-section__title">저장 결과</h2>
            <p className="form-section__description">
              신규로 분류된 행에 대한 저장 결과입니다.
            </p>
          </div>

          <div className="result-list">
            {saveResults.map((item, index) => (
              <article key={`${item.creatorName}-${index}`} className="result-card">
                <div className="result-card__top">
                  <div>
                    <h3 className="result-card__title">{item.creatorName}</h3>
                    <p className="result-card__meta">{item.message}</p>
                  </div>

                  <span
                    className={`status-pill ${
                      item.ok ? "status-pill--new" : "status-pill--error"
                    }`}
                  >
                    {item.ok ? "저장 성공" : "저장 실패"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}