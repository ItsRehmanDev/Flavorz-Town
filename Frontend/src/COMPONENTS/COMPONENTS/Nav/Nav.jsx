import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("email");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-[1200px] mx-auto px-20 flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="logo" className="h-12 w-12 rounded-full" />
          <span className="text-xl font-semibold text-gray-800">Flavor Town</span>
        </div>
        <ul className="flex gap-8 text-sm font-medium text-gray-700">
          <li onClick={() => scrollTo("home")} className="cursor-pointer">Home</li>
          <li onClick={() => scrollTo("about")} className="cursor-pointer">About</li>
          <li onClick={() => scrollTo("Menu")} className="cursor-pointer">Menu</li>
          <li onClick={() => scrollTo("contact")} className="cursor-pointer">Contact</li>
        </ul>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md">Log Out</button>
          ) : (
            <Link to="/login" className="px-4 py-2 border rounded-md text-gray-800 text-sm">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
