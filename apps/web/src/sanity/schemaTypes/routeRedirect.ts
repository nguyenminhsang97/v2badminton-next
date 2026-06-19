import { defineField, defineType } from "sanity";
import { findPathConflict, normalizePath } from "./contentShared";

/**
 * route_redirect — minimal redirect record for slug changes / legacy URLs.
 *
 * Phase 1 substitute for a full route_registry: the catch-all route falls back
 * to a redirect lookup before notFound(). `fromPath` participates in the same
 * global uniqueness check as routable `fullPath`s, so a redirect source can
 * never shadow a live page (satisfies the pre-publish-enforcement requirement
 * without an editor-facing registry document).
 */
export const routeRedirect = defineType({
  name: "route_redirect",
  title: "Chuyển hướng URL",
  type: "document",
  initialValue: {
    permanent: true,
  },
  fields: [
    defineField({
      name: "fromPath",
      title: "Đường dẫn cũ (from)",
      type: "string",
      description:
        "URL cũ cần chuyển hướng, dạng /duong-dan-cu/. Phải duy nhất và không trùng trang đang chạy.",
      validation: (Rule) =>
        Rule.required()
          .custom((value) => {
            if (!value) return true;
            return value.startsWith("/")
              ? true
              : "Đường dẫn phải bắt đầu bằng /";
          })
          .custom(async (value, context) => {
            if (!value) return true;
            return findPathConflict(
              value,
              context as unknown as Parameters<typeof findPathConflict>[1],
            );
          }),
    }),
    defineField({
      name: "toPath",
      title: "Đường dẫn mới (to)",
      type: "string",
      description:
        "Đích chuyển hướng. Đường dẫn nội bộ /duong-dan-moi/ hoặc URL đầy đủ https://...",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return true;
          return value.startsWith("/") || /^https?:\/\//.test(value)
            ? true
            : "Phải là đường dẫn nội bộ (/...) hoặc URL đầy đủ (https://...)";
        }),
    }),
    defineField({
      name: "permanent",
      title: "Chuyển hướng vĩnh viễn (308/301)?",
      type: "boolean",
      description:
        "Bật cho chuyển hướng vĩnh viễn (đổi slug). Tắt cho tạm thời (307/302).",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "fromPath",
      subtitle: "toPath",
      permanent: "permanent",
    },
    prepare({ title, subtitle, permanent }) {
      return {
        title: normalizePath(title ?? ""),
        subtitle: `→ ${subtitle ?? "?"} ${permanent ? "(301/308)" : "(302/307)"}`,
      };
    },
  },
});
