import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  shortDesc: string;
  images: string[];
  collectionSlug: string;
  isNew: boolean;
  featured: boolean;
  weight?: string;
}

interface Props {
  products: Product[];
  collectionName: string;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

const SORT_LABELS: Record<SortOption, string> = {
  featured: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  newest: 'Newest',
};

export default function FilterSort({ products, collectionName }: Props) {
  const [sort, setSort] = useState<SortOption>('featured');
  const [showNew, setShowNew] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...products];

    if (showNew) list = list.filter((p) => p.isNew);

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
        break;
      case 'featured':
        list.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
        break;
    }

    return list;
  }, [products, sort, showNew]);

  return (
    <div className="filter-sort-root">
      {/* Toolbar */}
      <div className="filter-toolbar">
        <div className="filter-left">
          <button
            className={`filter-chip ${showNew ? 'filter-chip--active' : ''}`}
            onClick={() => setShowNew((v) => !v)}
          >
            New Arrivals
          </button>
          <span className="filter-count">
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        <div className="filter-right">
          <div className="sort-dropdown">
            <button
              className="sort-trigger"
              onClick={() => setSortOpen((v) => !v)}
              aria-expanded={sortOpen}
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              <span>{SORT_LABELS[sort]}</span>
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 300ms ease' }}
              />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.ul
                  className="sort-menu"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                    <li key={opt}>
                      <button
                        className={`sort-option ${sort === opt ? 'sort-option--active' : ''}`}
                        onClick={() => { setSort(opt); setSortOpen(false); }}
                      >
                        {SORT_LABELS[opt]}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Product grid */}
      <motion.div className="product-grid" layout>
        <AnimatePresence mode="popLayout">
          {filtered.map((product, i) => (
            <motion.article
              key={product.id}
              className="product-card-fs"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              layout
            >
              <a href={`${import.meta.env.BASE_URL}products/${product.id}`} className="product-card-fs-img-link">
                <div className="product-card-fs-img">
                  <img src={product.images[0]} alt={product.name} width={600} height={750} loading="lazy" />
                  {product.images[1] && (
                    <img src={product.images[1]} alt="" width={600} height={750} loading="lazy" className="product-card-fs-img-hover" />
                  )}
                  {product.isNew && <span className="product-card-fs-badge">New</span>}
                </div>
              </a>
              <div className="product-card-fs-info">
                {product.weight && <span className="product-card-fs-weight">{product.weight}</span>}
                <h3 className="product-card-fs-name">
                  <a href={`${import.meta.env.BASE_URL}products/${product.id}`}>{product.name}</a>
                </h3>
                <p className="product-card-fs-desc">{product.shortDesc}</p>
                <div className="product-card-fs-footer">
                  <span className="product-card-fs-price">€{product.price}</span>
                  <a href={`${import.meta.env.BASE_URL}products/${product.id}`} className="product-card-fs-cta">View →</a>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .filter-sort-root { width: 100%; }

        .filter-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-block: var(--space-4);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-8);
          gap: var(--space-4);
        }

        .filter-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .filter-chip {
          font-family: var(--font-sans);
          font-size: var(--text-xs);
          font-weight: 400;
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
          padding: 0.4rem 0.9rem;
          border: 1px solid var(--color-border);
          background: transparent;
          color: var(--color-ink-muted);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .filter-chip--active {
          border-color: var(--color-ink);
          color: var(--color-ink);
          background: var(--color-ink);
          color: var(--color-bg);
        }

        .filter-count {
          font-size: var(--text-xs);
          color: var(--color-ink-faint);
          letter-spacing: 0.04em;
        }

        .sort-dropdown {
          position: relative;
        }

        .sort-trigger {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-family: var(--font-sans);
          font-size: var(--text-xs);
          font-weight: 400;
          letter-spacing: var(--tracking-wide);
          text-transform: uppercase;
          color: var(--color-ink-muted);
          cursor: pointer;
          transition: color var(--transition-base);
          padding: 0.4rem 0;
        }

        .sort-trigger:hover {
          color: var(--color-ink);
        }

        .sort-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          min-width: 200px;
          z-index: var(--z-overlay);
          box-shadow: 0 8px 32px rgba(26,24,22,0.08);
        }

        .sort-option {
          display: block;
          width: 100%;
          text-align: left;
          padding: 0.7rem 1rem;
          font-size: var(--text-sm);
          color: var(--color-ink-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .sort-option:hover, .sort-option--active {
          color: var(--color-ink);
          background: var(--color-bg-alt);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-4) var(--space-4);
        }

        .product-card-fs {
          display: flex;
          flex-direction: column;
        }

        .product-card-fs-img-link {
          display: block;
          margin-bottom: var(--space-3);
        }

        .product-card-fs-img {
          position: relative;
          aspect-ratio: 4/5;
          overflow: hidden;
          background: var(--color-bg-alt);
        }

        .product-card-fs-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
          transition: opacity 700ms ease, transform 1000ms ease;
        }

        .product-card-fs-img-hover {
          opacity: 0;
        }

        .product-card-fs:hover .product-card-fs-img img:first-child {
          opacity: 0;
        }

        .product-card-fs:hover .product-card-fs-img-hover {
          opacity: 1;
        }

        .product-card-fs:hover .product-card-fs-img img {
          transform: scale(1.03);
        }

        .product-card-fs-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          font-family: var(--font-sans);
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          padding: 0.25rem 0.6rem;
          border: 1px solid var(--color-accent-light);
          background: var(--color-accent-pale);
          color: var(--color-accent);
          z-index: 1;
        }

        .product-card-fs-info { flex: 1; }

        .product-card-fs-weight {
          display: block;
          font-size: var(--text-xs);
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color: var(--color-ink-faint);
          margin-bottom: 4px;
        }

        .product-card-fs-name {
          font-family: var(--font-serif);
          font-size: var(--text-lg);
          font-weight: 400;
          line-height: var(--leading-snug);
          margin-bottom: var(--space-2);
        }

        .product-card-fs-name a {
          color: var(--color-ink);
          text-decoration: none;
          transition: color var(--transition-base);
        }

        .product-card-fs-name a:hover {
          color: var(--color-accent);
        }

        .product-card-fs-desc {
          font-size: var(--text-sm);
          color: var(--color-ink-muted);
          line-height: var(--leading-relaxed);
          margin-bottom: var(--space-3);
          max-width: 34ch;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .product-card-fs-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .product-card-fs-price {
          font-family: var(--font-serif);
          font-size: var(--text-lg);
          color: var(--color-ink);
        }

        .product-card-fs-cta {
          font-size: var(--text-xs);
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color: var(--color-ink-muted);
          text-decoration: none;
          transition: color var(--transition-base);
        }

        .product-card-fs-cta:hover {
          color: var(--color-ink);
        }

        @media (max-width: 900px) {
          .product-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 500px) {
          .product-grid { grid-template-columns: 1fr 1fr; gap: var(--space-2); }
          .product-card-fs-desc { display: none; }
        }
      `}</style>
    </div>
  );
}
