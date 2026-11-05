# 🔧 Solusi: Gambar Tidak Muncul

## 🎯 Masalah
Gambar tidak muncul karena:
1. ❌ Database belum di-setup (tabel kosong/tidak ada)
2. ❌ URL gambar di database tidak valid

## ✅ Solusi Step-by-Step

### Step 1: Setup Database (WAJIB!)

1. **Buka Supabase Dashboard**
   - Login ke [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Pilih project: `fxbtbopcmqxfohfwuhso`

2. **Buka SQL Editor**
   - Klik **SQL Editor** di sidebar kiri
   - Klik **New Query**

3. **Copy & Run Schema**
   - Buka file `supabase-schema.sql` di project folder
   - Copy SELURUH isinya (Ctrl+A, Ctrl+C)
   - Paste ke SQL Editor
   - Klik **RUN** atau tekan `Ctrl+Enter`

4. **Tunggu sampai selesai**
   - Akan muncul "Success. No rows returned"
   - Ini normal dan berarti berhasil!

### Step 2: Verifikasi Tabel Terisi

1. **Buka Table Editor**
2. Cek tabel-tabel ini sudah terisi:
   - ✅ `hero_images` - harus ada 1 row
   - ✅ `works` - harus ada 4 rows
   - ✅ `contact_images` - harus ada 1 row
   - ✅ `site_content` - harus ada banyak rows

### Step 3: Refresh Website

1. Buka browser
2. Hard refresh: **Ctrl + Shift + R**
3. Gambar seharusnya sudah muncul!

---

## 🖼️ Jika Masih Belum Muncul

Jika setelah setup database masih belum muncul, ada 2 opsi:

### Opsi A: Pakai Gambar Unsplash (Sudah Ter-Setup)

Database awal sudah diisi dengan gambar Unsplash yang valid. Seharusnya langsung muncul setelah run SQL schema.

**Contoh URL yang sudah ter-setup:**
```
https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2400&q=90
```

### Opsi B: Upload Gambar Sendiri ke Supabase Storage

Jika ingin pakai gambar sendiri, ikuti panduan di `CARA-UPLOAD-GAMBAR-SUPABASE.md`

**PENTING:** Format URL harus seperti ini:
```
https://fxbtbopcmqxfohfwuhso.supabase.co/storage/v1/object/public/[bucket]/[path]/[filename]
```

**BUKAN seperti ini:**
```
https://supabase.com/dashboard/project/...  ❌
/hero/heroyuki.jpeg  ❌
```

---

## 🔍 Debug: Cek Apakah Data Terambil

Buka **Browser Console** (F12) dan lihat:

### Jika ada error "table does not exist":
→ Anda belum run `supabase-schema.sql`
→ Kembali ke Step 1

### Jika ada error "Failed to fetch" atau CORS:
→ Cek API keys di `.env.local`
→ Pastikan sama dengan di Supabase Dashboard

### Jika tidak ada error tapi gambar tidak muncul:
→ Cek Network tab di DevTools
→ Lihat request ke Supabase berhasil atau tidak
→ Cek response data ada atau kosong

---

## 🎨 Alternatif: Pakai Fallback Data (Sementara)

Website sudah punya **fallback data** dengan gambar Unsplash. Jadi meskipun Supabase tidak terkoneksi, website tetap jalan.

Tapi untuk data Jakarta dan konten dari database, **HARUS setup database dulu**.

---

## 📋 Checklist Troubleshooting

- [ ] SQL Schema sudah dijalankan di Supabase
- [ ] Tabel `hero_images`, `works`, `contact_images`, `site_content` ada dan terisi
- [ ] `.env.local` sudah benar dengan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- [ ] Dev server sudah restart (`npm run dev`)
- [ ] Browser sudah hard refresh (Ctrl+Shift+R)
- [ ] Console browser tidak ada error merah

---

## 🆘 Masih Bermasalah?

Jalankan command ini dan kirim outputnya:

```powershell
# Cek apakah schema ada
npm run build
```

Atau screenshot:
1. Supabase Table Editor (tabel `hero_images`)
2. Browser Console (F12)
3. Network tab request ke Supabase

---

**✨ Setelah run SQL schema, gambar akan muncul dengan lokasi Jakarta, Indonesia!**
