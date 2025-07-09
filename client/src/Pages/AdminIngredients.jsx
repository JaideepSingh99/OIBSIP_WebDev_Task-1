import { useEffect, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const AdminIngredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const fetchIngredients = async () => {
    try {
      const res = await api.get('/admin/ingredients');
      setIngredients(res.data.ingredients);
    } catch (error) {
      toast.error("Failed to load ingredients");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this ingredient?')) return;
    try {
      await api.delete(`/admin/ingredients/${id}`);
      toast.success("Ingredient deleted successfully");
      fetchIngredients();
    } catch (error) {
      toast.error("Failed to delete ingredient");
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">🧂 Ingredients</h1>
        <Link to="/admin/ingredients/new" className="btn btn-primary">+ Add New</Link>
      </div>
      <div className="overflow-x-auto rounded-xl shadow-sm">
        <table className="table w-full bg-base-100">
          <thead className="bg-base-200 text-base-content/80 text-sm uppercase">
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Threshold</th>
            <th>Available</th>
            <th className="text-right">Actions</th>
          </tr>
          </thead>
          <tbody className="text-sm">
          {ingredients.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-base-content/50 italic">No ingredients found.</td>
            </tr>
          ) : (
            ingredients.map((ing) => (
              <tr key={ing._id} className="hover:bg-base-200 transition">
                <td className="font-medium">{ing.name}</td>
                <td className="capitalize">{ing.type}</td>
                <td>
                  {ing.type === "base" ? (
                    <div className="space-y-1 leading-tight">
                      <div>S: ₹{ing.sizePrices?.small}</div>
                      <div>M: ₹{ing.sizePrices?.medium}</div>
                      <div>L: ₹{ing.sizePrices?.large}</div>
                    </div>
                  ) : (
                    `₹${ing.price}`
                  )}
                </td>
                <td>{ing.stock}</td>
                <td>{ing.threshold}</td>
                <td>
                    <span className={`badge badge-sm ${ing.isAvailable ? "badge-success" : "badge-error"}`}>
                      {ing.isAvailable ? "Yes" : "No"}
                    </span>
                </td>
                <td className="text-right space-x-2">
                  <Link
                    to={`/admin/ingredients/edit/${ing._id}`}
                    className="btn btn-sm btn-outline btn-primary"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(ing._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminIngredients;
