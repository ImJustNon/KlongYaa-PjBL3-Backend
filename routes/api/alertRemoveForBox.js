const express = require("express");
const router = express.Router();
const { connection } = require("../../database/mysql_connection");
const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const config = require("../../config/config");

router.post("/api/alert/remove", urlEncoded, (req, res) =>{
    const { alertId, boxId, secretApiKey } = req.body ?? {}; 
    
    if(!alertId || !boxId || !userToken){
        return res.json({
            status: "FAIL",
            message: "Please complete your information",
        });
    }


    // // check validate user
    // const validateUserQuery = "SELECT user_id FROM users WHERE user_token=?";
    // connection.query(validateUserQuery, [String(userToken)], (err, results, fields) =>{
    //     if(err){
    //         return res.json({
    //             status: "FAIL",
    //             message: "Cannot veify user in this time",
    //         });
    //     }
        
    //     if(results.length === 0){
    //         return res.json({
    //             status: "FAIL",
    //             message: "User is invalid",
    //         });
    //     }

    //     // run remove query
    //     const removeAlertQuery = "DELETE FROM alert_information WHERE box_id=? AND alert_id=?";
    //     connection.query(removeAlertQuery, [String(boxId), String(alertId)], (err, results, fields) =>{
    //         if(err){
    //             return res.json({
    //                 status: "FAIL",
    //                 message: "Cannot remove alert data in this time"
    //             });
    //         }

    //         return res.json({
    //             status: "OK",
    //             message: "Remove alert success"
    //         });
    //     });
    // });
});

module.exports = router;