# S3A-B1: Add `getCoaches()` Query

## Objective

Them typed query cho coach documents de homepage co the render trust layer tu Sanity ma khong can fallback static data.

## Input

- `src/lib/sanity/queries.ts`
- `src/lib/sanity/index.ts`
- `src/sanity/schemaTypes/coach.ts`
- Coach schema da ton tai tu Sprint 1, nhung frontend chua query

## Output

```text
src/lib/sanity/queries.ts
src/lib/sanity/index.ts
```

Them:

- `SanityCoach`
- `getCoaches()`

## Dependency

- Sprint 2 done

## Priority

- P0

## Data Shape

```ts
type SanityCoach = {
  id: string;
  name: string;
  photoUrl: string | null;
  photoAlt: string | null;
  teachingGroup: string;
  approach: string;
  order: number;
};
```

## Acceptance Criteria

1. `queries.ts` export type `SanityCoach`.
2. `getCoaches()` dung `react.cache()`.
3. Query chi lay documents:
   - `_type == "coach"`
   - `isActive == true`
   - published-only
4. Sort:
   - `coalesce(order, 9999) asc`
   - `_createdAt asc` lam fallback tie-breaker
5. Projection co day du:
   - `id`
   - `name`
   - `photoUrl`
   - `photoAlt`
   - `teachingGroup`
   - `approach`
   - `order`
6. Neu Sanity tra rong hoac khong co coach -> function tra `[]`, khong throw.
7. Khong them fallback static coach data.
8. `index.ts` barrel export duoc query va type nay.
9. `npm run lint` va `npm run build` pass.

## GROQ Notes

- `photoUrl` dung `photo.asset->url`
- `order` dung `coalesce(order, 9999)`
- khong can draft mode

## Edge Cases

### 1. Coach khong co photo

`photoUrl` va `photoAlt` phai cho phep `null`.

### 2. Dataset rong

Homepage section se graceful hide o ticket sau. Query layer chi can tra `[]`.

### 3. Query tags

Nen them cache tag rieng cho coach content de sau nay on-demand invalidation de dang hon.

## Non-Scope

- Chua tao component `CoachSection`
- Chua wire vao homepage
- Chua them CSS

## Risk / Luu y

- Day la query khong co fallback. UI phai duoc thiet ke de empty state = hidden state.
