import { useState } from "react";
import { useCart } from "../Context/CartContext.jsx";
import { useAuth } from "../Context/AuthContext.jsx";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const PizzaCard = ({ pizza }) => {
  const [size, setSize] = useState("medium");
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add to cart");
      return navigate("/login");
    }

    try {
      setLoading(true);
      await addToCart(pizza, size); // if async
      toast.success("Pizza added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full sm:w-80 bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300">
      <figure className="h-48 overflow-hidden">
        <img
          src={pizza.image}
          alt={pizza.name}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body flex flex-col">
        <h2 className="card-title">{pizza.name}</h2>
        <p className="text-sm text-base-content/80">{pizza.description}</p>

        <select
          className="select select-bordered mt-2"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          {Object.entries(pizza.sizePrices).map(([key, price]) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)} - ₹{price}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary mt-3 w-full"
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
};

export default PizzaCard;
