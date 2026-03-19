import { redirect } from "next/navigation";
import CreatorForm from "@/components/creators/creator-form";
import { getCurrentRole } from "@/lib/auth/session";
import { hasMinRole } from "@/lib/auth/permissions";

export default async function NewCreatorPage() {
  const role = await getCurrentRole();

  if (!hasMinRole(role, "editor")) {
    redirect("/access?next=/creators/new");
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel__header">
          <h2 className="panel__title">새 크리에이터 등록</h2>
          <p className="panel__description">
            이름과 플랫폼 링크를 입력하고 중복 확인 후 저장하세요.
          </p>
        </div>

        <div className="panel__body">
          <CreatorForm />
        </div>
      </section>
    </div>
  );
}