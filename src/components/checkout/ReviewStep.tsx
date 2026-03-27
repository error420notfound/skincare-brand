import type { CartItem } from '../cart/CartContext';

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

interface Props {
  shipping: ShippingData;
  payment: PaymentData;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  onBack: () => void;
  onConfirm: () => void;
}

export default function ReviewStep({
  shipping, payment, items, subtotal, shippingCost, total, onBack, onConfirm,
}: Props) {
  const maskedCard = '•••• •••• •••• ' + shipping.cardNumber?.slice(-4) ||
    '•••• •••• •••• ' + payment.cardNumber.replace(/\D/g, '').slice(-4);

  return (
    <div className="checkout-step">
      <h2 className="checkout-step-title">Review Your Order</h2>

      {/* Shipping summary */}
      <section className="review-section">
        <div className="review-section-header">
          <h3 className="review-section-title">Shipping to</h3>
          <button className="review-edit-btn" onClick={onBack} type="button">Edit</button>
        </div>
        <div className="review-section-body">
          <p className="review-detail">{shipping.firstName} {shipping.lastName}</p>
          <p className="review-detail">{shipping.address}{shipping.apartment ? `, ${shipping.apartment}` : ''}</p>
          <p className="review-detail">{shipping.city}, {shipping.postCode}</p>
          <p className="review-detail">{shipping.country}</p>
          <p className="review-detail review-detail--muted">{shipping.email}</p>
          <p className="review-detail-method">
            {shipping.method === 'express' ? 'Express Delivery (1–2 business days)' : 'Standard Delivery (3–5 business days)'}
          </p>
        </div>
      </section>

      {/* Payment summary */}
      <section className="review-section">
        <div className="review-section-header">
          <h3 className="review-section-title">Payment</h3>
        </div>
        <div className="review-section-body">
          <p className="review-detail">{payment.cardName}</p>
          <p className="review-detail review-detail--muted">
            Card ending {payment.cardNumber.replace(/\D/g, '').slice(-4)}
          </p>
        </div>
      </section>

      {/* Items */}
      <section className="review-section">
        <h3 className="review-section-title" style={{ marginBottom: '1rem' }}>Items</h3>
        <div className="review-items">
          {items.map((item) => (
            <div key={item.id} className="review-item">
              <div className="review-item-img">
                <img src={item.image} alt={item.name} width={56} height={70} />
              </div>
              <div className="review-item-info">
                <p className="review-item-name">{item.name}</p>
                {item.weight && <p className="review-item-weight">{item.weight}</p>}
                <p className="review-item-qty">Qty: {item.quantity}</p>
              </div>
              <p className="review-item-price">€{(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Totals */}
      <div className="review-totals">
        <div className="review-total-row">
          <span>Subtotal</span>
          <span>€{subtotal.toFixed(2)}</span>
        </div>
        <div className="review-total-row">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? 'Free' : `€${shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="review-total-row review-total-row--final">
          <span>Total</span>
          <span>€{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="checkout-step-actions">
        <button type="button" className="btn btn--ghost btn--md" onClick={onBack}>
          ← Back
        </button>
        <button type="button" className="btn btn--primary btn--lg" style={{ flex: 1 }} onClick={onConfirm}>
          Confirm Order
        </button>
      </div>

      <style>{`
        .checkout-step-title {
          font-family: var(--font-serif);
          font-size: var(--text-2xl);
          font-weight: 400;
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--color-border);
        }
        .review-section {
          margin-bottom: var(--space-6);
          padding-bottom: var(--space-6);
          border-bottom: 1px solid var(--color-border);
        }
        .review-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-3);
        }
        .review-section-title {
          font-family: var(--font-serif);
          font-size: var(--text-base);
          font-weight: 400;
          color: var(--color-ink);
        }
        .review-edit-btn {
          font-size: var(--text-xs);
          letter-spacing: var(--tracking-widest);
          text-transform: uppercase;
          color: var(--color-accent);
          cursor: pointer;
          transition: color var(--transition-base);
        }
        .review-edit-btn:hover { color: var(--color-ink); }
        .review-section-body { display: flex; flex-direction: column; gap: 4px; }
        .review-detail { font-size: var(--text-sm); color: var(--color-ink); font-weight: 300; }
        .review-detail--muted { color: var(--color-ink-muted); }
        .review-detail-method {
          font-size: var(--text-xs);
          color: var(--color-accent);
          letter-spacing: 0.02em;
          margin-top: var(--space-2);
        }
        .review-items { display: flex; flex-direction: column; gap: var(--space-3); }
        .review-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        .review-item-img {
          width: 56px;
          aspect-ratio: 4/5;
          background: var(--color-bg-alt);
          overflow: hidden;
          flex-shrink: 0;
        }
        .review-item-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .review-item-info { flex: 1; }
        .review-item-name { font-family: var(--font-serif); font-size: var(--text-sm); color: var(--color-ink); }
        .review-item-weight { font-size: var(--text-xs); color: var(--color-ink-faint); margin-top: 2px; }
        .review-item-qty { font-size: var(--text-xs); color: var(--color-ink-muted); margin-top: 2px; }
        .review-item-price { font-family: var(--font-serif); font-size: var(--text-base); color: var(--color-ink); }
        .review-totals {
          margin-bottom: var(--space-6);
          padding: var(--space-4);
          background: var(--color-bg-alt);
        }
        .review-total-row {
          display: flex;
          justify-content: space-between;
          font-size: var(--text-sm);
          color: var(--color-ink-muted);
          padding-block: 0.35rem;
        }
        .review-total-row--final {
          font-family: var(--font-serif);
          font-size: var(--text-lg);
          color: var(--color-ink);
          border-top: 1px solid var(--color-border);
          margin-top: var(--space-2);
          padding-top: var(--space-2);
        }
        .checkout-step-actions {
          display: flex;
          gap: var(--space-3);
          align-items: center;
          margin-top: var(--space-2);
        }
      `}</style>
    </div>
  );
}
