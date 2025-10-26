import { Link } from "wouter";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "../lib/cart/store";

export default function OrderConfirmation() {
  const { clear } = useCart();

  useEffect(() => {
    // Clear cart on successful order
    clear();
  }, [clear]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="mx-auto max-w-2xl p-6">
        <div className="text-center py-20" data-testid="order-confirmation-success">
          <div className="mb-8">
            <CheckCircle className="w-24 h-24 mx-auto text-green-500 mb-6" />
            <h1 className="text-4xl font-bold mb-4">Order Confirmed! 🎉</h1>
            <p className="text-xl text-gray-300 mb-2">
              Thank you for your purchase!
            </p>
            <p className="text-gray-400">
              You'll receive an email confirmation shortly.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-8 mb-8">
            <Package className="w-16 h-16 mx-auto text-orange-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-3">What's Next?</h2>
            <div className="text-left space-y-3 max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <p className="text-gray-300">
                  Check your email for order confirmation and tracking details
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <p className="text-gray-300">
                  Your items will be shipped within 2-3 business days
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                <p className="text-gray-300">
                  Track your order status in your account
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg font-semibold transition-colors"
              data-testid="link-continue-shopping"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-block border border-gray-600 hover:bg-gray-800 px-8 py-3 rounded-lg font-semibold transition-colors"
              data-testid="link-home"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
