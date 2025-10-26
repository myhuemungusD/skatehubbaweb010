import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import Navigation from "../components/Navigation";
import { Package, Shirt, Award } from "lucide-react";
import AddToCartButton from "../components/cart/AddToCartButton";

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#ff6a00] mb-4">
            SkateHubba Shop
          </h1>
          <p className="text-gray-400 text-lg">
            Own your style. Rep the brand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-neutral-900 border-neutral-700 hover:border-[#ff6a00] transition-colors" data-testid="card-product-1">
            <CardHeader>
              <div className="w-full h-48 bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                <Shirt className="w-20 h-20 text-[#ff6a00]" />
              </div>
              <CardTitle className="text-white">SkateHubba Tee</CardTitle>
              <CardDescription className="text-gray-400">Classic logo tee</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#24d52b]">$29.99</span>
                <AddToCartButton 
                  id="skatehubba-tee"
                  name="SkateHubba Tee"
                  price={29.99}
                  quantity={1}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-700 hover:border-[#ff6a00] transition-colors" data-testid="card-product-2">
            <CardHeader>
              <div className="w-full h-48 bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-20 h-20 text-[#24d52b]" />
              </div>
              <CardTitle className="text-white">Trick Pack</CardTitle>
              <CardDescription className="text-gray-400">Essential gear bundle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#24d52b]">$49.99</span>
                <AddToCartButton 
                  id="trick-pack"
                  name="Trick Pack"
                  price={49.99}
                  quantity={1}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-700 hover:border-[#ff6a00] transition-colors" data-testid="card-product-3">
            <CardHeader>
              <div className="w-full h-48 bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-20 h-20 text-[#ff6a00]" />
              </div>
              <CardTitle className="text-white">Pro Badge</CardTitle>
              <CardDescription className="text-gray-400">Exclusive member pin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-[#24d52b]">$14.99</span>
                <AddToCartButton 
                  id="pro-badge"
                  name="Pro Badge"
                  price={14.99}
                  quantity={1}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            More items coming soon. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
