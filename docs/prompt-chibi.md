# Tạo hình cô Thảo chibi bằng Gemini — làm theo 3 bước

Chỉ cần **copy khung xám → dán vào Gemini → gửi**. Không cần hiểu nội dung tiếng Anh trong khung.
Mở Gemini tại **gemini.google.com** (đăng nhập Gmail).

---

## Bước 1 — Tạo hình cô Thảo gốc (làm 1 lần)

1. Bấm dấu **+** trong ô chat ▸ **Tải tệp lên** ▸ chọn **ảnh thật của cô Thảo**.
2. Copy khung dưới, dán vào ô chat, bấm **Gửi**.

```
Turn the woman in the attached photo into a cute chibi character named "Ms. Thao", a kind high-school homeroom teacher.
Keep her look: thick black nearsighted glasses, a very round chubby kind face with rosy cheeks, gentle smiling eyes,
long straight dark-brown hair with an auburn tint and soft wispy bangs.
Outfit: black sleeveless V-neck vest with a thin gold stripe on the neckline, over an ivory long-sleeve blouse.
Chibi proportions: big round head, small body. Soft, warm, clean digital illustration.
Half-body, standing in the center, happy smile, plain white background, no text, square image.
```

3. Chưa giống cô? Gõ thêm một câu rồi gửi, ví dụ:
   - `Make her face rounder and the glasses bigger.` (mặt tròn hơn, kính to hơn)
   - `Make it look more like the photo.` (giống ảnh thật hơn)
4. Ưng hình nào ▸ bấm vào hình ▸ **Tải xuống**. Đổi tên file thành **`goc.png`**.

> Ảnh thật chỉ dùng ở bước này. Từ bước 2 chỉ dùng `goc.png`.

### Gemini không ra hình?
Gemini **thường từ chối vẽ lại ảnh chụp người thật** (không ra hình, hoặc chỉ trả lời bằng chữ). Khi đó:
1. Bấm **Cuộc trò chuyện mới**, **không đính kèm ảnh**, chỉ dán đoạn tiếng Việt này:
```
Hãy tạo một bức ảnh: nhân vật chibi dễ thương tên "cô Thảo", giáo viên chủ nhiệm cấp 3 người Việt.
Đeo kính cận gọng đen to, mặt rất tròn, phúc hậu, má hồng, mắt cười hiền; tóc dài thẳng màu nâu ánh đỏ, mái thưa.
Mặc áo gile đen cổ chữ V có viền vàng mảnh, bên trong áo sơ mi trắng ngà dài tay.
Tỉ lệ chibi: đầu to tròn, người nhỏ. Phong cách tranh vẽ số mềm mại, ấm áp. Nửa người, đứng giữa, cười tươi, vẫy tay chào,
nền trắng trơn, không có chữ, ảnh vuông.
```
2. Vẫn không được ⇒ đăng nhập Gemini bằng **Gmail cá nhân** (@gmail.com) — tài khoản của trường thường bị tắt tính năng tạo ảnh.
3. Vẫn không được ⇒ chụp màn hình câu trả lời của Gemini gửi Claude.

---

## Bước 2 — Tạo 16 biểu cảm

1. Bấm **Cuộc trò chuyện mới**. Bấm **+** ▸ đính kèm **`goc.png`**.
2. Copy **khung số 1** dưới đây, dán, gửi. Tải hình về, đặt tên **`1.png`**.
3. **Ở nguyên cuộc trò chuyện đó**, lần lượt copy khung số 2, 3, 4… → gửi → tải về, đặt tên theo số (`2.png`, `3.png`…).

**Khung số 1 — Vẫy tay chào** (dán kèm ảnh `goc.png`)
```
This is my character "Ms. Thao". Keep EXACTLY the same face, glasses, hair, outfit and drawing style in every image I ask for.
Plain white background, half-body, centered, no text, square image.
Image 1: waving hello with one hand, big warm smile.
```

Các khung tiếp theo (chỉ cần dán, không cần đính kèm lại ảnh):

**2 — Đọc hướng dẫn**
```
Same character, same style. Holding an open notebook and a teacher's pointer, explaining kindly.
```
**3 — Chỉ tay**
```
Same character, same style. Pointing to the right with a pointer, winking, encouraging smile.
```
**4 — Vui (học sinh được cộng điểm)**
```
Same character, same style. Happy, clapping hands, small sparkles around her.
```
**5 — Khen lớn**
```
Same character, same style. Very proud, both arms up holding a gold star, tiny confetti.
```
**6 — Cổ vũ**
```
Same character, same style. Cheering pose, one fist raised, "you can do it" face.
```
**7 — Buồn (học sinh bị trừ điểm)**
```
Same character, same style. A little sad, hugging her notebook, small sweat drop.
```
**8 — Lo lắng**
```
Same character, same style. Worried, hand on her cheek, small frown.
```
**9 — Nghiêm (tái phạm lần 2)**
```
Same character, same style. Arms crossed, serious but gentle face, one eyebrow raised.
```
**10 — Giận dễ thương (vi phạm nhiều lần)**
```
Same character, same style. Cute chibi anger: puffed cheeks, hands on hips, small anger mark on her head. Still adorable, not scary.
```
**11 — Suy nghĩ**
```
Same character, same style. Thinking, finger on chin, looking up, small question marks.
```
**12 — Ngạc nhiên**
```
Same character, same style. Surprised, eyes wide, hands up near her face.
```
**13 — Nghỉ ngơi**
```
Same character, same style. Relaxed, holding a cup of tea, peaceful smile.
```
**14 — Ăn mừng**
```
Same character, same style. Celebrating, jumping, holding a small flag, confetti.
```
**15 — Chụp ảnh**
```
Same character, same style. Holding up a smartphone taking a photo, friendly face.
```
**16 — Cảm ơn**
```
Same character, same style. Bowing slightly with hands together, holding a small bouquet of flowers.
```

Hình nào bị lệch (khác mặt, mất kính…): gõ `Keep the same face and glasses as image 1. Try again.` rồi gửi lại.

---

## Bước 3 — Gửi cho Claude

Gửi `goc.png` và các file `1.png` … `16.png` vào khung chat này. Claude sẽ tự tách nền, thu nhỏ và gắn vào app.
**Chưa đủ 16 hình cũng gửi được** — hình nào thiếu, app tạm dùng hình vẽ sẵn.

---

## Thêm: cô Thảo mặc trang phục khác (không bắt buộc)

Làm lại **Bước 2**, nhưng ở **khung số 1** thay câu đầu bằng một trong các câu dưới (vẫn đính kèm `goc.png`).
Mỗi bộ trang phục là một bộ hình riêng — khi gửi Claude, ghi rõ tên bộ (ví dụ "bộ áo dài").

| Bộ | Câu thay vào đầu khung số 1 |
|---|---|
| Áo dài trắng (20/11, khai giảng) | `This is my character "Ms. Thao". Keep the same face, glasses and hair, but she now wears an ivory-white Vietnamese ao dai with gold lotus embroidery.` |
| Áo dài đỏ (Tết) | `This is my character "Ms. Thao". Keep the same face, glasses and hair, but she now wears a red Vietnamese ao dai with yellow apricot blossoms.` |
| Lên lớp (áo len xanh) | `This is my character "Ms. Thao". Keep the same face, glasses and hair, but she now wears a teal cardigan over a white blouse and holds a pointer.` |
| STEM | `This is my character "Ms. Thao". Keep the same face, glasses and hair, but she now wears a white lab coat and holds a tablet, a tiny robot beside her.` |
| Mùa đông | `This is my character "Ms. Thao". Keep the same face, glasses and hair, but she now wears a blue-grey wool coat and a red knitted scarf.` |
| Trung thu | `This is my character "Ms. Thao". Keep the same face, glasses and hair, but she now wears an orange blouse and holds a star lantern.` |
| Cuối tuần | `This is my character "Ms. Thao". Keep the same face, glasses and hair, but she now wears an oversized lavender sweater with headphones around her neck.` |

Sau câu đó, giữ nguyên phần còn lại của khung số 1 (`Plain white background… Image 1: waving hello…`).

---

## Thêm: hình động (không bắt buộc)

Trong Gemini chọn **Video**, đính kèm một hình biểu cảm (ví dụ `4.png`), dán:
```
Animate this exact character. Keep the same face, glasses, hair and outfit. Plain bright green background, camera does not move,
2-3 second loop. She claps her hands happily and hops a little.
```
Đổi câu cuối theo hành động muốn có (vẫy tay, khoanh tay lắc đầu, giơ ngôi sao…). Tải video về gửi Claude — Claude tự tách nền xanh
và chuyển thành hình động trong app.
