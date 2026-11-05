'use client';

import { createContext, useCallback, useContext, useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';

type TransitionContextValue = { navigate: (href: string) => void };
const TransitionContext = createContext<TransitionContextValue | null>(null);

export function usePageTransition() {
  const context = useContext(TransitionContext);
  if (!context) throw new Error('usePageTransition must be used inside PageTransitionProvider');
  return context;
}

export function PageTransitionLink({
  href,
  children,
  className,
  onClick,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const { navigate } = usePageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    navigate(href);
  };

  return <a href={href} className={className} onClick={handleClick} {...props}>{children}</a>;
}

export default function PageTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const destinationRef = useRef<string | null>(null);
  const transitioningRef = useRef(false);

  const navigate = useCallback((href: string) => {
    if (transitioningRef.current || href === pathname) return;
    const panel = panelRef.current;
    const mark = markRef.current;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!panel || reduceMotion) {
      router.push(href);
      return;
    }

    transitioningRef.current = true;
    destinationRef.current = href;
    gsap.killTweensOf(panel);
    if (mark) gsap.killTweensOf(mark);
    gsap.set(panel, { clipPath: 'circle(0vmax at 50% 50%)' });

    const reveal = gsap.timeline({ onComplete: () => router.push(href) });
    reveal.to(panel, {
      clipPath: 'circle(150vmax at 50% 50%)',
      duration: 0.58,
      ease: 'power4.inOut',
    }, 0);
    if (mark) {
      reveal.fromTo(mark,
        { autoAlpha: 0, scale: 0.72, rotation: -8, filter: 'blur(12px)' },
        { autoAlpha: 1, scale: 1, rotation: 0, filter: 'blur(0px)', duration: 0.48, ease: 'back.out(1.5)' },
        0.06,
      );
    }
  }, [pathname, router]);

  useEffect(() => {
    if (!destinationRef.current || pathname !== destinationRef.current) return;
    const panel = panelRef.current;
    const mark = markRef.current;
    if (!panel) return;

    gsap.killTweensOf(panel);
    if (mark) gsap.killTweensOf(mark);
    gsap.set(panel, { clipPath: 'circle(150vmax at 50% 50%)' });

    const conceal = gsap.timeline({
      onComplete: () => {
        destinationRef.current = null;
        transitioningRef.current = false;
      },
    });
    conceal.to(panel, {
      clipPath: 'circle(0vmax at 50% 50%)',
      duration: 0.72,
      ease: 'power4.inOut',
    }, 0.04);
    if (mark) {
      conceal.to(mark, {
        autoAlpha: 0,
        scale: 0.78,
        rotation: 8,
        filter: 'blur(10px)',
        duration: 0.44,
        ease: 'power3.in',
      }, 0.04);
    }
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div className="route-transition-panel" ref={panelRef} aria-hidden="true">
        <span className="route-transition-mark-center"><span className="route-transition-mark" ref={markRef}><span className="route-transition-letter">Y</span><span className="route-transition-dot">.</span></span></span>
        <span className="route-transition-caption">A practice in presence · Jakarta</span>
      </div>
    </TransitionContext.Provider>
  );
}
