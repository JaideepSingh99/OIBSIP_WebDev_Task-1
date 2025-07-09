import { useCart } from "../Context/CartContext.jsx";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../Context/AuthContext.jsx";

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
    phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.address) {
      setAddress(prev => ({
        ...prev,
        ...user.address,
        phone: user.phone || '',
      }));
    }
    window.scrollTo(0, 0);
  }, [user]);

  const getRazorpayKey = async () => {
    try {
      const res = await api.get('/payment/get-key');
      return res.data.key;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load Razorpay key');
      return null;
    }
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const items = cart.map(item => ({
      itemType: item.itemType,
      pizza: item.pizza._id || item.pizza,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    if (paymentMethod === 'cash') {
      try {
        await api.post('/orders/placeOrder', {
          items,
          deliveryAddress: address,
          paymentMethod: 'cash',
        });
        toast.success('Order placed successfully');
        clearCart();
        navigate('/my-orders');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to place order');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const key = await getRazorpayKey();
    if (!key) return;

    try {
      const razorRes = await api.post('/payment/create-order', {
        amount: total,
        items,
      });
      const { orderId, amount, currency } = razorRes.data;

      const options = {
        key,
        amount,
        currency,
        name: "Crust n Flame",
        description: "Pizza Order Payment",
        order_id: orderId,
        handler: async function (response) {
          try {
            await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items,
              deliveryAddress: address,
              totalAmount: total,
            });

            toast.success('Payment successful and order placed');
            clearCart();
            navigate('/my-orders');
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: address.phone
        },
        theme: {
          color: "#22c55e"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-6">🧾 Checkout</h2>
      <div className="bg-base-200 p-6 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Your Cart</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {cart.map((item, idx) => (
                <li key={idx} className="flex justify-between items-center border-b py-2">
                  <div>
                    <div className="font-medium">{item.pizza?.name}</div>
                    <div className="text-sm text-gray-600">
                      Size: {item.size} | Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-semibold">₹{item.price * item.quantity}</div>
                </li>
              ))}
            </ul>
            <div className="text-right text-lg font-bold mt-4">
              Total: ₹{total}
            </div>
          </>
        )}
      </div>
      <form onSubmit={handleSubmit} className="bg-base-200 p-6 rounded-lg shadow space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Delivery Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["street", "city", "state", "pincode", "country", "phone"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={address[field]}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                className="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              Cash
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                className="radio"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              Online
            </label>
          </div>
        </div>
        <button
          type="submit"
          className={`btn btn-success w-full ${isLoading && "btn-disabled"}`}
        >
          {isLoading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;