import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "../lib/cart/store";
import { ShoppingCart, ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Load Stripe outside component to avoid recreating on every render
// Handle missing key gracefully instead of throwing
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { clear } = useCart();
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
        return_url: `${window.location.origin}/shop?payment=success`,
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
      // Clear cart on successful payment
      clear();
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase! 🛹",
      });
      setLocation('/shop?payment=success');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <PaymentElement />
      </div>
      
      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-6 text-lg"
        data-testid="button-submit-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Pay Now
          </>
        )}
      </Button>

      <p className="text-center text-sm text-gray-400">
        Secure payment powered by Stripe 🔒
      </p>
    </form>
  );
};

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { snapshot } = useCart();
  const snap = snapshot();
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Stripe is configured
    if (!stripePromise) {
      toast({
        title: "Payment service unavailable",
        description: "Stripe is not configured. Please contact support.",
        variant: "destructive",
      });
      setLocation('/cart');
      return;
    }

    // Redirect to cart if empty
    if (snap.items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out.",
        variant: "destructive",
      });
      setLocation('/cart');
      return;
    }

    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async (retryCount = 0) => {
      try {
        // Convert dollars to cents (Stripe requires integer cents)
        const amountInCents = Math.round(snap.subtotal * 100);
        
        const response = await apiRequest("POST", "/api/create-payment-intent", {
          amount: amountInCents,
          currency: "usd",
          description: `SkateHubba Shop - ${snap.items.length} item(s)`
        });
        
        const data = await response.json();
        
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error('No client secret received');
        }
      } catch (error: any) {
        // Retry once before giving up
        if (retryCount < 1) {
          setTimeout(() => createPaymentIntent(retryCount + 1), 1000);
          return;
        }
        
        toast({
          title: "Payment Setup Failed",
          description: error.message || "Unable to initialize payment. Please try again later.",
          variant: "destructive",
        });
        setLocation('/cart');
      } finally {
        if (retryCount === 0 || retryCount >= 1) {
          setIsLoading(false);
        }
      }
    };

    createPaymentIntent();
  }, [snap.items.length, snap.subtotal, setLocation, toast]);

  if (isLoading || !clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Setting up secure checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="mx-auto max-w-3xl p-6">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/cart')}
            className="text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 mb-4"
            data-testid="button-back-to-cart"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CreditCard className="w-8 h-8" />
            Secure Checkout
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Summary */}
          <Card className="bg-gray-800 border-gray-700 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Order Summary</CardTitle>
              <CardDescription className="text-gray-400">
                {snap.items.length} item{snap.items.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {snap.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm" data-testid={`checkout-item-${item.id}`}>
                  <div className="flex-1">
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-orange-500 font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              
              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">Subtotal</p>
                  <p className="text-white font-semibold">${snap.subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-400">Shipping</p>
                  <p className="text-white font-semibold">Free</p>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                  <p className="text-white font-bold text-lg">Total</p>
                  <p className="text-orange-500 font-bold text-xl" data-testid="checkout-total">
                    ${snap.subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Payment Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Complete your purchase securely
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm />
                </Elements>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
