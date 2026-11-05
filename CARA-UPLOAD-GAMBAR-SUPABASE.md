# 📸 Cara Upload & Mendapatkan URL Gambar dari Supabase Storage

## ⚠️ PENTING: Format URL yang Benar

**URL SALAH** ❌ (Dashboard URL):
```
https://supabase.com/dashboard/project/fxbtbopcmqxfohfwuhso/storage/files/buckets/content?path=hero&preview=heroyuki.jpeg
```

**URL BENAR** ✅ (Public URL):
```
https://fxbtbopcmqxfohfwuhso.supabase.co/storage/v1/object/public/content/hero/heroyuki.jpeg
```

---

## 🚀 Langkah-langkah Upload Gambar

### Step 1: Buat Bucket di Supabase Storage

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda: `fxbtbopcmqxfohfwuhso`
3. Klik **Storage** di sidebar kiri
4. Klik **New bucket**
5. Isi:
   - **Name**: `content` (atau nama lain)
   - **Public bucket**: ✅ **CENTANG INI** (sangat penting!)
6. Klik **Create bucket**

### Step 2: Upload Gambar

1. Klik bucket yang baru dibuat (contoh: `content`)
2. Klik **Upload file** atau **Create folder** (untuk organisasi)
3. Pilih gambar dari komputer Anda
4. Upload

### Step 3: Dapatkan URL Publik yang Benar

Setelah upload, ada 2 cara:

#### Cara A: Copy URL Langsung
1. Klik gambar yang sudah diupload
2. Di panel kanan, klik **Copy URL**
3. Akan ter-copy URL seperti:
   ```
   https://fxbtbopcmqxfohfwuhso.supabase.co/storage/v1/object/public/content/heroyuki.jpeg
   ```

#### Cara B: Buat Manual (jika tombol Copy tidak ada)
Format URL publik Supabase Storage:
```
https://[PROJECT_REF].supabase.co/storage/v1/object/public/[BUCKET_NAME]/[FILE_PATH]
```

**Contoh:**
- Project Ref: `fxbtbopcmqxfohfwuhso`
- Bucket Name: `content`
- File Path: `hero/heroyuki.jpeg`

**URL Lengkap:**
```
https://fxbtbopcmqxfohfwuhso.supabase.co/storage/v1/object/public/content/hero/heroyuki.jpeg
```

---

## 📝 Update URL di Database

### 1. Update Hero Image

1. Buka **Table Editor** di Supabase
2. Pilih tabel `hero_images`
3. Edit kolom `image_url`
4. Paste URL yang BENAR dari step di atas
5. Save

**Contoh:**
```sql
UPDATE hero_images 
SET image_url = 'https://fxbtbopcmqxfohfwuhso.supabase.co/storage/v1/object/public/content/hero/heroyuki.jpeg'
WHERE is_active = true;
```

### 2. Update Portfolio Images

Di tabel `works`, update kolom `image_url` dengan format yang sama:
```
https://fxbtbopcmqxfohfwuhso.supabase.co/storage/v1/object/public/content/portfolio/image1.jpg
```

### 3. Update Contact Image

Di tabel `contact_images`:
```
https://fxbtbopcmqxfohfwuhso.supabase.co/storage/v1/object/public/content/contact/portrait.jpg
```

---

## 🏗️ Struktur Folder Recommended

Untuk organisasi yang lebih baik, gunakan folder structure:

```
content/                    # Bucket name
├── hero/                   # Folder untuk hero images
│   └── heroyuki.jpeg
├── portfolio/              # Folder untuk portfolio
│   ├── project1.jpg
│   ├── project2.jpg
│   └── project3.jpg
└── contact/                # Folder untuk contact images
    └── portrait.jpg
```

**URL Examples:**
```
Hero:      https://fxbtbopcmqxfohfwuhso.supabase.co/storage/v1/object/public/content/hero/heroyuki.jpeg
Portfolio: https://fxbtbopcmqxfohfwuhso.supabase.co/storage/v1/object/public/content/portfolio/project1.jpg
Contact:   https://fxbtbopcmqxfohfwuhso.supabase.co/storage/v1/object/public/content/contact/portrait.jpg
```

---

## 🔧 Troubleshooting

### Error: "Image not found" atau 404
✅ Pastikan bucket di-set sebagai **Public**
✅ Cek URL format benar (gunakan `/storage/v1/object/public/`)
✅ Cek file benar-benar ada di Storage

### Error: "Hostname not configured"
✅ Sudah diperbaiki di `next.config.mjs`
✅ Restart dev server: `npm run dev`

### Gambar tidak muncul setelah update
✅ Hard refresh browser: `Ctrl + Shift + R`
✅ Clear browser cache
✅ Cek URL di browser langsung (paste URL gambar di address bar)

---

## 📊 Optimasi Gambar

### Ukuran File Recommended:
- **Hero Image**: Max 500KB, ideal 200-300KB
- **Portfolio**: Max 300KB, ideal 150-200KB
- **Contact**: Max 300KB, ideal 150-200KB

### Resolusi Recommended:
- **Hero**: 2400px width (landscape)
- **Portfolio**: 1800px width
- **Contact**: 1800px width

### Format:
- ✅ **JPG**: Untuk foto (ukuran kecil)
- ✅ **WebP**: Modern, kualitas bagus, ukuran sangat kecil
- ✅ **PNG**: Untuk logo atau gambar dengan transparansi

### Tools untuk Compress:
- [TinyPNG](https://tinypng.com) - Compress tanpa loss kualitas
- [Squoosh](https://squoosh.app) - Online image optimizer
- [ImageOptim](https://imageoptim.com) - Desktop app (Mac)

---

## 🎯 Quick Fix untuk Error Anda

Berdasarkan error Anda, URL yang ada di database salah. Berikut cara cepat fix:

1. **Buka Supabase Storage**
2. **Klik gambar `heroyuki.jpeg`**
3. **Copy URL yang benar** (bukan URL dashboard!)
4. **Buka Table Editor → `hero_images`**
5. **Update `image_url`** dengan URL yang benar
6. **Refresh website**

**Format URL HARUS seperti ini:**
```
https://fxbtbopcmqxfohfwuhso.supabase.co/storage/v1/object/public/[bucket]/[path]/[filename]
```

**BUKAN seperti ini:**
```
https://supabase.com/dashboard/project/...  ❌
```

---

## 💡 Alternative: Pakai Unsplash (Temporary)

Jika masih kesulitan, gunakan Unsplash dulu untuk testing:

1. Cari gambar di [Unsplash](https://unsplash.com)
2. Klik gambar
3. Klik kanan → **Copy image address**
4. Format URL: `https://images.unsplash.com/photo-xxxxx?auto=format&fit=crop&w=1800&q=85`
5. Paste di database

Unsplash URL sudah di-whitelist di `next.config.mjs`

---

**🎉 Setelah fix URL, website akan normal kembali!**
