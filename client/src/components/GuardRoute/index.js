import * as React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function GuestOnlyRoute({ children }) {
  let authenticated = localStorage.getItem("authenticated");
  if (authenticated === null) return <Navigate to="/" replace={true} />;

  return children || <Outlet />;
}
