import { BrowserRouter, useRoutes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import { protectedRoutes, publicRoutes } from './routes/routes';

function AppRoutesWrapper() {
  // Check if a token exists in localStorage
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const routes = isAuthenticated
    ? [{ element: <DashboardLayout />, children: protectedRoutes }]
    : publicRoutes;

  return useRoutes(routes);
  
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutesWrapper />
    </BrowserRouter>
  );
}
