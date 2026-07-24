const express = require("express");
const router = express.Router();

const products = require("../data/products.json");

router.get("/recommendation", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Recommended products fetched successfully",
    data: products.data,
  });
});

module.exports = router;