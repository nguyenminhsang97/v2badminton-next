# S3A-A1: Contact Copy Polish + Stale Comment Cleanup

## Objective

Polish toan bo visible copy trong contact flow de homepage khong con text ASCII, dong thoi xoa stale comment con sot lai tu Sprint 2.

## Input

- `src/components/home/ContactForm.tsx`
- `src/components/home/ContactSection.tsx`
- Contact flow hien tai da hoat dong, chi can polish copy
- Stale comment block cua Sprint 2 van con o dau `ContactSection.tsx`

## Output

```text
src/components/home/ContactForm.tsx
src/components/home/ContactSection.tsx
```

## Dependency

- Sprint 2 done

## Priority

- P0

## Acceptance Criteria

1. Khong con labels, placeholders, helper text, status text, business copy dang o dang ASCII trong contact flow.
2. `BUSINESS_MESSAGE` constant duoc viet lai co dau.
3. `ContactSection` title / subtitle duoc viet lai co dau.
4. Comment block stale cua Sprint 2 bi xoa khoi `ContactSection.tsx`.
5. Copy can cover day du:
   - labels
   - placeholders
   - details summary
   - success state
   - submit state
   - validation helper text
   - captcha note
   - business mode text
6. File luu o UTF-8, khong bi mojibake trong browser.
7. `npm run lint` va `npm run build` pass.

## String Coverage

### `ContactForm.tsx`

- `BUSINESS_MESSAGE`
- header eyebrow / title / subtitle
- success title + CTA
- field labels
- details summary
- select option labels
- textarea labels / placeholders
- captcha note
- submit status
- submit button
- helper hint

### `ContactSection.tsx`

- section title
- section subtitle
- direct contact title
- direct contact labels neu can polish

## Edge Cases

### 1. Encoding

Codebase dang tren Windows. Sau khi them dau tieng Viet, phai verify file khong bi save sai encoding.

### 2. Runtime strings

Khong chi sua labels o JSX. Can sua ca strings trong constants va state messages.

### 3. Scope control

Ticket nay chi polish copy, khong doi layout, khong doi submit logic, khong doi validation rules.

## Non-Scope

- Khong doi tracking
- Khong doi lead pipeline
- Khong doi form fields
- Khong doi visual layout

## Risk / Luu y

- Day la ticket nho nhung rat de sot string. Nen scan lai file sau khi sua thay vi chi nhin mot vai label lon.
