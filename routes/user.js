const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const userFile = path.join(__dirname, "../data/users.json");

router.post("/add", (req, res) => {

    const { userEmail, userName, mobileNo } = req.body;

    if (!userEmail) {
        return res.status(400).json({
            success: false,
            message: "User Email Required"
        });
    }

    const users = JSON.parse(fs.readFileSync(userFile));

    const userExist = users.data.find(
        (item) => item.userEmail === userEmail
    );

    if (userExist) {

        return res.status(201).json({
            success: true,
            message: "User Already Exists",
            data: userExist
        });

    }

    const newUser = {
        userId: users.data.length + 1,
        userName,
        userEmail,
        mobileNo
    };

    users.data.push(newUser);

    fs.writeFileSync(
        userFile,
        JSON.stringify(users, null, 2)
    );

    res.status(201).json({
        success: true,
        message: "User Registered Successfully",
        data: newUser
    });

});

module.exports = router;