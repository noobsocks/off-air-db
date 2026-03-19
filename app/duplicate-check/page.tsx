import DuplicateCheckPanel from "@/components/creators/duplicate-check-panel";

export default function DuplicateCheckPage() {
  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel__header">
          <h2 className="panel__title">중복 확인</h2>
          <p className="panel__description">
            이름 또는 플랫폼 링크를 입력해 중복 여부를 확인할 수 있습니다.
          </p>
        </div>

        <div className="panel__body">
          <DuplicateCheckPanel />
        </div>
      </section>
    </div>
  );
}