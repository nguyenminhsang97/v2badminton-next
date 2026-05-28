import { HOME_SECTION_IDS } from "@/lib/anchors";
import {
  ArrowRightIcon,
  CalendarIcon,
  MapPinIcon,
  ShuttleIcon,
  TrophyIcon,
  UsersIcon,
} from "@/components/ui/BrandIcons";
import type { SanityHomepageStatIcon } from "@/lib/sanity";
import type { HomepageWhySectionProps } from "./sectionProps";

type IconComponent = React.ComponentType<{ className?: string }>;

const ICON_LOOKUP: Record<SanityHomepageStatIcon, IconComponent> = {
  users: UsersIcon,
  trophy: TrophyIcon,
  shuttle: ShuttleIcon,
  calendar: CalendarIcon,
  mapPin: MapPinIcon,
  arrowRight: ArrowRightIcon,
};

function resolveIcon(icon: SanityHomepageStatIcon | null): IconComponent {
  if (icon && icon in ICON_LOOKUP) return ICON_LOOKUP[icon];
  return ArrowRightIcon;
}

const DEFAULT_DIFFERENTIATORS = [
  {
    title: "Rõ từng bước",
    description: "Biết rõ buổi này sửa gì, buổi sau tiến tiếp ở đâu.",
    Icon: CalendarIcon,
  },
  {
    title: "Nhóm nhỏ dễ theo",
    description: "HLV có thời gian quan sát, chỉnh lỗi và giữ nhịp cho từng người.",
    Icon: UsersIcon,
  },
  {
    title: "4 sân thuận tiện",
    description: "Ưu tiên sân gần nhà hoặc chỗ làm để đi học thuận hơn mỗi tuần.",
    Icon: MapPinIcon,
  },
  {
    title: "Khung giờ linh hoạt",
    description: "Sáng, tối và cuối tuần đều có lựa chọn theo từng nhóm.",
    Icon: ArrowRightIcon,
  },
];

export function WhySection({ content }: HomepageWhySectionProps) {
  const eyebrow = content?.eyebrow ?? "Tại sao chọn V2";
  const title = content?.title ?? "Nền tảng bài bản nhưng vẫn dễ theo";
  const description =
    content?.description ??
    "Mỗi buổi học có mục tiêu rõ, nhóm nhỏ và khung giờ đủ linh hoạt để theo đều.";

  const proofValue = content?.proofStat?.value ?? "2-6";
  const proofTitle = content?.proofStat?.statTitle ?? "học viên mỗi nhóm";
  const proofDescription =
    content?.proofStat?.statDescription ??
    "HLV có đủ thời gian quan sát và chỉnh kỹ thuật ngay trên sân.";

  const cmsDiffs = content?.differentiators;
  const differentiators =
    cmsDiffs && cmsDiffs.length > 0
      ? cmsDiffs.map((d) => ({
          title: d.title ?? "",
          description: d.description ?? "",
          Icon: resolveIcon(d.icon),
        }))
      : DEFAULT_DIFFERENTIATORS;

  return (
    <section className="section why-section" id={HOME_SECTION_IDS.why}>
      <div className="why-section__layout">
        <div className="section__header section__header--left why-section__header">
          <p className="section__eyebrow">{eyebrow}</p>
          <h2 className="section__title">{title}</h2>
          <p className="section__desc">{description}</p>
        </div>

        <div className="why-section__proof">
          <article className="why-section__stat">
            <span className="why-section__stat-value">{proofValue}</span>
            <div className="why-section__stat-copy">
              <strong className="why-section__stat-title">{proofTitle}</strong>
              <p>{proofDescription}</p>
            </div>
          </article>

          <div className="why-grid">
            {differentiators.map((item) => (
              <article key={item.title} className="why-card">
                <span className="why-card__icon">
                  <item.Icon className="why-card__icon-svg" />
                </span>
                <div className="why-card__content">
                  <h3 className="why-card__title">{item.title}</h3>
                  <p className="why-card__desc">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
