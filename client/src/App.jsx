
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./component/protectRoutes";
import ProtectedUser from "./component/protectUser";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import UserDashboard from "./pages/UserDashboard";
import UserLogin from "./pages/UserLogin";
import UserProduct from "./pages/UserProduct";
import UserProfile from "./pages/UserProfile";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
  
        <Route path="/" element={<Navigate to="/user/login" replace />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* User routes */}
        <Route path="/user/login" element={<UserLogin />} />
        <Route
          path="/user/dashboard"
          element={
            <ProtectedUser>
              <UserDashboard />
            </ProtectedUser>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedUser>
              <UserProfile />
            </ProtectedUser>
          }
        />
        <Route
          path="/user/products"
          element={
            <ProtectedUser>
              <UserProduct />
            </ProtectedUser>
          }
        />

        <Route path="*" element={<Navigate to="/user/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
