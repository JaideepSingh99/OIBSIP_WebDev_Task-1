import { useCart } from "../Context/CartContext.jsx";
import { useLocation, useNavigate } from "react-router";
import CartItem from "../components/CartItem.jsx";
import { useEffect } from "react";

const Cart = () => {
  const { cart, total, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">🛒 Your Cart</h2>
      {cart.length === 0 ? (
        <div className="bg-base-200 rounded-lg p-6 text-center text-gray-500">
          Your cart is empty. Go grab some delicious pizza! 🍕
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                index={index}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>
          <div className="mt-10 p-4 bg-base-200 rounded-lg shadow flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xl font-semibold">
              Total: <span className="text-primary">₹{total}</span>
            </div>

            <div className="flex gap-3">
              <button
                className="btn btn-outline"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;