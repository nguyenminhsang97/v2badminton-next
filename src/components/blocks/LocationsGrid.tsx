import Image from "next/image";
import type { SanityLocation } from "@/lib/sanity";

export type LocationsGridProps = {
  locations: SanityLocation[];
};

const LOCATION_IMAGE_FALLBACKS: Record<string, string> = {
  green: "/images/green.webp",
  "hue-thien": "/images/hue-thien.webp",
  "khang-sport": "/images/khang-sport.webp",
  "phuc-loc": "/images/phuc-loc.webp",
};

function resolveLocationImage(location: SanityLocation): string | null {
  if (location.imageUrl) {
    return location.imageUrl;
  }

  return LOCATION_IMAGE_FALLBACKS[location.slug] ?? null;
}

export function LocationsGrid({ locations }: LocationsGridProps) {
  return (
    <div className="locations-grid">
      {locations.map((location) => {
        const imageSrc = resolveLocationImage(location);

        return (
          <article key={location.id} className="location-card">
            {imageSrc ? (
              <div className="location-card__media">
                <Image
                  src={imageSrc}
                  alt={location.imageAlt ?? location.name}
                  className="location-card__image"
                  width={800}
                  height={500}
                  sizes="(max-width: 959px) 100vw, 25vw"
                />
              </div>
            ) : null}

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
        );
      })}
    </div>
  );
}
