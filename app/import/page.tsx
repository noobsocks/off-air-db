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
        <div className="panel__header">
          <h2 className="panel__title">크리에이터 Import</h2>
          <p className="panel__description">
            CSV 또는 XLSX 파일을 업로드해 신규 / 중복 / 오류 데이터를 미리 확인하세요.
          </p>
        </div>

        <div className="panel__body">
          <ImportUpload />
        </div>
      </section>
    </div>
  );
}