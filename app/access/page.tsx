import { redirect } from "next/navigation";
import AccessForm from "@/components/auth/access-form";
import { getCurrentRole } from "@/lib/auth/session";

type Props = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function AccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const nextUrl = params.next || "/dashboard";
  const role = await getCurrentRole();

  if (role !== "viewer") {
    redirect(nextUrl);
  }

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel__header">
          <h2 className="panel__title">로그인</h2>
          <p className="panel__description">
            접속 시 부여받은 6자리 숫자를 입력해주세요. 권한이 없더라도 열람할 수 있습니다.
          </p>
        </div>

        <div className="panel__body">
          <AccessForm nextUrl={nextUrl} />
        </div>
      </section>
    </div>
  );
}