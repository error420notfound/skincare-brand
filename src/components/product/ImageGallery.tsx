import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (index: number) => {
    setDirection(index > active ? 1 : -1);
    setActive(index);
  };

  const prev = () => go(active === 0 ? images.length - 1 : active - 1);
  const next = () => go(active === images.length - 1 ? 0 : active + 1);

  return (
    <div className="gallery">
      {/* Thumbnails */}
      <div className="gallery-thumbs">
        {images.map((src, i) => (
          <button
            key={i}
            className={`gallery-thumb ${i === active ? 'gallery-thumb--active' : ''}`}
            onClick={() => go(i)}
            aria-label={`View image ${i + 1} of ${images.length}`}
          >
            <img src={src} alt="" width={80} height={100} loading="lazy" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="gallery-main">
        <div className="gallery-main-inner">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              className="gallery-slide"
              custom={direction}
              initial={{ opacity: 0, x: direction * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -32 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={images[active]}
                alt={`${productName} — image ${active + 1}`}
                width={900}
                height={1100}
                loading={active === 0 ? 'eager' : 'lazy'}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button className="gallery-arrow gallery-arrow--prev" onClick={prev} aria-label="Previous image">
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>
              <button className="gallery-arrow gallery-arrow--next" onClick={next} aria-label="Next image">
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="gallery-dots" role="tablist">
            {images.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === active}
                className={`gallery-dot ${i === active ? 'gallery-dot--active' : ''}`}
                onClick={() => go(i)}
                aria-label={`Image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .gallery {
          display: grid;
          grid-template-columns: 72px 1fr;
          gap: var(--space-3);
          align-items: start;
        }

        .gallery-thumbs {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          position: sticky;
          top: calc(4rem + var(--space-4));
        }

        .gallery-thumb {
          width: 72px;
          aspect-ratio: 4/5;
          overflow: hidden;
          border: 1px solid transparent;
          cursor: pointer;
          transition: border-color var(--transition-base);
          padding: 0;
          background: var(--color-bg-alt);
        }

        .gallery-thumb:hover {
          border-color: var(--color-ink-muted);
        }

        .gallery-thumb--active {
          border-color: var(--color-ink) !important;
        }

        .gallery-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery-main {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .gallery-main-inner {
          position: relative;
          aspect-ratio: 4/5;
          overflow: hidden;
          background: var(--color-bg-alt);
        }

        .gallery-slide {
          position: absolute;
          inset: 0;
        }

        .gallery-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          background: rgba(250, 248, 244, 0.88);
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-ink);
          transition: all var(--transition-base);
          z-index: 2;
        }

        .gallery-arrow:hover {
          background: var(--color-bg);
          border-color: var(--color-ink);
        }

        .gallery-arrow--prev { left: var(--space-2); }
        .gallery-arrow--next { right: var(--space-2); }

        .gallery-dots {
          display: flex;
          justify-content: center;
          gap: var(--space-2);
        }

        .gallery-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-border);
          cursor: pointer;
          transition: background var(--transition-base), transform var(--transition-base);
          padding: 0;
        }

        .gallery-dot--active {
          background: var(--color-ink);
          transform: scale(1.3);
        }

        @media (max-width: 600px) {
          .gallery {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr auto;
          }

          .gallery-thumbs {
            flex-direction: row;
            order: 2;
            position: static;
            overflow-x: auto;
          }

          .gallery-thumb {
            width: 56px;
            flex-shrink: 0;
          }

          .gallery-main { order: 1; }
        }
      `}</style>
    </div>
  );
}
