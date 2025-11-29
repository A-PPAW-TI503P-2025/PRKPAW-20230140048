import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix icon leaflet
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const PRIMARY_COLOR = "#23204B"; // Biru Tua (Check-In)
const ACCENT_COLOR = "#B30F27"; // Merah (Check-Out)

const API_URL = "http://localhost:3001/api/presensi";
const getToken = () => localStorage.getItem("token");

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError("Gagal mendapatkan lokasi: " + err.message);
        }
      );
    } else {
      setError("Browser tidak mendukung Geolocation.");
    }
  }, []);

  const handleCheckIn = async () => {
    setError("");
    setMessage("");
    const token = getToken();

    if (!coords) {
      setError("Lokasi belum didapatkan. Pastikan GPS aktif.");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(
        `${API_URL}/check-in`,
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(err.response ? err.response.data.message : "Check-in gagal");
      }
    }
  };

  const handleCheckOut = async () => {
    setError("");
    setMessage("");
    const token = getToken();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(`${API_URL}/check-out`, {}, config);
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-out gagal");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg text-center border border-gray-100">
        <h2
          className="text-3xl font-bold mb-6"
          style={{ color: PRIMARY_COLOR }}
        >
          Presensi Lokasi
        </h2>

        {/* Peta */}
        {coords ? (
          <div
            className="mb-6 border-4 rounded-lg overflow-hidden h-64 w-full shadow-inner"
            style={{ borderColor: PRIMARY_COLOR }}
          >
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Anda Saat Ini</Popup>
              </Marker>
            </MapContainer>
          </div>
        ) : (
          <div className="mb-6 h-64 w-full bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
            <p className="text-gray-500 italic">Sedang mengambil lokasi...</p>
          </div>
        )}

        {/* Pesan Sukses/Error */}
        {message && (
          <div
            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded"
            role="alert"
          >
            <p>{message}</p>
          </div>
        )}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {/* Tombol Aksi */}
        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={handleCheckIn}
            className="flex-1 py-3 px-4 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-[1.02]"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            CHECK-IN
          </button>
          <button
            onClick={handleCheckOut}
            className="flex-1 py-3 px-4 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-[1.02]"
            style={{ backgroundColor: ACCENT_COLOR }}
          >
            CHECK-OUT
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
