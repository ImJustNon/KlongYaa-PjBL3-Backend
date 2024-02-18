const express = require("express");
const router = express.Router();
const { connection } = require("../../database/mysql_connection");


router.post("/api/alert/check", (req, res) =>{
    const { currentTime, boxId } = req.body ?? {}; 
    
    if(!currentTime || !boxId){
        return res.json({
            status: "FAIL",
            message: "Please complete your information",
        });
    }
    
    const validateBoxIdQuery = "SELECT box_id FROM box_information WHERE box_id=?";
    connection.query(validateBoxIdQuery, [String(boxId)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "cannot get box information in this time",
            });
        }
        
        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: `Cannot find boxId : ${boxId} Information`, 
            });
        }

        const getAlertInformationQuery = "SELECT * FROM alert_information WHERE box_id=?";
        connection.query(getAlertInformationQuery, [String(boxId)], async(err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot get information from database",
                });
            }
    
            if(results.length === 0){
                return res.json({
                    status: "FAIL",
                    message: `Cannot find alert information from this box id : ${boxId}`,
                });
            }

            const sortedResults = results.sort((a, b) => parseInt(a.alert_time) - parseInt(b.alert_time));
            const alertTime = sortedResults[0].alert_time;
            let makeCurrentYear = currentTime * 1000;
            if(parseInt(makeCurrentYear) >= parseInt(alertTime)){
                const ledCh = [];
                (JSON.parse(sortedResults[0].led_channel_id)).forEach(ch => ledCh.push(parseInt(ch)));
                return res.json({
                    status: "OK",
                    message: "Box will alert in a moment",
                    data: {
                        alert: "true",
                        alertId: sortedResults[0].alert_id,
                        ledChannel: ledCh,
                    }   
                });
            }
            else {
                return res.json({
                    status: "OK",
                    message: "It's not time to alert yet",
                    data: {
                        alert: "false",
                    }
                });
            }
        }); 
    });
});

module.exports = router;