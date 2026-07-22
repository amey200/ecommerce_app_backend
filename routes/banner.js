const express = require("express");
const router = express.Router();

const banners = require("../data/banners.json");

router.get("/all", (req, res) => {
    res.status(200).json(banners);
});

module.exports = router;