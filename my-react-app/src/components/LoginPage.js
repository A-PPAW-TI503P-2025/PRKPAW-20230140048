import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const PRIMARY_COLOR = "#23204B";
const ACCENT_COLOR = "#B30F27";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          email: email,
          password: password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Masuk ke Sistem
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Min. 6 Karakter"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.01]"
            style={{ backgroundColor: ACCENT_COLOR, outline: "none" }}
          >
            LOGIN
          </button>
        </form>

        <p className="text-center text-sm mt-5 text-gray-600">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-semibold"
            style={{ color: PRIMARY_COLOR }}
          >
            Daftar di sini
          </Link>
        </p>

        {error && (
          <p
            className="text-white text-sm mt-4 text-center p-2 rounded-md"
            style={{ backgroundColor: ACCENT_COLOR }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
