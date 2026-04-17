/**
 * SPRINT 2 STATUS: Partially active.
 * CourtId, DistrictId types are still depended on by:
 *   - src/lib/schedule.ts
 *   - src/lib/validation/lead.ts
 *   - src/lib/leadPipeline.ts
 *   - src/lib/db/types.ts
 *   - src/components/home/legacyScheduleCompatibility.ts
 *   - src/components/home/HomepageConversionProvider.tsx
 * courtLocations/courtLocationMap data also used in queries.ts for fallback.
 * Full deprecation blocked until lead pipeline migrates to Sanity-native location IDs (Sprint 4+).
 */
export type DistrictId = "binh_thanh" | "thu_duc";
export type CourtId = "green" | "hue_thien" | "khang_sport" | "phuc_loc";

export type CourtLocation = {
  id: CourtId;
  name: string;
  shortName: string;
  schemaName: string;
  district: DistrictId;
  districtLabel: string;
  localPage: "/lop-cau-long-binh-thanh/" | "/lop-cau-long-thu-duc/";
  addressText: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: "Hồ Chí Minh";
  addressCountry: "VN";
  mapsUrl: string;
  mapsLabel: string;
  geo: { lat: number; lng: number };
  image: string;
  imageAlt: string;
  primaryForSchema?: boolean;
};

export const courtLocations: readonly CourtLocation[] = [
  {
    id: "green",
    name: "Sân Green",
    shortName: "Green",
    schemaName: "Sân Green",
    district: "binh_thanh",
    districtLabel: "Bình Thạnh",
    localPage: "/lop-cau-long-binh-thanh/",
    addressText: "154/9 đường Nguyễn Xí, phường 26, Bình Thạnh, Hồ Chí Minh",
    streetAddress: "154/9 đường Nguyễn Xí, phường 26",
    addressLocality: "Bình Thạnh",
    addressRegion: "Hồ Chí Minh",
    addressCountry: "VN",
    mapsUrl: "https://maps.app.goo.gl/UDemAGhNE2hiYHPq7",
    mapsLabel: "Xem đường đi trên Google Maps",
    geo: { lat: 10.8159726, lng: 106.708611 },
    image: "/images/green.webp",
    imageAlt: "Sân Green",
  },
  {
    id: "hue_thien",
    name: "Sân Huệ Thiên",
    shortName: "Huệ Thiên",
    schemaName: "Sân Huệ Thiên",
    district: "thu_duc",
    districtLabel: "Thủ Đức",
    localPage: "/lop-cau-long-thu-duc/",
    addressText: "520 Quốc Lộ 13, Hiệp Bình Phước, Hiệp Bình, Hồ Chí Minh",
    streetAddress: "520 Quốc Lộ 13, Hiệp Bình Phước",
    addressLocality: "Hiệp Bình",
    addressRegion: "Hồ Chí Minh",
    addressCountry: "VN",
    mapsUrl: "https://maps.app.goo.gl/ZPetLoVBnimhjaEG6",
    mapsLabel: "Xem đường đi trên Google Maps",
    geo: { lat: 10.845561, lng: 106.7185454 },
    image: "/images/hue-thien.webp",
    imageAlt: "Sân Huệ Thiên",
    primaryForSchema: true,
  },
  {
    id: "khang_sport",
    name: "Sân Khang Sport (Bình Triệu)",
    shortName: "Khang Sport",
    schemaName: "Sân Khang Sport (Bình Triệu)",
    district: "thu_duc",
    districtLabel: "Thủ Đức",
    localPage: "/lop-cau-long-thu-duc/",
    addressText: "8 Đường số 20, Hiệp Bình Chánh, Hiệp Bình, Hồ Chí Minh",
    streetAddress: "8 Đường số 20, Hiệp Bình Chánh",
    addressLocality: "Hiệp Bình",
    addressRegion: "Hồ Chí Minh",
    addressCountry: "VN",
    mapsUrl: "https://maps.app.goo.gl/WK1JB7CCEhLQ8YN69",
    mapsLabel: "Xem đường đi trên Google Maps",
    geo: { lat: 10.8443035, lng: 106.703096 },
    image: "/images/khang-sport.webp",
    imageAlt: "Sân Khang Sport (Bình Triệu)",
  },
  {
    id: "phuc_loc",
    name: "Sân Phúc Lộc",
    shortName: "Phúc Lộc",
    schemaName: "Sân Phúc Lộc",
    district: "thu_duc",
    districtLabel: "Thủ Đức",
    localPage: "/lop-cau-long-thu-duc/",
    addressText: "103/11B Đường số 20, Hiệp Bình Chánh, Hiệp Bình, Hồ Chí Minh",
    streetAddress: "103/11B Đường số 20, Hiệp Bình Chánh",
    addressLocality: "Hiệp Bình",
    addressRegion: "Hồ Chí Minh",
    addressCountry: "VN",
    mapsUrl: "https://maps.app.goo.gl/pU2Zr72N1s612v5b7",
    mapsLabel: "Xem đường đi trên Google Maps",
    geo: { lat: 10.84495, lng: 106.70385 },
    image: "/images/phuc-loc.webp",
    imageAlt: "Sân Phúc Lộc",
  },
] as const;

export const courtLocationMap = Object.fromEntries(
  courtLocations.map((court) => [court.id, court]),
) as Record<CourtId, CourtLocation>;

export function getCourtsForLocalPage(path: CourtLocation["localPage"]) {
  return courtLocations.filter((court) => court.localPage === path);
}
