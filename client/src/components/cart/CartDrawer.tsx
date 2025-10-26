import { useEffect, useRef, useState } from "react";
import { useCart } from "../../lib/cart/store";
import { ShoppingCart, X, Minus, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function CartDrawer() {
  const { snapshot, remove, setQty, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const snap = snapshot();

  useEffect(() => {
    function onEsc(e: KeyboardEvent) { 
      if (e.key === "Escape") setOpen(false); 
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const goToCheckout = () => {
    setOpen(false);
    setLocation("/cart");
  };

  return (
    <>
      <button
        aria-label="Open cart"
        onClick={() => setOpen(true)}
        data-testid="button-open-cart"
        className="relative inline-flex items-center gap-2 rounded-lg border border-orange-600 px-4 py-2 hover:bg-orange-600/10 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="hidden sm:inline">Cart</span>
        {snap.count > 0 && (
          <span 
            className="absolute -top-2 -right-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-orange-600 text-white text-xs font-bold px-1.5"
            data-testid="cart-badge-count"
          >
            {snap.count}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
            data-testid="cart-drawer-overlay"
          />
          <div
            ref={panelRef}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 shadow-xl p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            data-testid="cart-drawer"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                Your Cart
              </h2>
              <button 
                onClick={() => setOpen(false)} 
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close cart"
                data-testid="button-close-cart-drawer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {snap.items.length === 0 ? (
              <div className="text-center py-12" data-testid="cart-drawer-empty">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">Your cart is empty.</p>
              </div>
            ) : (
              <>
                <ul className="space-y-4 mb-6">
                  {snap.items.map((i) => (
                    <li key={i.id} className="flex gap-4 bg-gray-800 p-4 rounded-lg" data-testid={`cart-item-${i.id}`}>
                      {i.image ? (
                        <img src={i.image} alt={i.name} className="h-20 w-20 object-cover rounded-lg" />
                      ) : (
                        <div className="h-20 w-20 bg-gray-700 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-white">{i.name}</p>
                          <button 
                            onClick={() => remove(i.id)} 
                            className="text-sm text-red-500 hover:text-red-400 transition-colors"
                            data-testid={`button-remove-${i.id}`}
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-sm text-orange-500 font-semibold mb-3">${i.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setQty(i.id, i.quantity - 1)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            aria-label="Decrease quantity"
                            data-testid={`button-decrease-quantity-${i.id}`}
                          >
                            <Minus className="w-4 h-4 text-white" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={i.quantity}
                            onChange={(e) => setQty(i.id, Number(e.target.value))}
                            className="w-16 rounded-lg bg-gray-700 border border-gray-600 px-3 py-1.5 text-sm text-white text-center"
                            data-testid={`input-quantity-${i.id}`}
                          />
                          <button
                            onClick={() => setQty(i.id, i.quantity + 1)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            aria-label="Increase quantity"
                            data-testid={`button-increase-quantity-${i.id}`}
                          >
                            <Plus className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-lg mb-6">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-bold text-white" data-testid="cart-drawer-subtotal">${snap.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={clear} 
                      className="flex-1 rounded-lg border border-gray-600 px-4 py-3 hover:bg-gray-800 transition-colors text-white"
                      data-testid="button-clear-cart"
                    >
                      Clear
                    </button>
                    <button
                      onClick={goToCheckout}
                      className="flex-[2] text-center rounded-lg bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 font-semibold transition-colors"
                      data-testid="button-checkout"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
