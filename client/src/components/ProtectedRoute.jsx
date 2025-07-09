import {useAuth} from "../Context/AuthContext.jsx";
import {Navigate} from "react-router";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if(loading) return <span className="loading loading-bars loading-xl" />;

  if(!user) return <Navigate to="/login" />;

  if(adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;