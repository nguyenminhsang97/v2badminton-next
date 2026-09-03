import {
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  ShuttleIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/ui/BrandIcons";
import { HOMEPAGE_STATS } from "@/content/homepage-stats";
import type { SanityHomepageStatIcon } from "@/lib/sanity";
import type { HomepageStatsSectionProps } from "./sectionProps";

type IconComponent = React.ComponentType<{ className?: string }>;

const STAT_ICONS: Record<SanityHomepageStatIcon, IconComponent> = {
  users: UsersIcon,
  trophy: TrophyIcon,
  shuttle: ShuttleIcon,
  calendar: CalendarIcon,
  mapPin: MapPinIcon,
  arrowRight: ArrowRightIcon,
};

function resolveIcon(icon: SanityHomepageStatIcon | null): IconComponent {
  if (icon && icon in STAT_ICONS) return STAT_ICONS[icon];
  return UsersIcon;
}

export function StatsBar({ content }: HomepageStatsSectionProps) {
  const cmsItems = content?.items;
  const items =
    cmsItems && cmsItems.length > 0
      ? cmsItems.map((item) => ({
          value: item.value ?? "",
          label: item.label ?? "",
          icon: resolveIcon(item.icon),
        }))
      : HOMEPAGE_STATS.map((stat) => ({
          value: stat.value,
          label: stat.label,
          icon: STAT_ICONS[stat.icon as SanityHomepageStatIcon],
        }));

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="stats-bar" aria-label="Điểm nổi bật của V2 Badminton">
      <div className="stats-bar__inner">
        {items.map((stat) => {
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
