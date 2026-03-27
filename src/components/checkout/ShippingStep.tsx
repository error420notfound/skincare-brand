import { useState } from 'react';

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

interface Props {
  onNext: (data: ShippingData) => void;
  defaultValues: ShippingData | null;
}

const COUNTRIES = [
  'United Kingdom', 'France', 'Germany', 'Netherlands', 'Belgium',
  'Switzerland', 'Austria', 'Italy', 'Spain', 'United States', 'Canada',
  'Australia', 'Japan', 'South Korea', 'Singapore',
];

export default function ShippingStep({ onNext, defaultValues }: Props) {
  const [form, setForm] = useState<ShippingData>(defaultValues ?? {
    firstName: '', lastName: '', email: '', phone: '',
    address: '', apartment: '', city: '', country: 'United Kingdom',
    postCode: '', method: 'standard',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingData, string>>>({});

  const set = (key: keyof ShippingData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.postCode.trim()) e.postCode = 'Required';
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
      <h2 className="checkout-step-title">Shipping Information</h2>

      <div className="form-row form-row--2">
        <FormField label="First Name" error={errors.firstName} required>
          <input className={`form-input ${errors.firstName ? 'form-input--error' : ''}`}
            value={form.firstName} onChange={(e) => set('firstName', e.target.value)}
            autoComplete="given-name" placeholder="Margot" />
        </FormField>
        <FormField label="Last Name" error={errors.lastName} required>
          <input className={`form-input ${errors.lastName ? 'form-input--error' : ''}`}
            value={form.lastName} onChange={(e) => set('lastName', e.target.value)}
            autoComplete="family-name" placeholder="Blanc" />
        </FormField>
      </div>

      <div className="form-row form-row--2">
        <FormField label="Email Address" error={errors.email} required>
          <input type="email" className={`form-input ${errors.email ? 'form-input--error' : ''}`}
            value={form.email} onChange={(e) => set('email', e.target.value)}
            autoComplete="email" placeholder="margot@example.com" />
        </FormField>
        <FormField label="Phone" error={errors.phone}>
          <input type="tel" className="form-input"
            value={form.phone} onChange={(e) => set('phone', e.target.value)}
            autoComplete="tel" placeholder="+44 7700 900000" />
        </FormField>
      </div>

      <FormField label="Street Address" error={errors.address} required>
        <input className={`form-input ${errors.address ? 'form-input--error' : ''}`}
          value={form.address} onChange={(e) => set('address', e.target.value)}
          autoComplete="address-line1" placeholder="14 Chemin des Vignes" />
      </FormField>

      <FormField label="Apartment, Suite, etc." error={errors.apartment}>
        <input className="form-input"
          value={form.apartment} onChange={(e) => set('apartment', e.target.value)}
          autoComplete="address-line2" placeholder="Optional" />
      </FormField>

      <div className="form-row form-row--3">
        <FormField label="City" error={errors.city} required>
          <input className={`form-input ${errors.city ? 'form-input--error' : ''}`}
            value={form.city} onChange={(e) => set('city', e.target.value)}
            autoComplete="address-level2" placeholder="Lausanne" />
        </FormField>
        <FormField label="Post Code" error={errors.postCode} required>
          <input className={`form-input ${errors.postCode ? 'form-input--error' : ''}`}
            value={form.postCode} onChange={(e) => set('postCode', e.target.value)}
            autoComplete="postal-code" placeholder="SW1A 1AA" />
        </FormField>
        <FormField label="Country" error={errors.country} required>
          <select className="form-input form-select"
            value={form.country} onChange={(e) => set('country', e.target.value)}>
            {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </FormField>
      </div>

      {/* Shipping method */}
      <div className="form-section">
        <p className="form-section-label t-eyebrow">Shipping Method</p>
        <div className="shipping-methods">
          {([
            { id: 'standard', label: 'Standard Delivery', time: '3–5 business days', price: 'Free over €150, else €12' },
            { id: 'express', label: 'Express Delivery', time: '1–2 business days', price: '€24' },
          ] as const).map((method) => (
            <label key={method.id} className={`shipping-method ${form.method === method.id ? 'shipping-method--active' : ''}`}>
              <input
                type="radio"
                name="shipping-method"
                value={method.id}
                checked={form.method === method.id}
                onChange={() => set('method', method.id)}
                className="sr-only"
              />
              <div className="shipping-method-radio" />
              <div className="shipping-method-info">
                <span className="shipping-method-name">{method.label}</span>
                <span className="shipping-method-time">{method.time}</span>
              </div>
              <span className="shipping-method-price">{method.price}</span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn--primary btn--lg checkout-next-btn">
        Continue to Payment
      </button>

      <style>{`
        .checkout-step-title {
          font-family: var(--font-serif);
          font-size: var(--text-2xl);
          font-weight: 400;
          margin-bottom: var(--space-8);
          padding-bottom: var(--space-4);
          border-bottom: 1px solid var(--color-border);
        }
        .form-row {
          display: grid;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
        }
        .form-row--2 { grid-template-columns: 1fr 1fr; }
        .form-row--3 { grid-template-columns: 1fr 1fr 1fr; }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          margin-bottom: var(--space-4);
        }
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
          appearance: none;
          -webkit-appearance: none;
        }
        .form-input::placeholder { color: var(--color-ink-faint); }
        .form-input:focus { outline: none; border-color: var(--color-ink); }
        .form-input--error { border-color: var(--color-error); }
        .form-select { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6560' stroke-width='1.5'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; padding-right: 2.5rem; }
        .form-error-msg { font-size: var(--text-xs); color: var(--color-error); margin-top: 2px; }
        .form-section { margin-bottom: var(--space-6); }
        .form-section-label { margin-bottom: var(--space-3); display: block; }
        .shipping-methods { display: flex; flex-direction: column; gap: var(--space-2); }
        .shipping-method {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border: 1px solid var(--color-border);
          cursor: pointer;
          transition: border-color var(--transition-base);
        }
        .shipping-method--active { border-color: var(--color-ink); }
        .shipping-method-radio {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          flex-shrink: 0;
          position: relative;
          transition: border-color var(--transition-base);
        }
        .shipping-method--active .shipping-method-radio {
          border-color: var(--color-ink);
        }
        .shipping-method--active .shipping-method-radio::after {
          content: '';
          position: absolute;
          inset: 3px;
          border-radius: 50%;
          background: var(--color-ink);
        }
        .shipping-method-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .shipping-method-name { font-size: var(--text-sm); color: var(--color-ink); }
        .shipping-method-time { font-size: var(--text-xs); color: var(--color-ink-muted); }
        .shipping-method-price { font-size: var(--text-sm); color: var(--color-ink-muted); white-space: nowrap; }
        .checkout-next-btn { width: 100%; justify-content: center; margin-top: var(--space-6); }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
        @media (max-width: 600px) {
          .form-row--2, .form-row--3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </form>
  );
}

function FormField({ label, error, required, children }: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="form-field">
      <label className="form-label">
        {label}{required && <span className="form-label-req" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <p className="form-error-msg" role="alert">{error}</p>}
    </div>
  );
}
