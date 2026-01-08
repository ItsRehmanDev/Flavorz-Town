// Categories.jsx
import React from "react";

const Categories = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedCategory === cat
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default Categories;
