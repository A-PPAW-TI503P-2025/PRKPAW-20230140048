import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  // Cek token saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Dekode token untuk mengambil nama
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.nama); // Ambil 'nama' dari payload token
      } catch (error) {
        console.error("Token tidak valid:", error);
        handleLogout(); // Jika token tidak valid, paksa logout
      }
    } else {
      // Jika tidak ada token, paksa kembali ke login
      navigate("/login");
    }
  }, [navigate]);

  // Fungsi Logout (Memenuhi TUGAS)
  const handleLogout = () => {
    localStorage.removeItem("token"); // Hapus token dari local storage
    navigate("/login"); // Arahkan kembali ke halaman login
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-10 rounded-lg shadow-md text-center w-full max-w-lg">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Login Sukses!
        </h1>

        {/* Tampilkan nama user */}
        <p className="text-xl text-gray-700 mb-8">
          Selamat Datang,{" "}
          <span className="font-bold">{userName || "Pengguna"}</span>!
        </p>

        <p className="text-gray-600 mb-8">
          Anda telah berhasil masuk ke halaman dashboard.
        </p>

        <button
          onClick={handleLogout}
          className="py-2 px-6 bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
