// Fallback fail-safe cho StatsBar: nếu Sanity `homepage_content.statsBar.items`
// trống, section tự ẩn thay vì hiển thị số liệu chưa xác minh.
export const HOMEPAGE_STATS: ReadonlyArray<{
  value: string;
  label: string;
  icon: string;
}> = [];
