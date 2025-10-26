import { useCart } from "../lib/cart/store";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Link } from "wouter";

export default function CartPage() {
  const { snapshot, remove, setQty, clear } = useCart();
  const snap = snapshot();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-8">
          <Link 
            href="/shop" 
            className="text-orange-500 hover:text-orange-400 mb-4 inline-block"
            data-testid="link-back-to-shop"
          >
            ← Back to Shop
          </Link>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            Shopping Cart
          </h1>
        </div>

        {snap.items.length === 0 ? (
          <div className="text-center py-20" data-testid="cart-page-empty">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-600 mb-6" />
            <p className="text-xl text-gray-400 mb-6">Your cart is empty.</p>
            <Link 
              href="/shop" 
              className="inline-block bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              data-testid="link-continue-shopping"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="py-4 px-6 text-left">Product</th>
                    <th className="py-4 px-6 text-center hidden sm:table-cell">Price</th>
                    <th className="py-4 px-6 text-center">Quantity</th>
                    <th className="py-4 px-6 text-center hidden sm:table-cell">Total</th>
                    <th className="py-4 px-6"></th>
                  </tr>
                </thead>
                <tbody>
                  {snap.items.map((i) => (
                    <tr key={i.id} className="border-t border-gray-700" data-testid={`cart-row-${i.id}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          {i.image ? (
                            <img src={i.image} alt={i.name} className="h-16 w-16 object-cover rounded-lg" />
                          ) : (
                            <div className="h-16 w-16 bg-gray-700 rounded-lg flex items-center justify-center">
                              <ShoppingCart className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                          <span className="font-medium">{i.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center hidden sm:table-cell">
                        <span className="text-orange-500 font-semibold">${i.price.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setQty(i.id, i.quantity - 1)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            aria-label="Decrease quantity"
                            data-testid={`button-decrease-quantity-${i.id}`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={i.quantity}
                            onChange={(e) => setQty(i.id, Number(e.target.value))}
                            className="w-20 rounded-lg bg-gray-700 border border-gray-600 px-3 py-2 text-center"
                            data-testid={`input-quantity-${i.id}`}
                          />
                          <button
                            onClick={() => setQty(i.id, i.quantity + 1)}
                            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                            aria-label="Increase quantity"
                            data-testid={`button-increase-quantity-${i.id}`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-semibold hidden sm:table-cell" data-testid={`cart-item-total-${i.id}`}>
                        ${(i.price * i.quantity).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => remove(i.id)} 
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          aria-label="Remove item"
                          data-testid={`button-remove-${i.id}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={clear} 
                  className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
                  data-testid="button-clear-cart"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear cart
                </button>
                <div className="text-right">
                  <div className="text-sm text-gray-400 mb-1">Subtotal</div>
                  <div className="text-3xl font-bold text-white" data-testid="cart-subtotal">
                    ${snap.subtotal.toFixed(2)}
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center rounded-lg bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 text-lg font-semibold transition-colors"
                data-testid="button-pay-now"
              >
                Proceed to Payment
              </Link>
              
              <p className="text-center text-sm text-gray-400 mt-4">
                🔒 Secure payment powered by Stripe
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
