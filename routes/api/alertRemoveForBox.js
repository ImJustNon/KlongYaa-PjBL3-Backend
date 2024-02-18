const express = require("express");
const router = express.Router();
const { connection } = require("../../database/mysql_connection");
const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const config = require("../../config/config");

router.post("/api/alert/removeforbox", urlEncoded, (req, res) =>{
    const { alertId, boxId, secretApiKey } = req.body ?? {}; 
    
    if(!alertId || !boxId || !userToken){
        return res.json({
            status: "FAIL",
            message: "Please complete your information",
        });
    }

    if(secretApiKey !== config.app.secretApiKey){
        return res.json({
            status: "FAIL",
            message: "Invalid api key",
        });
    }

    const validateBoxIdQuery = "SELECT box_id FROM box_information WHERE box_id=?";
    connection.query(validateBoxIdQuery, [String(boxId)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot validate box id in this time",
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "BoxId is in valid",
            });
        }

        const validateAlertId = "SELECT alert_id FROM alert_information WHERE alert_id=?";
        connection.query(validateAlertId, [String(alertId)], (err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot validate alert id in this time",
                });
            }

            if(results.length === 0){
                return res.json({
                    status: "FAIL",
                    message: "AlertId is in valid",
                }); 
            }

            // remove query
            const removeAlertScheduleQuery = "DELETE FROM alert_information WHERE alert_id=? AND box_id=?";
            connection.query(removeAlertScheduleQuery, [String(alertId), String(boxId)], (err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        message: "Cannot remove alert schedule in this time",
                    });
                }

                return res.json({
                    status: "OK",
                    message: "Remove alert success",
                });
            });
        });
    });
});

module.exports = router;