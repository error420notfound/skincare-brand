import { ShoppingBag } from 'lucide-react';
import { CartProvider, useCart } from './CartContext';
import CartDrawer from './CartDrawer';

function CartIconInner() {
  const { itemCount, openCart, isOpen, closeCart } = useCart();

  return (
    <>
      <button
        className="cart-icon-btn"
        onClick={openCart}
        aria-label={`Cart — ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
      >
        <ShoppingBag size={18} strokeWidth={1.5} />
        {itemCount > 0 && (
          <span className="cart-count">{itemCount}</span>
        )}
      </button>
      <CartDrawer />
    </>
  );
}

export default function CartIcon() {
  return (
    <CartProvider>
      <CartIconInner />
      <style>{`
        .cart-icon-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          color: var(--color-ink);
          cursor: pointer;
          border: none;
          background: none;
          transition: color var(--transition-base);
        }
        .cart-icon-btn:hover {
          color: var(--color-accent);
        }
        .cart-count {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--color-accent);
          color: white;
          font-size: 9px;
          font-family: var(--font-sans);
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
      `}</style>
    </CartProvider>
  );
}
