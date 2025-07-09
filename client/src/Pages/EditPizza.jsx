import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const EditPizza = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState({
    base: [],
    sauce: [],
    cheese: [],
    vegetable: [],
    meat: [],
  });
  const [form, setForm] = useState(null);

  const fetchIngredients = async () => {
    try {
      const res = await api.get("/admin/ingredients");
      const grouped = { base: [], sauce: [], cheese: [], vegetable: [], meat: [] };
      res.data.ingredients.forEach((i) => {
        if (grouped[i.type]) grouped[i.type].push(i);
      });
      setIngredients(grouped);
    } catch {
      toast.error("Failed to fetch ingredients");
    }
  };

  const fetchPizza = async () => {
    try {
      const res = await api.get("/admin/pizzas");
      const pizza = res.data.pizzas.find((p) => p._id === id);
      if (!pizza) return toast.error("Pizza not found");

      setForm({
        name: pizza.name,
        description: pizza.description,
        base: pizza.ingredients.find((i) => i.type === "base")?._id || "",
        sauce: pizza.ingredients.find((i) => i.type === "sauce")?._id || "",
        cheese: pizza.ingredients.find((i) => i.type === "cheese")?._id || "",
        vegetables: pizza.ingredients.filter((i) => i.type === "vegetable").map((i) => i._id),
        meats: pizza.ingredients.filter((i) => i.type === "meat").map((i) => i._id),
        sizePrices: {
          small: pizza.sizePrices?.small?.toString() || "",
          medium: pizza.sizePrices?.medium?.toString() || "",
          large: pizza.sizePrices?.large?.toString() || "",
        },
      });
    } catch {
      toast.error("Failed to fetch pizza");
    }
  };

  useEffect(() => {
    fetchIngredients();
    fetchPizza();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (size, value) => {
    setForm((prev) => ({
      ...prev,
      sizePrices: {
        ...prev.sizePrices,
        [size]: value,
      },
    }));
  };

  const handleMultiToggle = (type, id) => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter((i) => i !== id)
        : [...prev[type], id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allIngredients = [
      form.base,
      form.sauce,
      form.cheese,
      ...form.vegetables,
      ...form.meats,
    ];

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("ingredients", JSON.stringify(allIngredients));
    data.append("sizePrices", JSON.stringify({
      small: parseFloat(form.sizePrices.small),
      medium: parseFloat(form.sizePrices.medium),
      large: parseFloat(form.sizePrices.large),
    }));

    try {
      await api.put(`/admin/pizzas/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Pizza updated successfully");
      navigate("/admin/pizzas");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update pizza");
    }
  };

  if (!form) return <span className="loading loading-bars loading-lg mt-10 block mx-auto" />;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">🍕 Edit Pizza</h1>
      <form onSubmit={handleSubmit} className="space-y-5 bg-base-200 p-6 rounded-lg shadow">
        <input
          type="text"
          name="name"
          placeholder="Pizza Name"
          className="input input-bordered w-full"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="textarea textarea-bordered w-full"
          value={form.description}
          onChange={handleChange}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["base", "sauce", "cheese"].map((type) => (
            <select
              key={type}
              name={type}
              className="select select-bordered"
              value={form[type]}
              onChange={handleChange}
              required
            >
              <option value="">Select {type}</option>
              {ingredients[type].map((i) => (
                <option key={i._id} value={i._id}>
                  {i.name}
                </option>
              ))}
            </select>
          ))}
        </div>
        <div>
          <label className="block font-medium mb-1">Vegetables</label>
          <div className="flex flex-wrap gap-3">
            {ingredients.vegetable.map((v) => (
              <label key={v._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.vegetables.includes(v._id)}
                  onChange={() => handleMultiToggle("vegetables", v._id)}
                />
                {v.name}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Meats</label>
          <div className="flex flex-wrap gap-3">
            {ingredients.meat.map((m) => (
              <label key={m._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.meats.includes(m._id)}
                  onChange={() => handleMultiToggle("meats", m._id)}
                />
                {m.name}
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {["small", "medium", "large"].map((size) => (
            <input
              key={size}
              type="number"
              placeholder={`${size} price`}
              className="input input-bordered"
              value={form.sizePrices[size]}
              onChange={(e) => handlePriceChange(size, e.target.value)}
              required
            />
          ))}
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Update Pizza
        </button>
      </form>
    </div>
  );
};

export default EditPizza;