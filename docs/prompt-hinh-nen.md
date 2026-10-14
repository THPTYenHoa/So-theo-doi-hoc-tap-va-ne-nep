# Prompt tạo hình nền — Sổ hạnh kiểm 11D3

Phong cách lấy từ 2 bộ slide mẫu của cô (Đề cương giữa HKI lớp 11 và lớp 12):

| Bộ | Phong cách | Màu chính | Màu phụ | Nền thẻ | Chữ tiêu đề |
|---|---|---|---|---|---|
| **Mận chín** (đề cương 12) | Tranh kỹ thuật số bán hiện thực, nắng chiều vàng ấm, tông nâu đỏ hoài niệm | `#7A1E3A` / `#A3264B` | vàng mù tạt `#F2C230` | hồng phấn `#F8E9ED`, kem `#F8F4E6` | serif (Georgia / Cambria) |
| **Chàm màu nước** (đề cương 11) | Tranh màu nước + nét mực, giấy có vân, nhẹ và thơ | chàm `#302663` | san hô `#D9482B` | lavender `#F3F1FA` / `#E6E1F5` | serif (Georgia / Cambria) |

## Danh sách chủ đề
Bộ 1 Mận chín (3) · Bộ 2 Chàm màu nước (3) · Bộ 3 Tươi sáng (2) · Bộ 4 Hà Nội & Yên Hoà (4) · Bộ 5 Bốn mùa (4) · Bộ 6 Dịp đặc biệt (4) · Bộ 7 Phong cách nghệ thuật (8) · Bộ 8 Thiên nhiên & trừu tượng (6) — **34 hình nền**.
Không cần làm hết: chọn 8–12 cái cô thích nhất là đủ cho bản dự thi; Bộ 6 có thể tự đổi theo ngày (20/11, Trung thu…).

## Cách dùng
1. Mở Gemini (Imagen), ChatGPT (DALL·E / GPT-Image) hoặc Copilot Designer. Dán **nguyên văn** một prompt bên dưới.
2. Mỗi chủ đề tạo **2 ảnh**: bản **ngang 16:9** (máy tính) và bản **dọc 9:16** (điện thoại). Chỉ cần đổi dòng tỉ lệ ở cuối prompt.
3. Chọn ảnh ưng nhất. Tải về bản gốc (PNG hoặc JPG lớn nhất) rồi gửi Claude. Claude sẽ nén, cắt và đặt vào `themes/`.
4. Nếu ảnh có chữ, logo hay chữ ký lạ: tạo lại, hoặc thêm câu "absolutely no text, letters, numbers or watermark".

**Luật chung cho mọi ảnh** (đã có sẵn trong từng prompt):
- Không có chữ, không người nhìn rõ mặt.
- Chừa **khoảng trống lớn, ít chi tiết** ở giữa (ảnh ngang) hoặc ở 2/3 phía dưới (ảnh dọc), vì thẻ thông tin sẽ đặt lên đó.
- Độ tương phản thấp, không có mảng đen đậm.

---

## Bộ 1 — MẬN CHÍN (theo đề cương lớp 12)

### 1.1 Lớp học nắng chiều *(chủ đề mặc định)*
```
A warm, nostalgic semi-realistic digital painting of an empty Vietnamese high-school classroom in late afternoon. Golden sunlight streams through tall wooden-framed windows, casting long soft light shafts across rows of old wooden desks, an open notebook and a fountain pen on the nearest desk. Colour palette: deep plum and burgundy (#7A1E3A, #A3264B) in the shadows, warm cream and soft blush pink (#F8F4E6, #F8E9ED) in the light, small accents of mustard yellow (#F2C230). Painterly brush texture, gentle film-grain, calm and reflective mood, cinematic but soft. Composition: details concentrated on the left and top edges; the centre and right two-thirds are calm, low-detail, softly lit empty space for overlaying white UI cards. Low contrast, no pure black. No text, no letters, no numbers, no watermark, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 1.2 Hành lang trường mùa thu
```
Semi-realistic digital painting of a quiet Vietnamese school corridor with arched columns and a row of yellow-flowering trees outside, autumn afternoon, fallen leaves on the tiled floor, a bicycle leaning on a pillar. Warm burgundy and plum shadows (#7A1E3A), cream and blush highlights (#F8F4E6, #F8E9ED), mustard-yellow leaves (#F2C230). Soft painterly brushwork, gentle haze, nostalgic "tuổi học trò" mood. Keep the main details along the top and one side; leave a large calm, softly blurred area for UI cards. Low contrast, no text, no letters, no watermark, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 1.3 Góc bàn học — họa tiết nhẹ (dùng làm nền phụ / ảnh đầu trang)
```
Flat-lay illustration, top-down view of a wooden student desk: open lined notebook, a few pencils, a ruler, a cup of tea, a small potted plant, some pressed phoenix-flower (hoa phượng) petals. Semi-realistic painted style, warm afternoon light, palette of burgundy (#A3264B), cream (#F8F4E6), blush pink (#F8E9ED) and mustard yellow (#F2C230). Objects arranged only around the outer border; the large centre area is an empty, softly lit cream surface. No text written in the notebook, no letters, no watermark.
Aspect ratio 16:9, 2560x1440.
```

## Bộ 2 — CHÀM MÀU NƯỚC (theo đề cương lớp 11)

### 2.1 Sân trường màu nước
```
Delicate watercolour and ink illustration of a Vietnamese high-school courtyard in the early morning: a big old tree, school building with blue-grey roof tiles, a flag pole, light mist. Loose wet-on-wet washes on textured cold-press paper, fine ink linework, visible paper grain. Palette: deep indigo (#302663) and soft lavender (#E6E1F5, #F3F1FA) with small accents of coral red (#D9482B) on the roof and flowers. Airy, poetic, peaceful mood. Illustration fades out into blank lavender-white paper over the centre and right two-thirds of the image, leaving generous empty space for overlaying UI cards. No text, no letters, no watermark, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 2.2 Bàn học đêm, đèn vàng
```
Watercolour and ink illustration of a student's desk by a window at night: a warm desk lamp, a stack of books, an open notebook, a cup, a view of soft indigo night sky and city lights through the window. Textured paper, loose washes, fine ink lines. Palette: deep indigo (#302663, #292544), lavender (#E6E1F5), warm lamp glow and small coral accents (#D9482B). Calm, focused, cosy mood. Keep the scene in one corner and along one edge; the rest dissolves into pale lavender paper with plenty of empty space. No text, no letters, no watermark, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 2.3 Đường đến trường
```
Soft watercolour illustration of a tree-lined street leading to a Vietnamese school gate, students' bicycles silhouetted from behind in the distance, morning light, falling leaves. Ink outlines, granulating watercolour pigments on rough paper. Indigo (#302663) and lavender (#F3F1FA) tones with coral-red (#D9482B) accents. Gentle, hopeful mood. The illustration occupies only the lower or outer part of the frame; the upper and central area fades to blank textured paper for UI overlay. No text, no letters, no watermark, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

## Bộ 3 — TƯƠI SÁNG (tuỳ chọn, cho học sinh)

### 3.1 Vở ô ly và hình vẽ tay
```
Clean, light background that looks like a page of a Vietnamese school notebook with faint blue grid lines (vở ô ly), cute hand-drawn doodles only around the edges: pencils, stars, paper planes, a small sun, books, a phoenix flower, in coloured-pencil style. Palette: white paper, soft teal (#0E7C86), pale yellow, light coral. The centre is completely clean grid paper. Playful but tidy, not crowded. No text, no letters, no numbers, no watermark.
Aspect ratio 16:9, 2560x1440.
```

### 3.2 Bảng phấn xanh
```
Top view of a matte dark-green school chalkboard texture with faint chalk dust and erased smudges; small hand-drawn chalk doodles only in the corners (a ruler, a star, a small globe, a heart). The board must be desaturated and medium-dark (not pure black) so white cards on top stay readable. Large clean centre area. No text, no letters, no numbers, no watermark.
Aspect ratio 16:9, 2560x1440.
```

---

## Bộ 4 — HÀ NỘI & YÊN HOÀ

### 4.1 Hồ Gươm sớm thu
```
Soft impressionist painting of Hoan Kiem Lake in Hanoi on an early autumn morning: The Huc red bridge, willow branches, light mist on the water, a few distant cyclists. Palette: misty sage green, warm cream, soft red accent on the bridge, pale gold light. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 4.2 Văn Miếu – Quốc Tử Giám
```
Elegant watercolour of the Temple of Literature in Hanoi: Khue Van Cac pavilion, frangipani trees, stone stelae on turtles, tranquil courtyard. Palette: terracotta roof red, moss green, aged parchment cream, ink-brown lines. Scholarly, respectful mood. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 4.3 Phố cổ mùa hoa sữa
```
Cosy gouache illustration of a narrow Hanoi old-quarter street at dusk in late October, milk-flower (hoa sua) trees, tube houses with green shutters, warm shop lights, a street vendor's bicycle with flowers seen from behind. Palette: olive green, mustard yellow, warm cream, dusty rose. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 4.4 Cầu Long Biên hoàng hôn
```
Painterly illustration of Long Bien bridge silhouetted against a soft peach and lavender sunset over the Red River, reeds in the foreground, a few birds. Gentle gradients, calm and nostalgic. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

## Bộ 5 — BỐN MÙA TUỔI HỌC TRÒ

### 5.1 Mùa hè hoa phượng
```
Dreamy illustration of a school yard in early summer, a huge flame tree (hoa phuong) in full red bloom, cicada-summer light, fallen red petals on a stone bench, a forgotten school bag. Palette: vermilion red, leafy green, sunny cream, sky blue. Bittersweet farewell-season mood. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 5.2 Thu vàng tựu trường
```
Warm illustration of the first day of school in autumn, golden leaves, a row of bicycles, new notebooks and a white ao dai fluttering seen from behind in the distance. Palette: honey yellow, burnt orange, cream, soft teal. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 5.3 Đông Hà Nội se lạnh
```
Quiet winter scene outside a classroom window in northern Vietnam: drizzle (mua phun), bare tree branches, a steaming cup and a knitted scarf on the window sill. Palette: blue-grey, misty white, warm amber glow from inside. Calm, cosy. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 5.4 Xuân – hoa đào hoa mai
```
Festive yet gentle spring illustration: peach blossom (hoa dao) branches and a few yellow apricot blossoms (hoa mai) framing the top corners, red lucky envelopes, soft paper texture. Palette: blossom pink, warm red, gold, cream. Tet atmosphere, elegant not cluttered. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

## Bộ 6 — DỊP ĐẶC BIỆT (đổi theo lịch)

### 6.1 Ngày Nhà giáo 20/11
```
Heartfelt watercolour of a teacher's desk with a bouquet of roses and sunflowers, handmade paper cards (no writing), chalk and an old lesson book, morning light from a window. Palette: soft rose, sunflower yellow, sage green, cream. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 6.2 Trung thu
```
Whimsical illustration of a moonlit school yard with star-shaped lanterns (den ong sao), carp lanterns and a big full moon, soft glow. Palette: deep night blue, warm lantern orange and red, pale gold. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 6.3 Khai giảng
```
Bright illustration of a school opening ceremony morning: flags, balloons in the sky, rows of chairs, flower garlands, seen from far behind, joyful. Palette: fresh sky blue, red and yellow accents, white. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 6.4 Ôn thi – góc thư viện
```
Calm illustration of a sunlit school library corner: tall bookshelves, a reading table with stacked textbooks and a desk lamp, dust motes in the light. Palette: warm walnut brown, cream, soft green plants, golden light. Focused study mood. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

## Bộ 7 — PHONG CÁCH NGHỆ THUẬT

### 7.1 Anime nhẹ nhàng (kiểu phim hoạt hình Nhật)
```
Soft hand-painted anime background art in the style of classic Japanese animated films (not copying any specific film): a Vietnamese school building on a hill under huge summer cumulus clouds, lush green trees, a winding path. Palette: vivid sky blue, fresh green, white clouds, warm sunlight. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 7.2 Lo-fi phòng học
```
Lo-fi illustration of a cosy study room at dusk: a desk by the window, headphones, a stack of books, a cat sleeping on the sill, fairy lights, purple-orange sky outside. Palette: muted purple, peach, teal, warm lamp light. Relaxed, focused. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 7.3 Cắt giấy nhiều lớp
```
Layered paper-cut art with soft drop shadows, depicting rolling hills, a small school, trees and a sun. Each layer a different tint of the same colour family (choose: teal, or plum, or indigo). Clean, modern, tactile. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 7.4 Origami
```
Minimal composition of origami paper cranes, paper planes and paper boats floating around the edges of a soft pastel gradient background, subtle paper texture and gentle shadows. Palette: pastel mint, peach, lilac, cream. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 7.5 Risograph cổ điển
```
Retro risograph-print illustration of school items (globe, ruler, books, a bicycle, a bell) arranged around the borders, visible grain and slight colour misregistration, 2-3 ink colours only: fluorescent pink, teal, warm yellow on off-white paper. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 7.6 Thập niên 90 hoài niệm
```
Nostalgic 1990s Vietnamese classroom illustration: green chalkboard, wooden benches, an old ceiling fan, a tin pencil box, a red scarf (khan quang do) on a chair, faded film colours. Palette: faded green, cream, rust red, sepia. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 7.7 Nét mảnh tối giản
```
Minimal single-weight line-art illustration (one thin line colour on a plain background) of school objects - books, pencil, glasses, a plant, a clock - placed loosely only at the corners. Choose line colour teal #0E7C86 on warm white. Very airy and clean. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 7.8 Isometric trường học 3D
```
Cute isometric 3D low-poly illustration of a small school campus with buildings, trees, a football pitch and a flag pole, soft clay-like materials and gentle ambient occlusion, placed in one corner on a soft pastel background. Palette: pastel teal, coral, butter yellow, white. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

## Bộ 8 — THIÊN NHIÊN & TRỪU TƯỢNG (dịu mắt, hợp dùng lâu)

### 8.1 Lá cây màu nước
```
Loose botanical watercolour of monstera, fern and eucalyptus leaves drifting in from the top-left and bottom-right corners, lots of blank white paper. Palette: sage green, eucalyptus blue-green, pale gold. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 8.2 Bầu trời đêm sao
```
Peaceful starry night sky gradient from deep navy to soft violet, faint milky way, a few shooting stars, silhouette of a school roof and trees along the very bottom edge. Calm and dreamy, medium brightness. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 8.3 Biển và mây
```
Soft pastel painting of a calm sea horizon with big fluffy clouds, gentle waves at the bottom edge, airy sky filling most of the frame. Palette: baby blue, seafoam, peach, white. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 8.4 Chuyển màu trừu tượng
```
Abstract soft mesh-gradient background with organic blurred blobs of colour and subtle grain, no objects. Palette option A: plum, blush pink, mustard. Option B: indigo, lavender, coral. Option C: teal, mint, sand. Very smooth, calm. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 8.5 Giấy kraft & sticker
```
Kraft-paper texture background with cute student stickers, washi tape strips and paper clips only around the border (stars, hearts, books, pencils, smiley planets). Warm brown paper, pastel stickers. Scrapbook feel, tidy. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

### 8.6 Bảng ghim bần
```
Top view of a cork pin-board texture with a few colourful sticky notes (blank, no writing), push pins, a polaroid-style photo frame (empty) and string, all near the edges. Warm cork brown with pastel notes. Clean centre. Soft, high-quality illustration suitable as an app background. Composition: the illustrated details stay along the top edge and one side; the centre and the rest of the frame are calm, low-detail, low-contrast space for overlaying white UI cards. No pure black. No text, no letters, no numbers, no watermark, no logos, no visible faces.
Aspect ratio 16:9, 2560x1440.
```

---

## Bản cho điện thoại
Dùng lại đúng prompt trên, thay dòng cuối bằng:
```
Vertical composition for a phone wallpaper: keep the illustrated details in the top quarter of the image; the lower three-quarters is calm, low-detail space for UI cards.
Aspect ratio 9:16, 1440x2560.
```

## Khi app dùng ảnh
- Mỗi chủ đề có 1 bộ màu riêng (nút, tiêu đề, nhãn xếp loại) lấy theo bảng ở đầu file. **Màu xếp loại (Tốt / Khá / Trung bình / Yếu) giữ cố định** để không nhầm.
- Ảnh nằm sau một lớp phủ mờ, danh sách học sinh vẫn là thẻ trắng nên chữ luôn dễ đọc.
- Người dùng đổi chủ đề trong **Cài đặt ▸ Giao diện**, máy tự nhớ; GVCN chọn chủ đề mặc định cho cả lớp.
- Ảnh lưu trong repo ở `themes/<tên-chủ-đề>/` (bản `-d.webp` cho máy tính, `-m.webp` cho điện thoại, mỗi ảnh khoảng 150–250 KB).
