import { useState, useEffect } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, DollarSign, Heart, Users, Zap, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface DonateFormProps {
  amount: number;
}

const DonateForm = ({ amount }: DonateFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate?success=true`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
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
      <PaymentElement className="bg-white rounded-lg p-4" />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full bg-orange-400 text-black hover:bg-orange-500 font-semibold py-3"
        data-testid="button-submit-payment"
      >
        {isLoading ? 'Processing...' : `Donate $${amount}`}
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
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { toast } = useToast();

  // Your actual crypto wallet addresses for receiving donations
  const cryptoAddresses = {
    bitcoin: 'YOUR_ACTUAL_BITCOIN_ADDRESS_HERE',
    ethereum: 'YOUR_ACTUAL_ETHEREUM_ADDRESS_HERE',
    usdc: 'YOUR_ACTUAL_USDC_ADDRESS_HERE',
    solana: 'YOUR_ACTUAL_SOLANA_ADDRESS_HERE'
  };

  // Check for success parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Thank You! 🎉",
        description: "Your donation was successful. You're helping build the future of skateboarding!",
      });
    }
  }, [toast]);

  // Predefined donation amounts
  const donationAmounts = [5, 10, 25, 50, 100, 250];

  const handleAmountSelect = (amount: number) => {
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

  const copyToClipboard = async (address: string, currency: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(currency);
      toast({
        title: "Address Copied! 📋",
        description: `${currency.toUpperCase()} address copied to clipboard`,
      });
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the address",
        variant: "destructive",
      });
    }
  };

  const createPaymentIntent = async () => {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedAmount,
          description: `SkateHubba Support Donation - $${selectedAmount}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Payment creation failed:', error);
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
    <div className="min-h-screen bg-[#181818]" style={{
      backgroundImage: `url('/attached_assets/graffwallskateboardrack_1754296307132.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="min-h-screen bg-black/70">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="text-[#fafafa] hover:text-orange-400"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-[#fafafa]">Support SkateHubba</h1>
              <p className="text-gray-300">Help us build the future of skateboarding</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {/* Mission Card */}
            <Card className="bg-black/60 border-gray-600 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#fafafa] text-2xl flex items-center gap-3">
                  <Heart className="w-6 h-6 text-orange-400" />
                  Support Our Mission
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg">
                  Help us create the ultimate skateboarding platform that connects skaters worldwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="p-3 bg-orange-400/20 rounded-lg inline-flex items-center justify-center mb-2">
                      <Users className="w-6 h-6 text-orange-400" />
                    </div>
                    <h4 className="text-[#fafafa] font-semibold">Community</h4>
                    <p className="text-sm text-gray-300">Build connections between skaters globally</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-orange-400/20 rounded-lg inline-flex items-center justify-center mb-2">
                      <Zap className="w-6 h-6 text-orange-400" />
                    </div>
                    <h4 className="text-[#fafafa] font-semibold">Innovation</h4>
                    <p className="text-sm text-gray-300">Cutting-edge features and technology</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-orange-400/20 rounded-lg inline-flex items-center justify-center mb-2">
                      <DollarSign className="w-6 h-6 text-orange-400" />
                    </div>
                    <h4 className="text-[#fafafa] font-semibold">Sustainability</h4>
                    <p className="text-sm text-gray-300">Keep the platform free and accessible</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Donation Form */}
            <Card className="bg-black/60 border-gray-600 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#fafafa]">Choose Your Support Level</CardTitle>
                <CardDescription className="text-gray-300">
                  Every contribution helps us build amazing features for the skate community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!clientSecret ? (
                  <>
                    {/* Amount Selection */}
                    <div className="space-y-4">
                      <Label className="text-[#fafafa] text-base">Select Amount</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {donationAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant={selectedAmount === amount ? "default" : "outline"}
                            onClick={() => handleAmountSelect(amount)}
                            className={
                              selectedAmount === amount
                                ? "bg-orange-400 text-black hover:bg-orange-500"
                                : "border-gray-600 text-[#fafafa] hover:bg-gray-700"
                            }
                            data-testid={`button-amount-${amount}`}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="custom-amount" className="text-[#fafafa]">
                        Or enter custom amount
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
                          className="pl-10 bg-gray-800 border-gray-600 text-[#fafafa] placeholder-gray-400"
                          data-testid="input-custom-amount"
                        />
                      </div>
                    </div>

                    {/* Impact Information */}
                    <div className="p-4 bg-orange-400/10 rounded-lg border border-orange-400/30">
                      <h4 className="text-orange-400 font-semibold mb-2">Your Impact</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        {selectedAmount >= 250 && (
                          <p>🏆 Major Contributor - Help fund major feature development</p>
                        )}
                        {selectedAmount >= 100 && selectedAmount < 250 && (
                          <p>🚀 Feature Supporter - Support new interactive features</p>
                        )}
                        {selectedAmount >= 50 && selectedAmount < 100 && (
                          <p>🛹 Community Builder - Help grow the skater network</p>
                        )}
                        {selectedAmount >= 25 && selectedAmount < 50 && (
                          <p>⚡ Platform Supporter - Keep servers running smoothly</p>
                        )}
                        {selectedAmount >= 10 && selectedAmount < 25 && (
                          <p>💪 Contributor - Support daily operations</p>
                        )}
                        {selectedAmount >= 1 && selectedAmount < 10 && (
                          <p>❤️ Supporter - Every bit helps!</p>
                        )}
                      </div>
                    </div>

                    {/* Payment Method Selection */}
                    <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'crypto')} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                        <TabsTrigger value="card" className="data-[state=active]:bg-orange-400 data-[state=active]:text-black">
                          💳 Card Payment
                        </TabsTrigger>
                        <TabsTrigger value="crypto" className="data-[state=active]:bg-orange-400 data-[state=active]:text-black">
                          ₿ Cryptocurrency
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="card" className="space-y-4">
                        <Button
                          onClick={createPaymentIntent}
                          disabled={isCreatingPayment || selectedAmount < 1}
                          className="w-full bg-orange-400 text-black hover:bg-orange-500 font-semibold py-3"
                          data-testid="button-proceed-to-payment"
                        >
                          {isCreatingPayment ? 'Setting up payment...' : `Proceed to Card Payment - $${selectedAmount}`}
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="crypto" className="space-y-4">
                        <div className="text-center mb-4">
                          <p className="text-gray-300 text-sm">
                            Send any amount to one of our crypto addresses below:
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Bitcoin */}
                          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-orange-400 text-lg">₿</span>
                                <span className="text-[#fafafa] font-semibold">Bitcoin (BTC)</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(cryptoAddresses.bitcoin, 'bitcoin')}
                                className="text-orange-400 hover:text-orange-300"
                              >
                                {copiedAddress === 'bitcoin' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                            <p className="text-xs text-gray-300 break-all font-mono bg-gray-900 p-2 rounded">
                              {cryptoAddresses.bitcoin}
                            </p>
                          </div>

                          {/* Ethereum */}
                          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-blue-400 text-lg">⟠</span>
                                <span className="text-[#fafafa] font-semibold">Ethereum (ETH)</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(cryptoAddresses.ethereum, 'ethereum')}
                                className="text-orange-400 hover:text-orange-300"
                              >
                                {copiedAddress === 'ethereum' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                            <p className="text-xs text-gray-300 break-all font-mono bg-gray-900 p-2 rounded">
                              {cryptoAddresses.ethereum}
                            </p>
                          </div>

                          {/* USDC */}
                          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-green-400 text-lg">$</span>
                                <span className="text-[#fafafa] font-semibold">USDC (Ethereum)</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(cryptoAddresses.usdc, 'usdc')}
                                className="text-orange-400 hover:text-orange-300"
                              >
                                {copiedAddress === 'usdc' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                            <p className="text-xs text-gray-300 break-all font-mono bg-gray-900 p-2 rounded">
                              {cryptoAddresses.usdc}
                            </p>
                          </div>

                          {/* Solana */}
                          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-purple-400 text-lg">◎</span>
                                <span className="text-[#fafafa] font-semibold">Solana (SOL)</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(cryptoAddresses.solana, 'solana')}
                                className="text-orange-400 hover:text-orange-300"
                              >
                                {copiedAddress === 'solana' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                            <p className="text-xs text-gray-300 break-all font-mono bg-gray-900 p-2 rounded">
                              {cryptoAddresses.solana}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-orange-400/10 rounded-lg border border-orange-400/30">
                          <h4 className="text-orange-400 font-semibold mb-2 flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            Crypto Donation Instructions
                          </h4>
                          <div className="text-sm text-gray-300 space-y-1">
                            <p>• Copy the address for your preferred cryptocurrency</p>
                            <p>• Send any amount from your wallet to that address</p>
                            <p>• Transaction will appear on the blockchain within minutes</p>
                            <p>• No minimum amount required for crypto donations</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </>
                ) : (
                  <>
                    {/* Payment Form */}
                    <div className="text-center mb-6">
                      <Badge className="bg-orange-400/20 text-orange-400 border-orange-400/50 text-lg px-4 py-2">
                        Donating ${selectedAmount}
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

            {/* Security Info */}
            <Card className="bg-black/60 border-gray-600 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-400">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Secure</Badge>
                    <span className="text-sm">Multiple Payment Options</span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>💳 <strong>Card Payments:</strong> Powered by Stripe - encrypted and secure</p>
                    <p>₿ <strong>Crypto Payments:</strong> Direct blockchain transactions - pseudonymous and decentralized</p>
                    <p>We never store your payment details or private keys</p>
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