import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001/api/reports/daily";
// Pastikan BASE_URL mengarah ke root backend Anda
const BASE_URL = "http://localhost:3001/";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");

  // State untuk Modal (Popup Gambar)
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchReports = async (query = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      let dateQuery = "";
      if (tanggalMulai && tanggalSelesai) {
        dateQuery = `&tanggalMulai=${tanggalMulai}T00:00:00Z&tanggalSelesai=${tanggalSelesai}T23:59:59Z`;
      }

      const response = await axios.get(
        `${API_URL}?nama=${query}${dateQuery}`,
        config
      );
      setReports(response.data.data);
      setError(null);
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data.message
        : "Gagal mengambil data laporan.";
      setError(errorMessage);
      setReports([]);

      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 1500);
      }
    }
  };

  useEffect(() => {
    fetchReports("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Laporan Presensi
      </h1>

      {/* --- MODAL POPUP GAMBAR --- */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center"
          onClick={() => setSelectedPhoto(null)} // Tutup saat klik background
        >
          <div
            className="bg-white p-4 rounded-lg max-w-xl max-h-screen overflow-auto"
            onClick={(e) => e.stopPropagation()} // Cegah tutup saat klik gambar
          >
            <img
              src={selectedPhoto}
              alt="Bukti Presensi Full"
              className="w-full h-auto rounded"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="mt-4 w-full py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* --- FILTER & SEARCH --- */}
      <form
        onSubmit={handleSearchSubmit}
        className="mb-6 space-y-4 p-4 border rounded-lg shadow-sm bg-gray-50"
      >
        <div className="flex space-x-2 items-center">
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
          >
            Cari Nama
          </button>
        </div>

        <div className="flex space-x-4 items-center">
          <label className="text-sm font-medium text-gray-700">
            Rentang Tanggal:
          </label>
          <input
            type="date"
            value={tanggalMulai}
            onChange={(e) => setTanggalMulai(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-gray-500">hingga</span>
          <input
            type="date"
            value={tanggalSelesai}
            onChange={(e) => setTanggalSelesai(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={() => fetchReports(searchTerm)}
            className="py-2 px-4 bg-gray-500 text-white font-semibold rounded-md shadow-sm hover:bg-gray-600"
          >
            Filter Tanggal
          </button>
        </div>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
      )}

      {/* --- TABEL LAPORAN --- */}
      {!error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bukti Foto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((presensi) => (
                  <tr key={presensi.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {presensi.user ? presensi.user.nama : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(presensi.checkIn).toLocaleString("id-ID", {
                        timeZone: "Asia/Jakarta",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.checkOut
                        ? new Date(presensi.checkOut).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                          })
                        : "Belum Check-Out"}
                    </td>

                    {/* --- KOLOM BUKTI FOTO --- */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {presensi.buktiFoto ? (
                        <img
                          // Menggabungkan BASE_URL dengan path dari database
                          src={`${BASE_URL}${presensi.buktiFoto}`}
                          alt="Bukti"
                          className="w-12 h-12 object-cover rounded-md cursor-pointer hover:opacity-80 transition border border-gray-300"
                          onClick={() =>
                            setSelectedPhoto(`${BASE_URL}${presensi.buktiFoto}`)
                          }
                        />
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReportPage;
