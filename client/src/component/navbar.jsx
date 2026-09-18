import { NavLink, useNavigate } from "react-router-dom";
import { useState,useEffect } from "react";

const Navbar = ({  auth, setAuth}) => {
  const navigate = useNavigate();

  const [adminToken, setAdminToken] = useState(
  localStorage.getItem("adminToken")
);

const [userToken, setUserToken] = useState(
  localStorage.getItem("userToken")
);

  const handleLogout = () => {

    console.log("LOGOUT CLICKED"); 

    // Remove ALL authentication data
     localStorage.removeItem("adminToken");
      localStorage.removeItem("admin"); 
      localStorage.removeItem("userToken"); 

     // Reset React auth state
      setAuth({ role: null, isLoggedIn: false, });
      
    //  // Go to login page
     navigate("/user/login", { replace: true }); };
    
 
  
  return (
    <nav className="top-navbar">
      {/* logo */}
      <div className="nav-brand">
        <span className="brand-mark">GS</span>
        <span>Grocery Store</span>
      </div>
      {/* ================= ADMIN LOGGED IN ================= */} 

     {auth?.isLoggedIn && auth?.role === "admin" && (
      <> 
      <div className="nav-links"> 

               <NavLink to="/admin/dashboard" className="nav-link">
              Dashboard
            </NavLink>

            <NavLink to="/admin/register" className="nav-link">
              Register Admin
            </NavLink>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      )}
       

{/* ================= USER LOGGED IN ================= */} 

{auth?.isLoggedIn && auth?.role === "user" &&( 
  <> 
  <div className="nav-links"> 
       <NavLink to="/user/dashboard" className="nav-link">
              Dashboard
            </NavLink>

            <NavLink to="/user/products" className="nav-link">
              Products
            </NavLink>

            <NavLink to="/user/profile" className="nav-link">
              Profile
            </NavLink>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      )}

{/* ================= NOT LOGGED IN ================= */}
{!auth?.isLoggedIn && 

  ( <div className="nav-links"> 

        <NavLink to="/admin/login" className="nav-link">
            Admin Login
          </NavLink>

          <NavLink to="/user/login" className="nav-link">
            User Login
          </NavLink>

        </div>
      )}

    </nav>
  );
};
  
      


export default Navbar; 
