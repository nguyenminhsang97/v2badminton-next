# S4C-A1 · Mobile UX review

**Mục tiêu:** Kiểm tra trải nghiệm thực tế trên điện thoại. List issues cụ thể, fix ngay nếu nhỏ (CSS), ticket riêng nếu lớn.

**Thời gian ước lượng:** 1 giờ review + thời gian fix tùy vào số issues

**Phụ thuộc:** Không

**Rủi ro:** Trung bình. Vietnam users chủ yếu dùng mobile. Nếu UX mobile tệ → mất conversion.

---

## Context

Blueprint section 15 yêu cầu "mobile UX ổn" trước cutover. Chưa ai test thực tế trên thiết bị thật.

**Ai làm:** Business owner test trên điện thoại thật, báo cáo issues. Developer fix.

---

## Cách test

### Thiết bị

Dùng điện thoại thật (không phải Chrome DevTools responsive mode). Lý do:
- Touch target size cảm nhận khác trên ngón tay vs chuột
- Keyboard ảo che form fields — chỉ thấy trên thiết bị thật
- Scroll behavior khác
- Font rendering khác

Nếu có cả Android và iOS thì test cả hai.

### URL

Dùng production URL (Vercel deployment), không phải localhost.

---

## Checklist theo section

### 1. Navigation

- [ ] Logo click về homepage
- [ ] Menu mobile mở/đóng mượt
- [ ] Menu links scroll đúng tới section
- [ ] SĐT hiển thị, bấm được, gọi được

### 2. Hero

- [ ] Title đọc được, không bị cắt
- [ ] Subheading đọc được
- [ ] Quick links text không quá nhỏ, bấm dễ
- [ ] CTA button đủ lớn để bấm bằng ngón tay (min 44px height)
- [ ] Trust stats hiển thị đúng

### 3. Pricing Cards

- [ ] Cards không bị tràn ngang (horizontal scroll)
- [ ] Giá và features đọc được
- [ ] CTA button trên mỗi card bấm được
- [ ] Nếu 3 cards: layout stack hay scroll? Cả hai ok, miễn usable

### 4. Course Section

- [ ] Cards hiển thị đúng
- [ ] Ảnh load (không bị broken)
- [ ] Text không quá dài trên mobile

### 5. Coach Section

- [ ] Ảnh HLV hiển thị (hoặc placeholder nếu chưa có ảnh thật)
- [ ] Tên + nhóm + phương pháp đọc được
- [ ] Cards không bị overlap

### 6. Schedule Section

- [ ] Tabs (nếu có) chuyển được
- [ ] Lịch học đọc được trên mobile
- [ ] Không bị horizontal overflow

### 7. Locations Section

- [ ] Location cards hiển thị đúng
- [ ] "Xem bản đồ" link mở Google Maps

### 8. FAQ Section

- [ ] Accordion mở/đóng khi bấm
- [ ] Câu trả lời hiển thị đúng
- [ ] Không bị overflow text

### 9. Contact Form (quan trọng nhất)

- [ ] Form visible, scroll tới được
- [ ] Label đọc được
- [ ] Input fields: keyboard đúng loại (text cho tên, tel cho SĐT)
- [ ] Dropdown chọn được (trình độ, sân, khung giờ)
- [ ] Keyboard ảo không che nút Submit
- [ ] Submit button đủ lớn và nổi bật
- [ ] Success state hiển thị đúng sau submit
- [ ] Error messages hiển thị rõ ràng

### 10. Money Pages (chọn 1-2 trang test)

- [ ] H1 hiển thị đúng
- [ ] Nội dung (body) đọc được
- [ ] Pricing cards (nếu có) hiển thị ok
- [ ] CTA cuối trang bấm được, dẫn về homepage form

### 11. Footer

- [ ] Links hoạt động
- [ ] Copyright text hiển thị
- [ ] Social links (nếu có) bấm được

---

## Cách báo cáo issues

Với mỗi issue, cung cấp:

1. **Section nào:** VD: "Contact Form"
2. **Mô tả:** VD: "Keyboard ảo che mất nút Submit trên iPhone"
3. **Screenshot:** Chụp màn hình hoặc quay video ngắn
4. **Thiết bị:** VD: "iPhone 13, Safari" hoặc "Samsung Galaxy A52, Chrome"
5. **Mức nghiêm trọng:**
   - 🔴 Blocker: không thể hoàn thành hành động (VD: không submit được form)
   - 🟡 Major: khó dùng nhưng vẫn hoàn thành được
   - 🟢 Minor: cosmetic, không ảnh hưởng chức năng

---

## Output

Báo cáo dạng:

```
📱 Thiết bị: iPhone 13, Safari 17
📅 Ngày test: 2026-04-XX

✅ Navigation — ok
✅ Hero — ok
🟡 Pricing Cards — card thứ 3 bị cắt chữ "Doanh nghiệp"
✅ Course — ok
✅ Coach — ok
✅ Schedule — ok
✅ Locations — ok
✅ FAQ — ok
🔴 Contact Form — keyboard che nút Submit trên iPhone landscape
✅ Footer — ok
```

Developer sẽ fix dựa trên report này.
