import { Navigate, useLocation } from "react-router-dom";

interface RequireAccessProps {
  roles: ("admin" | "vendor")[];
  children: React.ReactNode;
}

export default function RequireAccess({ roles, children }: RequireAccessProps) {
  const location = useLocation();
  const isAdmin = localStorage.getItem("is_admin") === "true";
  const token = localStorage.getItem("token");

  let myPermissions: Record<string, boolean> = {};
  try {
    const stored = localStorage.getItem("my_permissions");
    if (stored) myPermissions = JSON.parse(stored);
  } catch {
    myPermissions = {};
  }

  // Redirect to login if not authenticated
  if (!token) return <Navigate to="/login" replace />;

  const userRole: "admin" | "vendor" = isAdmin ? "admin" : "vendor";

  // Role check
  if (!roles.includes(userRole)) return <Navigate to="/403" replace />;

  // Permission check (for admins)
  if (userRole === "admin") {
    // Convert path to permission key: "/roles" -> "Roles", "/admin-panel" -> "AdminPanel"
    const pathKey = location.pathname
      .split("/")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
      
    if (!myPermissions[pathKey]) return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
