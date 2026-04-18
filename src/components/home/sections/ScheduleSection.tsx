"use client";

import { useState } from "react";
import type { SanityScheduleBlock, SanityScheduleLevel } from "@/lib/sanity";
import { HOME_SECTION_IDS, toHash } from "@/lib/anchors";
import {
  useHomepageConversionIntent,
  type SchedulePrefill,
} from "../conversion/HomepageConversionProvider";
import {
  LEGACY_COURT_TAB_ORDER,
  isLegacyTimeSlotId,
  resolveLegacyCourtId,
} from "../compat/legacyScheduleCompatibility";
import type { HomepageScheduleSectionProps } from "./sectionProps";

const ALL_TAB_ID = "__all__";
const MAX_VISIBLE_ROWS = 8;

type SelectedCourseIntent = NonNullable<
  ReturnType<typeof useHomepageConversionIntent>["selectedCourseIntent"]
>;

function buildSchedulePrefill(
  scheduleBlock: SanityScheduleBlock,
): SchedulePrefill | null {
  const courtId = resolveLegacyCourtId(scheduleBlock);

  if (courtId === null || !isLegacyTimeSlotId(scheduleBlock.timeSlotId)) {
    return null;
  }

  const isBasicOnly =
    scheduleBlock.levels.length === 1 && scheduleBlock.levels[0] === "co_ban";

  return {
    courtId,
    timeSlotId: scheduleBlock.timeSlotId,
    message: `Quan tâm lịch: ${scheduleBlock.dayGroup} | ${scheduleBlock.timeLabel} | ${scheduleBlock.locationName}`,
    levelHint: isBasicOnly ? "co_ban" : undefined,
  };
}

function getScheduleFilterLabel(level: SelectedCourseIntent): string {
  switch (level) {
    case "co_ban":
      return "cơ bản";
    case "nang_cao":
      return "nâng cao";
    case "doanh_nghiep":
      return "doanh nghiệp";
  }
}

function getScheduleLevelUi(level: SanityScheduleLevel): {
  label: string;
  modifier: "co-ban" | "nang-cao" | "doanh-nghiep";
} {
  switch (level) {
    case "co_ban":
      return {
        label: "Cơ bản",
        modifier: "co-ban",
      };
    case "nang_cao":
      return {
        label: "Nâng cao",
        modifier: "nang-cao",
      };
    case "doanh_nghiep":
      return {
        label: "Doanh nghiệp",
        modifier: "doanh-nghiep",
      };
  }
}

function getScheduleProgramLabel(levels: SanityScheduleLevel[]): string {
  if (levels.includes("doanh_nghiep")) {
    return "Doanh nghiệp";
  }

  if (levels.includes("co_ban") && levels.includes("nang_cao")) {
    return "Cơ bản + Nâng cao";
  }

  if (levels.includes("nang_cao")) {
    return "Nâng cao";
  }

  return "Cơ bản";
}

export function ScheduleSection({
  scheduleBlocks,
}: HomepageScheduleSectionProps) {
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB_ID);
  const [expandedViewKey, setExpandedViewKey] = useState<string | null>(null);
  const { clearCourseIntent, selectedCourseIntent, setPrefill } =
    useHomepageConversionIntent();
  const isIntentFiltering = selectedCourseIntent !== null;

  const tabs = scheduleBlocks.reduce<
    Array<{
      id: string;
      label: string;
      sortOrder: number;
      discoveredAt: number;
    }>
  >((items, scheduleBlock, index) => {
    if (items.some((item) => item.id === scheduleBlock.locationId)) {
      return items;
    }

    const legacyCourtId = resolveLegacyCourtId(scheduleBlock);

    items.push({
      id: scheduleBlock.locationId,
      label: scheduleBlock.locationShortName || scheduleBlock.locationName,
      sortOrder:
        legacyCourtId === null
          ? Number.MAX_SAFE_INTEGER
          : LEGACY_COURT_TAB_ORDER[legacyCourtId],
      discoveredAt: index,
    });

    return items;
  }, []);

  tabs.sort((left, right) => {
    if (left.sortOrder !== right.sortOrder) {
      return left.sortOrder - right.sortOrder;
    }

    return left.discoveredAt - right.discoveredAt;
  });

  const filteredByTab =
    activeTab === ALL_TAB_ID
      ? scheduleBlocks
      : scheduleBlocks.filter((item) => item.locationId === activeTab);

  const displayItems = selectedCourseIntent
    ? filteredByTab.filter((item) => item.levels.includes(selectedCourseIntent))
    : filteredByTab;

  const hasEmptyIntentResult =
    isIntentFiltering && displayItems.length === 0 && filteredByTab.length > 0;
  const itemsToRender = displayItems;
  const filterMessage =
    selectedCourseIntent === null
      ? null
      : hasEmptyIntentResult
        ? activeTab === ALL_TAB_ID
          ? `Hiện chưa có lịch ${getScheduleFilterLabel(selectedCourseIntent)} trong tuần này.`
          : `Sân này chưa có lịch ${getScheduleFilterLabel(selectedCourseIntent)} trong tuần này.`
        : `Đang lọc theo trình độ ${getScheduleFilterLabel(selectedCourseIntent)}.`;
  const currentViewKey = `${activeTab}:${selectedCourseIntent ?? "all"}`;
  const isExpanded = expandedViewKey === currentViewKey;
  const hasOverflowRows = itemsToRender.length > MAX_VISIBLE_ROWS;
  const visibleItems = isExpanded
    ? itemsToRender
    : itemsToRender.slice(0, MAX_VISIBLE_ROWS);

  function handleCardClick(scheduleBlock: SanityScheduleBlock) {
    const prefill = buildSchedulePrefill(scheduleBlock);

    if (prefill === null) {
      return;
    }

    setPrefill(prefill);
  }

  return (
    <section className="section schedule-section" id={HOME_SECTION_IDS.schedule}>
      <div className="section__header">
        <p className="section__eyebrow">Thời khóa biểu</p>
        <h2 className="section__title">Lịch học linh hoạt 7 ngày trong tuần</h2>
        <p className="section__desc">
          Chọn sân, xem giờ phù hợp rồi nhấn vào từng dòng để điền nhanh form tư vấn.
        </p>
        {filterMessage ? (
          <p className="section__filter-note" aria-live="polite">
            {filterMessage}
          </p>
        ) : null}
      </div>

      <div className="schedule-tabs" role="tablist" aria-label="Lọc theo sân">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === ALL_TAB_ID}
          className={`schedule-tab ${activeTab === ALL_TAB_ID ? "schedule-tab--active" : ""}`}
          onClick={() => setActiveTab(ALL_TAB_ID)}
        >
          Tất cả
        </button>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`schedule-tab ${activeTab === tab.id ? "schedule-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {hasEmptyIntentResult ? (
        <div className="schedule-empty-state" role="status" aria-live="polite">
          <p className="schedule-empty-state__title">
            Chưa có lịch {getScheduleFilterLabel(selectedCourseIntent)} phù hợp.
          </p>
          <p className="schedule-empty-state__copy">
            Bạn có thể xem toàn bộ lịch đang mở hoặc để lại thông tin để V2 gợi ý sân và
            khung giờ gần nhất.
          </p>
          <div className="schedule-empty-state__actions">
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => clearCourseIntent()}
            >
              Xem toàn bộ lịch
            </button>
            <a href={toHash(HOME_SECTION_IDS.contact)} className="btn btn--primary">
              Liên hệ tư vấn
            </a>
          </div>
        </div>
      ) : (
        <div className="schedule-table" role="table" aria-label="Lịch học V2 Badminton">
          <div className="schedule-table__head" role="row">
            <span
              className="schedule-table__cell schedule-table__cell--label"
              role="columnheader"
            >
              Ngày
            </span>
            <span
              className="schedule-table__cell schedule-table__cell--label"
              role="columnheader"
            >
              Giờ học
            </span>
            <span
              className="schedule-table__cell schedule-table__cell--label"
              role="columnheader"
            >
              Khóa học
            </span>
            <span
              className="schedule-table__cell schedule-table__cell--label"
              role="columnheader"
            >
              Cơ sở
            </span>
            <span
              className="schedule-table__cell schedule-table__cell--label"
              role="columnheader"
            >
              Trình độ
            </span>
          </div>

          {visibleItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="schedule-row"
              aria-label={`${item.dayGroup}, ${item.timeLabel}, ${getScheduleProgramLabel(item.levels)}, ${item.locationName}. Nhấn để điền form theo lịch này.`}
              onClick={() => handleCardClick(item)}
            >
              <span className="schedule-table__cell schedule-row__days">
                {item.dayGroup}
              </span>
              <strong className="schedule-table__cell schedule-row__time">
                {item.timeLabel}
              </strong>
              <span className="schedule-table__cell schedule-row__program">
                {getScheduleProgramLabel(item.levels)}
              </span>
              <span className="schedule-table__cell schedule-row__location">
                <span className="schedule-row__court">{item.locationShortName}</span>
                <span className="schedule-row__location-note" aria-hidden="true">
                  Điền form nhanh
                </span>
                <span className="u-sr-only">Nhấn để điền form theo lịch này</span>
              </span>
              <span className="schedule-table__cell schedule-row__levels">
                {item.levels.map((level) => {
                  const levelUi = getScheduleLevelUi(level);

                  return (
                    <span
                      key={`${item.id}-${level}`}
                      className={`level-tag level-tag--${levelUi.modifier}`}
                    >
                      {levelUi.label}
                    </span>
                  );
                })}
              </span>
            </button>
          ))}
        </div>
      )}

      {hasOverflowRows ? (
        <div className="schedule-actions">
          <button
            type="button"
            className="schedule-actions__toggle"
            onClick={() =>
              setExpandedViewKey((current) =>
                current === currentViewKey ? null : currentViewKey,
              )
            }
          >
            {isExpanded
              ? "Thu gọn lịch học"
              : `Xem thêm ${itemsToRender.length - MAX_VISIBLE_ROWS} lịch còn lại`}
          </button>
        </div>
      ) : null}

      <p className="schedule-note">
        Lịch có thể thay đổi nhẹ theo sĩ số từng sân.
      </p>
    </section>
  );
}
