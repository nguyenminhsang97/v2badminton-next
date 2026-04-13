import type { SanityLocation } from "@/lib/sanity";

export type LocationsGridProps = {
  locations: SanityLocation[];
};

export function LocationsGrid({ locations }: LocationsGridProps) {
  return (
    <div className="locations-grid">
      {locations.map((location) => (
        <article key={location.id} className="location-card">
          <div className="location-card__info">
            <h3 className="location-card__name">{location.name}</h3>
            <p className="location-card__district">{location.districtLabel}</p>
            <p className="location-card__address">{location.addressText}</p>
          </div>
          <a
            href={location.mapsUrl}
            className="btn btn--outline location-card__cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            Xem bản đồ
          </a>
        </article>
      ))}
    </div>
  );
}
