# 🚀 Quick Start Guide

## ⚡ Setup dalam 5 Menit

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Buat Project Supabase
1. Buka [supabase.com](https://supabase.com)
2. Sign up / Login
3. **Create New Project**
4. Tunggu sampai selesai (~2 menit)

### 3️⃣ Setup Database
1. Di Supabase Dashboard, buka **SQL Editor**
2. Klik **New Query**
3. Copy SEMUA isi file `supabase-schema.sql`
4. Paste ke editor
5. Klik **Run** atau tekan `Ctrl+Enter`

✅ Database sudah siap dengan data awal Jakarta!

### 4️⃣ Get API Keys
1. Di Supabase Dashboard, klik **Settings** (gear icon)
2. Pilih **API**
3. Copy 2 hal ini:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (key panjang)

### 5️⃣ Setup Environment Variables
1. Edit file `.env.local` di root project
2. Ganti dengan API keys Anda:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key
```

⚠️ **Penting**: Ganti `your-project-id` dan `your-actual-key` dengan nilai asli!

### 6️⃣ Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) 🎉

---

## ✅ Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Supabase project dibuat
- [ ] Database schema dijalankan
- [ ] API keys di-copy
- [ ] `.env.local` sudah diisi dengan API keys asli
- [ ] Dev server berjalan (`npm run dev`)
- [ ] Website terbuka di browser

---

## 📍 Lokasi Sudah Diganti!

Website sekarang menampilkan **Jakarta, Indonesia** di semua tempat:

✅ Hero section: "Jakarta, Indonesia"  
✅ Intro: "Jakarta, ID · 6°12' S"  
✅ Footer: "Jakarta · Available in Indonesia"  
✅ Menu: "Jakarta · Indonesia"

---

## 🎨 Cara Edit Konten

### Via Supabase Dashboard:

1. Login ke Supabase
2. Buka **Table Editor**
3. Pilih tabel yang ingin diedit:
   - `site_content` → Untuk text/caption
   - `works` → Untuk portfolio items
   - `hero_images` → Untuk hero image
   - `contact_images` → Untuk contact image
4. Edit langsung di UI
5. Refresh website

**Tidak perlu coding! Tidak perlu deploy ulang!**

---

## 📚 Dokumentasi Lengkap

- **Setup Detail**: `README-SUPABASE.md`
- **Cara Edit Konten**: `CARA-EDIT-KONTEN.md`
- **Summary Perubahan**: `PERUBAHAN-SUMMARY.md`
- **Database Schema**: `supabase-schema.sql`

---

## 🆘 Troubleshooting

### Website tidak muncul / blank screen:
```bash
# 1. Clear cache dan rebuild
Remove-Item -Recurse -Force .next
npm run dev
```

### Data tidak muncul / masih default:
- ✅ Cek `.env.local` sudah diisi dengan benar
- ✅ Restart dev server: `Ctrl+C` lalu `npm run dev`
- ✅ Hard refresh browser: `Ctrl+Shift+R`

### Build error:
```bash
# Clear cache dan rebuild
Remove-Item -Recurse -Force .next
npm run build
```

### Database error:
- ✅ Pastikan schema SQL sudah dijalankan di Supabase
- ✅ Cek tables di Table Editor ada isinya
- ✅ Cek API keys sudah benar

---

## 💡 Tips

### Mode Fallback
Website akan tetap jalan **bahkan tanpa Supabase**!  
Jika koneksi gagal, akan pakai data default dengan lokasi Jakarta.

### Development vs Production
- **Development** (`npm run dev`): Live reload, hot module replacement
- **Production** (`npm run build && npm start`): Optimized, faster

### Deploy
```bash
# Build untuk production
npm run build

# Test production build locally
npm start

# Deploy ke Vercel (recommended)
npx vercel
```

---

## 🎯 Next Steps

1. **Upload Gambar Sendiri**
   - Gunakan Supabase Storage atau Cloudinary
   - Ganti URL di database

2. **Customize Content**
   - Edit text di tabel `site_content`
   - Ubah portfolio di tabel `works`

3. **Add More Features**
   - Contact form
   - Blog/articles
   - Multi-language support

---

## 🌟 Fitur Utama

✅ **Dynamic Content** - Edit via dashboard  
✅ **Jakarta-Based** - Lokasi sudah diubah  
✅ **Database-Driven** - Semua gambar dari Supabase  
✅ **Flexible Captions** - Section 2 fully editable  
✅ **Fallback Mode** - Jalan tanpa Supabase  
✅ **Type-Safe** - Full TypeScript support  

---

**🎉 Selamat! Website Anda sudah siap!**

Version: 2.0.0  
Location: Jakarta, Indonesia 🇮🇩
