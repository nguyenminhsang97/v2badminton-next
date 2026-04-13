# S3A-C1: Add `getTestimonials()` Query

## Objective

Them typed query cho testimonial documents de homepage co the render social proof tu Sanity.

## Input

- `src/lib/sanity/queries.ts`
- `src/lib/sanity/index.ts`
- `src/sanity/schemaTypes/testimonial.ts`

## Output

```text
src/lib/sanity/queries.ts
src/lib/sanity/index.ts
```

Them:

- `SanityTestimonial`
- `getTestimonials()`

## Dependency

- Sprint 2 done

## Priority

- P0

## Data Shape

```ts
type SanityTestimonial = {
  id: string;
  studentName: string;
  studentGroup: "tre_em" | "nguoi_moi" | "nguoi_di_lam" | "doanh_nghiep";
  contextLabel: string | null;
  content: string;
  order: number;
};
```

## Acceptance Criteria

1. `queries.ts` export type `SanityTestimonial`.
2. `getTestimonials()` dung `react.cache()`.
3. Query chi lay documents:
   - `_type == "testimonial"`
   - `isActive == true`
   - published-only
4. Sort:
   - `coalesce(order, 9999) asc`
   - `_createdAt asc`
5. Projection co day du:
   - `id`
   - `studentName`
   - `studentGroup`
   - `contextLabel`
   - `content`
   - `order`
6. Neu khong co data -> tra `[]`, khong throw.
7. Khong them fallback static testimonial data.
8. `index.ts` barrel export query va type.
9. `npm run lint` va `npm run build` pass.

## Edge Cases

### 1. `contextLabel`

Field nay optional, phai cho phep `null`.

### 2. `studentGroup`

Nen reuse union values tu schema shared neu co san, tranh hardcode lech enum.

### 3. Dataset rong

UI se hide section o ticket sau. Query layer khong can render empty placeholder.

## Non-Scope

- Chua tao testimonials component
- Chua wire vao homepage
- Chua them schema/JSON-LD cho testimonials

## Risk / Luu y

- Query nay khong duoc keo static fallback vao, vi Sprint 1 khong seed testimonials.
