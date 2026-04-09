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
  { id: "all", label: "Tất cả" },
  { id: "hue_thien", label: "Huệ Thiên" },
  { id: "green", label: "Green" },
  { id: "phuc_loc", label: "Phúc Lộc" },
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
        <p className="section__eyebrow">Thời khóa biểu</p>
        <h2 className="section__title">LỊCH HỌC</h2>
        <p className="section__desc">
          Lớp mở hàng tuần tại 4 sân. Buổi học có{" "}
          <strong>Cơ bản + Nâng cao</strong> nghĩa là cùng giờ đó có lớp cho cả người mới lẫn người đã có nền tảng.
        </p>
        {isFiltered && (
          <p className="section__filter-note">
            Đang lọc theo trình độ{" "}
            {selectedCourseIntent === "co_ban" ? "cơ bản" : "nâng cao"}
          </p>
        )}
      </div>

      {/* Filter tabs */}
      <div className="schedule-tabs" role="tablist" aria-label="Lọc theo sân">
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
          <article
            key={item.id}
            className="schedule-card"
            onClick={() => handleCardClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick(item);
              }
            }}
          >
            <div className="schedule-card__time">{item.timeLabel}</div>
            <div className="schedule-card__days">{item.dayGroup}</div>
            <div className="schedule-card__location">
              <span className="schedule-card__court">
                {courtLocationMap[item.courtId].shortName}
              </span>
            </div>
            <div className="schedule-card__levels">
              {item.levels.map((level) => (
                <span
                  key={level}
                  className={`level-tag level-tag--${level === "co_ban" ? "co-ban" : "nang-cao"}`}
                >
                  {level === "co_ban" ? "Cơ bản" : "Nâng cao"}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="schedule-note">
        Đăng ký thử hoặc hỏi lịch học trực tiếp qua form bên dưới — V2 sẽ xếp lịch theo sân gần bạn nhất.
      </p>
    </section>
  );
}
