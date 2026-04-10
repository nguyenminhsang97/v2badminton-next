# S3A-C2: Build `TestimonialsSection` + CSS

## Objective

Tao testimonials section tren homepage de render social proof tu `SanityTestimonial[]`.

## Input

- `SanityTestimonial[]` tu S3A-C1
- `src/app/globals.css`

## Output

```text
src/components/home/TestimonialsSection.tsx
src/app/globals.css
```

## Dependency

- S3A-C1

## Priority

- P0

## Component Contract

```ts
type HomepageTestimonialsSectionProps = {
  testimonials: SanityTestimonial[];
};
```

## Acceptance Criteria

1. Tao `src/components/home/TestimonialsSection.tsx`.
2. File la server component.
3. Neu `testimonials.length === 0` -> `return null`.
4. Section co:
   - `section.section`
   - `id="hoc-vien-noi-gi"`
   - section header
   - `testimonials-grid`
5. Moi card la `blockquote` va render:
   - content
   - studentName
   - contextLabel neu co
6. Co CSS cho:
   - `.testimonials-grid`
   - `.testimonial-card`
   - footer / name / context
   - responsive 1 cot mobile, 2-3 cot desktop
7. Khong can carousel / slider trong sprint nay.
8. `npm run lint` va `npm run build` pass.

## Edge Cases

### 1. Testimonial content dai

Card van phai giu duoc spacing va khong vo layout.

### 2. `contextLabel` null

Khong render span rong.

### 3. Empty state

Khong render section shell, khong render heading rong.

## Non-Scope

- Chua wire vao homepage
- Chua co filter theo `studentGroup`
- Chua lam slider / autoplay / animation

## Risk / Luu y

- Ticket nay la social proof layer, nen visual can ro rang nhung khong chiem qua nhieu chieu cao homepage.
