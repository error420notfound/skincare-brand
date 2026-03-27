import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { CartProvider, useCart } from '../cart/CartContext';
import ShippingStep from './ShippingStep';
import PaymentStep from './PaymentStep';
import ReviewStep from './ReviewStep';

type Step = 'shipping' | 'payment' | 'review' | 'confirmed';

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  country: string;
  postCode: string;
  method: 'standard' | 'express';
}

interface PaymentData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const STEPS: { id: Step; label: string }[] = [
  { id: 'shipping', label: 'Shipping' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

function CheckoutFlowInner() {
  const { items, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>('shipping');
  const [shipping, setShipping] = useState<ShippingData | null>(null);
  const [payment, setPayment] = useState<PaymentData | null>(null);

  const shippingCost = shipping?.method === 'express' ? 24 : (subtotal > 150 ? 0 : 12);
  const total = subtotal + shippingCost;

  const currentIndex = STEPS.findIndex((s) => s.id === step);

  const handleConfirm = () => {
    clearCart();
    setStep('confirmed');
  };

  if (step === 'confirmed') {
    return (
      <motion.div
        className="checkout-confirmed"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="confirmed-icon">
          <Check size={28} strokeWidth={1.5} />
        </div>
        <h2 className="confirmed-title">Order Received</h2>
        <p className="confirmed-text">
          Thank you for your order. A confirmation has been sent to{' '}
          <strong>{shipping?.email}</strong>.
        </p>
        <p className="confirmed-sub">
          Your items will be packaged with care and dispatched within 2 business days.
          We do not rush this.
        </p>
        <div className="confirmed-order-ref">
          <span className="t-eyebrow">Order Reference</span>
          <span className="confirmed-ref-number">
            MC-{Math.random().toString(36).slice(2, 8).toUpperCase()}
          </span>
        </div>
        <a href="/" className="btn btn--secondary btn--lg" style={{ display: 'inline-flex', marginTop: '2rem' }}>
          Return to Maison Clair
        </a>

        <style>{`
          .checkout-confirmed {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: var(--space-12) var(--space-4);
          }
          .confirmed-icon {
            width: 64px;
            height: 64px;
            border: 1px solid var(--color-accent);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-accent);
            margin-bottom: var(--space-6);
          }
          .confirmed-title {
            font-family: var(--font-serif);
            font-size: var(--text-3xl);
            font-weight: 300;
            margin-bottom: var(--space-4);
          }
          .confirmed-text {
            font-size: var(--text-md);
            color: var(--color-ink-muted);
            margin-bottom: var(--space-3);
            max-width: 50ch;
          }
          .confirmed-sub {
            font-size: var(--text-sm);
            color: var(--color-ink-faint);
            font-style: italic;
            max-width: 48ch;
            margin-bottom: var(--space-6);
          }
          .confirmed-order-ref {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--space-1);
            padding: var(--space-4) var(--space-6);
            border: 1px solid var(--color-border);
          }
          .confirmed-ref-number {
            font-family: var(--font-serif);
            font-size: var(--text-xl);
            color: var(--color-ink);
            letter-spacing: 0.1em;
          }
        `}</style>
      </motion.div>
    );
  }

  return (
    <div className="checkout-layout">
      {/* Progress */}
      <div className="checkout-progress">
        {STEPS.map((s, i) => (
          <div key={s.id} className="checkout-progress-step">
            <div className={`checkout-step-indicator ${
              i < currentIndex ? 'checkout-step-indicator--done' :
              i === currentIndex ? 'checkout-step-indicator--active' : ''
            }`}>
              {i < currentIndex ? (
                <Check size={12} strokeWidth={2} />
              ) : (
                <span>{i + 1}</span>
              )}
            </div>
            <span className={`checkout-step-label ${i === currentIndex ? 'checkout-step-label--active' : ''}`}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`checkout-step-line ${i < currentIndex ? 'checkout-step-line--done' : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="checkout-main">
        <div className="checkout-form-area">
          <AnimatePresence mode="wait">
            {step === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4 }}
              >
                <ShippingStep
                  onNext={(data) => { setShipping(data); setStep('payment'); }}
                  defaultValues={shipping}
                />
              </motion.div>
            )}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4 }}
              >
                <PaymentStep
                  onNext={(data) => { setPayment(data); setStep('review'); }}
                  onBack={() => setStep('shipping')}
                  defaultValues={payment}
                />
              </motion.div>
            )}
            {step === 'review' && shipping && payment && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4 }}
              >
                <ReviewStep
                  shipping={shipping}
                  payment={payment}
                  items={items}
                  subtotal={subtotal}
                  shippingCost={shippingCost}
                  total={total}
                  onBack={() => setStep('payment')}
                  onConfirm={handleConfirm}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary sidebar */}
        <aside className="checkout-order-summary">
          <h3 className="checkout-summary-title">Order Summary</h3>
          <div className="checkout-summary-items">
            {items.map((item) => (
              <div key={item.id} className="checkout-summary-item">
                <div className="checkout-summary-item-img">
                  <img src={item.image} alt={item.name} width={60} height={75} />
                  <span className="checkout-summary-item-qty">{item.quantity}</span>
                </div>
                <div className="checkout-summary-item-info">
                  <p className="checkout-summary-item-name">{item.name}</p>
                  {item.weight && <p className="checkout-summary-item-weight">{item.weight}</p>}
                </div>
                <p className="checkout-summary-item-price">€{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="checkout-summary-totals">
            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `€${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="checkout-summary-row checkout-summary-total-row">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
        .checkout-layout {
          display: flex;
          flex-direction: column;
          gap: var(--space-10);
        }

        /* Progress bar */
        .checkout-progress {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          padding-block: var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }

        .checkout-progress-step {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .checkout-step-indicator {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--text-xs);
          color: var(--color-ink-faint);
          background: var(--color-bg);
          flex-shrink: 0;
          transition: all var(--transition-base);
        }

        .checkout-step-indicator--active {
          border-color: var(--color-ink);
          color: var(--color-ink);
        }

        .checkout-step-indicator--done {
          border-color: var(--color-accent);
          background: var(--color-accent);
          color: white;
        }

        .checkout-step-label {
          font-size: var(--text-xs);
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color: var(--color-ink-faint);
          transition: color var(--transition-base);
        }

        .checkout-step-label--active {
          color: var(--color-ink);
        }

        .checkout-step-line {
          width: 60px;
          height: 1px;
          background: var(--color-border);
          margin-inline: var(--space-2);
          transition: background var(--transition-base);
        }

        .checkout-step-line--done {
          background: var(--color-accent);
        }

        /* Main */
        .checkout-main {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: var(--space-12);
          align-items: start;
        }

        .checkout-form-area {
          min-height: 400px;
        }

        /* Summary sidebar */
        .checkout-order-summary {
          position: sticky;
          top: calc(4rem + var(--space-4));
          border: 1px solid var(--color-border);
          padding: var(--space-5);
        }

        .checkout-summary-title {
          font-family: var(--font-serif);
          font-size: var(--text-lg);
          font-weight: 400;
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--space-4);
        }

        .checkout-summary-items {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-bottom: var(--space-4);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--color-border);
        }

        .checkout-summary-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .checkout-summary-item-img {
          position: relative;
          width: 52px;
          aspect-ratio: 4/5;
          background: var(--color-bg-alt);
          overflow: hidden;
          flex-shrink: 0;
        }

        .checkout-summary-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .checkout-summary-item-qty {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--color-ink);
          color: white;
          font-size: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans);
        }

        .checkout-summary-item-info {
          flex: 1;
        }

        .checkout-summary-item-name {
          font-family: var(--font-serif);
          font-size: var(--text-sm);
          color: var(--color-ink);
          line-height: var(--leading-snug);
        }

        .checkout-summary-item-weight {
          font-size: var(--text-xs);
          color: var(--color-ink-faint);
          margin-top: 2px;
        }

        .checkout-summary-item-price {
          font-family: var(--font-serif);
          font-size: var(--text-base);
          color: var(--color-ink);
          flex-shrink: 0;
        }

        .checkout-summary-totals {
          display: flex;
          flex-direction: column;
        }

        .checkout-summary-row {
          display: flex;
          justify-content: space-between;
          font-size: var(--text-sm);
          color: var(--color-ink-muted);
          padding-block: 0.4rem;
        }

        .checkout-summary-total-row {
          font-family: var(--font-serif);
          font-size: var(--text-lg);
          color: var(--color-ink);
          border-top: 1px solid var(--color-border);
          margin-top: var(--space-2);
          padding-top: var(--space-2);
        }

        @media (max-width: 900px) {
          .checkout-main {
            grid-template-columns: 1fr;
          }
          .checkout-order-summary {
            position: static;
            order: -1;
          }
          .checkout-step-line {
            width: 32px;
          }
        }
      `}</style>
    </div>
  );
}

export default function CheckoutFlow() {
  return (
    <CartProvider>
      <CheckoutFlowInner />
    </CartProvider>
  );
}
