// components/LoginRedirect.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Login from "../pages/Login";

const LoginRedirect = () => {
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const role = localStorage.getItem("user_name");

    if (userData && role) {
      setIsLoggedIn(true);
      setUserRole(role);
    }

    setChecking(false);
  }, []);

  if (checking) return null; // or a loading spinner

  if (isLoggedIn) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return <Login />;
};

export default LoginRedirect;
