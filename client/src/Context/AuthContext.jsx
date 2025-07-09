import {createContext, useContext, useEffect, useState} from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import socket from "../utils/socket.js";
import useSocketEvents from "../hooks/useSocketEvents.js";

const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?._id) {
      socket.emit('join', user._id);
    }
  }, [user]);

  useSocketEvents(user?._id);

  const register = async ({name, email, password, phone, address}) => {
    try {
      const res = await api.post('/auth/register', {name, email, password, phone, address});
      toast.success('Registration successful. Please check your email to verify your account.');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const login = async ({email, password}) => {
    try {
      const res = await api.post('/auth/login', {email, password});
      setUser(res.data.user);
      toast.success('Login successful');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      toast.success('Logout successful');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{user, loading, register, login, logout}}>
      {loading ?
        <span className="loading loading-bars loading-xl mx-auto flex items-center h-screen"></span> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);