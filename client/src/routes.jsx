import {createBrowserRouter} from "react-router";
import App from "./App.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import NotFound from "./Pages/NotFound.jsx";
import Register from "./Pages/Register.jsx";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home.jsx";
import PizzaMenu from "./Pages/PizzaMenu.jsx";
import Cart from "./Pages/Cart.jsx";
import Checkout from "./Pages/Checkout.jsx";
import MyOrders from "./Pages/MyOrders.jsx";
import PizzaBuilder from "./Pages/PizzaBuilder.jsx";
import AdminLayout from "./Pages/AdminLayout.jsx";
import AdminPizzas from "./Pages/AdminPizzas.jsx";
import CreatePizza from "./Pages/CreatePizza.jsx";
import EditPizza from "./Pages/EditPizza.jsx";
import AdminIngredients from "./Pages/AdminIngredients.jsx";
import CreateIngredient from "./Pages/CreateIngredient.jsx";
import EditIngredient from "./Pages/EditIngredient.jsx";
import AdminOrders from "./Pages/AdminOrders.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import VerifyEmail from "./Pages/VerifyEmail.jsx";
import VerifyPending from "./Pages/VerifyPending.jsx";
import ResetPassword from "./Pages/ResetPassword.jsx";
import ForgotPassword from "./Pages/ForgotPassword.jsx";

export const router = createBrowserRouter([
  {
    path: '*',
    element: <NotFound />
  },
  {
    path: '/',
    element: <App />,
    children: [
      {path: '/', element: <Home />},
      {path: 'register', element: <Register />},
      {path: 'login', element: <Login />},
      {path: 'verify-pending', element: <VerifyPending />},
      {path: 'verify-email', element: <VerifyEmail />},
      {path: 'forgot-password', element: <ForgotPassword />},
      {path: 'reset-password', element: <ResetPassword />},
      {path: 'menu', element: <PizzaMenu />},
      {path: '/custom-pizza', element: <ProtectedRoute><PizzaBuilder /></ProtectedRoute>},
      {path: 'cart', element: <Cart />},
      {path: 'checkout', element: <ProtectedRoute><Checkout /></ProtectedRoute>},
      {path: 'my-orders', element: <ProtectedRoute><MyOrders /></ProtectedRoute>}
    ],
  },
  {
    path: '/admin',
    element: <ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>,
    children: [
      {index: true, element: <AdminDashboard />},
      {path: 'pizzas', element: <AdminPizzas />},
      {path: 'pizzas/new', element: <CreatePizza />},
      {path: 'pizzas/edit/:id', element: <EditPizza />},
      {path: 'ingredients', element: <AdminIngredients />},
      {path: 'ingredients/new', element: <CreateIngredient />},
      {path: 'ingredients/edit/:id', element: <EditIngredient />},
      {path: 'orders', element: <AdminOrders />}
    ],
  }
]);