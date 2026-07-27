const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const addressFilePath = path.join(__dirname, "../data/address.json");

//
// Get All Addresses
//
router.get("/addresses", (req, res) => {
  const { userEmail } = req.query;

  const addresses = JSON.parse(
    fs.readFileSync(addressFilePath, "utf8")
  );

  const userAddresses = addresses.data.filter(
    (address) => address.userEmail === userEmail
  );

  res.status(200).json({
    success: true,
    message: "Addresses fetched successfully",
    data: userAddresses,
  });
});

//
// Add Address
//
router.post("/address/add", (req, res) => {
  const { address, userEmail } = req.body;

  if (!address || !userEmail) {
    return res.status(400).json({
      success: false,
      message: "All required fields are mandatory",
    });
  }

  const addresses = JSON.parse(
    fs.readFileSync(addressFilePath, "utf8")
  );

  const newAddress = {
    addressId: addresses.data.length + 1,
    address,
    userEmail,
  };

  addresses.data.push(newAddress);

  fs.writeFileSync(
    addressFilePath,
    JSON.stringify(addresses, null, 2)
  );

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    data: newAddress,
  });
});

//
// Delete Address
//
router.delete("/address/remove/:id", (req, res) => {
  const addressId = parseInt(req.params.id);

  const addresses = JSON.parse(
    fs.readFileSync(addressFilePath, "utf8")
  );

  const index = addresses.data.findIndex(
    (address) => address.addressId === addressId
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Address not found",
    });
  }

  addresses.data.splice(index, 1);

  fs.writeFileSync(
    addressFilePath,
    JSON.stringify(addresses, null, 2)
  );

  res.status(200).json({
    success: true,
    message: "Address removed successfully",
  });
});

module.exports = router;