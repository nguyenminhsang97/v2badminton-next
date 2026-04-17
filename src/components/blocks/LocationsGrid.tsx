import { ClockIcon, MapPinIcon, PhoneIcon } from "@/components/ui/BrandIcons";
import type { SanityLocation } from "@/lib/sanity";
import { siteConfig } from "@/lib/site";

export type LocationsGridProps = {
  locations: SanityLocation[];
  showSupportCard?: boolean;
};

const HOURS_LABEL = "T2-CN · 6:00 - 21:00";

export function LocationsGrid({
  locations,
  showSupportCard = true,
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

              <div className="location-card__meta">
                <span className="location-card__meta-item">
                  <PhoneIcon className="location-card__meta-icon" />
                  {siteConfig.phoneDisplay}
                </span>
                <span className="location-card__meta-item">
                  <ClockIcon className="location-card__meta-icon" />
                  {HOURS_LABEL}
                </span>
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
            Chỉ cần cho biết khu vực, khung giờ và mục tiêu học. V2 sẽ gọi lại để gợi ý sân phù
            hợp, lớp đang mở và cách bắt đầu dễ nhất cho bạn hoặc cho con.
          </p>
          <a href="#lien-he" className="btn btn--primary btn--lg">
            Đăng ký học thử
          </a>
        </aside>
      ) : null}
    </div>
  );
}
