import { useEffect, useState } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useCart } from "../Context/CartContext.jsx";

const PizzaBuilder = () => {
  const { fetchCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [ingredients, setIngredients] = useState({
    base: [],
    sauce: [],
    cheese: [],
    vegetables: [],
    meats: [],
  });

  const [pizzaConfig, setPizzaConfig] = useState({
    name: "Custom Pizza",
    base: "",
    sauce: "",
    cheese: "",
    vegetables: [],
    meats: [],
    size: "medium",
    quantity: 1,
  });

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await api.get("/ingredients");
        const data = res.data.ingredients;

        setIngredients({
          base: data.base || [],
          sauce: data.sauce || [],
          cheese: data.cheese || [],
          vegetables: data.vegetable || [],
          meats: data.meat || [],
        });
      } catch (error) {
        toast.error("Failed to load ingredients");
      }
    };

    fetchIngredients();
  }, []);

  const handleChange = (key, value) => {
    setPizzaConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleMultiChange = (key, value) => {
    setPizzaConfig((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.post("/custom-pizzas", pizzaConfig);
      await fetchCart();
      toast.success("Custom pizza added to cart");
      navigate("/cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to build pizza");
    }
  };

  const getNameById = (id) => {
    for (let type in ingredients) {
      const found = ingredients[type].find((i) => i._id === id);
      if (found) return found.name;
    }
    return "Unknown";
  };

  const StepButtons = () => (
    <div className="flex justify-between mt-6">
      {step > 1 && (
        <button
          onClick={() => setStep(step - 1)}
          className="btn btn-outline"
        >
          Back
        </button>
      )}
      {step < 4 ? (
        <button
          onClick={() => setStep(step + 1)}
          className="btn btn-primary ml-auto"
        >
          Next
        </button>
      ) : (
        <button
          onClick={handleSubmit}
          className="btn btn-success ml-auto"
        >
          Add to Cart
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">🍕 Build Your Pizza</h2>
      <div className="steps w-full mb-8">
        <div className={`step ${step >= 1 ? "step-primary" : ""}`}>Base</div>
        <div className={`step ${step >= 2 ? "step-primary" : ""}`}>Toppings</div>
        <div className={`step ${step >= 3 ? "step-primary" : ""}`}>Details</div>
        <div className={`step ${step === 4 ? "step-primary" : ""}`}>Confirm</div>
      </div>
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Step 1: Choose Base, Sauce & Cheese</h3>
          {["base", "sauce", "cheese"].map((type) => (
            <select
              key={type}
              value={pizzaConfig[type]}
              onChange={(e) => handleChange(type, e.target.value)}
              className="select select-bordered w-full"
              required
            >
              <option value="">Select {type}</option>
              {ingredients[type].map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          ))}
          <StepButtons />
        </div>
      )}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Step 2: Choose Vegetables</h3>
            <div className="flex flex-wrap gap-3 mt-2">
              {ingredients.vegetables.map((v) => (
                <label key={v._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pizzaConfig.vegetables.includes(v._id)}
                    onChange={() => handleMultiChange("vegetables", v._id)}
                  />
                  {v.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Step 2: Choose Meats</h3>
            <div className="flex flex-wrap gap-3 mt-2">
              {ingredients.meats.map((m) => (
                <label key={m._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pizzaConfig.meats.includes(m._id)}
                    onChange={() => handleMultiChange("meats", m._id)}
                  />
                  {m.name}
                </label>
              ))}
            </div>
          </div>
          <StepButtons />
        </div>
      )}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Step 3: Pizza Details</h3>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Custom Pizza Name"
            value={pizzaConfig.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <label className="block font-medium">Size</label>
          <select
            className="select select-bordered w-full"
            value={pizzaConfig.size}
            onChange={(e) => handleChange("size", e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
          <label className="block font-medium">Quantity</label>
          <input
            type="number"
            className="input input-bordered w-full"
            min="1"
            value={pizzaConfig.quantity}
            onChange={(e) =>
              handleChange("quantity", parseInt(e.target.value) || 1)
            }
          />
          <StepButtons />
        </div>
      )}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Step 4: Confirm Your Pizza</h3>
          <p><strong>Name:</strong> {pizzaConfig.name}</p>
          <p><strong>Size:</strong> {pizzaConfig.size}</p>
          <p><strong>Quantity:</strong> {pizzaConfig.quantity}</p>
          <p><strong>Base:</strong> {getNameById(pizzaConfig.base)}</p>
          <p><strong>Sauce:</strong> {getNameById(pizzaConfig.sauce)}</p>
          <p><strong>Cheese:</strong> {getNameById(pizzaConfig.cheese)}</p>
          <p><strong>Vegetables:</strong> {pizzaConfig.vegetables.map(getNameById).join(", ") || "None"}</p>
          <p><strong>Meats:</strong> {pizzaConfig.meats.map(getNameById).join(", ") || "None"}</p>
          <StepButtons />
        </div>
      )}
    </div>
  );
};

export default PizzaBuilder;