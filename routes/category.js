const express = require("express");
const router = express.Router();

const categories = require("../data/categories.json");

router.get("/all", (req, res) => {
    res.status(200).json(categories);
});

module.exports = router;