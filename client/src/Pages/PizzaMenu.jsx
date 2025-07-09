import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import PizzaCard from "../components/PizzaCard.jsx";

const PizzaMenu = () => {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPizzas = async () => {
    try {
      const res = await api.get("/pizzas");
      setPizzas(res.data.pizzas);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load pizzas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="loading loading-bars loading-xl" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center mb-10">Our Pizzas 🍕</h2>
      {pizzas.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No pizzas available at the moment.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {pizzas.map((pizza) => (
            <PizzaCard key={pizza._id} pizza={pizza} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PizzaMenu;