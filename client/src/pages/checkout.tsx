import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";
import { useCart } from "../lib/cart/store";
import { Link, useLocation } from "wouter";
import { ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { clear } = useCart();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Clear cart after successful payment
      clear();
      toast({
        title: "Payment Successful! 🎉",
        description: "Thank you for your purchase!",
      });
      setLocation("/order-confirmation");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="checkout-form">
      <div className="bg-gray-800 rounded-lg p-6">
        <PaymentElement />
      </div>
      <button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full rounded-lg bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-4 text-lg font-semibold transition-colors flex items-center justify-center gap-2"
        data-testid="button-submit-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Pay Now
          </>
        )}
      </button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const { snapshot } = useCart();
  const snap = snapshot();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    if (snap.subtotal > 0) {
      apiRequest("POST", "/api/create-shop-payment-intent", { 
        items: snap.items 
      })
        .then((res: Response) => res.json())
        .then((data: any) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else if (data.message) {
            setError(data.message);
          }
        })
        .catch((err: Error) => {
          setError(err.message || "Failed to initialize payment");
        });
    }
  }, []);

  if (snap.subtotal === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="mx-auto max-w-2xl p-6">
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-600 mb-6" />
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-400 mb-6">Add some items to your cart before checking out.</p>
            <Link 
              href="/shop" 
              className="inline-block bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              data-testid="link-back-to-shop"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="mx-auto max-w-2xl p-6">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Payment Error</h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link 
              href="/cart" 
              className="inline-block bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!clientSecret) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-600" />
            <p className="text-gray-400">Initializing secure payment...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="mx-auto max-w-2xl p-6">
        <div className="mb-8">
          <Link 
            href="/cart" 
            className="text-orange-500 hover:text-orange-400 mb-4 inline-flex items-center gap-2"
            data-testid="link-back-to-cart"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold mt-4">Secure Checkout</h1>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {snap.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-300">
                  {item.name} x {item.quantity}
                </span>
                <span className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-700 pt-3 mt-3 flex justify-between text-lg">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-orange-500" data-testid="checkout-total">
                ${snap.subtotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm />
        </Elements>

        <p className="text-center text-sm text-gray-400 mt-6">
          🔒 Secure payment powered by Stripe
        </p>
      </div>
    </main>
  );
}
