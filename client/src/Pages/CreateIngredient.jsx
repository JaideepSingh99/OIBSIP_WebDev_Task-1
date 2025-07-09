import {useState} from "react";
import {useNavigate} from "react-router";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const CreateIngredient = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "base",
    price: "",
    sizePrices: {
      small: "",
      medium: "",
      large: "",
    },
    stock: 0,
    threshold: 20,
    isAvailable: true,
  });

  const handleChange = (e) => {
    const {name, value, type, checked} = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizePriceChange = (size, value) => {
    setForm((prev) => ({
      ...prev,
      sizePrices: {
        ...prev.sizePrices,
        [size]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: form.type !== "base" ? parseFloat(form.price) || 0 : undefined,
      sizePrices: form.type === "base"
        ? {
          small: parseFloat(form.sizePrices.small) || 0,
          medium: parseFloat(form.sizePrices.medium) || 0,
          large: parseFloat(form.sizePrices.large) || 0,
        }
        : undefined,
    };

    try {
      await api.post("/admin/ingredients", payload);
      toast.success("Ingredient created");
      navigate("/admin/ingredients");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create ingredient");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">➕ Create Ingredient</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-base-200 p-6 rounded-lg shadow-md">
        <div>
          <label className="label">
            <span>Name</span>
          </label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              placeholder="Ingredient name"
              value={form.name}
              onChange={handleChange}
              required
            />
        </div>
        <div>
          <label className="label">
            <span>Type</span>
          </label>
          <select
            name="type"
            className="select select-bordered w-full"
            value={form.type}
            onChange={handleChange}
          >
            <option value="base">Base</option>
            <option value="sauce">Sauce</option>
            <option value="cheese">Cheese</option>
            <option value="vegetable">Vegetable</option>
            <option value="meat">Meat</option>
          </select>
        </div>
        {form.type === "base" ? (
          <div>
            <label className="label">
              <span>Size Prices (Base)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {["small", "medium", "large"].map((size) => (
                <input
                  key={size}
                  type="number"
                  placeholder={`${size} price`}
                  className="input input-bordered w-full"
                  value={form.sizePrices[size]}
                  onChange={(e) => handleSizePriceChange(size, e.target.value)}
                  required
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <label className="label">
              <span>Price</span>
            </label>
            <input
              type="number"
              name="price"
              className="input input-bordered w-full"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span>Stock</span>
            </label>
            <input
              type="number"
              name="stock"
              className="input input-bordered w-full"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="label">
              <span>Threshold</span>
            </label>
            <input
              type="number"
              name="threshold"
              className="input input-bordered w-full"
              value={form.threshold}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div>
          <label className="label cursor-pointer">
            <span>Available</span>
            <input
              type="checkbox"
              name="isAvailable"
              className="checkbox"
              checked={form.isAvailable}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Create Ingredient
        </button>
      </form>
    </div>
  );
};

export default CreateIngredient;