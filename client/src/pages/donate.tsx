import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import Navigation from "../components/Navigation";
import { ArrowLeft, DollarSign, Heart, Users, Zap } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { trackDonation, trackButtonClick, trackPageView } from "../lib/analytics";
import { env } from '../config/env';

const stripePromise = loadStripe(env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface DonateFormProps {
  amount: number;
}

const DonateForm = ({ amount }: DonateFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [donorName, setDonorName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!donorName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your first name to be recognized as a supporter.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate?success=true&name=${encodeURIComponent(donorName)}`,
        },
        redirect: "if_required"
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Record the donation
        try {
          await fetch('/api/record-donation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              firstName: donorName.trim()
            })
          });
        } catch (recordError) {
          console.error('Failed to record donation:', recordError);
        }

        toast({
          title: "Thank You! 🎉",
          description: "Your donation was successful. You're helping build the future of skateboarding!",
        });
        
        // Redirect to success page
        window.location.href = `${window.location.origin}/donate?success=true`;
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred during payment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="donor-name" className="text-sm font-medium text-[#fafafa]">
          First Name (for recognition)
        </label>
        <input
          id="donor-name"
          type="text"
          placeholder="Enter your first name"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          className="w-full px-3 py-2 bg-[#232323] border border-[#333] rounded-md text-[#fafafa] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <p className="text-xs text-gray-400">
          Your first name will be displayed on our supporter recognition banner
        </p>
      </div>
      <PaymentElement className="bg-white rounded-lg p-4" />
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 text-lg rounded-lg shadow-lg transition-all transform hover:scale-105"
        data-testid="button-submit-payment"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Processing...
          </div>
        ) : (
          `💳 Donate $${amount}`
        )}
      </Button>
    </form>
  );
};

export default function Donate() {
  const [, setLocation] = useLocation();
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const { toast } = useToast();

  // Track page view and check for success parameter
  useEffect(() => {
    trackPageView('Donation Page');
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Thank You! 🎉",
        description: "Your donation was successful. You're helping build the future of skateboarding!",
      });
    }
  }, [toast]);

  // Simple donation amounts
  const donationAmounts = [10, 25, 50, 100];

  const handleAmountSelect = (amount: number) => {
    trackButtonClick(`donation_amount_${amount}`, 'donation_page');
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1) {
      setSelectedAmount(numValue);
      setCustomAmount(value);
    }
  };

  const createPaymentIntent = async () => {
    // Track donation initiation
    trackDonation(selectedAmount, 'stripe');
    
    if (selectedAmount < 1) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount of at least $1.00",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingPayment(true);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedAmount,
          currency: 'usd',
          description: `SkateHubba Support - $${selectedAmount}`
        })
      });

      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "Payment Setup Failed",
        description: "Unable to set up payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingPayment(false);
    }
  };

  return (
    <div className="min-h-screen" style={{
      backgroundImage: `url('/attached_assets/graffwallskateboardrack_1754296307132.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      backgroundAttachment: 'fixed'
    }}>
      <Navigation />
      <div className="min-h-screen">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 bg-transparent">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Support SkateHubba</h1>
              <p className="text-gray-200">Help us build the future of skateboarding</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
            {/* Mission Card */}
            <Card className="bg-black/30 border-orange-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-3">
                  <Heart className="w-6 h-6 text-orange-400" />
                  Support Our Mission
                </CardTitle>
                <CardDescription className="text-gray-200 text-lg">
                  Help us create the ultimate skateboarding platform that connects skaters worldwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center">
                    <div className="p-3 bg-orange-400/20 rounded-lg inline-flex items-center justify-center mb-2">
                      <Users className="w-6 h-6 text-orange-400" />
                    </div>
                    <h4 className="text-white font-semibold">Community</h4>
                    <p className="text-sm text-gray-200">Build connections between skaters globally</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-orange-400/20 rounded-lg inline-flex items-center justify-center mb-2">
                      <Zap className="w-6 h-6 text-orange-400" />
                    </div>
                    <h4 className="text-white font-semibold">Innovation</h4>
                    <p className="text-sm text-gray-200">Cutting-edge features and technology</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-orange-400/20 rounded-lg inline-flex items-center justify-center mb-2">
                      <DollarSign className="w-6 h-6 text-orange-400" />
                    </div>
                    <h4 className="text-white font-semibold">Sustainability</h4>
                    <p className="text-sm text-gray-200">Keep the platform free and accessible</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donation Form */}
            <Card className="bg-black/30 border-orange-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Choose Your Support Level</CardTitle>
                <CardDescription className="text-gray-200">
                  Every contribution helps us build amazing features for the skate community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!clientSecret ? (
                  <>
                    {/* Amount Selection */}
                    <div className="space-y-3">
                      <Label className="text-white text-base">Select Amount</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        {donationAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant={selectedAmount === amount ? "default" : "outline"}
                            onClick={() => handleAmountSelect(amount)}
                            className={`h-12 sm:h-14 text-base sm:text-lg font-semibold rounded-lg transition-all ${
                              selectedAmount === amount
                                ? "bg-orange-500 text-white hover:bg-orange-600 ring-2 ring-orange-300"
                                : "bg-white/20 border-orange-400/50 text-white hover:bg-white/30 hover:border-orange-400"
                            }`}
                            data-testid={`button-amount-${amount}`}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="custom-amount" className="text-white text-base">
                        Or Enter Custom Amount
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="custom-amount"
                          type="number"
                          min="1"
                          step="0.01"
                          placeholder="25.00"
                          value={customAmount}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          className="pl-8 sm:pl-10 bg-white/20 border-orange-400/50 text-white placeholder-gray-300 h-10 sm:h-12 text-base sm:text-lg"
                          data-testid="input-custom-amount"
                        />
                      </div>
                    </div>

                    {/* Payment Button */}
                    <div className="space-y-4">
                      <Button
                        onClick={createPaymentIntent}
                        disabled={isCreatingPayment || selectedAmount < 1}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-lg shadow-lg transition-all transform hover:scale-105"
                        data-testid="button-proceed-to-payment"
                      >
                        {isCreatingPayment ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Setting up payment...
                          </div>
                        ) : (
                          `💳 Donate $${selectedAmount} with Card`
                        )}
                      </Button>
                    </div>

                    {/* Alternative Options */}
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-400/30">
                      <h4 className="text-green-400 font-semibold mb-3">Alternative Options</h4>
                      <div className="space-y-2">
                        <a
                          href="https://gofund.me/4d6b7234"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base"
                        >
                          🎯 GoFundMe
                        </a>
                        <p className="text-sm text-gray-300">
                          Or send directly to <strong className="text-green-400">$SkateHubbaApp</strong> via CashApp
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center space-y-2">
                      <Badge className="bg-orange-400/20 text-orange-400 border-orange-400/30">
                        Secure Payment
                      </Badge>
                      <p className="text-gray-300 mt-2">Complete your secure payment below</p>
                    </div>

                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <DonateForm amount={selectedAmount} />
                    </Elements>

                    <div className="text-center">
                      <Button
                        variant="outline"
                        onClick={() => setClientSecret('')}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        data-testid="button-change-amount"
                      >
                        Change Amount
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Donate Option */}
            <Card className="bg-black/30 border-orange-400/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-center">Quick Donate</CardTitle>
                <CardDescription className="text-gray-200 text-center">
                  Skip the form and donate any amount instantly
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <a 
                  href="https://buy.stripe.com/9B63cu9AngM80LV4ntfMA01" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackButtonClick('quick_donate_stripe', 'donation_page')}
                  className="inline-block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 sm:py-4 text-base sm:text-lg rounded-lg shadow-lg transition-all transform hover:scale-105"
                  data-testid="button-quick-donate"
                >
                  💚 Donate Any Amount
                </a>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="bg-black/30 border-orange-400/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-400">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Secure</Badge>
                    <span className="text-sm">Payments powered by Stripe</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    <p>🔒 Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}