import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { jwtDecode } from "jwt-decode";

const PRIMARY_COLOR = "#23204B";
const ACCENT_COLOR = "#B30F27";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
    
  }, [location.pathname]);

  
  if (!user) {
    return (
      <nav
        className="p-4 text-white shadow-md"
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        <Link to="/login" className="mr-6 font-semibold hover:text-gray-200">
          Login
        </Link>
        <Link to="/register" className="font-semibold hover:text-gray-200">
          Register
        </Link>
      </nav>
    );
  }

  return (
    <nav
      className="p-4 flex justify-between items-center text-white shadow-md"
      style={{ backgroundColor: PRIMARY_COLOR }}
    >
      
      <div className="flex space-x-6">
        <Link to="/dashboard" className="font-bold hover:text-gray-200">
          Dashboard
        </Link>
        <Link to="/presensi" className="hover:text-gray-200">
          Presensi
        </Link>
        
        {user.role === "admin" && (
          <Link
            to="/reports"
            className="hover:text-gray-200"
            style={{ color: ACCENT_COLOR }}
          >
            Laporan Admin
          </Link>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">
          Halo, {user.nama} ({user.role})
        </span>
        <button
          onClick={handleLogout}
          className="py-1 px-3 text-sm rounded font-semibold transition duration-200"
          style={{ backgroundColor: ACCENT_COLOR, color: "white" }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
