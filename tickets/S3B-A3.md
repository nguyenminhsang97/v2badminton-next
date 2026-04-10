# S3B-A3: Extract `FaqList`

## Objective

Tach FAQ list thanh presentational block de money pages co the reuse render details/summary ma khong bi section header homepage di kem.

## Input

- `src/components/home/FaqSection.tsx`
- `@portabletext/react` da co trong repo

## Output

```text
src/components/blocks/FaqList.tsx
src/components/home/FaqSection.tsx
```

## Dependency

- Sprint 2 done

## Priority

- P0

## Acceptance Criteria

1. Tao `src/components/blocks/FaqList.tsx`.
2. `FaqList` render:
   - `details`
   - `summary`
   - answer rich text / fallback plain text
3. `FaqSection.tsx` giu section header homepage va delegate list render xuong `FaqList`.
4. Homepage FAQ khong regression sau refactor.
5. Money pages co the import `FaqList` truc tiep ma khong keo theo title homepage.
6. Portable Text rendering van hoat dong dung sau refactor.
7. `npm run lint` va `npm run build` pass.

## Edge Cases

### 1. Empty answer blocks

Van fallback ve `answerPlainText`.

### 2. Empty list

Block co the render rong an toan; wrapper/page caller se quyet dinh co render section shell hay khong.

## Non-Scope

- Chua doi schema logic cua FAQ JSON-LD
- Chua skip FAQPage khi `includeInSchema` rong

## Risk / Luu y

- Block nay se duoc dung o money pages, nen dung import homepage-only props types.
