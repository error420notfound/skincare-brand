import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from './CartContext';

export default function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, closeCart, updateQty, removeItem } = useCart();

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeCart]);

  const shipping = subtotal > 150 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="cart-drawer-header">
              <h2 className="cart-drawer-title">
                Cart
                {itemCount > 0 && <span className="cart-drawer-count">({itemCount})</span>}
              </h2>
              <button
                onClick={closeCart}
                className="cart-drawer-close"
                aria-label="Close cart"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="cart-drawer-body">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <p className="cart-empty-text">Your cart is empty.</p>
                  <a href="/collections/facial-care" className="btn btn--secondary btn--sm" onClick={closeCart}>
                    Explore Products
                  </a>
                </div>
              ) : (
                <ul className="cart-items">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        className="cart-item"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        transition={{ duration: 0.35 }}
                      >
                        <div className="cart-item-img">
                          <img src={item.image} alt={item.name} width={80} height={100} />
                        </div>
                        <div className="cart-item-info">
                          <div className="cart-item-top">
                            <div>
                              <p className="cart-item-name">{item.name}</p>
                              {item.weight && (
                                <p className="cart-item-weight">{item.weight}</p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="cart-item-remove"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={14} strokeWidth={1.5} />
                            </button>
                          </div>
                          <div className="cart-item-bottom">
                            <div className="cart-item-qty">
                              <button
                                onClick={() => updateQty(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} strokeWidth={2} />
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() => updateQty(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} strokeWidth={2} />
                              </button>
                            </div>
                            <p className="cart-item-price">€{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="cart-drawer-footer">
                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="cart-shipping-note">
                      Free shipping on orders over €150
                    </p>
                  )}
                  <div className="cart-summary-row cart-summary-total">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
                <a href="/checkout" className="btn btn--primary btn--lg cart-checkout-btn" onClick={closeCart}>
                  Proceed to Checkout
                </a>
                <a href="/cart" className="cart-view-link link-underline" onClick={closeCart}>
                  View full cart
                </a>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
