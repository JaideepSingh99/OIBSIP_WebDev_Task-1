import { NavLink, Outlet } from "react-router";

const navLinks = [
  { to: "/admin", label: "📊 Dashboard", end: true },
  { to: "/admin/pizzas", label: "🍕 Pizzas" },
  { to: "/admin/ingredients", label: "🧂 Ingredients" },
  { to: "/admin/orders", label: "📦 Orders" },
];

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-base-100 text-base-content">
      <aside className="w-64 bg-base-200 p-6 shadow-inner space-y-6">
        <h2 className="text-2xl font-extrabold tracking-tight">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {navLinks.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `btn btn-ghost justify-start w-full text-left ${
                  isActive ? "bg-primary text-primary-content font-semibold" : ""
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;