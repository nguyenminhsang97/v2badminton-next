import {
  CalendarIcon,
  ShuttleIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/ui/BrandIcons";
import { HOMEPAGE_STATS } from "@/content/homepage-stats";

const STAT_ICONS = {
  users: UsersIcon,
  trophy: TrophyIcon,
  shuttle: ShuttleIcon,
  calendar: CalendarIcon,
} as const;

export function StatsBar() {
  return (
    <section className="stats-bar" aria-label="Điểm nổi bật của V2 Badminton">
      <div className="stats-bar__inner">
        {HOMEPAGE_STATS.map((stat) => {
          const Icon = STAT_ICONS[stat.icon];

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
