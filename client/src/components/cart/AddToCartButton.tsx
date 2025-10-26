import { useCart } from "../../lib/cart/store";
import type { CartItem } from "../../lib/cart/types";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps extends Omit<CartItem, 'quantity'> {
  quantity?: number;
}

export default function AddToCartButton(props: AddToCartButtonProps) {
  const add = useCart((s) => s.add);
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    add({ ...props, quantity: Math.max(1, props.quantity || 1) });
    toast({
      title: "Added to cart! 🛹",
      description: `${props.name} has been added to your cart.`,
      duration: 3000,
    });
  };
  
  return (
    <button
      onClick={handleAddToCart}
      data-testid={`button-add-to-cart-${props.id}`}
      className="rounded bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 font-medium transition-colors"
    >
      Add to Cart
    </button>
  );
}
