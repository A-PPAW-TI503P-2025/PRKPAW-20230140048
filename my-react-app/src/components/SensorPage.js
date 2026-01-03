import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SensorPage() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/iot/history");
      const dataSensor = response.data.data;

      const labels = dataSensor.map((item) =>
        new Date(item.createdAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );

      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Suhu (°C)",
            data: dataSensor.map((item) => item.suhu),
            borderColor: "rgb(255, 99, 132)", // Merah
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            tension: 0.2,
          },
          {
            label: "Kelembaban (%)",
            data: dataSensor.map((item) => item.kelembaban),
            borderColor: "rgb(53, 162, 235)", // Biru
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            tension: 0.2,
          },
          {
            label: "Cahaya (LDR)",
            data: dataSensor.map((item) => item.cahaya),
            borderColor: "rgb(255, 205, 86)", // Kuning
            backgroundColor: "rgba(255, 205, 86, 0.5)",
            tension: 0.2,
            yAxisID: "y1", // Sumbu Y terpisah karena angkanya besar
          },
        ],
      });
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Auto refresh 5 detik
    return () => clearInterval(interval);
  }, []);

  const options = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    scales: {
      y: { type: "linear", display: true, position: "left" },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: { drawOnChartArea: false },
      },
    },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monitoring IoT Real-time" },
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">
        Dashboard Monitoring IoT
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <Line options={options} data={chartData} />
      </div>
    </div>
  );
}

export default SensorPage;
