import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { CartProvider, useCart } from './CartContext';

function CartPageInner() {
  const { items, itemCount, subtotal, removeItem, updateQty, clearCart } = useCart();

  const shipping = subtotal > 150 ? 0 : 12;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="cart-page-empty">
        <p className="cart-page-empty-text">Your cart is empty.</p>
        <p className="cart-page-empty-sub">You have not yet selected anything. This is entirely fine.</p>
        <a href="/collections/facial-care" className="btn btn--secondary btn--md" style={{ display: 'inline-flex', marginTop: '2rem' }}>
          Explore Collections
        </a>
        <style>{`
          .cart-page-empty {
            text-align: center;
            padding: var(--space-16) var(--space-4);
          }
          .cart-page-empty-text {
            font-family: var(--font-serif);
            font-size: var(--text-3xl);
            font-weight: 300;
            color: var(--color-ink);
            margin-bottom: var(--space-3);
          }
          .cart-page-empty-sub {
            font-size: var(--text-md);
            color: var(--color-ink-muted);
            font-style: italic;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page-layout">
      {/* Items */}
      <div className="cart-page-items">
        <div className="cart-page-items-header">
          <span className="cart-page-col-name">Product</span>
          <span className="cart-page-col-qty">Quantity</span>
          <span className="cart-page-col-total">Total</span>
        </div>

        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="cart-page-item"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 32, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="cart-page-item-product">
                <a href={`/products/${item.id}`} className="cart-page-item-img-link">
                  <div className="cart-page-item-img">
                    <img src={item.image} alt={item.name} width={100} height={125} />
                  </div>
                </a>
                <div className="cart-page-item-info">
                  <h3 className="cart-page-item-name">
                    <a href={`/products/${item.id}`}>{item.name}</a>
                  </h3>
                  {item.weight && <p className="cart-page-item-weight">{item.weight}</p>}
                  <p className="cart-page-item-price">€{item.price.toFixed(2)}</p>
                  <button
                    className="cart-page-item-remove"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                    Remove
                  </button>
                </div>
              </div>

              <div className="cart-page-item-qty">
                <div className="atc-qty">
                  <button
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    aria-label="Decrease"
                  >
                    <Minus size={12} strokeWidth={2} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                    aria-label="Increase"
                  >
                    <Plus size={12} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="cart-page-item-line-total">
                €{(item.price * item.quantity).toFixed(2)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <aside className="cart-page-summary">
        <h2 className="cart-summary-heading">Order Summary</h2>

        <div className="cart-summary-rows">
          <div className="cart-summary-row">
            <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
            <span>€{subtotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
          </div>
          {shipping > 0 && (
            <p className="cart-free-shipping-note">
              Add €{(150 - subtotal).toFixed(2)} more for free shipping
            </p>
          )}
          <div className="cart-summary-row cart-summary-total-row">
            <span>Total</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>

        <a href="/checkout" className="btn btn--primary btn--lg cart-summary-cta">
          Proceed to Checkout
          <ArrowRight size={16} strokeWidth={1.5} />
        </a>

        <button onClick={clearCart} className="cart-clear-btn">
          Clear cart
        </button>
      </aside>

      <style>{`
        .cart-page-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: var(--space-12);
          align-items: start;
        }

        .cart-page-items-header {
          display: grid;
          grid-template-columns: 1fr 160px 120px;
          gap: var(--space-4);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-6);
        }

        .cart-page-col-name,
        .cart-page-col-qty,
        .cart-page-col-total {
          font-size: var(--text-xs);
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color: var(--color-ink-faint);
        }

        .cart-page-col-qty,
        .cart-page-col-total {
          text-align: center;
        }

        .cart-page-item {
          display: grid;
          grid-template-columns: 1fr 160px 120px;
          gap: var(--space-4);
          align-items: center;
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-6);
        }

        .cart-page-item:last-child {
          border-bottom: none;
        }

        .cart-page-item-product {
          display: flex;
          gap: var(--space-4);
          align-items: flex-start;
        }

        .cart-page-item-img {
          width: 100px;
          aspect-ratio: 4/5;
          overflow: hidden;
          background: var(--color-bg-alt);
          flex-shrink: 0;
        }

        .cart-page-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .cart-page-item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cart-page-item-name {
          font-family: var(--font-serif);
          font-size: var(--text-lg);
          font-weight: 400;
          line-height: var(--leading-snug);
        }

        .cart-page-item-name a {
          color: var(--color-ink);
          text-decoration: none;
          transition: color var(--transition-base);
        }

        .cart-page-item-name a:hover {
          color: var(--color-accent);
        }

        .cart-page-item-weight {
          font-size: var(--text-xs);
          color: var(--color-ink-faint);
          letter-spacing: 0.04em;
        }

        .cart-page-item-price {
          font-size: var(--text-sm);
          color: var(--color-ink-muted);
          margin-top: 4px;
        }

        .cart-page-item-remove {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--text-xs);
          letter-spacing: 0.04em;
          color: var(--color-ink-faint);
          cursor: pointer;
          margin-top: var(--space-2);
          transition: color var(--transition-base);
        }

        .cart-page-item-remove:hover {
          color: var(--color-error);
        }

        .cart-page-item-qty {
          display: flex;
          justify-content: center;
        }

        .cart-page-item-line-total {
          font-family: var(--font-serif);
          font-size: var(--text-lg);
          color: var(--color-ink);
          text-align: center;
        }

        /* Qty controls */
        .atc-qty {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid var(--color-border);
        }

        .atc-qty button {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
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
          width: 36px;
          text-align: center;
          font-size: var(--text-sm);
          color: var(--color-ink);
          border-inline: 1px solid var(--color-border);
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Summary */
        .cart-page-summary {
          position: sticky;
          top: calc(4rem + var(--space-4));
          border: 1px solid var(--color-border);
          padding: var(--space-6);
        }

        .cart-summary-heading {
          font-family: var(--font-serif);
          font-size: var(--text-xl);
          font-weight: 400;
          margin-bottom: var(--space-5);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--color-border);
        }

        .cart-summary-rows {
          display: flex;
          flex-direction: column;
          margin-bottom: var(--space-5);
        }

        .cart-summary-row {
          display: flex;
          justify-content: space-between;
          font-size: var(--text-sm);
          color: var(--color-ink-muted);
          padding-block: 0.5rem;
        }

        .cart-free-shipping-note {
          font-size: var(--text-xs);
          color: var(--color-accent);
          letter-spacing: 0.02em;
          margin-block: 0.2rem 0.5rem;
        }

        .cart-summary-total-row {
          font-family: var(--font-serif);
          font-size: var(--text-lg);
          color: var(--color-ink);
          font-weight: 400;
          border-top: 1px solid var(--color-border);
          margin-top: var(--space-2);
          padding-top: var(--space-2);
        }

        .cart-summary-cta {
          width: 100%;
          justify-content: center;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
          display: flex;
          align-items: center;
        }

        .cart-clear-btn {
          display: block;
          width: 100%;
          text-align: center;
          font-size: var(--text-xs);
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color: var(--color-ink-faint);
          cursor: pointer;
          transition: color var(--transition-base);
          padding: var(--space-2);
        }

        .cart-clear-btn:hover {
          color: var(--color-error);
        }

        @media (max-width: 900px) {
          .cart-page-layout {
            grid-template-columns: 1fr;
          }

          .cart-page-summary {
            position: static;
          }

          .cart-page-items-header {
            display: none;
          }

          .cart-page-item {
            grid-template-columns: 1fr auto auto;
          }
        }

        @media (max-width: 600px) {
          .cart-page-item {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default function CartPage() {
  return (
    <CartProvider>
      <CartPageInner />
    </CartProvider>
  );
}
