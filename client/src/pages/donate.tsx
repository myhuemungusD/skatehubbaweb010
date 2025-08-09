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
    bitcoin: 'bc1qtlc2pyv3wndeavmfcz4750lmqng9q32h246n8l',
    ethereum: '0xE73CeeF1101d2355592A313A299333cB9a55A889',
    usdc: '0xE73CeeF1101d2355592A313A299333cB9a55A889',
    solana: '311eHoFpY61cSjZfuXRmZeM6H6Ja7kh5d4JAHY6EQo2z',
    dogecoin: 'DJBHyoA1rosNn3B4EbBjmzZqm4Vrn1NGzR',
    litecoin: 'ltc1q8rp2s4x23m5hmazqr7srp7kregqurspskxkkvj'
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

                    {/* Impact Information & Rewards */}
                    <div className="p-4 bg-orange-400/10 rounded-lg border border-orange-400/30">
                      <h4 className="text-orange-400 font-semibold mb-3">Your Impact & Rewards</h4>
                      <div className="text-sm text-gray-300 space-y-2">
                        {selectedAmount >= 250 && (
                          <div className="p-3 bg-purple-500/20 rounded border border-purple-400/30">
                            <p className="font-semibold text-purple-300">🏆 LEGENDARY CONTRIBUTOR ($250+)</p>
                            <p>• Help fund major feature development</p>
                            <p>• Exclusive "Founder" badge on your future SkateHubba profile</p>
                            <p>• Early access to all beta features (lifetime)</p>
                            <p>• Your name credited in app "Special Thanks" section</p>
                            <p>• Direct line to developers for feature suggestions</p>
                          </div>
                        )}
                        {selectedAmount >= 100 && selectedAmount < 250 && (
                          <div className="p-3 bg-gold-500/20 rounded border border-yellow-400/30">
                            <p className="font-semibold text-yellow-300">🚀 PRO SUPPORTER ($100+)</p>
                            <p>• Support new interactive features</p>
                            <p>• Exclusive "Pro Supporter" badge on your profile</p>
                            <p>• Early access to major updates (2 weeks before public)</p>
                            <p>• Your username listed in app credits</p>
                          </div>
                        )}
                        {selectedAmount >= 50 && selectedAmount < 100 && (
                          <div className="p-3 bg-blue-500/20 rounded border border-blue-400/30">
                            <p className="font-semibold text-blue-300">🛹 COMMUNITY BUILDER ($50+)</p>
                            <p>• Help grow the skater network</p>
                            <p>• Exclusive "Community Builder" badge</p>
                            <p>• Early access to new features (1 week before public)</p>
                            <p>• Priority support for any issues</p>
                          </div>
                        )}
                        {selectedAmount >= 25 && selectedAmount < 50 && (
                          <div className="p-3 bg-green-500/20 rounded border border-green-400/30">
                            <p className="font-semibold text-green-300">⚡ CORE SUPPORTER ($25+)</p>
                            <p>• Keep servers running smoothly</p>
                            <p>• Exclusive "Core Supporter" badge</p>
                            <p>• Access to supporter-only Discord channel</p>
                          </div>
                        )}
                        {selectedAmount >= 10 && selectedAmount < 25 && (
                          <div className="p-3 bg-orange-500/20 rounded border border-orange-400/30">
                            <p className="font-semibold text-orange-300">💪 CONTRIBUTOR ($10+)</p>
                            <p>• Support daily operations</p>
                            <p>• Exclusive "Contributor" badge</p>
                            <p>• Monthly development updates via email</p>
                          </div>
                        )}
                        {selectedAmount >= 1 && selectedAmount < 10 && (
                          <div className="p-3 bg-gray-500/20 rounded border border-gray-400/30">
                            <p className="font-semibold text-gray-300">❤️ SUPPORTER ($1+)</p>
                            <p>• Every bit helps!</p>
                            <p>• Exclusive "Supporter" badge</p>
                            <p>• Our eternal gratitude!</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 p-3 bg-orange-600/20 rounded border border-orange-500/30">
                        <p className="text-xs text-orange-200 font-semibold">
                          🎖️ All rewards will be automatically applied to your SkateHubba account when the platform launches!
                        </p>
                      </div>
                    </div>

                    {/* GoFundMe Option */}
                    <div className="p-4 bg-green-500/10 rounded-lg border border-green-400/30">
                      <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Alternative: Support via GoFundMe
                      </h4>
                      <p className="text-sm text-gray-300 mb-3">
                        Prefer using GoFundMe? You can also support SkateHubba through our campaign:
                      </p>
                      <a
                        href="https://gofund.me/4d6b7234"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold"
                      >
                        <span>🎯</span>
                        <span>Donate via GoFundMe</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
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

                          {/* Dogecoin */}
                          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-yellow-400 text-lg">🐕</span>
                                <span className="text-[#fafafa] font-semibold">Dogecoin (DOGE)</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(cryptoAddresses.dogecoin, 'dogecoin')}
                                className="text-orange-400 hover:text-orange-300"
                              >
                                {copiedAddress === 'dogecoin' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                            <p className="text-xs text-gray-300 break-all font-mono bg-gray-900 p-2 rounded">
                              {cryptoAddresses.dogecoin}
                            </p>
                          </div>

                          {/* Litecoin */}
                          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-lg">Ł</span>
                                <span className="text-[#fafafa] font-semibold">Litecoin (LTC)</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(cryptoAddresses.litecoin, 'litecoin')}
                                className="text-orange-400 hover:text-orange-300"
                              >
                                {copiedAddress === 'litecoin' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                            <p className="text-xs text-gray-300 break-all font-mono bg-gray-900 p-2 rounded">
                              {cryptoAddresses.litecoin}
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

            {/* Exclusive Perks Preview */}
            <Card className="bg-black/60 border-gray-600 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-[#fafafa] flex items-center gap-2">
                  <span className="text-2xl">🎁</span>
                  Supporter Exclusive Perks
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Get exclusive access and recognition for supporting SkateHubba
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h5 className="text-orange-400 font-semibold">🏅 Profile Badges</h5>
                    <p className="text-gray-300">Show off your supporter status with exclusive badges that appear on your SkateHubba profile</p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-orange-400 font-semibold">🚀 Early Access</h5>
                    <p className="text-gray-300">Be among the first to test new features and updates before they go live</p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-orange-400 font-semibold">💬 Direct Line</h5>
                    <p className="text-gray-300">Higher-tier supporters get direct access to suggest features and improvements</p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-orange-400 font-semibold">📜 Hall of Fame</h5>
                    <p className="text-gray-300">Your name listed in the app credits, immortalized in SkateHubba history</p>
                  </div>
                </div>
                <div className="p-3 bg-purple-500/10 rounded border border-purple-400/30">
                  <p className="text-purple-300 text-sm font-semibold text-center">
                    🌟 All perks are lifetime rewards - once earned, they're yours forever!
                  </p>
                </div>
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