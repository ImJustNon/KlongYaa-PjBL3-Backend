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


router.post("/api/user/login/history/checkexpire", urlEncoded, async(req, res) => {
    const { deviceId, userToken } = req.body ?? {};

    if(!deviceId || !userToken){
        return res.json({
            status: "FAIL",
            message: "(auto logout) : Please complete your information",
        });
    }
    
    // validate user
    const validateUserQuery = "SELECT user_id FROM users WHERE user_token=?";
    connection.query(validateUserQuery, [String(userToken)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot validate user in this time",
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
                    message: "Cannot validate device in this time"
                });
            }

            if(results.length === 0){
                return res.json({
                    status: "FAIL",
                    message: "Device not found"
                });
            }

            const getHistoryDataQuery = "SELECT * FROM login_history WHERE user_token=? AND device_id=?";
            connection.query(getHistoryDataQuery, [String(userToken), String(deviceId)], async(err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        message: "Cannot get history information in this time"
                    });
                }

                // cannot find history send true for make it logout
                if(results.length === 0){
                    return res.json({
                        status: "OK",
                        message: "Cannot find your information from history data",
                        data: {
                            isExpire: true,
                        }
                    });
                }

                if(is1DayPassed(parseInt(results[0].create_at))){
                    // delete login history from login_history table
                    await promiseQuery({
                        query: "DELETE FROM login_history WHERE user_token=? AND device_id=?",
                        values: [String(userToken), String(deviceId)]
                    });
                    return res.json({
                        status: "OK",
                        message: "Your session expired",
                        data: {
                            isExpire: true,
                        }
                    });
                }

                return res.json({
                    status: "OK",
                    message: "Your session expired",
                    data: {
                        isExpire: false,
                    }
                });
            });
        });
    });
    
    
});

module.exports = router;