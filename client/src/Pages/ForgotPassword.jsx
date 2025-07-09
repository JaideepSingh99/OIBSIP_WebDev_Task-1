import {useState} from "react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("Reset link sent to your email");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
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
          Forgot Password
        </h2>
        <p className="text-sm text-base-content/70 text-center">
          Enter your email to receive a reset link.
        </p>
        <input
          type="email"
          placeholder="you@example.com"
          className="input input-bordered w-full"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;