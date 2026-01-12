import { BrowserRouter, useRoutes } from "react-router-dom";
import { useEffect } from "react";

import DashboardLayout from "./layouts/DashboardLayout";
import { protectedRoutes, publicRoutes } from "./routes/routes";

// ✅ Correct import (side-effect safe)
// import "./firebaseInit";

function AppRoutesWrapper() {
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  const routes = isAuthenticated
    ? [{ element: <DashboardLayout />, children: protectedRoutes }]
    : publicRoutes;

  return useRoutes(routes);
}

export default function App() {
//   useEffect(() => {
//     // ✅ Register service worker ONCE
//     if ("serviceWorker" in navigator) {
//       navigator.serviceWorker.register("/firebase-messaging-sw.js");
//     }
//   }, []);

  return (
    <BrowserRouter>
      <AppRoutesWrapper />
    </BrowserRouter>
  );
}
