import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import Webcam from "react-webcam";

const PRIMARY_COLOR = "#23204B";
const ACCENT_COLOR = "#B30F27";
const API_URL = "http://localhost:3001/api/presensi";
const getToken = () => localStorage.getItem("token");

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);
  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }),
        (err) => setError("Gagal mendapatkan lokasi: " + err.message)
      );
    } else {
      setError("Browser tidak mendukung Geolocation.");
    }
  }, []);

  const handleCheckIn = async () => {
    setError("");
    setMessage("");
    const token = getToken();

    if (!coords || !image) {
      setError("Lokasi dan Foto wajib ada sebelum Check-in!");
      return;
    }

    try {
      const blob = await (await fetch(image)).blob();

      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type: multipart/form-data DITANGANI OLEH AXIOS
        },
      };

      const response = await axios.post(
        `${API_URL}/check-in`,
        formData,
        config
      );
      setMessage(response.data.message);
      setImage(null);
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
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
      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        navigate("/login");
      } else {
        setError(err.response ? err.response.data.message : "Check-out gagal");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg text-center border border-gray-100">
        <h2
          className="text-3xl font-bold mb-6"
          style={{ color: PRIMARY_COLOR }}
        >
          Presensi Lokasi & Foto
        </h2>

        <div className="my-4 border-4 border-gray-300 rounded-lg overflow-hidden bg-black h-64 w-full flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt="Selfie Capture"
              className="w-full h-full object-cover"
            />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{ facingMode: "user" }}
            />
          )}
        </div>

        <div className="mb-4">
          {!image ? (
            <button
              onClick={capture}
              className="bg-blue-600 text-white py-2 rounded w-full font-semibold hover:bg-blue-700"
            >
              Ambil Foto 📸
            </button>
          ) : (
            <button
              onClick={() => setImage(null)}
              className="bg-gray-500 text-white py-2 rounded w-full font-semibold hover:bg-gray-600"
            >
              Foto Ulang 🔄
            </button>
          )}
        </div>

        {coords && (
          <div
            className="mb-6 border-2 rounded-lg overflow-hidden h-48 w-full shadow-inner"
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
                <Popup>Lokasi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {message && (
          <p className="text-green-600 bg-green-100 p-3 rounded mb-4">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</p>
        )}

        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={handleCheckIn}
            className="flex-1 py-3 px-4 text-white font-bold rounded-lg shadow-md hover:shadow-lg"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            CHECK-IN
          </button>
          <button
            onClick={handleCheckOut}
            className="flex-1 py-3 px-4 text-white font-bold rounded-lg shadow-md hover:shadow-lg"
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
