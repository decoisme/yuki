'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useGallery, type GalleryItem } from '@/hooks/useGallery';
import { PageTransitionLink } from '@/components/PageTransitionProvider';

type Filter = 'all' | GalleryItem['category'];
const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'dancer', label: 'Movement' },
  { id: 'model', label: 'Portrait' },
  { id: 'producer', label: 'Process' },
  { id: 'fashion', label: 'Fashion' },
];
const categoryLabels: Record<GalleryItem['category'], string> = {
  dancer: 'Movement',
  model: 'Portrait',
  producer: 'Process',
  fashion: 'Fashion',
};

function itemYear(item: GalleryItem) {
  if (!item.created_at) return 'ARCHIVE';
  const year = new Date(item.created_at).getFullYear();
  return Number.isNaN(year) ? 'ARCHIVE' : String(year);
}

export default function FullArchive() {
  const { items, loading } = useGallery(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const visibleItems = useMemo(
    () => filter === 'all' ? items : items.filter((item) => item.category === filter),
    [filter, items],
  );
  const activeItem = selectedIndex === null ? null : visibleItems[selectedIndex] ?? null;

  useEffect(() => {
    if (!activeItem) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedIndex(null);
      if (event.key === 'ArrowRight') setSelectedIndex((index) => index === null ? null : (index + 1) % visibleItems.length);
      if (event.key === 'ArrowLeft') setSelectedIndex((index) => index === null ? null : (index - 1 + visibleItems.length) % visibleItems.length);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [activeItem, visibleItems.length]);

  const closeViewer = () => setSelectedIndex(null);
  const moveViewer = (direction: -1 | 1) => {
    setSelectedIndex((index) => index === null ? null : (index + direction + visibleItems.length) % visibleItems.length);
  };

  return (
    <main className="archive-page">
      <header className="archive-topbar">
        <PageTransitionLink href="/" className="archive-back-link">
          <ArrowLeft size={15} strokeWidth={1.4} />
          <span>Back to studio</span>
        </PageTransitionLink>
        <PageTransitionLink className="archive-wordmark" href="/" aria-label="Yuki home">Y<span>.</span></PageTransitionLink>
        <span className="archive-location">Jakarta · Indonesia</span>
      </header>

      <section className="archive-intro" aria-labelledby="archive-title">
        <div className="archive-intro-meta">
          <span><i /> The complete index</span>
          <span>2023 — 2025</span>
        </div>
        <div className="archive-intro-main">
          <h1 id="archive-title">Collected<br /><em>moments.</em></h1>
          <div className="archive-intro-note">
            <p>A living record of movement, image, and everything in between.</p>
            <span>{String(visibleItems.length).padStart(2, '0')} works <b>·</b> {loading ? 'SYNCING' : 'SELECTED'}</span>
          </div>
        </div>
      </section>

      <nav className="archive-filters" aria-label="Filter the archive by discipline">
        {filters.map((option) => {
          const count = option.id === 'all' ? items.length : items.filter((item) => item.category === option.id).length;
          return (
            <button
              key={option.id}
              className={`archive-filter ${filter === option.id ? 'is-selected' : ''}`}
              type="button"
              aria-pressed={filter === option.id}
              onClick={() => { setFilter(option.id); setSelectedIndex(null); }}
            >
              <span>{option.label}</span><sup>{String(count).padStart(2, '0')}</sup>
            </button>
          );
        })}
        <span className="archive-filter-hint">Select a frame to view <ArrowUpRight size={12} /></span>
      </nav>

      {visibleItems.length > 0 ? (
        <section className="archive-grid" aria-label="Archive works">
          {visibleItems.map((item, index) => (
            <button
              className={`archive-card archive-card-${index % 5}`}
              key={item.id}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Open ${item.title || `archive work ${index + 1}`}, ${categoryLabels[item.category]}`}
            >
              <span className={`archive-card-media aspect-${item.aspect_ratio || 'portrait'}`}>
                {item.media_type === 'video' && item.video_url ? (
                  <video
                    src={item.video_url}
                    poster={item.image_url}
                    muted
                    loop
                    playsInline
                    preload="none"
                    onMouseEnter={(event) => { void event.currentTarget.play().catch(() => undefined); }}
                    onMouseLeave={(event) => event.currentTarget.pause()}
                    aria-label={`${item.title || 'Archive'} video preview`}
                  />
                ) : (
                  <Image
                    src={item.image_url}
                    alt={item.title || 'Yuki archive image'}
                    fill
                    sizes="(max-width: 650px) 92vw, (max-width: 1000px) 45vw, 30vw"
                    priority={index < 2}
                  />
                )}
                <span className="archive-card-index">{String(index + 1).padStart(2, '0')}</span>
                {item.media_type === 'video' && <span className="archive-motion-mark" aria-label="Video">Motion <i /></span>}
                <span className="archive-card-open"><ArrowUpRight size={17} strokeWidth={1.4} /></span>
              </span>
              <span className="archive-card-caption">
                <span><strong>{item.title || `Untitled study ${index + 1}`}</strong><small>{categoryLabels[item.category]}</small></span>
                <span className="archive-card-year">{itemYear(item)}</span>
              </span>
            </button>
          ))}
        </section>
      ) : (
        <div className="archive-empty">No works in this chapter yet.</div>
      )}

      <footer className="archive-footer">
        <span>Yuki · A practice in presence</span>
        <PageTransitionLink href="/" className="archive-return-link">Return to the studio <ArrowUpRight size={13} /></PageTransitionLink>
      </footer>

      {activeItem && selectedIndex !== null && (
        <div className="archive-viewer" role="dialog" aria-modal="true" aria-label={`${activeItem.title || 'Archive image'} detail`} onClick={closeViewer}>
          <div className="archive-viewer-bar">
            <span>{String(selectedIndex + 1).padStart(2, '0')} <i>/</i> {String(visibleItems.length).padStart(2, '0')}</span>
            <button type="button" onClick={closeViewer} aria-label="Close image"><X size={21} strokeWidth={1.3} /></button>
          </div>
          <button className="archive-viewer-arrow previous" type="button" onClick={(event) => { event.stopPropagation(); moveViewer(-1); }} aria-label="Previous work"><ChevronLeft size={22} /></button>
          <div className="archive-viewer-media" onClick={(event) => event.stopPropagation()}>
            {activeItem.media_type === 'video' && activeItem.video_url ? (
              <video src={activeItem.video_url} poster={activeItem.image_url} autoPlay muted loop playsInline controls />
            ) : (
              <Image src={activeItem.image_url} alt={activeItem.title || 'Yuki archive image'} fill sizes="90vw" priority />
            )}
          </div>
          <button className="archive-viewer-arrow next" type="button" onClick={(event) => { event.stopPropagation(); moveViewer(1); }} aria-label="Next work"><ChevronRight size={22} /></button>
          <div className="archive-viewer-caption">
            <span>{categoryLabels[activeItem.category]} · {itemYear(activeItem)}</span>
            <h2>{activeItem.title || 'Untitled study'}</h2>
            <span className="viewer-key-hint">Use ← → to move through the archive</span>
          </div>
        </div>
      )}
    </main>
  );
}
