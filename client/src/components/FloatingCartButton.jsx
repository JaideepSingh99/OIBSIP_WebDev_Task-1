import { useCart } from "../Context/CartContext.jsx";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router";

const FloatingCartButton = () => {
  const { cart } = useCart();

  return (
    <Link
      to="/cart"
      aria-label="Go to cart"
      className="fixed bottom-6 right-6 z-50 bg-primary text-primary-content p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-focus"
    >
      <div className="relative">
        <ShoppingCart size={28} />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 text-xs w-5 h-5 rounded-full bg-secondary text-secondary-content flex items-center justify-center shadow">
            {cart.length}
          </span>
        )}
      </div>
    </Link>
  );
};

export default FloatingCartButton;