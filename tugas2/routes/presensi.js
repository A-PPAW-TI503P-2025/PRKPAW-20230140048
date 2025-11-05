const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { addUserData } = require("../middleware/permissionMiddleware");

const { body } = require("express-validator");

router.use(addUserData);

router.post("/check-in", presensiController.CheckIn);
router.post("/check-out", presensiController.CheckOut);

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

router.put("/:id", updateValidationRules, presensiController.updatePresensi);
router.delete("/:id", presensiController.deletePresensi);

module.exports = router;
