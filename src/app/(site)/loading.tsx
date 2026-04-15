export default function Loading() {
  return (
    <div className="loading-shell" aria-label="Đang tải nội dung">
      <div className="loading-shell__hero">
        <div className="skeleton skeleton--eyebrow" />
        <div className="skeleton skeleton--heading" />
        <div className="skeleton skeleton--text" />
        <div className="skeleton skeleton--text skeleton--text-short" />
      </div>
      <div className="loading-shell__grid">
        <div className="skeleton skeleton--card" />
        <div className="skeleton skeleton--card" />
        <div className="skeleton skeleton--card" />
      </div>
    </div>
  );
}
