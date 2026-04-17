import {
  CalendarIcon,
  FeatherMarkIcon,
  ShuttleIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/ui/BrandIcons";

const STATS = [
  {
    value: "1.200+",
    label: "lượt tư vấn và học thử",
    icon: UsersIcon,
  },
  {
    value: "8 HLV",
    label: "đồng hành theo từng nhóm",
    icon: TrophyIcon,
  },
  {
    value: "4 sân",
    label: "Bình Thạnh và Thủ Đức",
    icon: ShuttleIcon,
  },
  {
    value: "7+ năm",
    label: "xây nền tảng đúng kỹ thuật",
    icon: CalendarIcon,
  },
] as const;

export function StatsBar() {
  return (
    <section className="stats-bar" aria-label="Điểm nổi bật của V2 Badminton">
      <div className="stats-bar__inner">
        {STATS.map((stat) => {
          const Icon = stat.icon;

          return (
            <article key={stat.label} className="stats-bar__item">
              <span className="stats-bar__icon">
                <Icon className="stats-bar__icon-svg" />
              </span>
              <div className="stats-bar__copy">
                <strong className="stats-bar__value">{stat.value}</strong>
                <span className="stats-bar__label">{stat.label}</span>
              </div>
            </article>
          );
        })}

        <div className="stats-bar__signature" aria-hidden="true">
          <FeatherMarkIcon className="stats-bar__signature-icon" />
        </div>
      </div>
    </section>
  );
}
