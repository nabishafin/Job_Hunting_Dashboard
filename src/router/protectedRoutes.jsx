import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectIsAuthenticated, selectUser } from "../stores/userSlice";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const location = useLocation();

  console.log("isAuthenticated:", isAuthenticated, "user:", user, "location:", location);

  // Redirect authenticated users away from /login
  if (isAuthenticated && location?.pathname === "/login" || location?.pathname === "/login/") {
    return <Navigate to="/" replace />;
  }

  // Redirect unauthenticated users to /login
  if (!isAuthenticated && location?.pathname !== "/login") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if no redirects are needed
  return children;
};

export default ProtectedRoute;
