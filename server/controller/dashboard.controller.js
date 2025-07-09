import Order from '../models/order.model.js';
import Pizza from '../models/pizza.model.js';
import Ingredient from '../models/ingredient.model.js';
import {asyncHandler} from "../middleware/error.middleware.js";
import User from "../models/user.model.js";

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalSales = await Order.aggregate([
    { $match: { orderStatus: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
  ]);

  const totalPizzas = await Pizza.countDocuments({ isDeleted: false });
  const totalIngredients = await Ingredient.countDocuments();

  const lowStockIngredients = await Ingredient.find({
    stock: { $lte: 20 },
    threshold: { $gte: 0 },
    isAvailable: true,
    isDeleted: false
  }).select("name stock");

  const topPizzas = await Order.aggregate([
    { $unwind: "$items" },
    { $match: { "items.itemType": "Pizza" } },
    {
      $group: {
        _id: "$items.pizza",
        count: { $sum: "$items.quantity" }
      }
    },
    {
      $lookup: {
        from: "pizzas",
        localField: "_id",
        foreignField: "_id",
        as: "pizza"
      }
    },
    { $unwind: "$pizza" },
    { $project: { name: "$pizza.name", count: 1 } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  res.json({
    totalOrders,
    totalUsers,
    totalSales: totalSales[0]?.total || 0,
    ordersByStatus,
    totalPizzas,
    totalIngredients,
    lowStockIngredients,
    topPizzas
  });
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const [userCount, pizzaCount, ingredientCount, orderCount, revenue] = await Promise.all([
    User.countDocuments(),
    Pizza.countDocuments({ isDeleted: false }),
    Ingredient.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
  ]);

  res.json({
    success: true,
    stats: {
      users: userCount,
      pizzas: pizzaCount,
      ingredients: ingredientCount,
      orders: orderCount,
      revenue: revenue[0]?.total || 0
    }
  });
});