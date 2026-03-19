import { redirect } from "next/navigation";
import AccessTokenManager from "@/components/admin/access-token-manager";
import { canManageTokens } from "@/lib/auth/permissions";
import { getCurrentRole } from "@/lib/auth/session";
import { getAccessTokens } from "@/lib/db/access-tokens";

export default async function AccessTokensPage() {
  const role = await getCurrentRole();

  if (!canManageTokens(role)) {
    redirect("/dashboard");
  }

  const tokens = await getAccessTokens();

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel__header">
          <h2 className="panel__title">토큰 관리</h2>
          <p className="panel__description">
            admin이 editor/admin용 6자리 숫자 토큰을 생성하고 확인하는 페이지입니다.
          </p>
        </div>

        <div className="panel__body">
          <AccessTokenManager tokens={tokens} />
        </div>
      </section>
    </div>
  );
}