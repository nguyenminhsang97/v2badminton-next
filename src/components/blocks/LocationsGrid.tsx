import { MapPinIcon } from "@/components/ui/BrandIcons";
import type { HomepageLocation } from "@/domain/homepage";
import { HOME_SECTION_IDS, toHomepageHash } from "@/lib/anchors";

export type LocationsGridProps = {
  locations: HomepageLocation[];
  showSupportCard?: boolean;
  supportCardHref?: string;
};

export function LocationsGrid({
  locations,
  showSupportCard = true,
  supportCardHref = toHomepageHash(HOME_SECTION_IDS.contact),
}: LocationsGridProps) {
  return (
    <div
      className={`locations-grid locations-grid--figma ${showSupportCard ? "" : "locations-grid--compact"}`.trim()}
    >
      <div className="locations-grid__list">
        {locations.map((location) => (
          <article key={location.id} className="location-card location-card--list">
            <span className="location-card__icon">
              <MapPinIcon className="location-card__icon-svg" />
            </span>

            <div className="location-card__content">
              <div className="location-card__info">
                <h3 className="location-card__name">{location.name}</h3>
                <p className="location-card__district">{location.districtLabel}</p>
                <p className="location-card__address">{location.addressText}</p>
              </div>
            </div>

            <a
              href={location.mapsUrl}
              className="location-card__cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem bản đồ
            </a>
          </article>
        ))}
      </div>

      {showSupportCard ? (
        <aside className="location-cta-card">
          <p className="location-cta-card__eyebrow">Học thử trước khi chốt lịch</p>
          <h3 className="location-cta-card__title">
            Chọn sân gần bạn, để V2 xếp buổi phù hợp nhất
          </h3>
          <p className="location-cta-card__copy">
            Chỉ cần cho biết khu vực, khung giờ và mục tiêu học. V2 sẽ gọi lại để gợi ý sân
            và lớp đang mở phù hợp nhất.
          </p>
          <a href={supportCardHref} className="btn btn--primary btn--lg">
            Đăng ký học thử
          </a>
        </aside>
      ) : null}
    </div>
  );
}
