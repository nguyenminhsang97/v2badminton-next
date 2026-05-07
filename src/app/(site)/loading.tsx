export default function Loading() {
  return (
    <div
      className="loading-shell"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="u-sr-only">Đang tải nội dung trang…</span>
      <div className="loading-shell__hero" aria-hidden="true">
        <div className="skeleton skeleton--eyebrow" />
        <div className="skeleton skeleton--heading" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text skeleton--text-short" />
      </div>
      <div className="loading-shell__grid" aria-hidden="true">
        <div className="skeleton skeleton--card" />
        <div className="skeleton skeleton--card" />
        <div className="skeleton skeleton--card" />
      </div>
    </div>
  );
}
