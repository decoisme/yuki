# 🎭 Chiaroscuro Gallery - Spotlight Immersion

## ✨ Konsep

**Chiaroscuro** (Italian: "light-dark") adalah teknik seni visual yang menggunakan kontras kuat antara terang dan gelap. Gallery ini mengadopsi konsep tersebut dengan **spotlight/lamp effect** yang mengungkap gambar secara dramatis saat user scroll.

### Pengalaman:
- 🔦 **Spotlight dinamis** yang bergerak mengikuti scroll
- 🌑 **Background gelap (#0A0C10)** untuk kontras maksimal
- 📸 **Media fadedan scale (Ken Burns effect)**
- 📝 **Parallax background typography** untuk depth
- 🎬 **100% passive** - hanya scroll, no clicking

---

## 🎯 Fitur Utama

### 1. **Pinned Viewport**
- Gallery di-pin selama scroll
- Scroll wheel = timeline scrubber
- Semua animasi sinkron dengan scroll position

### 2. **Radial Gradient Mask (Spotlight)**
- CSS `mask-image` dengan radial gradient
- Spotlight bergerak dalam pola circular
- Size berubah secara dinamis (40-55%)
- Soft edge fade untuk blending natural

### 3. **Ken Burns Breathing Effect**
- Media scale dari 1.0 → 1.08
- Memberikan ilusi "hidup"
- Smooth, continuous zoom
- Peak saat media di tengah spotlight

### 4. **Parallax Background Text**
- Typography oversized (180-420px)
- 1px stroke outline (semi-transparent)
- Move berlawanan arah scroll
- Menciptakan ilusi multi-plane depth

### 5. **Category Labels**
- Fade in/out dengan timing presisi
- Floating pills design
- Show: category · title
- Backdrop blur untuk legibility

---

## 🚀 Setup

### Step 1: Drop Old Gallery Schema (Optional)

Jika Anda sudah punya gallery_items table lama:

```sql
DROP TABLE IF EXISTS gallery_items CASCADE;
```

### Step 2: Run New Schema

Di Supabase SQL Editor, jalankan **seluruh** isi file `supabase-gallery-schema.sql`:

```sql
-- Creates table with new columns:
-- - category (dancer/model/producer/fashion)
-- - aspect_ratio (portrait/landscape/square)
-- - bg_text (background typography)
```

### Step 3: Verify Data

Table Editor → `gallery_items` harus punya kolom:
- ✅ `category`
- ✅ `aspect_ratio`
- ✅ `bg_text`

Dan 5 sample rows dengan data lengkap.

### Step 4: Restart Dev Server

```powershell
npm run dev
```

### Step 5: Test Gallery

Buka http://localhost:3000, scroll sampai section Gallery dan nikmati spotlight effect!

---

## 🎨 Customization Guide

### Ubah Spotlight Size

Di `chiaroscuro.css`:

```css
.spotlight-container {
  --spotlight-size: 50%; /* Default: 45% */
}
```

**Tips:**
- 35-40%: Tight spotlight (dramatic)
- 45-50%: Balanced (recommended)
- 55-60%: Wide reveal (less dramatic)

### Ubah Spotlight Movement Pattern

Di `ChiaroscuroGallery.tsx`:

```typescript
// Circular pattern (default)
'--spotlight-x': `${45 + Math.sin(progress * Math.PI * 2) * 10}%`
'--spotlight-y': `${45 + Math.cos(progress * Math.PI * 2) * 10}%`

// Horizontal sweep
'--spotlight-x': `${30 + (progress * 40)}%`
'--spotlight-y': `50%`

// Vertical drop
'--spotlight-x': `50%`
'--spotlight-y': `${20 + (progress * 60)}%`

// Figure-8 pattern
'--spotlight-x': `${50 + Math.sin(progress * Math.PI * 4) * 15}%`
'--spotlight-y': `${50 + Math.sin(progress * Math.PI * 2) * 15}%`
```

### Ubah Ken Burns Speed

```typescript
scale: 1.12, // More zoom (default: 1.08)
duration: 0.6, // Faster (default: 0.4)
```

### Ubah Background Text

Via Supabase:
```sql
UPDATE gallery_items 
SET bg_text = 'MOTION' 
WHERE id = 'xxx';
```

Atau hardcode di component (fallback):
```typescript
bgText: ['MOTION', 'STYLE', 'ESSENCE', 'FORM', 'LIGHT'][index % 5]
```

---

## 📸 Menambah Gambar

### Via Supabase Dashboard

1. Table Editor → `gallery_items`
2. Insert row
3. Isi:
   ```
   title: "New Work"
   image_url: "https://your-image.jpg"
   media_type: "image"
   category: "dancer" | "model" | "producer" | "fashion"
   aspect_ratio: "portrait" | "landscape" | "square"
   bg_text: "MOMENT"
   order_index: 6
   is_active: true
   ```

### Via SQL

```sql
INSERT INTO gallery_items 
(title, image_url, media_type, category, aspect_ratio, bg_text, order_index, is_active) 
VALUES 
('Editorial Shoot', 'https://...jpg', 'image', 'model', 'portrait', 'VOGUE', 6, true);
```

### Aspect Ratio Guide

**Portrait** (9:16, 2:3):
- Full body shots
- Vertical compositions
- Fashion editorials

**Landscape** (16:9, 3:2):
- Wide scenes
- Dance performances
- Behind-the-scenes

**Square** (1:1):
- Instagram-style
- Centered compositions
- Product shots

---

## 🎬 Animation Details

### Timing Breakdown (Per Item)

```
0.0 - 0.1: Fade in (opacity 0 → 1)
0.1 - 0.5: Peak visibility + Ken Burns
0.5 - 0.7: Hold
0.7 - 1.0: Fade out (opacity 1 → 0)
```

### Spotlight Animation

```typescript
scrollTrigger: {
  scrub: 1,        // Smooth follow
  anticipatePin: 1 // Prevent janks
}
```

### Parallax Speed

- Background text: `-0.3x` scroll speed
- Media scale: `+0.05x` scroll speed
- Label fade: Snap timing (0.2s in/out)

---

## 🎨 Color & Style Variables

### Main Palette

```css
--bg-black: #0a0c10;        /* Off-black background */
--text-white: #f3f4f6;      /* Off-white text */
--accent-blue: #2563eb;     /* Cobalt blue accent */
--text-stroke: rgba(243, 244, 246, 0.08); /* Background text */
```

### Filter Stack

```css
.gallery-media {
  filter: 
    saturate(0.88)    /* Slightly desaturated */
    contrast(1.08)    /* Punch up blacks */
    brightness(0.95); /* Darker for drama */
}
```

### Vignette Gradient

```css
radial-gradient(
  ellipse 70% 65% at 50% 50%,
  transparent 0%,
  rgba(10, 12, 16, 0.2) 50%,
  rgba(10, 12, 16, 0.6) 85%,
  rgba(10, 12, 16, 0.9) 100%
)
```

---

## 📱 Mobile Optimization

### Auto Adjustments

- Typography: 100-220px (mobile) vs 180-420px (desktop)
- Media container: 92vw × 75vh (mobile) vs 85vw × 85vh (desktop)
- Spotlight size: Auto-adjusted for smaller screens
- Labels: Smaller text (9px vs 11px)
- Grain effect: Reduced opacity (0.03 vs 0.05)
- Ambient glow: Disabled on mobile

### Touch Gestures

- Vertical scroll: Standard behavior
- Pinch zoom: Disabled (prevents user confusion)
- Swipe: No horizontal swipe (vertical only)

---

## 🔧 Performance Tips

### Image Optimization

**Recommended Sizes:**
- Portrait: 1200px height
- Landscape: 2000px width
- Square: 1400×1400px

**Format:**
- WebP for modern browsers
- JPG fallback
- Max 300KB per image

### Reduce Gallery Items

Optimal: **5-8 items**
- Less than 5: Feels short
- More than 10: Performance hit

### Lazy Loading

Images auto lazy-load via Next.js Image:
```typescript
priority={false} // Only first item should be priority
```

---

## 🐛 Troubleshooting

### Spotlight tidak bergerak

✅ Cek GSAP version (min 3.12)
✅ ScrollTrigger plugin loaded?
✅ CSS variables di-set di `.spotlight-container`?

### Media tidak fade smooth

✅ Terlalu banyak items (max 8)
✅ Gambar terlalu besar (compress!)
✅ Check browser DevTools Performance tab

### Background text tidak visible

✅ Cek `-webkit-text-stroke` support
✅ Opacity terlalu rendah?
✅ Z-index collision dengan media?

### Animation lag on scroll

✅ Reduce grain opacity
✅ Disable ambient glow
✅ Lower spotlight-size
✅ Remove Ken Burns effect

---

## 💡 Advanced Techniques

### Add Mouse Parallax

```typescript
useEffect(() => {
  const handleMouse = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 10;
    const y = (e.clientY / window.innerHeight) * 10;
    gsap.to('.spotlight-container', {
      '--spotlight-x': `${45 + x}%`,
      '--spotlight-y': `${45 + y}%`,
      duration: 0.5,
    });
  };
  window.addEventListener('mousemove', handleMouse);
  return () => window.removeEventListener('mousemove', handleMouse);
}, []);
```

### Add Sound Design

```typescript
const playSound = () => {
  const audio = new Audio('/sounds/spotlight-move.mp3');
  audio.volume = 0.2;
  audio.play();
};
```

### WebGL Shader Transition

Use Three.js dengan custom shader untuk smooth distortion transitions.

---

## 📐 Design Philosophy

### Chiaroscuro = Drama through Light

- **High contrast** creates emotional impact
- **Selective reveal** builds anticipation
- **Darkness** focuses attention
- **Movement** suggests narrative

### Inspiration References

- **Caravaggio paintings** - Dramatic lighting
- **Film noir** - High contrast cinematography
- **Awwwards sites** - Premium digital experiences
- **Fashion editorials** - Spotlight photography

---

## 🎯 UX Principles

### Zero Interaction = Maximum Immersion

- User only scrolls
- No buttons, no clicks
- Passive viewing
- Linear narrative

### Scroll as Timeline

- Each scroll increment = frame
- User controls playback speed
- Forward/backward scrubbing
- Precise control

---

**🎉 Gallery Chiaroscuro siap! Nikmati pengalaman spotlight yang cinematic.** 🎭✨
