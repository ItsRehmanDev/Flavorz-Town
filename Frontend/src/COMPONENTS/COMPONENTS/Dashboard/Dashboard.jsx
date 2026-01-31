import React, { useState } from "react";
import Addpro from "../Addpro/Addpro";
import Analytics from "../Analytics/Analytics";
import Allpro from "../Allpro/Allpro";
import Order from "../Order/Order";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("Welcome"); 

  const menuItems = [
    { name: "Analytics", icon: "📊" },
    { name: "Orders", icon: "🛒" },
    { name: "Add Product", icon: "➕" },
    { name: "All Products", icon: "📦" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Analytics":
        return <Analytics />;
      case "Orders":
        return <Order />;
      case "Add Product":
        return <Addpro />;  
      case "All Products":
        return <Allpro />;
      default:
        return <p>Welcome to the Dashboard! Select an option from the sidebar.</p>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
     
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">My Dashboard</h2>

        <div className="bg-blue-500 text-white p-4 rounded-xl shadow flex items-center mb-8">
          <div className="flex items-center space-x-3">
            <img
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
              src="https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2534623311.jpg"
              alt="Admin"
            />
            <div>
              <span className="text-lg font-semibold">Admin</span>
              <span className="text-sm font-semibold block text-green-200">Online</span>
            </div>
          </div>
        </div>

        <nav className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full text-left px-4 py-2 rounded-lg hover:bg-gray-200 transition ${
                activeTab === item.name ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>
      </aside>

     
      <main className="flex-1 p-8">
        <div className="bg-white p-6 rounded-xl shadow min-h-[400px]">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">{activeTab}</h1>
          <div className="mt-4">{renderContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
