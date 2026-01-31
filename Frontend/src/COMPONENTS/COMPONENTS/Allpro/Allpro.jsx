import React, { useEffect, useState } from "react";

const Allpro = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4500/dishes")
      .then(res => res.json())
      .then(data => setDishes(data))

      .catch(() => setDishes([]));
  }, []);

  return (
    <section className="max-w-[1200px] mx-auto my-10 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.length ? (
          dishes.map((food, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border shadow hover:shadow-lg transition p-3"
            >
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
                  <button className="bg-gray-800 text-white text-xs px-2 py-1 rounded hover:bg-gray-700">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No dishes found.</p>
        )}
      </div>
    </section>
  );
};

export default Allpro;
