const express = require("express");
const router = express.Router();

const products = require("../data/products.json");
const wishlist = require("../data/wishlist.json");


function getProductWithFav(product, userEmail) {
    const isFavourite = wishlist.data.some(
        (wishlistItem) =>
            wishlistItem.user?.userEmail === userEmail &&
            wishlistItem.wishListItem?.itemId === product.itemId
    );

    return {
        ...product,
        fav: isFavourite ? 1 : 0
    };
}



router.get("/get/:category/all", (req, res) => {

    const category = req.params.category;

    const filteredProducts = products.data
    .filter(
        (item) =>
            item.category.toLowerCase() === category.toLowerCase()
    )
    .map(
        (product) => getProductWithFav(product, userEmail)
    );

    res.status(200).json({
        success: true,
        message: "Category products fetched successfully",
        data: filteredProducts
    });

});

//
// Category Products
//
router.get("/get/:category/all", (req, res) => {

    const category = req.params.category;
    const userEmail = req.query.userEmail;

    const filteredProducts = products.data
        .filter(
            (item) =>
                item.category.toLowerCase() === category.toLowerCase()
        )
        .map(
            (product) => getProductWithFav(product, userEmail)
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
    const userEmail = req.query.userEmail;

    const product = products.data.find(
        (item) => item.itemId === id
    );

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    const updatedProduct = getProductWithFav(
        product,
        userEmail
    );

    res.status(200).json({
        success: true,
        message: "Product details fetched successfully",
        data: {
            ...updatedProduct,
            timeStamp: new Date().toISOString()
        }
    });
});


module.exports = router;