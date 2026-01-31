// DishCard.jsx
import React from "react";

const DishCard = ({ food, onAddToCart }) => {
  return (
    <div className="bg-white rounded-lg border shadow hover:shadow-lg transition p-3">
      <img
        src={food.image}
        alt={food.name}
        className="w-full h-36 object-cover rounded-t-lg"
      />
      <div className="p-2">
        <h3 className="text-md font-semibold">{food.name}</h3>
        <p className="text-gray-600 text-sm">{food.desc}</p>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>🏷 {food.category}</span>
          <span>📍 {food.city}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-gray-900">Rs {food.price}</span>
          <button
            onClick={() => onAddToCart(food)}
            className="bg-gray-800 text-white text-xs px-2 py-1 rounded hover:bg-gray-700"
          >
            Add Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
