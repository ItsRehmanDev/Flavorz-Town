import React, { useState } from "react";
import { Link } from "react-router-dom";


const Addpro = () => {
  const [name, setname] = useState("");
  const [image, setimage] = useState("");
  const [price, setprice] = useState("");
  const [desc, setdesc] = useState("");
  const [city, setcity] = useState("");
  const [category, setcategory] = useState("");

  const handleForm = async (e) => {
    e.preventDefault(); 
 
    const newDish = { name, image, price, desc, city, category };
    try {
      const res = await fetch("http://localhost:4500/Admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDish),
      });
      const data = await res.json();
      alert(data.message || "Post created");
      setname("");
      setimage("");
      setprice("");
      setdesc("");
      setcity("");
      setcategory("");
    } catch (err) {
      console.log(err);
      alert("Create post failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          🍴 Create Post
        </h1>
        <p className="text-gray-600 text-center mb-4 text-sm">
          Share a dish with the community
        </p>

        <form onSubmit={handleForm} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="Dish Name"
            className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          required/>
          <input
            value={price}
            onChange={(e) => setprice(e.target.value)}
            placeholder="Price"
            className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          required/>
          
          <input
            value={image}
            onChange={(e) => setimage(e.target.value)}
            placeholder="Image URL"
            className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          />
          <input
            value={city}
            onChange={(e) => setcity(e.target.value)}
            placeholder="City"
            className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          required/>
          <input
            value={category}
            onChange={(e) => setcategory(e.target.value)}
            placeholder="Category"
            className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          required/>
          
          <textarea
            value={desc}
            onChange={(e) => setdesc(e.target.value)}
            rows="3"
            placeholder="Description"
            className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none"
          ></textarea>

          <button
            type="submit"
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium text-sm transition duration-300 shadow-md"
          >
            🚀 Create Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addpro;
