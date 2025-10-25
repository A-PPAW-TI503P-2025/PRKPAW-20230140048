const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan"); 
// Inisialisasi aplikasi Express
const app = express();
const PORT = 3001;

// Panggil dan impor router dari file lain
const bookRoutes = require("./routes/book");
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");

// ------------------ MIDDLEWARE ------------------

app.use(cors()); 
app.use(helmet()); // Mengatur header HTTP untuk keamanan
app.use(morgan("dev")); // Logging request (menggunakan format 'dev' untuk output singkat) [cite: 220]

// Built-in Middleware
// Middleware untuk parsing body JSON dari request
app.use(express.json()); 

// Custom Application-level Middleware (sudah ada dari code Anda)
// Middleware untuk logging setiap request yang masuk
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ------------------ ROUTES ------------------
// Rute untuk halaman utama
app.get("/", (req, res) => {
  res.send("Selamat Datang di API Manajemen Buku Perpustakaan!");
});

// Daftarkan Router
app.use("/api/books", bookRoutes);

// Daftarkan Router baru untuk Presensi dan Report
app.use("/api/presensi", presensiRoutes); 
app.use("/api/reports", reportRoutes); 

// Middleware untuk menangani 404 Not Found (jika request tidak cocok dengan rute manapun di atas)
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Terjadi kesalahan pada server" });
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});