const express = require("express");
const router = express.Router();

// Penyimpanan data sementara menggunakan array [cite: 142]
let books = [
  { id: 1, title: "Bumi Manusia", author: "Pramoedya Ananta Toer" },
  { id: 2, title: "Laskar Pelangi", author: "Andrea Hirata" },
];
let currentId = 2; // Untuk auto-increment ID buku baru

// --- IMPLEMENTASI ROUTING CRUD --- [cite: 141]

// READ: Mendapatkan semua buku (GET /api/books)
router.get("/", (req, res) => {
  res.json(books);
});

// READ: Mendapatkan satu buku berdasarkan ID (GET /api/books/:id)
router.get("/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    // Jika buku tidak ditemukan, kirim status 404
    return res.status(404).json({ message: "Buku tidak ditemukan" });
  }
  res.json(book);
});

// CREATE: Menambah buku baru (POST /api/books)
router.post("/", (req, res) => {
  const { title, author } = req.body;

  // Implementasi validasi input [cite: 143]
  if (!title || !author) {
    return res.status(400).json({ message: "Judul dan penulis harus diisi" });
  }

  currentId++;
  const newBook = {
    id: currentId,
    title,
    author,
  };

  books.push(newBook);
  res.status(201).json(newBook); // Status 201 artinya "Created"
});

// UPDATE: Memperbarui buku berdasarkan ID (PUT /api/books/:id)
router.put("/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Buku tidak ditemukan" });
  }

  const { title, author } = req.body;

  // Implementasi validasi input [cite: 143]
  if (!title || !author) {
    return res.status(400).json({ message: "Judul dan penulis harus diisi" });
  }

  const updatedBook = {
    id: bookId,
    title,
    author,
  };

  books[bookIndex] = updatedBook;
  res.json(updatedBook);
});

// DELETE: Menghapus buku berdasarkan ID (DELETE /api/books/:id)
router.delete("/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Buku tidak ditemukan" });
  }

  books.splice(bookIndex, 1);
  res.status(200).json({ message: "Buku berhasil dihapus" });
});

module.exports = router;
