const { Presensi } = require("../models");

exports.getDailyReport = async (req, res) => {
  try {
    console.log("Controller: Mengambil data laporan harian dari database...");

    const presensiRecords = await Presensi.findAll({
      order: [["checkIn", "DESC"]],
    });

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: presensiRecords,
    });
  } catch (error) {
    console.error("Error saat mengambil laporan:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengakses database laporan.",
      error: error.message,
    });
  }
};
