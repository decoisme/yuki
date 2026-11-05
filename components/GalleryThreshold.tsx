'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type GalleryThresholdProps = { image: string; alt: string; index: string };

export default function GalleryThreshold({ image, alt, index }: GalleryThresholdProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const transition = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          end: 'bottom 18%',
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      transition
        .fromTo(
          '.threshold-frame',
          { clipPath: 'inset(12% 15% 12% 15%)', scale: 0.92, filter: 'brightness(.72)' },
          { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, filter: 'brightness(.82)', duration: 0.58, ease: 'none' },
          0,
        )
        .fromTo(
          '.threshold-copy',
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' },
          0.16,
        )
        .to(
          '.threshold-frame',
          { scale: 1.13, filter: 'brightness(.22)', opacity: 0.4, duration: 0.42, ease: 'none' },
          0.58,
        )
        .to('.threshold-copy', { opacity: 0, y: -18, duration: 0.18, ease: 'power2.in' }, 0.76)
        .to('.threshold-overline', { opacity: 0, duration: 0.12 }, 0.72);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section className="gallery-threshold" ref={sectionRef} aria-labelledby="threshold-title">
      <div className="threshold-frame">
        <Image src={image} alt={alt} fill sizes="100vw" />
        <div className="threshold-shade" />
      </div>
      <div className="threshold-overline" aria-hidden="true">
        <span>SELECTED WORK / {index}</span>
        <span>THE ARCHIVE CONTINUES <i /></span>
      </div>
      <div className="threshold-copy">
        <span className="threshold-kicker">BEYOND THE SELECTED FRAME</span>
        <h2 id="threshold-title">The image<br /><em>keeps moving.</em></h2>
        <a href="#gallery" className="threshold-link">Enter Obscura <ArrowDown size={14} strokeWidth={1.4} /></a>
      </div>
      <span className="threshold-index" aria-hidden="true">O / {index}</span>
    </section>
  );
}
