import { Navigate } from "react-router-dom";
import Navbar from "./navbar";

const ProtectedUser = ({ children }) => {
  const token = localStorage.getItem("userToken");

  if (!token) {
    return <Navigate to="/user/login" replace />;
  }

  return (
    <>
     
      {children}
    </>
  );
};

export default ProtectedUser;
