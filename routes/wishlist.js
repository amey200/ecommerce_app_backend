const express = require("express");
const router = express.Router();

const wishlist = require("../data/wishlist.json");
const products = require("../data/products.json");

//
// Get Wishlist
//
router.get("/all", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Wishlist fetched successfully",
    data: wishlist.data
  });
});

//
// Add To Wishlist
//
router.post("/add", (req, res) => {
  const itemId = item.itemId;

  const product = products.data.find(
    (item) => item.itemId == itemId
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  const alreadyAdded = wishlist.data.find(
    (item) => item.wishListItem.itemId == itemId
  );

  if (alreadyAdded) {
    return res.status(200).json({
      success: true,
      message: "Already in wishlist"
    });
  }

  const newWishListItem = {
    wishListId: wishlist.data.length + 1,
    wishListItem: {
      itemId: product.itemId,
      itemName: product.itemName,
      itemDescription: product.itemDescription,
      itemImage: product.itemImage,
      actualPrice: product.actualPrice,
      discountPrice: product.discountPrice,
      fav: 1
    }
  };

  wishlist.data.push(newWishListItem);

  res.status(200).json({
    success: true,
    message: "Added to wishlist successfully",
    data: newWishListItem
  });
});

//
// Remove Wishlist Item
//
router.delete("/remove/item/:id", (req, res) => {

  const itemId = parseInt(req.params.id);

  const index = wishlist.data.findIndex(
    (item) => item.wishListItem.itemId === itemId
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Wishlist item not found"
    });
  }

  wishlist.data.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Removed from wishlist successfully"
  });
});

module.exports = router;