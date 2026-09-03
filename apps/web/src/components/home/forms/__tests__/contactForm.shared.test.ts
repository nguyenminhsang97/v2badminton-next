import { describe, expect, it } from "vitest";

import {
  buildLeadType,
  resolveSchedulePrefillLevel,
} from "../contactForm.shared";

/**
 * S14 — chuỗi chuyển ý định trên form liên hệ homepage.
 *
 * `applyBusinessMode()` đặt level = "doanh_nghiep". Trước đây prefill lịch chỉ
 * ghi level khi giá trị cũ rỗng, nên level doanh nghiệp kẹt lại sau khi user
 * bấm một dòng lịch — làm `buildLeadType()` phân loại lead nhóm thành
 * "corporate" trong analytics, DB và thông báo.
 */
describe("resolveSchedulePrefillLevel", () => {
  it("thay level doanh nghiệp bằng trình độ của dòng lịch được bấm", () => {
    expect(
      resolveSchedulePrefillLevel("doanh_nghiep", {
        levels: ["co_ban"],
        levelHint: "co_ban",
      }),
    ).toBe("co_ban");
  });

  it("xoá level doanh nghiệp khi dòng lịch mở nhiều trình độ", () => {
    expect(
      resolveSchedulePrefillLevel("doanh_nghiep", {
        levels: ["co_ban", "nang_cao"],
      }),
    ).toBe("");
  });

  it("giữ level doanh nghiệp khi dòng lịch đúng là lớp doanh nghiệp", () => {
    expect(
      resolveSchedulePrefillLevel("doanh_nghiep", {
        levels: ["doanh_nghiep"],
        levelHint: "doanh_nghiep",
      }),
    ).toBe("doanh_nghiep");
  });

  it("giữ lựa chọn của user khi dòng lịch có hỗ trợ trình độ đó", () => {
    expect(
      resolveSchedulePrefillLevel("nang_cao", {
        levels: ["co_ban", "nang_cao"],
      }),
    ).toBe("nang_cao");
  });

  it("thay lựa chọn của user khi mâu thuẫn với dòng lịch", () => {
    expect(
      resolveSchedulePrefillLevel("nang_cao", {
        levels: ["co_ban"],
        levelHint: "co_ban",
      }),
    ).toBe("co_ban");
  });

  it("điền trình độ khi form còn trống và dòng lịch chỉ có một trình độ", () => {
    expect(
      resolveSchedulePrefillLevel("", {
        levels: ["co_ban"],
        levelHint: "co_ban",
      }),
    ).toBe("co_ban");
  });

  it("để trống khi form còn trống và dòng lịch mở nhiều trình độ", () => {
    expect(
      resolveSchedulePrefillLevel("", {
        levels: ["co_ban", "nang_cao"],
      }),
    ).toBe("");
  });
});

describe("buildLeadType", () => {
  it("phân loại lead chọn lịch nhóm là individual", () => {
    expect(buildLeadType("co_ban", false)).toBe("individual");
  });

  it("phân loại lead doanh nghiệp là corporate", () => {
    expect(buildLeadType("doanh_nghiep", false)).toBe("corporate");
  });

  it("phân loại corporate khi đang ở chế độ doanh nghiệp", () => {
    expect(buildLeadType("", true)).toBe("corporate");
  });
});
