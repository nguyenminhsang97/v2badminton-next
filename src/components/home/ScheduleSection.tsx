"use client";

import { useState } from "react";
import { courtLocationMap, type CourtId } from "@/lib/locations";
import { scheduleItems, type ScheduleItem } from "@/lib/schedule";
import { useHomepageConversion } from "./HomepageConversionProvider";

// ---------------------------------------------------------------------------
// Filter tabs — per-court, NOT per-district (S2-B1 spec)
// ---------------------------------------------------------------------------

type TabId = "all" | CourtId;

const TABS: readonly { id: TabId; label: string }[] = [
  { id: "all", label: "Tat ca" },
  { id: "hue_thien", label: "Hue Thien" },
  { id: "green", label: "Green" },
  { id: "phuc_loc", label: "Phuc Loc" },
  { id: "khang_sport", label: "Khang Sport" },
] as const;

function filterSchedule(tab: TabId): readonly ScheduleItem[] {
  if (tab === "all") return scheduleItems;
  return scheduleItems.filter((item) => item.courtId === tab);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ScheduleSection() {
  const [activeTab, setActiveTab] = useState<TabId>("all");
  const { setPrefill, selectedCourseIntent } = useHomepageConversion();

  const filtered = filterSchedule(activeTab);

  // If a course intent is active, highlight matching level items
  const displayItems = selectedCourseIntent
    ? filtered.filter((item) => item.levels.includes(selectedCourseIntent))
    : filtered;

  // Show all items but dimmed if course filter yields empty
  const itemsToRender = displayItems.length > 0 ? displayItems : filtered;
  const isFiltered = selectedCourseIntent !== null && displayItems.length > 0;

  function handleCardClick(item: ScheduleItem) {
    const isBasicOnly =
      item.levels.length === 1 && item.levels[0] === "co_ban";

    setPrefill({
      courtId: item.prefillCourtId,
      timeSlotId: item.prefillTimeSlotId,
      message: item.prefillMessage,
      levelHint: isBasicOnly ? "co_ban" : undefined,
    });
  }

  return (
    <section className="section" id="lich-hoc">
      <div className="section__header">
        <h2 className="section__title">Lich hoc</h2>
        {isFiltered && (
          <p className="section__subtitle">
            Dang loc theo trinh do {selectedCourseIntent === "co_ban" ? "co ban" : "nang cao"}
          </p>
        )}
      </div>

      {/* Filter tabs */}
      <div className="schedule-tabs" role="tablist" aria-label="Loc theo san">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`schedule-tab ${activeTab === tab.id ? "schedule-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Schedule cards */}
      <div className="schedule-grid">
        {itemsToRender.map((item) => (
          <article key={item.id} className="schedule-card">
            <div className="schedule-card__info">
              <p className="schedule-card__court">
                {courtLocationMap[item.courtId].shortName}
              </p>
              <p className="schedule-card__day">{item.dayGroup}</p>
              <p className="schedule-card__time">{item.timeLabel}</p>
              <p className="schedule-card__level">{item.levelLabel}</p>
            </div>
            <button
              type="button"
              className="btn btn--primary schedule-card__cta"
              onClick={() => handleCardClick(item)}
            >
              Dang ky
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
