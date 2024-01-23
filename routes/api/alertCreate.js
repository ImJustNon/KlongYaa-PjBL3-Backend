const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const { ramdomString } = require("../../utilities/randomString");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/alert/create", urlEncoded, async(req, res) => {
    const { alertTime, userToken, boxId, ledChannelId, alertName } = req.body ?? {};

    if(!alertTime || !userToken || !boxId || !ledChannelId || !alertName){
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
                message: "Cannot veify user in this time"
            }); 
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "User is invalid",
            });
        }

        // insert data
        const ledChannelIdJson = JSON.stringify(ledChannelId);
        const createAt = new Date().getTime();
        const alertId = ramdomString(10);
        const createAlertQuery = "INSERT INTO alert_information(alert_id, alert_name,alert_time, user_token, box_id, create_at, led_channel_id) VALUES(?, ?, ?, ?, ?, ?, ?)";
        connection.query(createAlertQuery, [String(alertId), String(alertName), String(alertTime), String(userToken), String(boxId), String(createAt), String(ledChannelIdJson)], async(err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot create information to database",
                });
            }
    
            return res.json({
                status: "OK",
                message: "Create information success",
            });
        });
    });
    
    
});

module.exports = router;