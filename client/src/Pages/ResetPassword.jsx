import { useSearchParams, useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid or missing token");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password?token=${token}`, { newPassword });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-base-200 p-8 rounded-xl shadow w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-primary text-center">
          Reset Password
        </h2>
        <input
          type="password"
          placeholder="New Password"
          className="input input-bordered w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button className="btn btn-success w-full" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;