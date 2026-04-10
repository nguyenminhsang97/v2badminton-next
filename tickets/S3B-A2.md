# S3B-A2: Extract `LocationsGrid`

## Objective

Tach locations cards thanh presentational block de money pages co the render 1-2 san ma khong bi header homepage "4 SAN TAP" di kem.

## Input

- `src/components/home/LocationsSection.tsx`

## Output

```text
src/components/blocks/LocationsGrid.tsx
src/components/home/LocationsSection.tsx
```

## Dependency

- Sprint 2 done

## Priority

- P0

## Acceptance Criteria

1. Tao `src/components/blocks/LocationsGrid.tsx`.
2. `LocationsGrid` render thuần location cards:
   - ten san
   - district label
   - dia chi
   - maps CTA
3. `LocationsSection.tsx` giu section header homepage va delegate grid render xuong `LocationsGrid`.
4. Homepage locations khong regression sau refactor.
5. Money pages co the import `LocationsGrid` truc tiep ma khong keo theo title hardcode "4 SAN TAP".
6. Khong doi maps-only CTA behavior trong ticket nay.
7. `npm run lint` va `npm run build` pass.

## Edge Cases

### 1. So san it

Grid van on khi co 1 hoac 2 locations.

### 2. Header ownership

Header homepage nam o wrapper, khong nam trong block.

## Non-Scope

- Chua them internal links tren location cards
- Chua doi styling card

## Risk / Luu y

- Ticket nay phai giu exact behavior tren homepage, vi section nay da o production state tu Sprint 2.
