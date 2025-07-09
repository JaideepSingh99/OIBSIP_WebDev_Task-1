import { Link } from "react-router";
import { useAuth } from "../Context/AuthContext.jsx";
import { UserRound } from "lucide-react";
import getInitials from "../utils/getInitials.js";

const Navbar = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <span className="loading loading-bars loading-xl mx-auto block mt-10" />;
  }

  return (
    <header className="navbar bg-base-100 shadow-md fixed top-0 z-50 w-full px-4">
      <div className="flex-1">
        <Link to="/" className="text-3xl font-display font-bold">
          Crust N Flame
        </Link>
      </div>
      <div className="flex-none">
        <div className="drawer">
          <input id="user-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {user ? (
              <label
                htmlFor="user-drawer"
                className="drawer-button"
                aria-label="Open user drawer"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-content flex items-center justify-center text-sm font-semibold cursor-pointer hover:opacity-90">
                  {getInitials(user.name)}
                </div>
              </label>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
          <div className="drawer-side z-99">
            <label htmlFor="user-drawer" className="drawer-overlay" aria-label="Close drawer" />
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content space-y-2">
              <li className="flex flex-row items-center justify-between mb-4">
                <div className="btn btn-ghost btn-circle text-xl">
                  {user?.name ? getInitials(user.name) : <UserRound />}
                </div>
                {user && (
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => logout()}
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                )}
              </li>
              <li>
                <Link to="/menu" className="font-medium">Menu</Link>
              </li>
              <li>
                <Link to="/custom-pizza" className="font-medium">Pizza Builder</Link>
              </li>
              <li>
                <Link to="/my-orders" className="font-medium">My Orders</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
