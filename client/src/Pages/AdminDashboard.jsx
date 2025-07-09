import { useQuery } from "@tanstack/react-query";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data;
    },
  });

  console.log('Dashboard stats:',stats);

  if (isLoading) return <span className="loading loading-bars loading-lg" />;
  if (error) {
    toast.error("Failed to load dashboard");
    return null;
  }

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Users', value: stats.totalUsers },
          { label: 'Total Pizzas', value: stats.totalPizzas },
          { label: 'Total Ingredients', value: stats.totalIngredients },
          { label: 'Total Orders', value: stats.totalOrders },
          { label: 'Total Revenue', value: `₹${stats.totalSales}` }
        ].map(({ label, value }) => (
          <div key={label} className="card bg-base-200 p-4 shadow-md hover:shadow-lg transition rounded-xl">
            <h2 className="text-sm font-medium text-base-content/60">{label}</h2>
            <p className="text-2xl font-bold text-primary mt-1">{value}</p>
          </div>
        ))}
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-2">📦 Orders by Status</h2>
        <ul className="divide-y divide-base-300 bg-base-100 rounded-lg shadow-md">
          {stats.ordersByStatus.map((s, idx) => (
            <li key={idx} className="flex justify-between items-center px-4 py-2">
              <span className="capitalize text-base-content">{s._id}</span>
              <span className="font-semibold text-base-content/80">{s.count}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">🥦 Low Stock Ingredients</h2>
        {stats.lowStockIngredients.length === 0 ? (
          <p className="text-base-content/60 italic">All ingredients are well stocked.</p>
        ) : (
          <ul className="space-y-2">
            {stats.lowStockIngredients.map(i => (
              <li key={i._id} className="flex justify-between bg-base-200 px-4 py-2 rounded-md">
                <span className="font-medium text-base-content">{i.name}</span>
                <span className="badge badge-warning badge-sm">Stock: {i.stock}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">🔥 Top 5 Best-Selling Pizzas</h2>
        <ul className="space-y-2">
          {stats.topPizzas.map(p => (
            <li key={p.name} className="flex justify-between bg-base-100 px-4 py-2 rounded-md shadow-sm">
              <span className="text-base-content">{p.name}</span>
              <span className="font-semibold text-primary">Sold: {p.count}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;