import { useEffect, useState } from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const CreatePizza = () => {
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState({
    base: [],
    sauce: [],
    cheese: [],
    vegetable: [],
    meat: []
  });

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
    base: "",
    sauce: "",
    cheese: "",
    vegetables: [],
    meats: [],
    sizePrices: {
      small: 0,
      medium: 0,
      large: 0,
    },
  });

  const fetchIngredients = async () => {
    try {
      const res = await api.get("/admin/ingredients");
      const grouped = { base: [], sauce: [], cheese: [], vegetable: [], meat: [] };
      res.data.ingredients.forEach((i) => {
        if (grouped[i.type]) grouped[i.type].push(i);
      });
      setIngredients(grouped);
    } catch {
      toast.error("Failed to fetch ingredients. Please try again later.");
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setForm((prev) => ({
      ...prev,
      image: e.target.files[0],
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

  const handlePriceChange = (size, value) => {
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

    const allIngredients = [
      form.base,
      form.sauce,
      form.cheese,
      ...form.vegetables,
      ...form.meats
    ];

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("image", form.image);
    data.append("ingredients", JSON.stringify(allIngredients));
    data.append("sizePrices", JSON.stringify({
      small: parseFloat(form.sizePrices.small) || 0,
      medium: parseFloat(form.sizePrices.medium) || 0,
      large: parseFloat(form.sizePrices.large) || 0,
    }));

    try {
      await api.post("/admin/pizzas", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Pizza created successfully");
      navigate("/admin/pizzas");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create pizza");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">🍕 Create Pizza</h1>
      <form onSubmit={handleSubmit} className="bg-base-200 p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            name="name"
            className="input input-bordered w-full"
            placeholder="Pizza Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            className="textarea textarea-bordered w-full"
            placeholder="Pizza Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="label">Pizza Image</label>
          <input
            type="file"
            accept="image/*"
            className="file-input w-full"
            onChange={handleImageChange}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {["base", "sauce", "cheese"].map((type) => (
            <div key={type}>
              <label className="label capitalize">{type}</label>
              <select
                name={type}
                className="select select-bordered w-full"
                value={form[type]}
                onChange={handleChange}
                required
              >
                <option value="">Select {type}</option>
                {ingredients[type].map((i) => (
                  <option key={i._id} value={i._id}>{i.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div>
          <label className="label">Vegetables</label>
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
          <label className="label">Meats</label>
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
        <div>
          <label className="label">Prices by Size</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["small", "medium", "large"].map((size) => (
              <input
                key={size}
                type="number"
                placeholder={`${size.charAt(0).toUpperCase() + size.slice(1)} Price`}
                className="input input-bordered w-full"
                value={form.sizePrices[size]}
                onChange={(e) => handlePriceChange(size, e.target.value)}
                required
              />
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Create Pizza
        </button>
      </form>
    </div>
  );
};

export default CreatePizza;