import { useAuth } from "../Context/AuthContext.jsx";
import { useNavigate } from "react-router";
import { Flame } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-base-content bg-base-100 flex flex-col">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-black bg-opacity-60 p-10 rounded-box shadow-lg w-full max-w-2xl text-center space-y-6 text-white">
          <h1 className="text-4xl font-bold text-primary font-secondary">
            Welcome to <span className="text-secondary">Crust n Flame</span>
          </h1>
          <p className="text-lg leading-relaxed font-primary">
            {user
              ? `Hello, ${user.name}! Ready to order your perfect pizza?`
              : "Delicious pizzas made fresh — browse the menu or login to start creating your pizza masterpiece!"}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {user ? (
              <button
                className="btn btn-primary btn-wide font-secondary text-base"
                onClick={() => navigate("/menu")}
              >
                Order Now
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary font-secondary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
                <button
                  className="btn btn-outline btn-secondary font-secondary"
                  onClick={() => navigate("/menu")}
                >
                  Browse Menu
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <section className="py-20 px-6 bg-base-200 text-center">
        <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
        <p className="max-w-3xl mx-auto text-lg font-primary">
          We use only the freshest ingredients, hand-tossed dough, and wood-fired ovens
          to bring you the most flavorful pizzas imaginable.
        </p>
      </section>
      <section className="py-24 px-6 text-center bg-[url('/path-to-fire-bg.jpg')] bg-cover bg-center text-white">
        <div className="bg-black bg-opacity-70 p-8 rounded-lg max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Crafted with Fire</h2>
          <p className="text-lg font-primary">
            Every pizza is baked in a firebrick oven to perfection — giving you that
            signature crisp and smoky flavor.
          </p>
        </div>
      </section>
      <section className="py-20 px-6 bg-accent text-accent-content text-center">
        <h2 className="text-3xl font-bold mb-4">Create Your Own Pizza</h2>
        <p className="max-w-2xl mx-auto text-lg font-primary mb-6">
          Pick your own base, sauce, toppings, cheese, and more. Your pizza, your way.
        </p>
        <button
          className="btn btn-neutral font-secondary"
          onClick={() => navigate("/custom-pizza")}
        >
          Build My Pizza <Flame className="ml-2" />
        </button>
      </section>
      <footer className="bg-base-300 text-base-content p-10 text-center">
        <p className="text-sm font-primary">
          &copy; {new Date().getFullYear()} Crust n Flame. All rights reserved.
        </p>
        <p className="text-xs opacity-60 mt-1">Crafted with love & pizza 🍕</p>
      </footer>
    </div>
  );
};

export default Home;