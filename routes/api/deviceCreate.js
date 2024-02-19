const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const { comparePassword } = require("../../utilities/comparePassword");
const { parseTimestampToLocal } = require("../../utilities/parseTimestampToLocal");
const { genDeviceId } = require("../../utilities/genDeviceId");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/device/create", urlEncoded, async(req, res) => {
    const deviceId = genDeviceId();

    const createAt = new Date().getTime();
    const addNewDevice = "INSERT INTO devices (device_id, create_at) VALUES (?, ?)";
    connection.query(addNewDevice, [String(deviceId), String(createAt)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot create new device id in this time",
                error: err
            });
        }

        return res.json({
            status: "OK",
            message: "Generate device id success",
            data: {
                deviceId: deviceId,
            }
        });
    });
    
});

module.exports = router;