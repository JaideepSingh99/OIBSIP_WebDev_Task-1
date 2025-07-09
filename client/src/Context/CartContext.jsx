import {createContext, useContext, useEffect, useState} from "react";
import {useAuth} from "./AuthContext.jsx";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const { user } = useAuth();

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data.cart.items);
      setTotal(res.data.cart.totalPrice);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if(user) {
      fetchCart()
    } else {
      setCart([]);
      setTotal(0);
    }
  }, [user]);

  const addToCart = async (pizza, size) => {
    try {
      const res = await api.post('/cart/add', {
        itemType: 'Pizza',
        pizza: pizza._id,
        size,
        quantity: 1,
      });

      setCart(res.data.cart.items);
      setTotal(res.data.cart.totalPrice);
      toast.success('Item added to cart');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add item to cart');
    }
  };

  const updateCartItem = async (itemIndex, size, quantity) => {
    try {
      const res = await api.put('/cart/update', {
        itemIndex,
        quantity,
        size
      });

      setCart(res.data.cart.items);
      setTotal(res.data.cart.totalPrice);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update cart item');
    }
  };

  const removeFromCart = async (itemIndex) => {
    try {
      const res = await api.delete(`/cart/remove/${itemIndex}`);

      setCart(res.data.cart.items);
      setTotal(res.data.cart.totalPrice);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error(error);
      toast.error('Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart/clear');
      setCart([]);
      setTotal(0);
      toast.success('Cart cleared');
    } catch (error) {
      console.error(error);
      toast.error('Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, total, fetchCart, addToCart, updateCartItem, removeFromCart, clearCart}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);