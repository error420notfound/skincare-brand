import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ShoppingBag } from 'lucide-react';
import { CartProvider, useCart } from '../cart/CartContext';
import CartDrawer from '../cart/CartDrawer';

interface Props {
  productId: string;
  productName: string;
  price: number;
  image: string;
  weight?: string;
  inStock: boolean;
}

function AddToCartInner({ productId, productName, price, image, weight, inStock }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (!inStock || added) return;

    for (let i = 0; i < qty; i++) {
      addItem({
        id: productId,
        name: productName,
        price,
        image,
        weight,
      });
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="add-to-cart">
      {/* Quantity */}
      <div className="atc-qty-row">
        <span className="atc-qty-label">Quantity</span>
        <div className="atc-qty">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            disabled={qty <= 1}
            aria-label="Decrease"
          >
            −
          </button>
          <span>{qty}</span>
          <button
            onClick={() => setQty(Math.min(10, qty + 1))}
            disabled={qty >= 10}
            aria-label="Increase"
          >
            +
          </button>
        </div>
      </div>

      {/* CTA */}
      <button
        className={`atc-btn ${added ? 'atc-btn--added' : ''} ${!inStock ? 'atc-btn--oos' : ''}`}
        onClick={handleAdd}
        disabled={!inStock}
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          {added ? (
            <motion.span
              key="added"
              className="atc-btn-inner"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Check size={16} strokeWidth={2} />
              Added to Cart
            </motion.span>
          ) : (
            <motion.span
              key="add"
              className="atc-btn-inner"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Cart drawer rendered here */}
      <CartDrawer />

      <style>{`
        .add-to-cart {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .atc-qty-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .atc-qty-label {
          font-size: var(--text-xs);
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color: var(--color-ink-muted);
        }

        .atc-qty {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid var(--color-border);
        }

        .atc-qty button {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          color: var(--color-ink-muted);
          cursor: pointer;
          transition: color var(--transition-base), background var(--transition-base);
        }

        .atc-qty button:hover:not(:disabled) {
          color: var(--color-ink);
          background: var(--color-bg-alt);
        }

        .atc-qty button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .atc-qty span {
          width: 40px;
          text-align: center;
          font-size: var(--text-sm);
          color: var(--color-ink);
          border-inline: 1px solid var(--color-border);
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .atc-btn {
          width: 100%;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans);
          font-size: var(--text-xs);
          font-weight: 400;
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          cursor: pointer;
          transition: background var(--transition-base), border-color var(--transition-base);
          background: var(--color-ink);
          color: var(--color-bg);
          border: 1px solid var(--color-ink);
        }

        .atc-btn:hover:not(:disabled) {
          background: var(--color-accent);
          border-color: var(--color-accent);
        }

        .atc-btn--added {
          background: var(--color-accent) !important;
          border-color: var(--color-accent) !important;
        }

        .atc-btn--oos {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .atc-btn-inner {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
      `}</style>
    </div>
  );
}

export default function AddToCart(props: Props) {
  return (
    <CartProvider>
      <AddToCartInner {...props} />
    </CartProvider>
  );
}
