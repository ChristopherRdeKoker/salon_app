import { Icon } from "@/components/Icon";
import { useNotices } from "@/hooks/useAppStores";

export function NoticeBar() {
  const { notices, dismissNotice } = useNotices();

  return (
    <div className="notices" role="status" aria-live="polite">
      {notices.map((notice) => (
        <div key={notice.id} className="notice" data-testid="notice">
          <p>{notice.text}</p>
          <button type="button" className="icon-button" onClick={() => dismissNotice(notice.id)} aria-label="Dismiss notice">
            <Icon name="close" />
          </button>
        </div>
      ))}
    </div>
  );
}
