import React from "react";
import { Navigate } from "react-router-dom";

const RoleProtectedRoute = ({ children, allowedRoles, currentPath }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Agar user login hi nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar homepage role hai aur woh dusri jagah jana chahe → logout + login page
  if (user.role === "homepage") {
    if (currentPath !== "/homepage") {
      localStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }
  }

  // Agar dashboard role hai aur woh dusri jagah jana chahe → logout + login page
  if (user.role === "dashboard") {
    if (currentPath !== "/dashboard") {
      localStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }
  }

  // Agar role allowedRoles me hi nahi hai → login bhejo
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
