import { MapPinIcon } from "@/components/ui/BrandIcons";
import { HOME_SECTION_IDS } from "@/lib/anchors";
import type { SanityScheduleLevel } from "@/lib/sanity";
import {
  LEGACY_COURT_TAB_ORDER,
  resolveLegacyCourtId,
} from "../compat/legacyScheduleCompatibility";
import type { HomepageScheduleSectionProps } from "./sectionProps";

const ALL_TAB_ID = "__all__";
const MAX_VISIBLE_ROWS = 8;

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

export function StaticScheduleSection({
  scheduleBlocks,
}: HomepageScheduleSectionProps) {
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

  const visibleItems = scheduleBlocks.slice(0, MAX_VISIBLE_ROWS);
  const hasOverflowRows = scheduleBlocks.length > MAX_VISIBLE_ROWS;

  return (
    <section className="section schedule-section" id={HOME_SECTION_IDS.schedule}>
      <div className="section__header">
        <p className="section__eyebrow">Thời khóa biểu</p>
        <h2 className="section__title">Lịch học linh hoạt 7 ngày trong tuần</h2>
        <p className="section__desc">
          Chọn sân, xem giờ phù hợp rồi bấm “Chọn lịch này” để V2 tự điền sân và giờ vào form đăng ký.
        </p>
      </div>

      <div className="schedule-tabs" role="tablist" aria-label="Lọc theo sân">
        <button
          type="button"
          role="tab"
          aria-selected="true"
          className="schedule-tab schedule-tab--active"
        >
          Tất cả
        </button>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === ALL_TAB_ID}
            className="schedule-tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="schedule-table" aria-label="Lịch học V2 Badminton">
        <div className="schedule-table__head">
          <span
            className="schedule-table__cell schedule-table__cell--label"
          >
            Ngày
          </span>
          <span
            className="schedule-table__cell schedule-table__cell--label"
          >
            Giờ học
          </span>
          <span
            className="schedule-table__cell schedule-table__cell--label"
          >
            Khóa học
          </span>
          <span
            className="schedule-table__cell schedule-table__cell--label"
          >
            Cơ sở
          </span>
          <span
            className="schedule-table__cell schedule-table__cell--label"
          >
            Trình độ
          </span>
        </div>

        {visibleItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className="schedule-row"
            aria-label={`${item.dayGroup}, ${item.timeLabel}, ${getScheduleProgramLabel(item.levels)}, ${item.locationName}. Chọn lịch này để tự điền sân và giờ vào form đăng ký.`}
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
              <MapPinIcon className="schedule-row__location-icon" />
              <span className="schedule-row__court">{item.locationShortName}</span>
            </span>
            <span className="schedule-table__cell schedule-row__levels">
              <span className="schedule-row__level-list">
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
            </span>
            <span className="schedule-row__quick-fill" aria-hidden="true">
              <span className="schedule-row__quick-fill-copy">
                <strong>Chọn lịch này</strong>
                <span>Tự điền sân & giờ vào form</span>
              </span>
              <span className="schedule-row__quick-fill-arrow">→</span>
            </span>
          </button>
        ))}
      </div>

      {hasOverflowRows ? (
        <div className="schedule-actions" aria-hidden="true">
          <span className="schedule-actions__toggle">
            Xem thêm {scheduleBlocks.length - MAX_VISIBLE_ROWS} lịch còn lại
          </span>
        </div>
      ) : null}

      <p className="schedule-note">
        Lịch có thể thay đổi nhẹ theo sĩ số từng sân và từng giai đoạn.
      </p>
    </section>
  );
}
