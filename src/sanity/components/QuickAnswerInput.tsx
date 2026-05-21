import type { StringInputProps } from "sanity";

/**
 * QuickAnswerInput — custom Sanity Studio input for `quickAnswer` fields.
 *
 * Wraps the default textarea with:
 * - An "AEO" badge (Answer Engine Optimisation reminder)
 * - A live word counter that turns green inside the 40–70 word target range
 * - A helper line with the recommended range
 *
 * Used on content_hub, content_node, and content_article. Wired via
 * `components: { input: QuickAnswerInput }` in each schema.
 */
export function QuickAnswerInput(props: StringInputProps) {
  const value = (props.value ?? "").trim();
  const wordCount = value === "" ? 0 : value.split(/\s+/).length;
  const inRange = wordCount >= 40 && wordCount <= 70;

  return (
    <div>
      {props.renderDefault(props)}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "6px",
          marginTop: "6px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            background: "#2276fc",
            color: "#fff",
            borderRadius: "4px",
            padding: "2px 7px",
            lineHeight: 1.5,
          }}
        >
          AEO
        </span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: inRange ? "#1a9e6f" : "#b45309",
          }}
        >
          {wordCount} từ
        </span>
        <span style={{ fontSize: "12px", color: "#888" }}>
          · Khuyến nghị 40–70 từ, bắt đầu bằng chủ thể.
        </span>
      </div>
    </div>
  );
}
