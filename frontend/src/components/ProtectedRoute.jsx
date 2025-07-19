import React from "react";
import { Navigate, Route } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to={"login"} />;
};

export default ProtectedRoute;
