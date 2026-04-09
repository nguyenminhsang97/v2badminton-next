import { courtLocations } from "@/lib/locations";

/**
 * S2-B4: Location cards — maps-only CTA behavior.
 *
 * INTENTIONAL DEVIATION from MASTERPLAN §8.7:
 * Sprint 2 keeps maps-only cards like production.
 * Internal links to local pages live in the SeoLinksBlock (#seo-links), not here.
 * Adding internal-link CTAs on cards is deferred to Sprint 3 or a separate UX ticket.
 */
export function LocationsSection() {
  return (
    <section className="section" id="dia-diem">
      <div className="section__header">
        <h2 className="section__title">4 SÂN TẬP</h2>
        <p className="section__desc">
          Phủ sóng Bình Thạnh & Thủ Đức. Chọn sân gần nhà hoặc gần nơi làm việc.
        </p>
      </div>
      <div className="locations-grid">
        {courtLocations.map((court) => (
          <article key={court.id} className="location-card">
            <div className="location-card__info">
              <h3 className="location-card__name">{court.name}</h3>
              <p className="location-card__district">{court.districtLabel}</p>
              <p className="location-card__address">{court.addressText}</p>
            </div>
            <a
              href={court.mapsUrl}
              className="btn btn--outline location-card__cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              Xem bản đồ
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
