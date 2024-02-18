const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const bcrypt = require('bcrypt');
const { encryptPassword } = require("../../utilities/encryptPassword");
const { connection } = require("../../database/mysql_connection");
const { genToken } = require("../../utilities/genToken");
const { isValidEmail } = require("../../utilities/isValidEmail");
const { isValidPassword } = require("../../utilities/isValidPassword");

router.get("/test/test/test/:time", urlEncoded, async(req, res) => {
    const {time} = req.params ?? {};
    return res.json({
        time: (new Date(parseInt(time)).getTime())
    });
});

module.exports = router;