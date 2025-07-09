import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import FloatingCartButton from "./components/FloatingCartButton.jsx";

const App = () => {
  return (
    <div
      className="min-h-screen flex flex-col relative"
    >
      <Toaster position="bottom-left" reverseOrder={false} />
      <Navbar />
      <main className="flex-1 pt-15 w-full">
        <Outlet />
      </main>
      <FloatingCartButton />
    </div>
  );
};

export default App;