import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { Link } from "react-router";

const AdminPizzas = () => {
  const [pizzas, setPizzas] = useState([]);

  const fetchPizzas = async () => {
    try {
      const res = await api.get('/admin/pizzas');
      setPizzas(res.data.pizzas);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load pizzas');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this pizza?')) return;
    try {
      await api.delete(`/admin/pizzas/${id}`);
      toast.success('Pizza deleted successfully');
      fetchPizzas();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete pizza');
    }
  };

  useEffect(() => {
    fetchPizzas();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Pizzas</h1>
        <Link to="/admin/pizzas/new" className="btn btn-primary">+ Add New</Link>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra w-full text-sm">
          <thead className="bg-base-200 text-base-content uppercase text-xs tracking-wider">
          <tr>
            <th>Name</th>
            <th>Ingredients</th>
            <th>Prices</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {pizzas.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No pizzas found.
              </td>
            </tr>
          )}
          {pizzas.map((p) => (
            <tr key={p._id}>
              <td className="font-semibold">{p.name}</td>
              <td className="text-xs text-gray-700 max-w-xs">
                {p.ingredients.map(i => i.name).join(", ")}
              </td>
              <td className="text-xs">
                <div>Small: ₹{p.sizePrices.small}</div>
                <div>Medium: ₹{p.sizePrices.medium}</div>
                <div>Large: ₹{p.sizePrices.large}</div>
              </td>
              <td>
                  <span className={`badge badge-sm ${p.isAvailable ? 'badge-success' : 'badge-error'}`}>
                    {p.isAvailable ? "Yes" : "No"}
                  </span>
              </td>
              <td className="space-x-2">
                <Link to={`/admin/pizzas/edit/${p._id}`} className="btn btn-sm btn-outline">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPizzas;