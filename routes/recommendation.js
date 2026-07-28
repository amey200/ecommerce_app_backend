const express = require("express");
const router = express.Router();

const products = require("../data/recommendation.json");
const wishlist = require("../data/wishlist.json");

router.get("/recommendation", (req, res) => {

    const userEmail = req.query.userEmail;

    const updatedProducts = products.data.map((product) => {

        // Check product is present in logged-in user's wishlist
        const isFavourite = wishlist.data.some(
            (wishlistItem) =>
                wishlistItem.user?.userEmail === userEmail &&
                wishlistItem.wishListItem?.itemId === product.itemId
        );

        return {
            ...product,
            fav: isFavourite ? 1 : 0
        };
    });

    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: updatedProducts
    });

});

module.exports = router;