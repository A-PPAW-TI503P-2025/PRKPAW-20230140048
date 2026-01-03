// Lokasi: tugas2/controllers/iotController.js
const { SensorLog } = require("../models");

// FUNGSI 1: Menerima Data dari ESP32 & Simpan ke DB
exports.receiveSensorData = async (req, res) => {
  try {
    const { suhu, kelembaban, cahaya } = req.body;

    // Validasi sederhana (biar gak error kalau data kosong)
    if (suhu === undefined || kelembaban === undefined) {
      return res
        .status(400)
        .json({ status: "error", message: "Data tidak lengkap" });
    }

    // Simpan ke Database
    await SensorLog.create({
      suhu: parseFloat(suhu),
      kelembaban: parseFloat(kelembaban),
      cahaya: parseInt(cahaya) || 0,
    });

    console.log(
      `💾 [SAVED] Suhu: ${suhu}°C | Lembab: ${kelembaban}% | Cahaya: ${cahaya}`
    );
    res.status(201).json({ status: "ok", message: "Data berhasil disimpan" });
  } catch (error) {
    console.error("Gagal menyimpan data:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// FUNGSI 2: Mengambil Data untuk Grafik Frontend
exports.getSensorHistory = async (req, res) => {
  try {
    // Ambil 20 data terakhir
    const data = await SensorLog.findAll({
      limit: 20,
      order: [["createdAt", "DESC"]],
    });

    // Balik urutan biar grafik jalan dari Kiri (Lama) ke Kanan (Baru)
    const formattedData = data.reverse();

    res.json({ status: "success", data: formattedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
