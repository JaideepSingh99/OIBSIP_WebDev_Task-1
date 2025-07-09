# 🍕 Crust n Flame - Pizza Delivery Application

A full-stack Pizza Delivery Web Application built using **React**, **Node.js**, **MongoDB**, and **Razorpay**, complete with:
- Custom Pizza Builder
- Cart System
- Razorpay Payment Integration (Test Mode)
- Inventory Management
- Real-Time Order Tracking via Socket.io

---

## 🛠️ Tech Stack

| Frontend         | Backend          | Database | Realtime | Auth |
|------------------|------------------|----------|----------|------|
| React + Vite     | Node.js + Express| MongoDB  | Socket.io| JWT  |

---

## ✨ Features

### 👥 User Side
- 🔐 Registration, Login with JWT & Email Verification
- 🧾 View all available pizzas
- 🧑‍🍳 Custom Pizza Builder (Base, Sauce, Cheese, Veggies, Meats)
- 🛒 Cart Management
- 💰 Razorpay Integration (Test Mode) for payments
- 🧾 Order History with real-time status updates
- ❌ Cancel orders (if pending or received)

### 🔐 Admin Side
- 📊 Dashboard with stats: orders, users, revenue
- 📦 Inventory Management System for:
    - Pizza Bases
    - Sauces
    - Cheeses
    - Meats & Vegetables
- ⚠️ Low Stock Detection + Email Alerts (threshold check)
- ✅ Order Status Management: Pending → Received → In Kitchen → Out for Delivery → Delivered

---

### 🖥️ Clone the Repository

```bash
git clone https://github.com/your-username/pizza-delivery-app.git
cd pizza-delivery-app
