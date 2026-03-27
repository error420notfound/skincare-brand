import { useState } from 'react';
import { Lock } from 'lucide-react';

interface PaymentData {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

interface Props {
  onNext: (data: PaymentData) => void;
  onBack: () => void;
  defaultValues: PaymentData | null;
}

function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return digits.slice(0, 2) + ' / ' + digits.slice(2);
  return digits;
}

export default function PaymentStep({ onNext, onBack, defaultValues }: Props) {
  const [form, setForm] = useState<PaymentData>(defaultValues ?? {
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentData, string>>>({});

  const set = (key: keyof PaymentData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.cardName.trim()) e.cardName = 'Required';
    const digits = form.cardNumber.replace(/\D/g, '');
    if (digits.length < 16) e.cardNumber = 'Enter a valid 16-digit card number';
    const expiryDigits = form.expiry.replace(/\D/g, '');
    if (expiryDigits.length < 4) e.expiry = 'Enter a valid expiry date';
    if (!form.cvv || form.cvv.length < 3) e.cvv = 'Enter a valid CVV';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-step" noValidate>
      <h2 className="checkout-step-title">Payment Details</h2>

      <div className="payment-secure-notice">
        <Lock size={12} strokeWidth={1.5} />
        <span>This is a simulated checkout. No real payment is processed.</span>
      </div>

      <div className="form-field">
        <label className="form-label">Name on Card<span className="form-label-req" aria-hidden="true">*</span></label>
        <input
          className={`form-input ${errors.cardName ? 'form-input--error' : ''}`}
          value={form.cardName}
          onChange={(e) => set('cardName', e.target.value)}
          autoComplete="cc-name"
          placeholder="Margot Blanc"
        />
        {errors.cardName && <p className="form-error-msg">{errors.cardName}</p>}
      </div>

      <div className="form-field">
        <label className="form-label">Card Number<span className="form-label-req" aria-hidden="true">*</span></label>
        <input
          className={`form-input ${errors.cardNumber ? 'form-input--error' : ''}`}
          value={form.cardNumber}
          onChange={(e) => set('cardNumber', formatCardNumber(e.target.value))}
          autoComplete="cc-number"
          placeholder="4242 4242 4242 4242"
          inputMode="numeric"
        />
        {errors.cardNumber && <p className="form-error-msg">{errors.cardNumber}</p>}
      </div>

      <div className="form-row form-row--2">
        <div className="form-field">
          <label className="form-label">Expiry Date<span className="form-label-req" aria-hidden="true">*</span></label>
          <input
            className={`form-input ${errors.expiry ? 'form-input--error' : ''}`}
            value={form.expiry}
            onChange={(e) => set('expiry', formatExpiry(e.target.value))}
            autoComplete="cc-exp"
            placeholder="MM / YY"
            inputMode="numeric"
          />
          {errors.expiry && <p className="form-error-msg">{errors.expiry}</p>}
        </div>
        <div className="form-field">
          <label className="form-label">CVV<span className="form-label-req" aria-hidden="true">*</span></label>
          <input
            className={`form-input ${errors.cvv ? 'form-input--error' : ''}`}
            value={form.cvv}
            onChange={(e) => set('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
            autoComplete="cc-csc"
            placeholder="123"
            inputMode="numeric"
          />
          {errors.cvv && <p className="form-error-msg">{errors.cvv}</p>}
        </div>
      </div>

      <div className="checkout-step-actions">
        <button type="button" className="btn btn--ghost btn--md" onClick={onBack}>
          ← Back
        </button>
        <button type="submit" className="btn btn--primary btn--lg checkout-next-btn-inline">
          Review Order
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
        .payment-secure-notice {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-size: var(--text-xs);
          color: var(--color-ink-muted);
          letter-spacing: 0.03em;
          padding: var(--space-3) var(--space-4);
          background: var(--color-bg-alt);
          border: 1px solid var(--color-border);
          margin-bottom: var(--space-6);
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          margin-bottom: var(--space-4);
        }
        .form-row { display: grid; gap: var(--space-4); margin-bottom: var(--space-4); }
        .form-row--2 { grid-template-columns: 1fr 1fr; }
        .form-label {
          font-size: var(--text-xs);
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
          color: var(--color-ink-muted);
        }
        .form-label-req { color: var(--color-accent); margin-left: 2px; }
        .form-input {
          width: 100%;
          height: 48px;
          padding-inline: var(--space-3);
          border: 1px solid var(--color-border);
          background: var(--color-bg);
          font-family: var(--font-sans);
          font-size: var(--text-sm);
          color: var(--color-ink);
          font-weight: 300;
          transition: border-color var(--transition-base);
        }
        .form-input::placeholder { color: var(--color-ink-faint); }
        .form-input:focus { outline: none; border-color: var(--color-ink); }
        .form-input--error { border-color: var(--color-error); }
        .form-error-msg { font-size: var(--text-xs); color: var(--color-error); margin-top: 2px; }
        .checkout-step-actions {
          display: flex;
          gap: var(--space-3);
          align-items: center;
          margin-top: var(--space-6);
        }
        .checkout-next-btn-inline { flex: 1; justify-content: center; }
        @media (max-width: 600px) {
          .form-row--2 { grid-template-columns: 1fr; }
        }
      `}</style>
    </form>
  );
}
