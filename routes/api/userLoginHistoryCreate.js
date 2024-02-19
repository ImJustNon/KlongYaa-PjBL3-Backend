const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const { comparePassword } = require("../../utilities/comparePassword");
const { parseTimestampToLocal } = require("../../utilities/parseTimestampToLocal");
const { promiseQuery } = require("../../utilities/promiseQuery");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/user/login/history/create", urlEncoded, async(req, res) => {
    const { userToken, deviceId } = req.body ?? {};

    if(!userToken || !deviceId){
        return res.json({
            status: "FAIL",
            message: "Please complete your information",
        });
    }

    // validate user
    const validateUserQuery = "SELECT user_id FROM users WHERE user_token=?";
    connection.query(validateUserQuery, [String(userToken)], (err, user_results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot validate user in this time",
                error: err
            });
        }

        if(user_results.length === 0){
            return res.json({
                status: "FAIL",
                message: "user not found"
            });
        }

        // validate device
        const validateDeviceQuery = "SELECT device_id FROM devices WHERE device_id=?";
        connection.query(validateDeviceQuery, [String(deviceId)], async(err, device_results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot validate device in this time",
                    error: err
                });
            }

            if(device_results.length === 0){
                return res.json({
                    status: "FAIL",
                    message: "device not found"
                });
            }

            // delete same data for make sure no same data
            await promiseQuery({
                query: "DELETE FROM login_history WHERE user_token=? AND device_id=?",
                values: [String(userToken), String(deviceId)]
            });
            // get current time
            const createAt = new Date().getTime();
            // create new history for this user
            const createLoginHistory = "INSERT INTO login_history (device_id, user_token, login_at, create_at) VALUES (?, ?, ?, ?)";
            connection.query(createLoginHistory, [String(deviceId), String(userToken), String(createAt), String(createAt)], (err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        message: "Cannot create new login history in this time",
                        error: err
                    });
                }
        
                return res.json({
                    status: "OK",
                    message: "Create history success"
                });
            });
        });
    });
});

module.exports = router;