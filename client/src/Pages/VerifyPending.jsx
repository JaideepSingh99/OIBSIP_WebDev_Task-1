import {useEffect, useState} from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const VerifyPending = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const resendEmail = async () => {
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      await api.post("/auth/resend-verification", { email });
      toast.success("Verification email sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center p-4 text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">📨 Email Verification</h1>
      <p className="text-base-content/80 mb-4">
        Please check your inbox for a verification link.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered w-full max-w-xs mb-4"
        placeholder="Enter your email again"
      />
      <button
        onClick={resendEmail}
        disabled={loading}
        className="btn btn-primary"
      >
        {loading ? "Resending..." : "Resend Verification Email"}
      </button>
    </div>
  );
};

export default VerifyPending;