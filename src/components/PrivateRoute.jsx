import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children }) {
  const auth = useSelector((s) => s.auth);
  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
