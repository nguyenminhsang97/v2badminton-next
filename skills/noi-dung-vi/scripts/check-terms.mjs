#!/usr/bin/env node
/**
 * Soát thuật ngữ cầu lông trong văn bản tiếng Việt.
 *
 *   node check-terms.mjs bai-viet.md [tệp khác...]
 *   echo "đoạn văn" | node check-terms.mjs
 *
 * LỖI      — từ tự dịch không chuẩn. Thoát với mã 1.
 * CẢNH BÁO — thuật ngữ tiếng Anh đứng một mình. Không báo khi nó nằm trong ngoặc
 *            (ví dụ "Đập cầu (smash)") hoặc dính vào slug/URL ("ky-thuat-dap-cau-smash").
 *
 * Tệp JSON (bản xuất Sanity, Portable Text) chỉ được soát ở các chuỗi nội dung;
 * khóa cấu trúc như `_type: "block"` bị bỏ qua, và vị trí báo theo đường dẫn trường.
 */
import { readFileSync } from "node:fs";

// Từ tự dịch mà cộng đồng cầu lông Việt Nam không dùng. HLV Sang đã xác nhận.
const NON_STANDARD = ["lốp cầu", "giết lưới", "bốc lưới"];

// Cụm dài đứng trước để "spin net shot" không bị báo thêm thành "net shot".
const ENGLISH_TO_VI = [
  ["spin net shot", "Sủi cầu"],
  ["split step", "Tách chân / Tách nhịp"],
  ["basic grip", "Cầm vợt thuận tay"],
  ["v grip", "Cầm vợt thuận tay"],
  ["thumb grip", "Cầm vợt ngón cái"],
  ["panhandle grip", "Cầm vợt cán búa"],
  ["hammer grip", "Cầm vợt cán búa"],
  ["flick serve", "Giao cầu bắn"],
  ["low serve", "Giao cầu thấp"],
  ["net kill", "Chụp lưới"],
  ["net lift", "Bung cầu"],
  ["net shot", "Kê cầu"],
  ["drop shot", "Bỏ nhỏ"],
  ["dropshot", "Bỏ nhỏ"],
  ["forecourt", "Dàn lưới"],
  ["midcourt", "Giữa sân"],
  ["rearcourt", "Cuối sân"],
  ["forehand", "Thuận tay"],
  ["backhand", "Trái tay"],
  ["lunge", "Bước rướn"],
  ["clear", "Phông cầu"],
  ["smash", "Đập cầu"],
  ["drive", "Tạt cầu"],
  ["block", "Chặn cầu"],
  ["slice", "Cắt cầu"],
];

// Khóa cấu trúc của Sanity / Portable Text. Giá trị của chúng ("block", "span",
// "normal", "strong", slug, URL) không phải chữ người đọc nhìn thấy.
const STRUCTURAL_KEYS = new Set([
  "_type",
  "_key",
  "_ref",
  "_id",
  "_rev",
  "style",
  "listItem",
  "level",
  "marks",
  "markDefs",
  "href",
  "current",
  "slug",
  "audience",
  "pages",
]);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Không dính chữ, số, gạch nối, gạch dưới hay "/" ở hai bên — bỏ qua slug và URL.
function termRegex(term) {
  const body = escapeRegex(term).replace(/ /g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}\\-_/])${body}(?![\\p{L}\\p{N}\\-_/])`, "giu");
}

function isInsideParentheses(line, index) {
  return line.lastIndexOf("(", index) > line.lastIndexOf(")", index);
}

function checkLine(line, where, totals) {
  for (const term of NON_STANDARD) {
    for (const match of line.matchAll(termRegex(term))) {
      console.log(`${where}: LỖI "${match[0]}" — không phải thuật ngữ chuẩn, tra bảng trong SKILL.md`);
      totals.errors++;
    }
  }

  const claimed = [];
  for (const [english, vietnamese] of ENGLISH_TO_VI) {
    for (const match of line.matchAll(termRegex(english))) {
      const start = match.index;
      const end = start + match[0].length;
      if (claimed.some(([s, e]) => start < e && end > s)) continue;
      claimed.push([start, end]);
      if (isInsideParentheses(line, start)) continue;
      console.log(`${where}: CẢNH BÁO "${match[0]}" → dùng "${vietnamese}"`);
      totals.warnings++;
    }
  }
}

function collectProse(node, path, out = []) {
  if (typeof node === "string") {
    out.push([path, node]);
  } else if (Array.isArray(node)) {
    node.forEach((item, index) => collectProse(item, `${path}[${index}]`, out));
  } else if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (STRUCTURAL_KEYS.has(key)) continue;
      collectProse(value, path ? `${path}.${key}` : key, out);
    }
  }
  return out;
}

function tryParseJson(text) {
  // trim() also drops a leading BOM, which JSON.parse would reject.
  const trimmed = text.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return undefined;
  try {
    return JSON.parse(trimmed);
  } catch {
    return undefined;
  }
}

function check(text, label, totals) {
  const json = tryParseJson(text);

  if (json !== undefined) {
    for (const [path, value] of collectProse(json, "")) {
      for (const line of value.split(/\r?\n/)) {
        checkLine(line, `${label} ${path}`, totals);
      }
    }
    return;
  }

  text.split(/\r?\n/).forEach((line, lineIndex) => {
    checkLine(line, `${label}:${lineIndex + 1}`, totals);
  });
}

const files = process.argv.slice(2);
const sources =
  files.length === 0
    ? [["stdin", readFileSync(0, "utf8")]]
    : files.map((file) => [file, readFileSync(file, "utf8")]);

const totals = { errors: 0, warnings: 0 };
for (const [label, text] of sources) {
  // NFC: văn bản dán từ một số trình soạn thảo ở dạng NFD, khi đó "lốp" không khớp.
  check(text.normalize("NFC"), label, totals);
}

console.log(`Kết quả: ${totals.errors} lỗi, ${totals.warnings} cảnh báo.`);
process.exit(totals.errors > 0 ? 1 : 0);
