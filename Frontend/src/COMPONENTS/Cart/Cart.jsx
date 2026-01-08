// Cart.jsx
import React from "react";

const Cart = ({ cart, onBuyNow }) => {
  return (
    <div className="fixed top-16 right-5 w-80 bg-white border shadow-lg rounded-lg p-4 z-50">
      <h2 className="font-bold text-lg mb-4">Your Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">No items in cart.</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.name} className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <span className="text-gray-500 text-xs">
                  Quantity: {item.quantity}
                </span>
              </div>
              <span className="font-bold">Rs {item.price}</span>
            </div>
          ))}
          <button
            onClick={onBuyNow}
            className="w-full bg-green-600 text-white py-2 mt-3 rounded hover:bg-green-700"
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
