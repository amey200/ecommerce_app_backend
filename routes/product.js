const express = require("express");
const router = express.Router();

const products = require("../data/products.json");

//
// Recommended Products
//
router.get("/recommendation", (req, res) => {

    res.status(200).json(products);

});

//
// Category Products
//
router.get("/get/:category/all", (req, res) => {

    const category = req.params.category;

    const filteredProducts = products.data.filter(
        (item) =>
            item.category.toLowerCase() === category.toLowerCase()
    );

    res.status(200).json({
        success: true,
        message: "Category products fetched successfully",
        data: filteredProducts
    });

});

//
// Product Details
//
router.get("/get/single", (req, res) => {

    const id = parseInt(req.query.id);

    const product = products.data.find(
        (item) => item.itemId === id
    );

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Product details fetched successfully",
        data: {
            ...product,
            timeStamp: new Date().toISOString()
        }
    });

});

module.exports = router;