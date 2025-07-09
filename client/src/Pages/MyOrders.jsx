import { useAuth } from "../Context/AuthContext.jsx";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const MyOrders = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const res = await api.get("/orders/my-orders");
      return res.data.orders;
    },
    enabled: !!user,
  });

  const cancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      toast.success("Order cancelled successfully");
      queryClient.invalidateQueries(['myOrders']);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  if (isLoading) return <span className="loading loading-bars loading-lg" />;

  if (!orders || orders.length === 0) {
    return <p className="text-center text-neutral-content mt-5">No orders found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-16 pb-8">
      <h2 className="text-3xl font-bold mb-8 text-primary font-secondary text-center">
        My Orders
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-base-200 p-5 rounded-lg shadow-md border border-base-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="font-semibold text-base-content">
                  <span className="text-sm font-medium text-base-content/70">Order ID:</span>{" "}
                  {order._id}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-base-content/70">Status:</span>{" "}
                  <span className="capitalize badge badge-outline badge-sm">
                    {order.orderStatus}
                  </span>
                </p>
                <p className="text-sm text-base-content/60">
                  Placed on: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              {["pending", "received"].includes(order.orderStatus) && (
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => cancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              )}
            </div>
            <div className="divider my-3" />
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm items-center"
                >
                  <p>
                    {item.pizza?.name || "Custom Pizza"}{" "}
                    <span className="text-xs text-neutral-content">
                      ({item.size})
                    </span>
                  </p>
                  <p className="font-medium">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
              ))}
              <div className="text-right font-bold text-lg mt-2 text-primary">
                Total: ₹{order.totalAmount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;