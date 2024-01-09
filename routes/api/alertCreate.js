const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/alert/create", urlEncoded, async(req, res) => {
    const { alertTime, userId, boxId, ledChannelId } = req.body ?? {};

    if(!alertTime || !userId || !boxId || !ledChannelId){
        return res.json({
            status: "FAIL",
            message: "Please complete your information",
        });
    }
    
    const ledChannelIdJson = JSON.stringify(ledChannelId);
    const createAt = new Date().getTime();

    const createAlertQuery = "INSERT INTO alert_schedule(alert_time, user_id, box_id, create_at, led_channel_id) VALUES(?, ?, ?, ?, ?)";
    connection.query(createAlertQuery, [String(alertTime), String(userId), String(boxId), String(createAt), String(ledChannelIdJson)], async(err, results, fields) =>{
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

module.exports = router;