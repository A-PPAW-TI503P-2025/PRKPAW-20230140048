import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PRIMARY_COLOR = "#23204B";
const ACCENT_COLOR = "#B30F27";

function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Loading...");
  const [userRole, setUserRole] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.nama);
        setUserRole(decodedToken.role.toUpperCase());
      } catch (error) {
        handleLogout();
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <div className="bg-white p-12 rounded-xl shadow-2xl text-center w-full max-w-lg transition duration-500 ease-in-out transform hover:scale-[1.02]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="#10B981"
          className="w-16 h-16 mx-auto mb-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
          Akses Diberikan!
        </h1>

        <p className="text-2xl text-gray-700 mt-6 mb-2">
          Selamat Datang,{" "}
          <span className="font-extrabold text-green-700">{userName}</span>!
        </p>
        <div
          className="inline-block px-4 py-1 mb-8 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          ROLE: {userRole}
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 px-6 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-300"
          style={{ backgroundColor: ACCENT_COLOR, outline: "none" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
