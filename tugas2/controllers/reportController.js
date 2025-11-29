const { Presensi, User } = require("../models"); // HARUS IMPORT USER JUGA
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    let options = {
      where: {},
      order: [["checkIn", "DESC"]],

      // --- FIX: EAGER LOADING DENGAN INCLUDE ---
      include: [
        {
          model: User,
          as: "user", // Harus sama dengan alias di models/presensi.js
          attributes: ["nama"], // Hanya ambil kolom 'nama'
        },
      ],
      // --- END FIX ---
    };

    // Filter Nama (Logika dari Modul 5)
    if (nama) {
      // Kita filter berdasarkan nama yang ada di tabel Users (tabel relasi)
      options.include[0].where = {
        nama: {
          [Op.like]: `%${nama}%`,
        },
      };
    }

    // Filter Rentang Tanggal (Logika dari Modul 5)
    if (tanggalMulai && tanggalSelesai) {
      options.where.checkIn = {
        [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)],
      };
    }

    console.log("Controller: Mengambil data laporan dari database...");

    // Query akan mengambil data Presensi DAN User terkait
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
