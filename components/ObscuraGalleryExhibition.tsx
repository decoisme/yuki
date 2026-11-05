'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { useGallery, type GalleryItem as SupabaseGalleryItem } from '@/hooks/useGallery';
import { PageTransitionLink } from '@/components/PageTransitionProvider';

export interface GalleryItem {
  id: string;
  index: string;
  role: 'DANCE' | 'MODEL' | 'PRODUCER' | 'STYLING';
  title: string;
  subtext: string;
  metadata: string;
  type: 'image' | 'video';
  src: string;
  videoSrc?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

export interface ObscuraExhibitionProps {
  title?: string;
  subtitle?: string;
  items?: GalleryItem[];
  className?: string;
}

const categoryRoles: Record<SupabaseGalleryItem['category'], GalleryItem['role']> = {
  dancer: 'DANCE',
  model: 'MODEL',
  producer: 'PRODUCER',
  fashion: 'STYLING',
};

function toGalleryItem(item: SupabaseGalleryItem, index: number): GalleryItem {
  return {
    id: item.id,
    index: String(index + 1).padStart(2, '0'),
    role: categoryRoles[item.category] || 'DANCE',
    title: item.title || `Untitled ${index + 1}`,
    subtext: item.category?.toUpperCase() || 'VISUAL STUDY',
    metadata: `${item.aspect_ratio?.toUpperCase() || 'PORTRAIT'} / ${item.bg_text || 'ARCHIVE'}`,
    type: item.media_type,
    src: item.image_url,
    videoSrc: item.video_url || undefined,
    aspectRatio: item.aspect_ratio,
  };
}

export default function ObscuraGalleryExhibition({
  title = 'OBSCURA',
  subtitle = 'SHADOW ARCHIVE',
  items: providedItems,
  className = '',
}: ObscuraExhibitionProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);
  const { items: rawItems, loading } = useGallery(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const galleryItems = useMemo<GalleryItem[]>(() => providedItems
    ? providedItems.map((item, index) => ({
      ...item,
      index: item.index || String(index + 1).padStart(2, '0'),
      videoSrc: item.videoSrc || (item.type === 'video' ? item.src : undefined),
    }))
    : rawItems.map(toGalleryItem), [providedItems, rawItems]);
  const currentIndex = galleryItems.length ? activeIndex % galleryItems.length : 0;
  const currentItem = galleryItems[currentIndex];
  const previousIndexRef = useRef(currentIndex);

  useEffect(() => {
    if (!currentItem || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const frame = stageRef.current?.querySelector<HTMLElement>('.obscura-current-frame');
    if (!frame) return;
    gsap.fromTo(frame, { opacity: 0.35, scale: 1.025, y: 5 }, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out' });
    return () => { gsap.killTweensOf(frame); };
  }, [currentIndex, currentItem]);

  useEffect(() => {
    if (previousIndexRef.current === currentIndex) return;
    previousIndexRef.current = currentIndex;
    activeThumbRef.current?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }, [currentIndex]);

  const moveTo = (index: number) => {
    setActiveIndex((index + galleryItems.length) % galleryItems.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveTo(currentIndex + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveTo(currentIndex - 1);
    }
  };

  if (loading && !providedItems) {
    return <div className="obscura-loading" role="status" aria-live="polite"><div className="loading-spinner">Loading Exhibition...</div></div>;
  }

  if (!currentItem) return null;

  return (
    <section
      className={`obscura-gallery ${className}`}
      id="gallery"
      aria-labelledby="obscura-gallery-title"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <header className="obscura-gallery-header">
        <div className="obscura-gallery-brand">
          <span className="obscura-gallery-eyebrow"><i /> YUKI / {subtitle}</span>
          <h2 id="obscura-gallery-title">{title}<span>.</span></h2>
        </div>
        <div className="obscura-gallery-edition">
          <span>A visual study in light, form & motion</span>
          <span>Jakarta · Indonesia</span>
        </div>
      </header>

      <div className="obscura-gallery-main">
        <div className="obscura-gallery-stage" ref={stageRef}>
          <div className="obscura-stage-grain" aria-hidden="true" />
          <div className="obscura-stage-index" aria-hidden="true">{currentItem.index} <i>/</i> {String(galleryItems.length).padStart(2, '0')}</div>
          <div className="obscura-current-frame" key={currentItem.id}>
            {currentItem.type === 'video' && currentItem.videoSrc ? (
              <video
                src={currentItem.videoSrc}
                poster={currentItem.src}
                autoPlay
                loop
                muted
                playsInline
                controls
                aria-label={`${currentItem.title} video`}
              />
            ) : (
              <Image src={currentItem.src} alt={currentItem.title} fill priority sizes="(max-width: 700px) 100vw, 70vw" />
            )}
          </div>
          <div className="obscura-stage-shade" aria-hidden="true" />
          <span className="obscura-stage-edition" aria-hidden="true">{currentItem.metadata}</span>
        </div>

        <aside className="obscura-gallery-info" aria-live="polite" aria-atomic="true">
          <span className="obscura-info-kicker">{currentItem.role} <i /> {currentItem.subtext}</span>
          <p className="obscura-info-count">FRAME {currentItem.index} / {String(galleryItems.length).padStart(2, '0')}</p>
          <h3>{currentItem.title}</h3>
          <p className="obscura-info-description">A moment in movement, held just long enough to be seen differently.</p>
          <div className="obscura-gallery-controls" aria-label="Gallery controls">
            <button type="button" onClick={() => moveTo(currentIndex - 1)} aria-label="Previous image"><ChevronLeft size={18} strokeWidth={1.4} /></button>
            <span>{currentItem.index}<i />{String(galleryItems.length).padStart(2, '0')}</span>
            <button type="button" onClick={() => moveTo(currentIndex + 1)} aria-label="Next image"><ChevronRight size={18} strokeWidth={1.4} /></button>
          </div>
        </aside>
      </div>

      <nav className="obscura-gallery-rail" aria-label="Choose a gallery image">
        {galleryItems.map((item, index) => (
          <button
            className={`obscura-gallery-thumb ${index === currentIndex ? 'is-current' : ''}`}
            key={item.id}
            ref={index === currentIndex ? activeThumbRef : undefined}
            type="button"
            onClick={() => moveTo(index)}
            aria-label={`Show image ${index + 1}: ${item.title}`}
            aria-pressed={index === currentIndex}
          >
            <span className="obscura-thumb-image">
              <Image src={item.src} alt="" fill sizes="120px" />
              {item.type === 'video' && <i aria-label="Video" />}
            </span>
            <span className="obscura-thumb-index">{item.index}</span>
          </button>
        ))}
      </nav>

      <footer className="obscura-gallery-footer">
        <span>Use ← → to move through the frames</span>
        <PageTransitionLink href="/archive">View full archive <ArrowUpRight size={13} strokeWidth={1.4} /></PageTransitionLink>
        <a href="#contact">Continue to contact <ArrowDown size={13} strokeWidth={1.4} /></a>
      </footer>
    </section>
  );
}
