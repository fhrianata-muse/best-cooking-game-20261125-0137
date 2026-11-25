# LOOK — Saffron Line

Game: a warm ember kitchen, one chef, one line of orders. Top-down-oblique view,
logical canvas 1280x480, everything readable at screenshot size.

## Palette (named hex)
- Cream wall `#F6E8C8` — warm plaster above the counter line.
- Terracotta tile `#C96F3F` / `#B85C33` — floor tiles, alternating.
- Dark wood counter `#5A3A22` with edge `#7A5230` — all work surfaces.
- Brass `#D9A441` — stove trim, pot handles, order-rail, timer frame.
- Saffron `#F2A007` — chef apron, accent, "ready" glow.
- Herb green `#4E7A3A` — greens, garnish, fresh marks.
- Tomato red `#D64533` — tomatoes, order urgency, timer under 30 s.
- Ceramic white `#FBF7EE` — plates, chef hat, ticket paper.
- Charcoal text `#2B2118` — labels on cream; cream text `#FBF7EE` on wood.
- Pantry shadow `#3A2A1A` — shelf backs, depth under counters.

## Light and mood
- Warm light from upper-left, soft shadows falling down-right, 8 px offset.
- Heat shimmer: stove and pot carry a warm radial glow; steam rises in soft
  white curls. No neon, no glow-as-geometry: light sits on real forms.
- Mood: a busy evening service, golden hour through a high window, calm
  colours, hot accents only where food is cooking or ready.

## Material language
- Wood: flat planks with grain lines, brass screws at corners.
- Ceramic: white plates with a thin saffron rim ring.
- Metal: brass stove with dark burners, steel pot with highlight stripe.
- Food: drawn shapes with a darker outline and one highlight — tomato round
  with leaf star, onion rings, fish silver-blue with tail, bread tan crust,
  greens leafy clusters, cheese yellow wedge. Food must look worth serving.

## Camera
- Fixed 1280x480 frame. Order board strip on top, kitchen below, chef
  walking the counter line. Nothing scrolls; the whole game is one room.

## Checks the build will be held to
- At 1280x480 every label is legible: order names, timer, score, station names.
- Ingredients on the pantry are distinguishable by shape, not colour alone.
- A dish mid-assembly is visible (pot with steam + progress bar, or board
  with chopped pieces), and a plate ready to serve is visibly plated.
- No placeholder boxes, no flat grey, no text-only stations.

## REFERENSI (metode referensi-dulu, Bos 2026-11-25 — 4 gambar dilihat,
## disimpan di work/refs/, TIDAK disalin ke repo/game)
1. Dapur pixel-art top-down (img.32r.com): dua baris counter PANJANG PENUH
   peralatan; rak penuh stoples; perkakas gantung; untaian bawang/cabai;
   range hood besar tengah; lantai ubin bermotif; HUD koin/bintang tebal.
2. Kokoro Kitchen (Steam 3079770): dapur cozy, karakter membawa piring,
   rak penuh stok, lampu untaian hangat, kartu pesanan kanan bergambar
   hidangan, dial waktu siang/malam di HUD.
3. Dapur cozy tungku bata (Steam 4164330): cerobong bata + api, panci dan
   sendok gantung, rak stoples, meja penuh hidangan tersaji, kucing tidur —
   tiap permukaan berisi sesuatu.
4. Kitchen Sync: Aloha (IGDB): dapur pro modern — meja baja bentuk L,
   ladle/pisau gantung, dinding ubin, ikan besar di talenan dengan herba,
   lantai kotak-kotak, oven berisi makanan.

## Target konkret dari referensi (wajib di screenshot)
- ATURAN KEPADATAN: tidak ada counter kosong. Setiap permukaan berisi
  peralatan, tumpukan bahan, stoples, atau perkakas; rak terisi berderet;
  rel gantung (sendok, pisau, untaian cabai/bawang, panci) di tepi atas
  untuk kedalaman. Dapur yang sepi = kalah sebelum dinilai.
- CAHAYA HANGAT: genangan cahaya amber (radial, lembut) di atas stove dan
  grill, plus deret lampu kecil di tepi atas — bukan pencahayaan datar.
- TERBACA DI UKURAN KECIL: ikon bahan besar dan jelas, siluet stasiun
  tegas, tiket pesanan besar bergambar hidangan (lencana piring berwarna
  per resep), timer BESAR berupa angka.
- TANDA KEHIDUPAN: uap di atas panci dan hidangan jadi, api kecil di
  tungku stove, satu hidangan sedang dirakit di tengah dengan lapisan
  bahan terlihat, piring jadi bergarnish (daun herba) di dekat pass,
  kucing tidur di peti di pojok lantai.
- HUD tebal kontras tinggi, sedikit angka: timer, skor, koin, kombo.

## Iterasi putaran 4 (dari penilaian independen J1+J2, rata-rata 2,4)
- Pita lantai bawah BUKAN ruang kosong: runner rug merah-saffron di jalur
  chef + service pass kayu di tepi bawah dengan piring bersih, keranjang
  roti, mangkuk sayur, botol saus, peti tomat, dan kucing tidur.
- Makanan diperbesar: panci stove 76x36, piring plating 64x36, hidangan
  di piring bertumpuk berlapis (tengah terangkat), ikan grill lebih besar.
- Timer merah + berdenyut mulai 60 dtk (bukan 30), badge RUSH merah besar
  di header, banner Served pindah ke pass counter bawah (tidak pernah
  menutupi stasiun), chef skala 1,2 berdiri di celah antar-stasiun (y 252)
  agar tidak menutupi label/progress stasiun.

## Upgrade pass (2026-11-25, sesudah Bos: "Kok jelek, kok ga kompleks")
- VISUAL: stasiun dibangun ulang dari kartu cokelat datar menjadi counter
  berbingkai — gradien kayu + garis serat, permukaan masak inset, tepi 3D
  (highlight atas + bayangan bawah), bayangan lembut, plakat nama kuningan.
  Makanan digambar detail: panci sup dengan permukaan cairan + potongan
  mengapung + gelembung, salad berlapis, ikan panggang bergaris bakar +
  lemon, sandwich terlihat stratanya, bruschetta dua roti terpisah, roti
  berskor. Ikon pantry 37px dengan gloss + bayangan di atas rak stoples.
  Dinding: pola ubin halus, pot herba, lampu gantung dengan genangan
  cahaya elips di atas stove/grill/plating + vignette. Chef skala 1,4
  (wajah, neckerchief, kancing, piring bawaan bertanda ★/✕ kualitas).
  Tiket: lencana piring tergambar (mound per langkah), bar waktu
  hijau→kuning→merah, tiket VIP gradien emas + tag ★ VIP ×3, baris
  "alt route: Smokey (+40)".
- KOMPLEKSITAS (hidup di gameplay, terbaca di screenshot):
  1. Kematangan (doneness) di stove/grill: bar berzona UNDER (biru) /
     PERFECT (hijau, d 0,70–1,15) / BURNT (merah); klik stasiun untuk
     mengambil — PERFECT +50, d ≥ 1,6 item hangus hilang, item gosong
     yang diplating dibuang −25.
  2. Rute alternatif: 7 dari 12 resep punya rute kedua valid
     (Smokey / Pan-seared / Pan-toasted / Charred), bonus serve +40.
  3. Tiket VIP emas: ±18% pesanan, waktu ×0,7, nilai ×3, banner
     "VIP Served!" saat tersaji.
