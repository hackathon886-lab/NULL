// React is supplied by the frontend runtime; keep the import in one place for the hook APIs.
// @ts-ignore The editor may not have the frontend dependencies resolved yet.
import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface HeroLandingProps {
  brandName?: string;
  tagline?: string;
  typewriterText?: string;
  email?: string;
  onNavigate?: (section: string) => void;
}

/**
 * Custom hook for typewriter text effect
 * @param text The full text to type out
 * @param speed Typing interval in milliseconds (default: 38ms)
 * @param startDelay Delay before typing begins (default: 600ms)
 */
export function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);

    let currentIndex = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let interval: ReturnType<typeof setInterval> | null = null;

    timer = setTimeout(() => {
      interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayed(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setDone(true);
          if (interval) clearInterval(interval);
        }
      }, speed);
    }, startDelay);

    return () => {
      if (timer) clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  brandName = 'LOK\u0100NTRA',
  tagline = 'Concise & Universal Swarm Intelligence Engine',
  typewriterText = 'From a single document, LOK\u0100NTRA extracts reality seeds to auto-generate a parallel world with up to million-scale Agents. Inject variables from a god\'s-eye view to find the optimal solution in complex group dynamics.',
  email = 'contact@lokantra.ai',
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pillsVisible, setPillsVisible] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  const { displayed, done } = useTypewriter(typewriterText, 38, 600);

  // Trigger pill buttons animation 400ms after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setPillsVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Request next seek without flooding
  const requestSeek = useCallback(() => {
    const video = videoRef.current;
    if (!video || isSeekingRef.current || !video.duration) return;

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
      isSeekingRef.current = true;
      video.currentTime = targetTimeRef.current;
    }
  }, []);

  const handleSeeked = useCallback(() => {
    isSeekingRef.current = false;
    const video = videoRef.current;
    if (!video || !video.duration) return;

    if (Math.abs(video.currentTime - targetTimeRef.current) > 0.02) {
      requestSeek();
    }
  }, [requestSeek]);

  // Video mouse scrubbing logic
  useEffect(() => {
    const SENSITIVITY = 0.8;

    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current;
      if (!video || !video.duration) return;

      const currentX = e.clientX;
      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const duration = video.duration;
      const offset = (delta / window.innerWidth) * SENSITIVITY * duration;
      targetTimeRef.current = Math.max(0, Math.min(duration, targetTimeRef.current + offset));

      requestSeek();
    };

    const handleMouseLeave = () => {
      prevXRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [requestSeek]);


  const handleNav = (target: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(target);
    } else {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden text-black select-none font-(--font-body)">
      {/* Background Video (mouse-scrub controlled) */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{ objectPosition: '70% center' }}
        muted
        playsInline
        preload="auto"
        onSeeked={handleSeeked}
      />

      {/* Subtle vignette gradient on the left to ensure text pops with high legibility */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-linear-to-r from-white/30 via-white/10 to-transparent" />

      {/* Centered Fixed Wordmark Logo (does not scroll) */}
      <header className="fixed top-3 sm:top-3 md:top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex justify-center items-center">
        <img
          src="/src/assets/logo/lokantra_wordmark.png"
          alt="LOK\u0100NTRA"
          className="h-12 sm:h-16 md:h-20 lg:h-24 max-w-[85vw] w-auto object-contain cursor-pointer select-none filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="LOK\u0100NTRA - Back to top"
        />
      </header>

      {/* Hero Section (z-index: 1) */}
      <section className="min-h-screen w-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 xl:px-28 pt-32 sm:pt-36 md:pt-40 pb-16 md:pb-20 relative z-1 overflow-hidden">
        <div className="w-full max-w-xl lg:max-w-2xl relative z-10 flex flex-col items-start text-left">
          {/* 1. Blurred intro label */}
          <div
            className="pointer-events-none select-none mb-4 sm:mb-6"
            style={{
              fontSize: 'clamp(17px, 2.2vw, 24px)',
              lineHeight: 1.35,
              fontWeight: 400,
              color: 'rgba(0, 0, 0, 0.75)',
              filter: 'blur(2.5px)',
              fontFamily: 'var(--font-body)'
            }}
          >
            Hey there, meet {brandName},<br />
            {tagline}
          </div>

          {/* 2. Typewriter text */}
          <p
            className="text-black mb-6 sm:mb-8 select-text"
            style={{
              fontSize: 'clamp(18px, 2.4vw, 26px)',
              lineHeight: 1.45,
              fontWeight: 400,
              minHeight: '70px',
              fontFamily: 'var(--font-body)',
              letterSpacing: '-0.01em'
            }}
          >
            {displayed}
            {!done && (
              <span
                className="inline-block w-0.5 h-[1.15em] bg-black align-middle ml-0.5"
                style={{ animation: 'blink 1s step-end infinite' }}
              />
            )}
          </p>

          {/* 3. Action pill buttons */}
          <div
            className="flex flex-wrap items-center gap-4 sm:gap-3.5 transition-all duration-500 ease-out pt-2"
            style={{
              opacity: pillsVisible ? 1 : 0,
              transform: pillsVisible ? 'translateY(0)' : 'translateY(12px)'
            }}
          >
            <button
              onClick={() => handleNav('simulation-console')}
              className="inline-flex items-center justify-center bg-white/95 backdrop-blur-md text-black border border-black/15 hover:border-black hover:bg-black hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-[13px] sm:text-[14px] font-medium tracking-wide shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Start Simulation
            </button>

            <button
              onClick={() => handleNav('workflow-section')}
              className="inline-flex items-center justify-center bg-white/95 backdrop-blur-md text-black border border-black/15 hover:border-black hover:bg-black hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-[13px] sm:text-[14px] font-medium tracking-wide shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Explore Workflow
            </button>

            <button
              onClick={() => handleNav('history-section')}
              className="inline-flex items-center justify-center bg-white/95 backdrop-blur-md text-black border border-black/15 hover:border-black hover:bg-black hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-[13px] sm:text-[14px] font-medium tracking-wide shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              History Database
            </button>

            <button
              onClick={() => handleNav('dashboard-section')}
              className="inline-flex items-center justify-center bg-white/95 backdrop-blur-md text-black border border-black/15 hover:border-black hover:bg-black hover:text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-[13px] sm:text-[14px] font-medium tracking-wide shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              System Architecture
            </button>


          </div>
        </div>

        {/* Scroll down indicator button with generous margin */}
        <button
          onClick={() => handleNav('simulation-console')}
          className="absolute bottom-8 right-8 sm:bottom-12 sm:right-14 md:bottom-14 md:right-20 w-12 h-12 rounded-full border border-black/20 bg-white/85 backdrop-blur-md text-black flex items-center justify-center text-lg hover:bg-black hover:text-white transition-all duration-300 cursor-pointer z-10 shadow-md hover:scale-105"
          title="Scroll down to simulation console"
        >
          {'\u2193'}
        </button>
      </section>
    </div>
  );
};

export default HeroLanding;
