import Link from "next/link";
import { notFound } from "next/navigation";
import PlatformBadges from "@/components/creators/platform-badges";
import CreatorAdminActions from "@/components/creators/creator-admin-actions";
import { getCreatorById } from "@/lib/db/creators";
import { canCopy, canDelete } from "@/lib/auth/permissions";
import { getCurrentRole } from "@/lib/auth/session";
import { formatDate } from "@/lib/utils";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CreatorDetailPage({ params }: Props) {
  const { id } = await params;
  const creator = await getCreatorById(id);
  const role = await getCurrentRole();

  if (!creator) {
    notFound();
  }

  const isAdmin = canCopy(role) && canDelete(role);

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel__header panel__header--row">
          <div>
            <h2 className="panel__title">{creator.name}</h2>
           <p className="panel__description">
  등록일: {formatDate(creator.createdAt)}
  {isAdmin && (
    <>
      {" · "}등록토큰값 : {creator.createdTokenCode || "-"}
    </>
  )}
</p>
          </div>

          <Link href="/creators" className="ghost-button">
            리스트로 돌아가기
          </Link>
        </div>

        <div className="panel__body detail-stack">
          {isAdmin && <CreatorAdminActions creator={creator} />}

          <div className="detail-block">
            <p className="detail-block__label">보유 플랫폼</p>
            <PlatformBadges accounts={creator.accounts} />
          </div>

          <div className="detail-block">
            <p className="detail-block__label">플랫폼 링크</p>

            <ul className="detail-links">
              {creator.accounts.map((account) => (
                <li key={`${creator.id}-${account.platform}`}>
                  <span className="detail-links__platform">{account.platform}</span>
                  <a
                    href={account.url}
                    target="_blank"
                    rel="noreferrer"
                    className="result-links__item"
                  >
                    {account.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}