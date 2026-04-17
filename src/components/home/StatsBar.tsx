import {
  CalendarIcon,
  ShuttleIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/ui/BrandIcons";

const STATS = [
  {
    value: "1.200+",
    label: "học thử & tư vấn",
    icon: UsersIcon,
  },
  {
    value: "8 HLV",
    label: "theo sát từng nhóm",
    icon: TrophyIcon,
  },
  {
    value: "4 sân",
    label: "Bình Thạnh · Thủ Đức",
    icon: ShuttleIcon,
  },
  {
    value: "Tối & cuối tuần",
    label: "khung giờ dễ theo",
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
      </div>
    </section>
  );
}
