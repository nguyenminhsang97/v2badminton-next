#!/usr/bin/env node
// Tìm mâu thuẫn dữ kiện kinh doanh trong nội dung đã publish trên Sanity.
//
//   node skills/noi-dung-vi/scripts/check-facts.mjs [chủ đề ...]
//   node skills/noi-dung-vi/scripts/check-facts.mjs --input docs.json [chủ đề ...]
//   node skills/noi-dung-vi/scripts/check-facts.mjs --print-query
//
// Chủ đề: hoc-phi, si-so, thoi-luong, san-1-kem-1. Bỏ trống = tất cả.
//
// Vì sao có script này: quy tắc "hai nguồn mâu thuẫn thì không tự chọn" chỉ có
// tác dụng khi người viết nhận ra có mâu thuẫn. Đọc từng tài liệu thì không thấy;
// phải đặt mọi câu nói về cùng một dữ kiện cạnh nhau. Script quét MỌI trường chữ
// của mọi tài liệu đã publish — cả Portable Text lẫn các trường chữ thường như
// description, features — vì mâu thuẫn hay nằm ở chỗ ít ai đọc.
//
// Chỉ gửi yêu cầu GET tới Sanity (đọc, không ghi). Cần token đọc: biến môi trường
// SANITY_API_READ_TOKEN, hoặc dòng đó trong .env.local ở gốc repo (script tự dò
// lên các thư mục cha). Đọc ẩn danh trả về một phần dữ liệu mà không báo lỗi, nên
// script từ chối chạy khi không có token. Không có token thì chạy truy vấn in ra
// bởi --print-query bằng Sanity MCP, lưu kết quả (mảng tài liệu) ra file, rồi
// truyền vào bằng --input.
//
// Mã thoát: 0 không có mâu thuẫn, 1 có mâu thuẫn, 2 không đọc được dữ liệu.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const QUERY = `*[!(_id in path("drafts.**")) && !(_id in path("versions.**")) && !(_type match "sanity.*") && !(_type match "system.*")]`;
const API_VERSION = "v2025-02-19";

const args = process.argv.slice(2);
if (args.includes("--print-query")) {
  console.log(QUERY);
  process.exit(0);
}
const inputIndex = args.indexOf("--input");
const inputFile = inputIndex >= 0 ? args[inputIndex + 1] : null;
const TOPICS = ["hoc-phi", "si-so", "thoi-luong", "san-1-kem-1"];
const wanted = args.filter((arg, index) => !arg.startsWith("--") && !(inputIndex >= 0 && index === inputIndex + 1));
for (const topic of wanted) {
  if (!TOPICS.includes(topic)) {
    console.error(`Chủ đề không hợp lệ: ${topic}. Chọn trong: ${TOPICS.join(", ")}.`);
    process.exit(2);
  }
}
const topics = wanted.length > 0 ? wanted : TOPICS;

// ---------------------------------------------------------------- đọc dữ liệu

function findEnvValue(name) {
  if (process.env[name]) return process.env[name];
  const starts = [process.cwd(), dirname(fileURLToPath(import.meta.url))];
  for (const start of starts) {
    let dir = resolve(start);
    for (let depth = 0; depth < 8; depth++) {
      const file = join(dir, ".env.local");
      if (existsSync(file)) {
        const line = readFileSync(file, "utf8").split(/\r?\n/).find((entry) => entry.startsWith(`${name}=`));
        const value = line?.slice(name.length + 1).trim().replace(/^["']|["']$/g, "");
        if (value) return value;
      }
      const parent = dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  return null;
}

async function loadDocuments() {
  if (inputFile) {
    const parsed = JSON.parse(readFileSync(inputFile, "utf8").replace(/^﻿/, ""));
    return Array.isArray(parsed) ? parsed : parsed.result ?? parsed.documents ?? [];
  }
  const token = findEnvValue("SANITY_API_READ_TOKEN");
  if (!token) {
    console.error(
      "Không có SANITY_API_READ_TOKEN. Đọc ẩn danh chỉ trả về một phần dữ liệu, nên không chạy.\n" +
        "Cách khác: chạy truy vấn từ --print-query bằng Sanity MCP (project w58s0f53, dataset production),\n" +
        "lưu mảng kết quả ra file JSON, rồi chạy lại với --input <file>.",
    );
    process.exit(2);
  }
  const projectId = findEnvValue("NEXT_PUBLIC_SANITY_PROJECT_ID") ?? "w58s0f53";
  const dataset = findEnvValue("NEXT_PUBLIC_SANITY_DATASET") ?? "production";
  const url = `https://${projectId}.api.sanity.io/${API_VERSION}/data/query/${dataset}?query=${encodeURIComponent(QUERY)}&perspective=published`;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) {
    console.error(`Sanity trả về HTTP ${response.status}. Kiểm tra token.`);
    process.exit(2);
  }
  return (await response.json()).result ?? [];
}

// ------------------------------------------------------- gom chữ thành câu

const SKIP_KEYS = new Set(["_id", "_type", "_key", "_ref", "_rev", "_createdAt", "_updatedAt", "_weak", "style", "markDefs", "marks", "listItem", "level", "slug", "asset", "crop", "hotspot", "href", "url", "mapsUrl", "facebookUrl", "zaloUrl", "fullPath", "timeSlotId"]);

function collectTexts(node, path, out) {
  if (typeof node === "string") {
    out.push({ field: path, text: node });
  } else if (Array.isArray(node)) {
    node.forEach((item, index) => collectTexts(item, `${path}[${index}]`, out));
  } else if (node && typeof node === "object") {
    if (node._type === "block" && Array.isArray(node.children)) {
      out.push({ field: path, text: node.children.map((child) => child.text ?? "").join("") });
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      if (SKIP_KEYS.has(key) || key.endsWith("Url")) continue;
      collectTexts(value, path ? `${path}.${key}` : key, out);
    }
  }
}

function sentences(text) {
  return text.split(/(?<=[.!?])\s+|\n+/).map((part) => part.trim()).filter(Boolean);
}

const lower = (text) => text.toLocaleLowerCase("vi");
const numberOf = (text) => Number(text.replace(/\./g, ""));

// Mỗi câu kèm ngữ cảnh của tài liệu (câu hỏi FAQ, slug, id) để biết câu đó đang nói về lớp nào.
function contextOf(doc) {
  return lower([doc._id, doc._type, doc.slug?.current, doc.question, doc.title, doc.name].filter(Boolean).join(" "));
}

const TEAM = /team.?building|doanh nghiệp|sự kiện|phòng ban|giải (?:đấu|nội bộ)/;
const ONE_ON_ONE = /1 kèm 1|kèm 1|kèm riêng|1:1|private-1-1|1-kem-1/;

// ---------------------------------------------------------------- các chủ đề

function tierPrices(documents) {
  const tiers = documents.filter((doc) => doc._type === "pricing_tier" && doc.isActive !== false);
  return {
    tiers,
    amounts: new Set(tiers.flatMap((tier) => [tier.pricePerMonth, tier.pricePerHour]).filter(Number.isFinite)),
    cheapestMonthly: Math.min(...tiers.map((tier) => tier.pricePerMonth).filter(Number.isFinite)),
  };
}

const AMOUNT = /(\d{1,3}(?:\.\d{3})+)\s*(?:đ|vnđ|vnd|đồng)?/g;

const TOPIC_CHECKS = {
  "hoc-phi": {
    title: "Học phí",
    run(documents, rows) {
      const { tiers, amounts, cheapestMonthly } = tierPrices(documents);
      const findings = { contradictions: [], notes: [] };
      // Mỗi gói lưu giá hai lần: chữ (displayPrice) và số (pricePerMonth/pricePerHour).
      for (const tier of tiers) {
        const shown = (tier.displayPrice ?? "").match(/\d{1,3}(?:\.\d{3})+/);
        const stored = tier.pricePerMonth ?? tier.pricePerHour;
        if (shown && Number.isFinite(stored) && numberOf(shown[0]) !== stored) {
          findings.contradictions.push(`${tier._id}: displayPrice "${tier.displayPrice}" nhưng giá lưu dạng số là ${stored}`);
        }
      }
      for (const row of rows) {
        const text = lower(row.sentence);
        // Câu nói giá "từ X" hoặc "rẻ nhất/thấp nhất" phải khớp gói tháng rẻ nhất.
        const fromClaim = text.match(/(?:từ|chỉ từ)\s+(\d{1,3}(?:\.\d{3})+)/);
        const cheapestClaim = /rẻ nhất|thấp nhất/.test(text) ? text.match(/\d{1,3}(?:\.\d{3})+/) : null;
        for (const claim of [fromClaim?.[1], cheapestClaim?.[0]].filter(Boolean)) {
          const value = numberOf(claim);
          if (value >= 100_000 && !ONE_ON_ONE.test(text) && value !== cheapestMonthly) {
            findings.contradictions.push(`${row.where}: nói giá thấp nhất là ${claim}, nhưng gói tháng rẻ nhất trong pricing_tier là ${cheapestMonthly.toLocaleString("vi-VN")} — "${row.sentence}"`);
          }
        }
        // Số tiền trong câu nói về học phí mà không khớp gói nào: không hẳn là sai
        // (ví dụ phí học thử), nhưng người viết phải biết nguồn của nó.
        const aboutTuition = /học phí|gói|lớp|buổi|\/tháng|\/giờ|kèm 1|học thử/.test(lower(row.block));
        const aboutMerch = /(?<!\p{L})(?:áo|quần|combo|vợt|giày)(?!\p{L})|kỷ niệm/u.test(text);
        if (!aboutTuition || aboutMerch || row.doc._type === "pricing_tier") continue;
        for (const match of row.sentence.matchAll(AMOUNT)) {
          const value = numberOf(match[1]);
          const note = `${row.where}: số tiền ${match[1]} không khớp gói nào trong pricing_tier — "${row.sentence}"`;
          if (value >= 100_000 && !amounts.has(value) && !findings.notes.includes(note)) findings.notes.push(note);
        }
      }
      return findings;
    },
  },

  "si-so": {
    title: "Sĩ số lớp nhóm",
    values(row) {
      const text = lower(row.sentence);
      if (row.field.endsWith("groupSize")) {
        const match = text.match(/(\d+)\s*(?:-|–|đến)\s*(\d+)/);
        return match ? [`${match[1]}-${match[2]}`] : [];
      }
      // Xét cả khối văn bản: "2-6 học viên" thường đứng ở câu sau tiêu đề "Lớp nhóm …".
      const block = lower(row.block);
      if (TEAM.test(block) || TEAM.test(row.context)) return [];
      if (!/lớp|nhóm|quy mô|sĩ số/.test(block)) return [];
      return [...text.matchAll(/(?:từ\s+)?(\d+)\s*(?:-|–|đến)\s*(\d+)\s*(?:người|học viên)/g)].map((match) => `${match[1]}-${match[2]}`);
    },
  },

  "thoi-luong": {
    title: "Thời lượng buổi học nhóm",
    values(row) {
      const text = lower(row.sentence);
      if (row.doc._type === "schedule_block") return [];
      if (ONE_ON_ONE.test(text) || ONE_ON_ONE.test(row.context) || TEAM.test(text) || TEAM.test(row.context)) return [];
      if (!/buổi|lớp|khung/.test(text) || /mỗi ngày|tự tập|đến trễ/.test(text)) return [];
      // Từ 45 phút trở lên: bỏ các phần nhỏ trong buổi như "15-20 phút khởi động".
      return [...text.matchAll(/(\d{2,3})(?:\s*(?:-|–)\s*(\d{2,3}))?\s*phút/g)]
        .filter((match) => Number(match[1]) >= 45)
        .map((match) => (match[2] ? `${match[1]}-${match[2]} phút` : `${match[1]} phút`));
    },
  },

  "san-1-kem-1": {
    title: "Ai đặt sân, ai trả tiền sân (1 kèm 1)",
    values(row) {
      const text = lower(row.sentence);
      if (!/sân/.test(text) || !(ONE_ON_ONE.test(text) || ONE_ON_ONE.test(row.context))) return [];
      const found = [];
      if (/tự lo sân|tự đặt sân|tự chuẩn bị sân|tự thuê sân/.test(text)) found.push("người đặt sân: học viên tự lo");
      if (/hỗ trợ (?:học viên )?đặt sân|đặt sân giúp|v2 (?:sẽ )?đặt sân/.test(text)) found.push("người đặt sân: V2 hỗ trợ đặt");
      if (/(?:chưa|không) (?:bao )?gồm (?:phí )?(?:thuê )?sân/.test(text)) found.push("tiền sân: chưa gồm trong học phí");
      if (/đã (?:bao )?gồm (?:phí )?(?:thuê )?sân/.test(text) && ONE_ON_ONE.test(text)) found.push("tiền sân: đã gồm trong học phí");
      return found;
    },
    // Hai nhóm câu trả lời cho hai câu hỏi khác nhau; chỉ so trong cùng một nhóm.
    groupOf: (value) => value.split(":")[0],
  },
};

// ------------------------------------------------------------------ chạy

const documents = await loadDocuments();
if (documents.length === 0) {
  console.error("Không đọc được tài liệu nào. Kiểm tra token hoặc file --input.");
  process.exit(2);
}

const rows = [];
for (const doc of documents) {
  const texts = [];
  collectTexts(doc, "", texts);
  const label = `${doc._type} ${doc.slug?.current ?? doc._id}`;
  for (const { field, text } of texts) {
    for (const sentence of sentences(text)) {
      rows.push({ doc, field, sentence, block: text, context: contextOf(doc), where: `${label} · ${field}` });
    }
  }
}

let contradictionCount = 0;
console.log(`Đã quét ${documents.length} tài liệu đã publish, ${rows.length} câu.\n`);

for (const topic of topics) {
  const check = TOPIC_CHECKS[topic];
  console.log(`== ${check.title} (${topic}) ==`);

  if (check.run) {
    const { contradictions, notes } = check.run(documents, rows);
    for (const line of contradictions) console.log(`MÂU THUẪN  ${line}`);
    for (const line of notes) console.log(`CẦN XEM    ${line}`);
    if (contradictions.length === 0 && notes.length === 0) console.log("Khớp nhau.");
    contradictionCount += contradictions.length;
    console.log("");
    continue;
  }

  const byValue = new Map();
  for (const row of rows) {
    for (const value of check.values(row)) {
      if (!byValue.has(value)) byValue.set(value, []);
      byValue.get(value).push(row);
    }
  }
  const groups = new Map();
  for (const value of byValue.keys()) {
    const group = check.groupOf ? check.groupOf(value) : "";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(value);
  }
  if (byValue.size === 0) console.log("Không tìm thấy câu nào nói về dữ kiện này.");
  for (const values of groups.values()) {
    const conflicting = values.length > 1;
    if (conflicting) {
      contradictionCount++;
      console.log(`MÂU THUẪN — ${values.length} giá trị khác nhau:`);
    }
    for (const value of values) {
      const found = byValue.get(value);
      console.log(`  "${value}" (${found.length} chỗ)`);
      for (const row of found.slice(0, 6)) console.log(`      ${row.where}: "${row.sentence}"`);
      if (found.length > 6) console.log(`      … và ${found.length - 6} chỗ khác`);
    }
  }
  console.log("");
}

if (contradictionCount > 0) {
  console.log(
    `Kết quả: ${contradictionCount} mâu thuẫn.\n` +
      "Với dữ kiện đang mâu thuẫn: KHÔNG viết vế nào như sự thật trong văn bản cho người đọc.\n" +
      "Chỉ viết phần các nguồn khớp nhau, ghi [CẦN HLV XÁC NHẬN: …] ở chỗ còn lại, và liệt kê\n" +
      "từng mâu thuẫn (nguồn nào nói gì, kèm id) trong phần bàn giao để chủ repo chốt.",
  );
  process.exit(1);
}
console.log("Kết quả: không thấy mâu thuẫn ở các chủ đề đã kiểm.");
process.exit(0);
