"use client";

import {
  Children,
  type ReactNode,
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
} from "react";

type MobileDotCarouselProps = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  trackClassName: string;
};

export function MobileDotCarousel({
  ariaLabel,
  children,
  className,
  trackClassName,
}: MobileDotCarouselProps) {
  const items = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const [rawActiveIndex, setRawActiveIndex] = useState(0);
  const activeIndex =
    items.length === 0 ? 0 : Math.min(rawActiveIndex, items.length - 1);

  const syncActiveIndex = useEffectEvent(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const children = Array.from(track.children) as HTMLElement[];

    if (children.length <= 1) {
      setRawActiveIndex(0);
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const viewportCenter = trackRect.left + trackRect.width / 2;
    const nextIndex = children.reduce(
      (closestIndex, child, index) => {
        const childRect = child.getBoundingClientRect();
        const closestRect = children[closestIndex].getBoundingClientRect();
        const nextDistance = Math.abs(
          childRect.left + childRect.width / 2 - viewportCenter,
        );
        const currentDistance = Math.abs(
          closestRect.left + closestRect.width / 2 - viewportCenter,
        );

        return nextDistance < currentDistance ? index : closestIndex;
      },
      0,
    );

    setRawActiveIndex(nextIndex);
  });

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    let frameId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => syncActiveIndex());
    };

    const handleResize = () => syncActiveIndex();

    syncActiveIndex();
    track.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [items.length]);

  function scrollToIndex(index: number) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const slide = track.children[index];

    if (!(slide instanceof HTMLElement)) {
      return;
    }

    setRawActiveIndex(index);
    slide.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={["mobile-carousel", className].filter(Boolean).join(" ")}>
      <div
        ref={trackRef}
        id={trackId}
        className={["mobile-carousel__track", trackClassName].join(" ")}
      >
        {items}
      </div>

      {items.length > 1 ? (
        <div className="mobile-carousel__dots" role="tablist" aria-label={ariaLabel}>
          {items.map((_, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={`${trackId}-${index}`}
                type="button"
                role="tab"
                aria-controls={trackId}
                aria-selected={isActive}
                aria-label={`Xem mục ${index + 1}`}
                className={`mobile-carousel__dot ${
                  isActive ? "mobile-carousel__dot--active" : ""
                }`}
                onClick={() => scrollToIndex(index)}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
