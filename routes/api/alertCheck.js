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
    

    const getAlertInformationQuery = "SELECT * FROM alert_schedule WHERE box_id=?";
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

        const alertTime = results[0].alert_time;
        let makeCurrentYear = currentTime * 1000;
        if(parseInt(makeCurrentYear) >= parseInt(alertTime)){
            return res.json({
                status: "OK",
                message: "Box will alert in a moment",
                data: {
                    alert: true,
                }   
            });
        }
        else {
            return res.json({
                status: "OK",
                message: "It's not time to alert yet",
                data: {
                    alert: false,
                }
            });
        }
    }); 
});

module.exports = router;