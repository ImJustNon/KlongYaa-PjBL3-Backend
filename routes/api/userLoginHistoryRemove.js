const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const { comparePassword } = require("../../utilities/comparePassword");
const { parseTimestampToLocal } = require("../../utilities/parseTimestampToLocal");
const { is1DayPassed } = require("../../utilities/is1DayPassed");
const { promiseQuery } = require("../../utilities/promiseQuery");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/user/login/history/remove", urlEncoded, async(req, res) => {
    const { userToken, deviceId } = req.body ?? {};
    
    if(!userToken || !deviceId){
        return res.json({
            status: "FAIL",
            message: "Please complete your information",
        });
    }

    // validate user
    const validateUserQuery = "SELECT user_id FROM users WHERE user_token=?";
    connection.query(validateUserQuery, [String(userToken)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot validate user in this time",
                error: err
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "User not found"
            });
        }

        // validate device
        const validateDeviceQuery = "SELECT device_id FROM devices WHERE device_id=?";
        connection.query(validateDeviceQuery, [String(deviceId)], (err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot validate device in this time",
                    error: err
                });
            }

            if(results.length === 0){
                return res.json({
                    status: "FAIL",
                    message: "Device not found",
                });
            }

            //delete history
            const removeFromHistoryQuery = "DELETE FROM login_history WHERE user_token=? AND device_id=?";
            connection.query(removeFromHistoryQuery, [String(userToken), String(deviceId)], (err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        message: "Cannot get login history information in this time",
                        error: err
                    });
                }

                return res.json({
                    status: "OK",
                    message: "Remove success",
                });
            });
        });
    });
});

module.exports = router;