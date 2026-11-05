# 📝 Cara Edit Konten Website

Panduan lengkap untuk mengubah konten website melalui Supabase Dashboard.

## 🎯 Quick Access

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik **Table Editor** di sidebar kiri

---

## 📍 Mengubah Lokasi

### Hero Section (Bagian Atas)

**Tabel**: `site_content`

| Section | Key | Value Default | Keterangan |
|---------|-----|---------------|------------|
| `hero` | `location` | Jakarta, Indonesia | Lokasi yang tampil di hero |
| `hero` | `tagline` | Independent artist | Tagline atas |
| `hero` | `availability` | Available for select projects | Status ketersediaan |
| `hero` | `practice` | A practice in presence | Label samping |

### Intro Section

| Section | Key | Value Default | Keterangan |
|---------|-----|---------------|------------|
| `intro` | `location_full` | Jakarta, ID · 6°12' S | Koordinat lokasi |
| `intro` | `description` | I work with... | Deskripsi diri |

### Footer & Menu

| Section | Key | Value Default |
|---------|-----|---------------|
| `footer` | `location` | Jakarta · Available in Indonesia |
| `menu` | `location` | Jakarta · Indonesia |

---

## 🎨 Mengubah Section 2 (Portfolio)

**Tabel**: `site_content`

### Caption yang Bisa Diubah:

1. **Eyebrow/Label Kecil**
   - Section: `section2`
   - Key: `eyebrow`
   - Default: `02 / Selected work`

2. **Judul Utama**
   - Section: `section2`
   - Key: `title`
   - Default: `In good`

3. **Judul Italic**
   - Section: `section2`
   - Key: `title_em`
   - Default: `company.`

4. **Deskripsi**
   - Section: `section2`
   - Key: `description`
   - Default: `A collection of collaborations<br />and quiet obsessions.`
   - ⚠️ Bisa pakai HTML tags: `<br />`, `<em>`, `<strong>`

### Contoh Perubahan Caption Section 2:

**Dari:**
```
02 / Selected work
In good
company.
A collection of collaborations
and quiet obsessions.
```

**Menjadi:**
```
02 / Karya Pilihan
Proyek dengan
hati.
Kolaborasi bermakna untuk
brand dan komunitas Indonesia.
```

**Cara Edit:**
1. Buka tabel `site_content`
2. Filter: section = `section2`
3. Edit value sesuai keinginan
4. Save

---

## 🖼️ Mengubah Gambar

### 1. Hero Image (Gambar Besar di Atas)

**Tabel**: `hero_images`

**Kolom yang perlu diisi:**
- `image_url`: URL gambar lengkap
- `alt_text`: Deskripsi untuk accessibility
- `is_active`: `true` (centang)

**Langkah:**
1. Buka tabel `hero_images`
2. Edit baris yang ada
3. Ganti `image_url` dengan URL baru
4. Update `alt_text` untuk deskripsi

**Format URL yang didukung:**
```
https://images.unsplash.com/photo-xxx?auto=format&fit=crop&w=2400&q=90
https://res.cloudinary.com/xxx/image/upload/v1234/xxx.jpg
https://yourdomain.com/images/hero.jpg
```

### 2. Portfolio/Works Images

**Tabel**: `works`

**Kolom:**
- `id`: 01, 02, 03, dst (nomor urut)
- `title`: Judul project
- `role`: Peran Anda
- `year`: Tahun (2024, 2025)
- `image_url`: URL gambar
- `size`: `tall` atau `short` (ukuran card)
- `order_index`: Urutan tampilan (1, 2, 3, dst)

**Mengubah Gambar Portfolio:**
1. Buka tabel `works`
2. Pilih row yang ingin diubah
3. Edit `image_url` dengan URL baru
4. Save

**Menambah Portfolio Baru:**
1. Klik **Insert row**
2. Isi semua kolom:
   ```
   id: "05"
   title: "Nama Project"
   role: "Art Direction"
   year: "2025"
   image_url: "https://..."
   size: "tall"  atau "short"
   order_index: 5
   ```
3. Klik **Save**

**Tips Memilih Size:**
- `tall`: Card tinggi vertikal (cocok untuk portrait/full body)
- `short`: Card pendek horizontal (cocok untuk landscape)
- Usahakan mix keduanya untuk layout menarik

### 3. Contact Image (Gambar di Contact Section)

**Tabel**: `contact_images`

**Kolom:**
- `image_url`: URL gambar
- `caption`: Caption yang tampil di bawah gambar
- `is_active`: `true`

**Mengubah:**
1. Buka tabel `contact_images`
2. Edit `image_url` dan `caption`
3. Save

**Contoh Caption:**
```
Yuki, between takes · 2025
Behind the scenes, Jakarta Studio · 2025
Editorial session for Vogue ID · Jan 2025
```

---

## 🔗 Cara Upload Gambar Sendiri

### Opsi 1: Pakai Supabase Storage (Recommended)

1. Di Supabase Dashboard, buka **Storage**
2. Buat bucket baru: `public-images`
3. Set bucket sebagai **Public**
4. Upload gambar Anda
5. Copy URL publik
6. Paste ke kolom `image_url`

**Contoh URL:**
```
https://your-project.supabase.co/storage/v1/object/public/public-images/hero.jpg
```

### Opsi 2: Pakai Cloudinary

1. Daftar di [Cloudinary](https://cloudinary.com) (gratis)
2. Upload gambar
3. Copy URL
4. Paste ke kolom `image_url`

### Opsi 3: Pakai Unsplash (Temporary)

1. Cari gambar di [Unsplash](https://unsplash.com)
2. Klik gambar → Download → Copy URL
3. Format: `https://images.unsplash.com/photo-xxx?auto=format&fit=crop&w=1800&q=85`

---

## 💡 Tips & Best Practices

### Ukuran Gambar Optimal:

- **Hero Image**: 2400px width, landscape
- **Portfolio Images**: 1800px width
- **Contact Image**: 1800px width

### Format File:
- ✅ JPG: Untuk foto (ukuran file kecil)
- ✅ PNG: Untuk grafis dengan transparansi
- ✅ WebP: Modern, kualitas bagus, ukuran kecil

### Kualitas:
- Hero: q=90 (high quality)
- Portfolio: q=85 (good balance)
- Thumbnails: q=75 (smaller size)

### HTML di Description:

Anda bisa pakai HTML tags untuk formatting:

```html
<em>emphasized text</em>
<strong>bold text</strong>
<br /> untuk line break
```

**Contoh:**
```
Saya bekerja dengan <em>movement</em>, image, dan feeling<br />untuk menciptakan momen yang berkesan.
```

---

## 🔄 Cara Refresh Website Setelah Edit

1. **Browser Auto-Refresh**: Biasanya otomatis dalam 1-2 detik
2. **Hard Refresh**: `Ctrl + Shift + R` (Windows) atau `Cmd + Shift + R` (Mac)
3. **Clear Cache**: Jika masih tidak update, clear browser cache

---

## ❓ FAQ

### Q: Berapa lama perubahan terlihat di website?
**A:** Langsung! Tapi mungkin perlu refresh browser.

### Q: Bisa pakai emoji? 
**A:** Bisa! ✨ 🎨 📸 (tapi jangan terlalu banyak)

### Q: Gambar harus hosting dimana?
**A:** Bebas. Bisa Supabase Storage, Cloudinary, atau hosting lain.

### Q: Maksimal berapa portfolio items?
**A:** Tidak ada limit, tapi untuk UX yang baik, 6-12 items optimal.

### Q: Bisa multi-bahasa (Indonesia & English)?
**A:** Untuk sekarang belum. Perlu development tambahan.

### Q: Bisa ubah font atau warna?
**A:** Itu perlu edit CSS di code. File ini hanya untuk konten text & gambar.

---

## 🆘 Troubleshooting

### Gambar tidak tampil:
- ✅ Cek URL gambar valid (buka di tab baru)
- ✅ Pastikan URL lengkap dimulai dengan `https://`
- ✅ Cek gambar tidak memerlukan autentikasi

### Text tidak ter-update:
- ✅ Hard refresh browser
- ✅ Cek typo di kolom `section` dan `key`
- ✅ Cek data tersimpan di database

### Layout berantakan:
- ✅ Jangan hapus HTML tags di description
- ✅ Pastikan tidak ada karakter spesial yang break code

---

**🎉 Selamat mengedit! Kalau ada pertanyaan, hubungi developer.**
