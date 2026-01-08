import React, { useEffect, useState } from "react";

const Order = ({ userEmail }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const emailToUse = userEmail || localStorage.getItem("userEmail");

  useEffect(() => {
    fetchOrders();
  }, [emailToUse]);

  const fetchOrders = () => {
    if (!emailToUse) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:4500/order?email=${encodeURIComponent(emailToUse)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrders(data.orders || []);
        } else {
          setOrders([]);
        }
      })
      .catch((err) => {
        console.error("Fetch orders error:", err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  };

  
  const handleDelete = async (id) => {

    try {
      const res = await fetch(`http://localhost:4500/order/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        alert("Order deleted successfully!");
        setOrders((prev) => prev.filter((order) => order._id !== id));
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error("Delete order error:", error);
      alert("Something went wrong!");
    }
  };

  if (!emailToUse) {
    return (
      <section className="max-w-[900px] mx-auto my-10 px-5">
        <h1 className="text-2xl font-bold mb-6 text-center">📦 Your Orders</h1>
        <p className="text-center text-gray-500">No user email found. Place an order first.</p>
      </section>
    );
  }

  return (
    <section className="max-w-[900px] mx-auto my-10 px-5">
      <h1 className="text-2xl font-bold mb-6 text-center">📦 Your Orders</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={order._id || index}
              className="bg-white border rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{order.dishName}</h3>
                <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
                <p className="text-sm text-gray-600">Address: {order.address}</p>
                <p className="text-sm text-gray-600">Email: {order.userEmail}</p>
                <p className="text-xs text-gray-400">
                  {new Date(order.date).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-gray-900 mb-2">Rs {order.price}</span>
                <button
                  onClick={() => handleDelete(order._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Order;
