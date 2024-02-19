const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const { ramdomString } = require("../../utilities/randomString");
const { convertDateObjToTimestamp } = require("../../utilities/convertDateObjToTimestamp");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/alert/update", urlEncoded, async(req, res) => {
    const { boxId, alertId, userToken, update, data } = req.body ?? {};
    
    if(!boxId || !alertId || !userToken || !update){
        return res.json({
            status: "FAIL",
            message: "Please complete your information",
        });
    }

    // check validate user
    const validateUser = "SELECT user_id FROM users WHERE user_token=?";
    connection.query(validateUser, [String(userToken)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot verify user in this time",
                error: err
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "User is invalid"
            });
        }
        let updateQuery = "";
        let updateData = "";
        if(update.toLowerCase() === "alertname"){
            updateQuery = "UPDATE alert_information SET alert_name=? WHERE box_id=? AND alert_id=?";
            updateData = data;
        }
        if(update.toLowerCase() === "alerttime"){   
            updateQuery = "UPDATE alert_information SET alert_time=? WHERE box_id=? AND alert_id=?";
            updateData = convertDateObjToTimestamp(data);
        }
        if(update.toLowerCase() === "alertledchannel"){
            updateQuery = "UPDATE alert_information SET led_channel_id=? WHERE box_id=? AND alert_id=?";
            updateData = JSON.stringify(data);
        }

        connection.query(updateQuery, [String(updateData), String(boxId), String(alertId)], (err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot query update information",
                    error: err,
                });
            }

            return res.json({
                status: "OK",
                message: "Update success",
            });
        });
    });
    
});

module.exports = router;