import Image from "next/image";
import { CheckBadgeIcon, StarIcon } from "@/components/ui/BrandIcons";
import type { SanityCoach } from "@/lib/sanity";

const FALLBACK_COACH_IMAGES = [
  "/images/course-basic.webp",
  "/images/course-advanced.webp",
  "/images/course-enterprise.webp",
] as const;

export function getUsableCoaches(coaches: SanityCoach[]): SanityCoach[] {
  return coaches.filter((coach) =>
    Boolean(
      coach.name?.trim() ||
        coach.teachingGroup?.trim() ||
        coach.approach?.trim() ||
        coach.photoUrl,
    ),
  );
}

type CoachCardsGridProps = {
  coaches: SanityCoach[];
};

export function CoachCardsGrid({ coaches }: CoachCardsGridProps) {
  return (
    <div className="coach-grid coach-grid--figma">
      {coaches.map((coach, index) => {
        const fallbackImage =
          FALLBACK_COACH_IMAGES[index % FALLBACK_COACH_IMAGES.length];
        const photoSrc = coach.photoUrl ?? fallbackImage;
        const displayName = coach.name?.trim() || "HLV V2 Badminton";
        const displayGroup =
          coach.teachingGroup?.trim() || "Đồng hành theo từng nhóm học viên";
        const photoAlt = coach.photoAlt ?? `${displayName} tại V2 Badminton`;
        const credentials = coach.credentialTags.slice(0, 3);
        const roleBadge = coach.roleBadge?.trim() || null;
        const quote = coach.quote?.trim() || coach.approach?.trim() || null;
        const focusLine = coach.focusLine?.trim() || null;
        const proofLabel = coach.proofLabel?.trim() || null;
        const showFooter =
          coach.showStars || proofLabel !== null || focusLine !== null;

        return (
          <article key={coach.id} className="coach-card coach-card--figma">
            <div className="coach-card__photo-wrap">
              <Image
                src={photoSrc}
                alt={photoAlt}
                className="coach-card__photo"
                fill
                sizes="(max-width: 959px) 100vw, 33vw"
              />
              <div className="coach-card__photo-overlay" />
              <div className="coach-card__photo-copy">
                {roleBadge ? <p className="coach-card__badge">{roleBadge}</p> : null}
                <h3 className="coach-card__name">{displayName}</h3>
                <span className="coach-card__group">{displayGroup}</span>
              </div>
            </div>

            <div className="coach-card__body">
              {credentials.length > 0 ? (
                <div className="coach-card__meta">
                  {credentials.map((credential) => (
                    <span key={credential} className="coach-card__credential">
                      <CheckBadgeIcon className="coach-card__credential-icon" />
                      {credential}
                    </span>
                  ))}
                </div>
              ) : null}

              {quote ? (
                <blockquote className="coach-card__quote">
                  <span className="coach-card__quote-mark" aria-hidden="true">
                    “
                  </span>
                  <span>{quote}</span>
                </blockquote>
              ) : null}

              {showFooter ? (
                <footer className="coach-card__footer">
                  {coach.showStars ? (
                    <div className="coach-card__stars" aria-label="Đánh giá 5 sao">
                      <StarIcon className="coach-card__star" />
                      <StarIcon className="coach-card__star" />
                      <StarIcon className="coach-card__star" />
                      <StarIcon className="coach-card__star" />
                      <StarIcon className="coach-card__star" />
                    </div>
                  ) : null}
                  {focusLine ? <span className="coach-card__focus">{focusLine}</span> : null}
                  {proofLabel ? <span className="coach-card__proof">{proofLabel}</span> : null}
                </footer>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
