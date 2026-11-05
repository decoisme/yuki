'use client';

import { ArrowUpRight } from 'lucide-react';
import { PageTransitionLink } from '@/components/PageTransitionProvider';

export interface ObscuraOutroRevealProps {
  fullGalleryStatus?: string;
  contactTargetId?: string;
  className?: string;
}

export default function ObscuraOutroReveal({
  fullGalleryStatus = 'ONGOING',
  contactTargetId = 'contact',
  className = '',
}: ObscuraOutroRevealProps) {
  const handleContactClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const target = document.getElementById(contactTargetId);
    if (!target) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div className={`obscura-outro-reveal ${className}`}>
      <div className="outro-colophon">
        <div className="outro-rail">
          <span>YUKI / VISUAL ARCHIVE</span>
          <span>JAKARTA · INDONESIA</span>
        </div>

        <div className="outro-composition">
          <span className="outro-ghost" aria-hidden="true">Y<span>.</span></span>
          <div className="outro-copy">
            <span className="outro-kicker"><i aria-hidden="true" /> COLOPHON · 2025</span>
            <h2 className="outro-headline">More to<br /><em>come.</em></h2>
            <p className="outro-deck">Some stories don’t end.<br />They find another way to move.</p>
          </div>
        </div>

        <div className="outro-footer">
          <PageTransitionLink href="/archive" className="outro-archive-status" aria-label="Explore the full archive">
            <span className="status-dot pulsing" aria-hidden="true" />
            <span className="outro-archive-label">Full archive</span>
            <span className="outro-archive-value">{fullGalleryStatus === 'ONGOING' ? 'Still unfolding' : fullGalleryStatus}</span>
            <ArrowUpRight className="outro-archive-arrow" size={14} strokeWidth={1.4} aria-hidden="true" />
          </PageTransitionLink>
          <div className="outro-separator" aria-hidden="true" />
          <a
            href={`#${contactTargetId}`}
            onClick={handleContactClick}
            className="outro-contact-link"
          >
            <span>Continue to contact</span>
            <ArrowUpRight size={18} strokeWidth={1.4} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
