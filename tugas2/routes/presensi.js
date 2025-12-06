const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { body } = require("express-validator");
const { authenticateToken } = require("../middleware/permissionMiddleware");

const updateValidationRules = [
  body("checkIn")
    .optional()
    .isISO8601()
    .withMessage("Format checkIn harus tanggal ISO8601 yang valid"),
  body("checkOut")
    .optional()
    .isISO8601()
    .withMessage("Format checkOut harus tanggal ISO8601 yang valid"),
];

router.use(authenticateToken);

router.post(
  "/check-in",
  presensiController.upload.single("image"),
  presensiController.CheckIn
);
router.post("/check-out", presensiController.CheckOut);

router.put("/:id", updateValidationRules, presensiController.updatePresensi);

router.delete("/:id", presensiController.deletePresensi);

module.exports = router;
