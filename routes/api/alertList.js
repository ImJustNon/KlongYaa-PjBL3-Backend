const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/alert/list", urlEncoded, async(req, res) => {
    const { userToken, boxId } = req.body ?? {};

    if(!userToken || !boxId){
        return res.json({
            status: "FAIL",
            message: "Please complete your information"
        });
    }

    // check valid user
    const validateUserQuery = "SELECT user_id FROM users WHERE user_token=?";
    connection.query(validateUserQuery, [String(userToken)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "cannot verify user in this time",
                error: err
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "User is invalid"
            });
        }

        // get data
        const searchAlertQuery = "SELECT * FROM alert_information WHERE user_token=? AND box_id=?";
        connection.query(searchAlertQuery, [String(userToken), String(boxId)], (err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot search alert list in this time",
                    error: err
                });
            }

            return  res.json({
                status: "OK",
                message: "Search success",
                data: {
                    results: results,
                }
            });
        });
    });
    
});

module.exports = router;