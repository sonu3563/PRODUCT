// components/RedirectToDashboard.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const RedirectToDashboard = () => {
  const userData = localStorage.getItem("userData");
  const userRole = localStorage.getItem("user_name");

if (!userData || !userRole) {
  return <Navigate to="/login" replace />;
}


  return <Navigate to={`/${userRole}/dashboard`} />;
};

export default RedirectToDashboard;
