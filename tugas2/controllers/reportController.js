const { Presensi } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    let options = {
      where: {},
      order: [["checkIn", "DESC"]],
    };

    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    if (tanggalMulai && tanggalSelesai) {
      options.where.checkIn = {
        [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)],
      };
    }

    console.log("Controller: Mengambil data laporan dari database...");

    const presensiRecords = await Presensi.findAll(options);

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
