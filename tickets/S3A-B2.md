# S3A-B2: Build `CoachSection` + CSS

## Objective

Tao homepage coach section render tu `SanityCoach[]`, responsive va co the tu an khi chua co data.

## Input

- `SanityCoach[]` tu S3A-B1
- `src/app/globals.css`
- Homepage hien chua co trust section cho coach

## Output

```text
src/components/home/CoachSection.tsx
src/app/globals.css
```

## Dependency

- S3A-B1

## Priority

- P0

## Component Contract

```ts
type HomepageCoachSectionProps = {
  coaches: SanityCoach[];
};
```

## Acceptance Criteria

1. Tao `src/components/home/CoachSection.tsx`.
2. File la server component, khong them `"use client"`.
3. Neu `coaches.length === 0` -> `return null`.
4. Section co:
   - `section.section`
   - `id="hlv"`
   - section header
   - `coach-grid`
   - `coach-card`
5. Moi card render:
   - photo neu co
   - name
   - teachingGroup
   - approach
6. Co CSS cho:
   - `.coach-grid`
   - `.coach-card`
   - photo square
   - responsive 1 cot mobile, 2 cot tablet+
7. Khong can `next/image` trong ticket nay.
8. Neu coach khong co photo, card van layout on dinh.
9. `npm run lint` va `npm run build` pass.

## UI Notes

- Dung `<img>` thong thuong de giu scope nho.
- `max-width` photo goi y: `120px`
- `aspect-ratio: 1 / 1`
- `object-fit: cover`

## Edge Cases

### 1. Grid item count it

Khi co 1 coach hoac 2 coach, grid khong duoc vo layout.

### 2. Photo alt

Neu `photoAlt` null -> fallback ve `coach.name`.

### 3. Empty state

Khong render placeholder card, khong render section shell rong.

## Non-Scope

- Chua wire vao homepage
- Chua query data
- Chua them tracking

## Risk / Luu y

- Ticket nay chot visual shell cua trust layer, nen CSS can clean va khong anh huong toi grids hien co.
