# Setup Integrasi Supabase

## 📋 Perubahan yang Telah Dilakukan

### 1. **Lokasi Diganti dari Tokyo ke Jakarta, Indonesia**
   - Hero section: `Jakarta, Indonesia`
   - Intro section: `Jakarta, ID · 6°12' S`
   - Footer: `Jakarta · Available in Indonesia`
   - Menu: `Jakarta · Indonesia`

### 2. **Caption Section 2 Lebih Fleksibel**
   - Semua konten section 2 sekarang disimpan di database
   - Dapat diubah tanpa perlu edit kode
   - Mendukung HTML markup untuk formatting

### 3. **Semua Gambar Terkoneksi dengan Supabase**
   - Hero image
   - Portfolio/works images
   - Contact image
   - Semuanya diambil dari database

## 🚀 Cara Setup

### Step 1: Buat Project Supabase

1. Kunjungi [https://supabase.com](https://supabase.com)
2. Sign up / Login
3. Buat project baru
4. Tunggu hingga project selesai dibuat

### Step 2: Setup Database

1. Di dashboard Supabase, buka **SQL Editor**
2. Klik **New Query**
3. Copy seluruh isi file `supabase-schema.sql`
4. Paste ke SQL Editor
5. Klik **Run** atau tekan `Ctrl + Enter`

File ini akan membuat:
- ✅ 4 tabel: `hero_images`, `works`, `contact_images`, `site_content`
- ✅ Data awal dengan lokasi Jakarta
- ✅ Row Level Security (RLS) policies
- ✅ Indexes untuk performa

### Step 3: Dapatkan API Keys

1. Di dashboard Supabase, buka **Settings** → **API**
2. Copy:
   - **Project URL** (misal: `https://xxxxx.supabase.co`)
   - **anon/public key**

### Step 4: Setup Environment Variables

1. Buat file `.env.local` di root project
2. Isi dengan:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Penting**: Ganti dengan URL dan key Anda sendiri!

### Step 5: Install Dependencies & Jalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📁 Struktur File Baru

```
yukie2/
├── app/
│   └── page.tsx              # ✅ Updated dengan Supabase hooks
├── lib/
│   └── supabase.ts           # 🆕 Supabase client & types
├── hooks/
│   └── useSupabaseData.ts    # 🆕 Custom hooks untuk fetch data
├── supabase-schema.sql       # 🆕 Database schema
├── .env.local.example        # 🆕 Template environment variables
└── README-SUPABASE.md        # 🆕 Dokumentasi ini
```

## 🎨 Cara Mengubah Konten

### Mengubah Teks/Caption

1. Buka **Table Editor** di Supabase Dashboard
2. Pilih tabel `site_content`
3. Edit nilai pada kolom `value`
4. Refresh website - perubahan langsung terlihat!

**Contoh field yang bisa diubah:**

| Section | Key | Keterangan |
|---------|-----|------------|
| `section2` | `eyebrow` | "02 / Selected work" |
| `section2` | `title` | "In good" |
| `section2` | `title_em` | "company." |
| `section2` | `description` | Deskripsi section (support HTML) |
| `hero` | `location` | "Jakarta, Indonesia" |
| `hero` | `tagline` | "Independent artist" |
| `intro` | `location_full` | "Jakarta, ID · 6°12' S" |

### Mengubah Gambar

#### Hero Image
1. Buka tabel `hero_images`
2. Edit `image_url` dengan URL gambar baru
3. Edit `alt_text` untuk accessibility

#### Portfolio Images
1. Buka tabel `works`
2. Edit `image_url` untuk setiap work item
3. Bisa juga ubah title, role, year, dan size

#### Contact Image
1. Buka tabel `contact_images`
2. Edit `image_url` dan `caption`

### Menambah Portfolio Item Baru

1. Buka tabel `works`
2. Klik **Insert row**
3. Isi:
   - `id`: "05", "06", dst
   - `title`: Judul project
   - `role`: Peran Anda
   - `year`: Tahun
   - `image_url`: URL gambar
   - `size`: "tall" atau "short"
   - `order_index`: Urutan tampilan (5, 6, dst)
4. Save

## 🔒 Keamanan

- ✅ Row Level Security (RLS) enabled
- ✅ Public hanya bisa READ
- ✅ WRITE/UPDATE memerlukan autentikasi (akan diatur di dashboard)

## 🐛 Troubleshooting

### Website menampilkan "Loading..." terus
- ✅ Pastikan `.env.local` sudah dibuat dengan API keys yang benar
- ✅ Restart dev server: `npm run dev`
- ✅ Cek browser console untuk error

### Data tidak muncul
- ✅ Pastikan schema SQL sudah dijalankan
- ✅ Cek tabel di Supabase ada data
- ✅ Cek RLS policies sudah aktif

### Error "Invalid API Key"
- ✅ Pastikan copy **anon/public key**, bukan service_role key
- ✅ Tidak ada spasi di awal/akhir key

## 📝 Catatan

- Semua URL gambar bisa dari mana saja (Unsplash, Cloudinary, Supabase Storage, dll)
- HTML tags didukung di field description (contoh: `<em>`, `<br />`)
- Data di-cache oleh browser, mungkin perlu hard refresh (`Ctrl + Shift + R`)

## 🎯 Next Steps (Opsional)

1. **Upload gambar ke Supabase Storage** (bukan link external)
2. **Buat admin panel** untuk edit konten tanpa buka dashboard
3. **Tambah authentication** untuk proteksi edit data
4. **Tambah caching** dengan React Query untuk performa lebih baik

---

✨ **Sekarang website Anda sudah full dynamic dengan Supabase!**
