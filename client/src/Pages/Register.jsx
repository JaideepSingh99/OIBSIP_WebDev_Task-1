import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Context/AuthContext.jsx";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: ""
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [key]: value
        }
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.address.street.trim()) newErrors["address.street"] = "Street is required";
    if (!form.address.city.trim()) newErrors["address.city"] = "City is required";
    if (!form.address.state.trim()) newErrors["address.state"] = "State is required";
    if (!form.address.pincode.trim()) newErrors["address.pincode"] = "Pincode is required";
    if (!form.address.country.trim()) newErrors["address.country"] = "Country is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const success = await register(form);
      if(success) navigate("/verify-pending");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-20 p-8 card bg-base-200 shadow-xl">
      <h3 className="text-3xl font-bold text-center mb-4">Register</h3>

      <div className="flex justify-center mb-6">
        <ul className="steps">
          <li className={`step ${step >= 1 ? "step-primary" : ""}`}>Basic</li>
          <li className={`step ${step >= 2 ? "step-primary" : ""}`}>Contact</li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <div className="animate-fade-in space-y-4">
            <label className="floating-label">
              <span>Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
            </label>
            <label className="floating-label">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
            </label>
            <label className="floating-label">
              <span>Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input input-bordered w-full pr-12"
                  placeholder="••••••••"
                  minLength="6"
                />
              </div>
              <button
                type="button"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onMouseLeave={() => setShowPassword(false)}
                className="absolute inset-y-0 right-3 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
            </label>
            <button type="button" onClick={handleNext} className="btn btn-primary w-full mt-4">
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="animate-fade-in space-y-4">
            <label className="floating-label">
              <span>Phone</span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="+91 98765 43210"
              />
              {errors.phone && <p className="text-error text-sm mt-1">{errors.phone}</p>}
            </label>
            <label className="floating-label">
              <span>Street</span>
              <input
                name="address.street"
                value={form.address.street}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="123 Pizza St"
              />
              {errors["address.street"] && <p className="text-error text-sm mt-1">{errors["address.street"]}</p>}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="floating-label">
                <span>City</span>
                <input
                  name="address.city"
                  value={form.address.city}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
                {errors["address.city"] && <p className="text-error text-sm mt-1">{errors["address.city"]}</p>}
              </label>
              <label className="floating-label">
                <span>State</span>
                <input
                  name="address.state"
                  value={form.address.state}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
                {errors["address.state"] && <p className="text-error text-sm mt-1">{errors["address.state"]}</p>}
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="floating-label">
                <span>Pincode</span>
                <input
                  name="address.pincode"
                  value={form.address.pincode}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
                {errors["address.pincode"] && <p className="text-error text-sm mt-1">{errors["address.pincode"]}</p>}
              </label>
              <label className="floating-label">
                <span>Country</span>
                <input
                  name="address.country"
                  value={form.address.country}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
                {errors["address.country"] && <p className="text-error text-sm mt-1">{errors["address.country"]}</p>}
              </label>
            </div>
            <div className="flex justify-between mt-6">
              <button type="button" onClick={handleBack} className="btn">
                Back
              </button>
              <button type="submit" className="btn btn-success">
                {loading ? "Registering..." : "Register"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;