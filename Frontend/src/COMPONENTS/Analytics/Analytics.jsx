import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const Analytics = () => {

  const data = [
    { name: "Pizza", sales: 50 },
    { name: "Burger", sales: 30 },
    { name: "Pasta", sales: 20 },
    { name: "Sushi", sales: 40 },
  ];

  return (
    <div className="bg-white p-4 rounded w-full h-[400px]">
      <h2 className="text-lg font-semibold mb-3">Sales Chart</h2>
      
     
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;
