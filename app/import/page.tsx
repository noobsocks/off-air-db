import Image from "next/image";
import { redirect } from "next/navigation";
import ImportUpload from "@/components/import/import-upload";
import { getCurrentRole } from "@/lib/auth/session";
import { hasMinRole } from "@/lib/auth/permissions";

export default async function ImportPage() {
  const role = await getCurrentRole();

  if (!hasMinRole(role, "editor")) {
    redirect("/access?next=/import");
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel__header panel__header--row">
          <div>
            <h2 className="panel__title">크리에이터 Import</h2>
            <p className="panel__description">
              CSV 또는 XLSM 파일을 업로드해 신규 / 중복 / 오류 데이터를 미리 확인하세요.
            </p>
          </div>

          <a
            href="/templates/OFF-AIR_DB_SHEET.xlsx"
            download
            className="secondary-button"
          >
            템플릿 다운로드
          </a>
        </div>

        <div className="panel__body">
          <div className="import-guide">
            <Image
              src="/images/import-guide.png"
              alt="업로드용 링크 작성 예시와 올바르지 않은 예시 안내 이미지"
              width={1280}
              height={618}
              className="import-guide__image"
            />
          </div>

          <ImportUpload />
        </div>
      </section>
    </div>
  );
}