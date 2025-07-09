import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import socket from "../utils/socket.js";
import toast from "react-hot-toast";

const useSocketEvents = (userId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    socket.on("orderPlaced", ({ orderId }) => {
      toast.success("Order placed successfully");
      queryClient.invalidateQueries(['myOrders']);
    });

    socket.on("orderStatusUpdated", ({ orderId, newStatus }) => {
      toast(`Order ${orderId} status: ${newStatus}`);
      queryClient.invalidateQueries(['myOrders']);
    });

    socket.on("orderCancelled", ({ orderId }) => {
      toast.error(`Order ${orderId} was cancelled`);
      queryClient.invalidateQueries(['myOrders']);
    });

    socket.on("newOrderPlaced", ({ orderId, totalAmount }) => {
      toast(`New order placed: ${orderId} - ₹${totalAmount}`);
      queryClient.invalidateQueries(['dashboardStats']);
    });

    return () => {
      socket.off("orderPlaced");
      socket.off("orderStatusUpdated");
      socket.off("orderCancelled");
      socket.off("newOrderPlaced");
    };
  }, [userId, queryClient]);
};

export default useSocketEvents;
