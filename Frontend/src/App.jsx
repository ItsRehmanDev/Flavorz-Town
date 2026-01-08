import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./COMPONENTS/Login/Login";
import SignUp from "./COMPONENTS/Signup/SignUp";
import HomePage from "./COMPONENTS/Homepage/HomePage";
import Dashboard from "./COMPONENTS/Dashboard/Dashboard";
import Addpro from "./COMPONENTS/Addpro/Addpro";
import Order from "./COMPONENTS/Order/Order";

const App = () => {
  const routes = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/homepage", element: <HomePage /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/order", element: <Order /> },
    { path: "/admin", element: <Addpro /> },
  ]);

  return <RouterProvider router={routes} />;
};

export default App;
