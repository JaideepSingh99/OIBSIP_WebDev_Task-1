import {useNavigate, useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      toast.error('Invalid verification link.');
      return;
    }

    const verify = async () => {
      try {
        const res = await api.post('/auth/verify-email', {token});
        toast.success('Email verified successfully.');
        navigate('/login');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Verification failed.');
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  return (
    <div className="h-screen flex justify-center items-center">
      {loading ? (
        <span className="loading loading-spinner loading-lg"/>
      ) : (
        <p>Email verification completed.</p>
      )}
    </div>
  );

};

export default VerifyEmail;