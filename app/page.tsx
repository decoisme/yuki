'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useWorks, useHeroImage, useContactImage, useSiteContent } from '@/hooks/useSupabaseData';
import ObscuraGalleryExhibition from '@/components/ObscuraGalleryExhibition';
import GalleryThreshold from '@/components/GalleryThreshold';
import SafeRichText from '@/components/SafeRichText';

function Photo({ src, alt, priority = false, className = '' }: { src: string; alt: string; priority?: boolean; className?: string }) {
  return <Image src={src} alt={alt} fill priority sizes="(max-width: 700px) 100vw, 50vw" className={`photo ${className}`} />;
}

type SocialLink = { label: string; url: string };

function getSocialLinks(value?: string): SocialLink[] {
  const defaults: SocialLink[] = [
    { label: 'Instagram', url: 'https://instagram.com' },
    { label: 'Vimeo', url: 'https://vimeo.com' },
  ];
  if (!value) return defaults;

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return defaults;
    return parsed.flatMap((entry): SocialLink[] => {
      if (!entry || typeof entry !== 'object') return [];
      const link = entry as Record<string, unknown>;
      if (typeof link.label !== 'string' || typeof link.url !== 'string' || !link.label.trim()) return [];
      try {
        const url = new URL(link.url);
        return url.protocol === 'https:' || url.protocol === 'http:'
          ? [{ label: link.label.trim(), url: url.toString() }]
          : [];
      } catch {
        return [];
      }
    });
  } catch {
    return defaults;
  }
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroTitle = useRef<HTMLHeadingElement>(null);
  const nav = useRef<HTMLElement>(null);
  const workDialogRef = useRef<HTMLDivElement>(null);
  const workCloseButtonRef = useRef<HTMLButtonElement>(null);
  const lastWorkTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);

  // Fetch data dari Supabase
  const { works, loading: worksLoading } = useWorks();
  const { heroImage } = useHeroImage();
  const { contactImage, loading: contactLoading } = useContactImage();
  const { content, loading: contentLoading } = useSiteContent();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-letter', { yPercent: 115, rotate: 8, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.15, stagger: 0.09, ease: 'power4.out', delay: 0.25 });
      gsap.fromTo('.hero-meta', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 1.1, stagger: 0.12, ease: 'power2.out' });

      gsap.fromTo('.contact-image', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'center center', scrub: true } });
      let previous = 0;
      ScrollTrigger.create({ start: 90, onUpdate: (self) => {
        if (menuOpen) return;
        const current = self.scroll();
        gsap.to(nav.current, { y: current > previous && current > 160 ? -120 : 0, duration: 0.35, ease: 'power2.out', overwrite: true });
        previous = current;
      } });
    });
    return () => ctx.revert();
  }, [menuOpen]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.work-card').forEach((card) => {
        const image = card.querySelector('.photo');
        gsap.fromTo(card, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 88%' } });
        if (image) gsap.to(image, { yPercent: -5, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      window.cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, [works]);

  const closeProjectOverlay = useCallback(() => {
    setSelectedWorkId(null);
    window.requestAnimationFrame(() => lastWorkTriggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (selectedWorkId && !works.some((work) => work.id === selectedWorkId)) setSelectedWorkId(null);
  }, [selectedWorkId, works]);

  useEffect(() => {
    if (!selectedWorkId) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => workCloseButtonRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeProjectOverlay();
        return;
      }
      if (event.key !== 'Tab' || !workDialogRef.current) return;
      const focusable = Array.from(workDialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedWorkId, closeProjectOverlay]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (menuOpen) gsap.fromTo('.menu-link', { y: 30, skewY: 5, opacity: 0 }, { y: 0, skewY: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.15 });
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);
  const selectedWork = works.find((work) => work.id === selectedWorkId) || null;
  const thresholdWork = works[works.length - 1];
  const thresholdImage = thresholdWork?.image_url || heroImage?.image_url;
  const contactEmail = content.contact?.email || 'hello@yuki.studio';
  const socialLinks = getSocialLinks(content.contact?.social_links);

  return (
    <main>
      <nav className="top-nav" ref={nav} aria-label="Main navigation">
        <a className="wordmark" href="#home" aria-label="Yuki home">Y<span className="blue-dot">.</span></a>
        <div className="nav-center"><a href="#work">Selected work</a><span className="nav-slash">/</span><a href="#about">About</a></div>
        <a className="nav-contact" href="#contact">Let's talk <ArrowUpRight size={13} strokeWidth={1.5} /></a>
        <button className="mobile-menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={20} strokeWidth={1.4} /></button>
      </nav>

      <section className="hero" id="home">
        {heroImage && <Image className="hero-photo" src={heroImage.image_url} alt={heroImage.alt_text} fill priority sizes="100vw" />}
        <div className="hero-shade" />
        <div className="hero-topline hero-meta">
          <span>
            {content.hero?.tagline || 'Independent artist'}<br />
            {content.hero?.location || 'Jakarta, Indonesia'}
          </span>
          <span className="availability">
            <i /> {content.hero?.availability || 'Available for select projects'}
          </span>
        </div>
        <div className="hero-title-wrap"><h1 ref={heroTitle} aria-label="Yuki">{'YUKI'.split('').map((letter, i) => <span className="letter-clip" key={letter + i}><span className="hero-letter">{letter}</span></span>)}<span className="hero-period">.</span></h1></div>
        <div className="hero-bottom hero-meta"><p>Dancer <b>·</b> Model <b>·</b> Producer<br />Fashion consultant</p><a className="scroll-cue" href="#work"><span>Scroll to explore</span><ArrowDown size={14} strokeWidth={1.5} /></a><span className="hero-index">01 — 04</span></div>
        <span className="hero-side-label">{content.hero?.practice || 'A practice in presence'}</span>
      </section>

      <section className="intro" id="about">
        <div className="section-kicker">
          <span>01 / A little about me</span>
          <span>{content.intro?.location_full || 'Jakarta, ID · 6°12\' S'}</span>
        </div>
        <div className="intro-copy">
          <p><SafeRichText value={content.intro?.description || 'I work with <em>movement</em>, image, and feeling — shaping moments that stay with you.'} /></p>
          <a className="text-link" href="#contact">More about Yuki <ArrowUpRight size={14} /></a>
        </div>
        <div className="intro-note"><span>Independent by nature.</span><span>Collaborative by design.</span></div>
      </section>

      <section className="works" id="work">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{content.section2?.eyebrow || '02 / Selected work'}</span>
            <h2>
              {content.section2?.title || 'In good'}<br />
              <em>{content.section2?.title_em || 'company.'}</em>
            </h2>
          </div>
          <p><SafeRichText value={content.section2?.description || 'A collection of collaborations<br />and quiet obsessions.'} /></p>
        </div>
        <div className="work-grid">
          {works.map((work) => <article className={`work-card ${work.size}`} key={work.id}>
            <button
              className="work-card-trigger"
              type="button"
              aria-expanded={selectedWorkId === work.id}
              aria-controls={selectedWorkId === work.id ? 'work-detail-dialog' : undefined}
              aria-label={`View project details for ${work.title}`}
              onClick={(event) => {
                lastWorkTriggerRef.current = event.currentTarget;
                setSelectedWorkId(work.id);
              }}
            >
              <div className="work-image"><Photo src={work.image_url} alt={`${work.title} editorial campaign`} /><span className="image-index">{String(work.order_index).padStart(2, '0')}</span><span className="image-arrow"><ArrowUpRight size={18} strokeWidth={1.3} /></span></div>
              <div className="work-info"><div><h3>{work.title}</h3><span>{work.role}</span></div><span className="work-year">{work.year}</span></div>
            </button>
          </article>)}
        </div>
        <div className="work-foot"><span>More work on request</span><span>Selected 2023—25</span></div>
        {selectedWork && <div className="work-story-overlay" onClick={(event) => { if (event.target === event.currentTarget) closeProjectOverlay(); }}>
          <div className="work-story-dialog" id="work-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="work-story-title" tabIndex={-1} ref={workDialogRef}>
            <div className="work-story-cover">
              <Image src={selectedWork.image_url} alt={`${selectedWork.title} — ${selectedWork.role}`} fill priority sizes="(max-width: 700px) 100vw, 55vw" />
              <span>{String(selectedWork.order_index).padStart(2, '0')} / SELECTED WORK</span>
            </div>
            <div className="work-story-content">
              <header className="work-story-toolbar"><span>YUKI / PROJECT FILE</span><button ref={workCloseButtonRef} type="button" onClick={closeProjectOverlay} aria-label="Close project details"><X size={19} strokeWidth={1.4} /></button></header>
              <div className="work-story-body">
                <div className="work-story-meta"><span>{selectedWork.role}</span><i /><span>{selectedWork.year}</span></div>
                <h2 id="work-story-title">{selectedWork.title}</h2>
                {selectedWork.summary?.trim() && <p className="work-story-summary">{selectedWork.summary}</p>}
                {selectedWork.story?.trim()
                  ? <div className="work-story-copy"><span>THE STORY</span><p>{selectedWork.story}</p></div>
                  : !selectedWork.summary?.trim() && <p className="work-story-empty">Project notes are still unfolding. Get in touch to hear more about this work.</p>}
                <div className="work-story-credits"><span>ROLE <b>{selectedWork.role}</b></span><span>YEAR <b>{selectedWork.year}</b></span></div>
                {(selectedWork.supporting_images || []).length > 0 && <div className="work-story-gallery" aria-label={`${selectedWork.title} supporting images`}>
                  {(selectedWork.supporting_images || []).map((src, index) => <div className="work-story-gallery-frame" key={`${src}-${index}`}><Image src={src} alt={`${selectedWork.title} supporting image ${index + 1}`} fill sizes="(max-width: 700px) 40vw, 16vw" /></div>)}
                </div>}
                <a className="work-story-cta" href="mailto:hello@yuki.studio?subject=Project%20inquiry"><span>Discuss a similar project</span><ArrowUpRight size={16} /></a>
              </div>
            </div>
          </div>
        </div>}
      </section>

      {thresholdImage && <GalleryThreshold
        image={thresholdImage}
        alt={`${thresholdWork?.title || 'Yuki'} — the selected work opening into Obscura`}
        index={String(thresholdWork?.order_index || 4).padStart(2, '0')}
      />}

      {/* Curated, one-screen Obscura gallery */}
      <ObscuraGalleryExhibition 
        title="OBSCURA"
        subtitle="SHADOW ARCHIVE"
      />

      <section className="contact" id="contact">
        <div className="contact-portrait">
          <Photo src={contactImage.image_url} alt="Yuki in an editorial fashion portrait" className="contact-image" />
          <span className="portrait-caption">{contactImage.caption}</span>
        </div>
        <div className="contact-content">
          <span className="eyebrow">{content.contact?.eyebrow || '03 / The next thing'}</span>
          <h2>{content.contact?.title || 'Have a good'}<br /><em>{content.contact?.title_em || 'feeling?'}</em></h2>
          <p>{content.contact?.description || 'For projects, collaborations, and everything in between.'}</p>
          <a className="contact-cta" href={`mailto:${contactEmail}`}><span>{contactEmail}</span><span className="cta-circle"><ArrowUpRight size={19} strokeWidth={1.4} /></span></a>
          <div className="socials">
            {socialLinks.map((link) => <a href={link.url} key={`${link.label}-${link.url}`} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size={11} /></a>)}
            <span>{content.footer?.location || 'Jakarta · Available in Indonesia'}</span>
          </div>
        </div>
      </section>

      <footer><a className="footer-mark" href="#home">Y<span>.</span></a><span>© 2025 Yuki. Made with intention.</span><a href="#home" className="back-top">Back to top ↑</a></footer>

      <div className={`menu-overlay ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen}>
        <div className="menu-top"><a className="wordmark" href="#home" onClick={closeMenu}>Y<span className="blue-dot">.</span></a><button className="close-menu" onClick={closeMenu} aria-label="Close menu"><X size={22} strokeWidth={1.4} /></button></div>
        <div className="menu-links"><a className="menu-link" href="#work" onClick={closeMenu}><span>01</span>Selected work<ArrowUpRight size={20} /></a><a className="menu-link" href="#about" onClick={closeMenu}><span>02</span>About<ArrowUpRight size={20} /></a><a className="menu-link" href="#gallery" onClick={closeMenu}><span>03</span>Gallery<ArrowUpRight size={20} /></a><a className="menu-link" href="#contact" onClick={closeMenu}><span>04</span>Contact<ArrowUpRight size={20} /></a></div>
        <div className="menu-foot"><span>{content.menu?.location || 'Jakarta · Indonesia'}</span><span>Dancer / Model / Producer</span></div>
      </div>
    </main>
  );
}
