import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const EditIngredient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  const fetchIngredient = async () => {
    try {
      const res = await api.get("/admin/ingredients");
      const ingredient = res.data.ingredients.find((i) => i._id === id);
      if (!ingredient) return toast.error("Ingredient not found");

      setForm({
        name: ingredient.name,
        type: ingredient.type,
        price: ingredient.price ?? "",
        sizePrices: ingredient.sizePrices ?? { small: "", medium: "", large: "" },
        stock: ingredient.stock,
        threshold: ingredient.threshold,
        isAvailable: ingredient.isAvailable,
      });
    } catch {
      toast.error("Failed to fetch ingredient");
    }
  };

  useEffect(() => {
    fetchIngredient();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
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
      price: form.type === "base" ? undefined : parseFloat(form.price) || 0,
      sizePrices:
        form.type === "base"
          ? {
            small: parseFloat(form.sizePrices.small) || 0,
            medium: parseFloat(form.sizePrices.medium) || 0,
            large: parseFloat(form.sizePrices.large) || 0,
          }
          : undefined,
    };

    try {
      await api.put(`/admin/ingredients/${id}`, payload);
      toast.success("Ingredient updated");
      navigate("/admin/ingredients");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update ingredient");
    }
  };

  if (!form) return <span className="loading loading-bars loading-lg mt-10 block mx-auto" />;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">🛠 Edit Ingredient</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-base-200 p-6 rounded-lg shadow">
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            name="name"
            className="input input-bordered w-full"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label">Type</label>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["small", "medium", "large"].map((size) => (
              <input
                key={size}
                type="number"
                placeholder={`${size} price`}
                className="input input-bordered"
                value={form.sizePrices[size]}
                onChange={(e) => handleSizePriceChange(size, e.target.value)}
                required
              />
            ))}
          </div>
        ) : (
          <div>
            <label className="label">Price</label>
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
        <div>
          <label className="label">Stock</label>
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
          <label className="label">Threshold</label>
          <input
            type="number"
            name="threshold"
            className="input input-bordered w-full"
            value={form.threshold}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-control">
          <label className="label cursor-pointer flex gap-3">
            <input
              type="checkbox"
              name="isAvailable"
              className="checkbox"
              checked={form.isAvailable}
              onChange={handleChange}
            />
            <span className="label-text">Available</span>
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Update Ingredient
        </button>
      </form>
    </div>
  );
};

export default EditIngredient;