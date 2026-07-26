const express = require("express");
const router = express.Router();

const cart = require("../data/cart.json");
const products = require("../data/products.json");

//
// Get All Cart Products
//
router.get("/all", (req, res) => {

    const userEmail = req.query.userEmail;

    const userCart = cart.data.filter(
        (item) => item.user.userEmail === userEmail
    );

    res.status(200).json({
        success: true,
        message: "Cart products fetched successfully",
        data: userCart
    });

});

//
// Add To Cart
//
router.post("/add", (req, res) => {

    const itemId = req.body.cartItem?.itemId;
    const userEmail = req.body.user?.userEmail;

    const product = products.data.find(
        (item) => item.itemId == itemId
    );

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    const existingCart = cart.data.find(
        (item) =>
            item.user.userEmail === userEmail &&
            item.cartItem.itemId == itemId
    );

    if (existingCart) {

        existingCart.itemQuantity++;

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated successfully",
            data: existingCart
        });
    }

    const newCartItem = {
        cartId: cart.data.length + 1,
        user: {
            userEmail: userEmail
        },
        cartItem: product,
        itemQuantity: 1
    };

    cart.data.push(newCartItem);

    res.status(200).json({
        success: true,
        message: "Product added successfully",
        data: newCartItem
    });

});

//
// Change Cart Quantity
//
router.put("/add/quantity", (req, res) => {

    const cartId = parseInt(req.query.cartId);
    const quantity = parseInt(req.query.quantity);

    const cartItem = cart.data.find(
        (item) => item.cartId === cartId
    );

    if (!cartItem) {
        return res.status(404).json({
            success: false,
            message: "Cart item not found"
        });
    }

    // Remove Item
    if (quantity === 0) {

        const index = cart.data.findIndex(
            (item) => item.cartId === cartId
        );

        cart.data.splice(index, 1);

        return res.status(200).json({
            success: true,
            message: "Cart item removed successfully"
        });
    }

    // Update Quantity
    cartItem.itemQuantity = quantity;

    res.status(200).json({
        success: true,
        message: "Cart quantity updated successfully",
        data: cartItem
    });

});

module.exports = router;