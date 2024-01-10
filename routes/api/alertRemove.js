const express = require("express");
const router = express.Router();
const { connection } = require("../../database/mysql_connection");


router.post("/api/alert/remove", (req, res) =>{
    const { userId, boxId } = req.body ?? {}; 
    
    if(!userId || !boxId){
        return res.json({
            status: "FAIL",
            message: "Please complete your information",
        });
    }
    
    const findInformationQuery = "SELECT alert_id FROM alert_schedule WHERE user_id=? AND box_id=?";
    connection.query(findInformationQuery, [String(userId), String(boxId)], async(err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot excute query in this time", 
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "Cannot find information from this data",
            });
        }

        const deleteAlertQuery = "DELETE FROM alert_schedule WHERE user_id=? AND box_id=?";
        connection.query(deleteAlertQuery, [String(userId), String(boxId)], async(err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot delete information from database",
                });
            }

            return res.json({
                status: "OK",
                message: "success"
            });
        });
    });
});

module.exports = router;