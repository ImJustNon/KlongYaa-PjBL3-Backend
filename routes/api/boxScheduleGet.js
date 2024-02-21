const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const { covertTimestampToLocalString } = require("../../utilities/covertTimestampToLocalString");

router.post("/api/box/schedule/get", urlEncoded, async(req, res) => {
    const { timestamp, userToken } = req.body ?? {};
    
    if(!timestamp || !userToken){
        return res.json({
            status: "FAIL",
            message: "Please complete your information"
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
                message: "User not found",
            });
        }

        // get this user alert
        const getAlertQuery = "SELECT * FROM alert_information WHERE user_token=?";
        connection.query(getAlertQuery, [String(userToken)], (err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Fail to get your alert information",
                    error: err
                });
            }

            const alertData = results;
            let todayAlerts = [];
            alertData.forEach(alert =>{
                const convertedDate = covertTimestampToLocalString(parseInt(timestamp));
                console.log(convertedDate);
                const convertedAlertDate = covertTimestampToLocalString(parseInt(alert.alert_time));
                if(
                    convertedAlertDate.day === convertedDate.day &&
                    convertedAlertDate.month === convertedDate.month &&
                    convertedAlertDate.year === convertedDate.year
                ){
                    todayAlerts.push({
                        alertId: alert.alert_id,
                        alertName: alert.alert_name,
                        boxId: alert.box_id,
                        alertTime: alert.alert_time,
                        channels: JSON.parse(alert.led_channel_id),
                        createAt: alert.create_at
                    });
                }
            });
            console.log()
            return res.json({
                status: "OK",
                message: "success",
                data: {
                    todayAlerts: todayAlerts,
                }
            });
        });
    });
});

module.exports = router;