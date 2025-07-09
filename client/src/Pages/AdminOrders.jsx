import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const statusOptions = ['pending', 'received', 'inKitchen', 'outForDelivery', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data.orders);
    } catch (err) {
      toast.error("Failed to fetch orders");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">All Orders</h1>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra w-full text-sm">
          <thead className="bg-base-200 text-base-content uppercase text-xs tracking-wider">
          <tr>
            <th className="whitespace-nowrap">Order ID</th>
            <th>User</th>
            <th>Items</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Address</th>
            <th>Time</th>
          </tr>
          </thead>
          <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
          {orders.map(order => (
            <tr key={order._id}>
              <td className="font-mono text-xs break-all">{order._id}</td>
              <td className="text-sm">{order.userId?.email || "Unknown"}</td>
              <td>
                <ul className="list-disc list-inside space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i} className="text-xs">
                      <span className="font-medium">{item.itemType}</span> x{item.quantity} {item.size && `(${item.size})`} – ₹{item.price}
                    </li>
                  ))}
                </ul>
              </td>
              <td className="font-semibold">₹{order.totalAmount}</td>
              <td>
                <div className="badge badge-outline text-xs capitalize">
                  {order.paymentStatus}
                </div>
                <div className="text-xs text-gray-500">{order.paymentMethod}</div>
              </td>
              <td>
                <select
                  className="select select-sm select-bordered"
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
              <td className="text-xs leading-tight space-y-1">
                <div>{order.deliveryAddress.street}</div>
                <div>{order.deliveryAddress.city}, {order.deliveryAddress.state}</div>
                <div>{order.deliveryAddress.pincode}, {order.deliveryAddress.country}</div>
                <div className="font-medium">{order.deliveryAddress.phone}</div>
              </td>
              <td className="text-xs whitespace-nowrap">
                {new Date(order.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;