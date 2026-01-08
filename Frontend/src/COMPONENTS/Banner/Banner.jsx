import React from "react";

const Banner = () => {
  return (
    <div className="relative w-full h-[500px] -my-4" id="home">
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80"
        alt="Food Banner"
        className="w-full h-full object-cover "
      />
      <div className="absolute inset-0  bg-opacity-50 flex flex-col justify-center items-center text-center px-20">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to Flavor Town
        </h1>
        <p className="text-sm text-white max-w-[700px]">
          Taste the best dishes from your city, freshly prepared and delivered
          with love ❤️
        </p>
        <button className="mt-6 px-10 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition">
          Explore Menu
        </button>
      </div>
    </div>
  );
};

export default Banner;
