
const express = require("express");
const router = express.Router();

const addresses = require("../data/address.json");

//
// Get All Addresses
//
router.get("/addresses", (req, res) => {
  const userEmail = req.query.userEmail;

  const userAddresses = addresses.data.filter(
    (address) => address.userEmail === userEmail
  );

  res.status(200).json({
    success: true,
    message: "Addresses fetched successfully",
    data: userAddresses
  });
});

//
// Add Address
//
router.post("/address/add", (req, res) => {
  const { address, user 
  } = req.body;

  const userEmail = user?.userEmail;

  if (
   !address || !user
  ) {
    return res.status(400).json({
      success: false,
      message: "All required fields are mandatory"
    });
  }

  const newAddress = {
    addressId: addresses.data.length + 1,
    userEmail,
    fullName,
    mobileNumber,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    addressType,
    defaultAddress: addresses.data.length === 0
  };

  addresses.data.push(newAddress);

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    data: newAddress
  });
});

//
// Delete Address
//
router.delete("/address/remove/:id", (req, res) => {
  const addressId = parseInt(req.params.id);

  const index = addresses.data.findIndex(
    (address) => address.addressId === addressId
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Address not found"
    });
  }

  addresses.data.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Address removed successfully"
  });
});

module.exports = router;