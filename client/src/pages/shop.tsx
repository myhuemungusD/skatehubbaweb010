import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import Navigation from "../components/Navigation";
import { Package, Shirt, Award, Loader2 } from "lucide-react";
import AddToCartButton from "../components/cart/AddToCartButton";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/../../shared/schema";

// Icon mapping for products
const ICON_MAP = {
  Shirt,
  Package,
  Award,
} as const;

export default function ShopPage() {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

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

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load products. Please try again.</p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => {
              const Icon = product.icon && product.icon in ICON_MAP 
                ? ICON_MAP[product.icon as keyof typeof ICON_MAP]
                : Package;
              const iconColor = index % 3 === 0 ? "text-[#ff6a00]" : index % 3 === 1 ? "text-[#24d52b]" : "text-[#ff6a00]";

              return (
                <Card 
                  key={product.id} 
                  className="bg-neutral-900 border-neutral-700 hover:border-[#ff6a00] transition-colors" 
                  data-testid={`card-product-${product.id}`}
                >
                  <CardHeader>
                    <div className="w-full h-48 bg-neutral-800 rounded-lg flex items-center justify-center mb-4">
                      <Icon className={`w-20 h-20 ${iconColor}`} />
                    </div>
                    <CardTitle className="text-white">{product.name}</CardTitle>
                    <CardDescription className="text-gray-400">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#24d52b]">
                        ${(product.price / 100).toFixed(2)}
                      </span>
                      <AddToCartButton 
                        id={product.productId}
                        name={product.name}
                        price={product.price / 100}
                        quantity={1}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-400">
            More items coming soon. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
