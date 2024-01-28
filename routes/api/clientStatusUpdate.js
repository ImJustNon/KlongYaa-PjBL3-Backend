const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const { comparePassword } = require("../../utilities/comparePassword");
const { parseTimestampToLocal } = require("../../utilities/parseTimestampToLocal");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});

const LastOnlineData = require("../../utilities/lastOnlineData");
const data = new LastOnlineData();
router.post("/api/client/status/update", urlEncoded, async(req, res) => {
    const { boxId } = req.body ?? {};

    if(!boxId){
        return res.json({
            status: "FAIL",
            message: "Please complete your information"
        });
    }

    data.update(boxId);

    return res.json({
        status: "OK",
        message: "Update success",
    });
});

module.exports = router;