const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const { ramdomString } = require("../../utilities/randomString");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/alert/get", urlEncoded, async(req, res) => {
    const { boxId, alertId, userToken } = req.body ?? {};

    if(!boxId || !alertId || !userToken){
        return res.json({
            status: "FAIL",
            message: "Please complete your information",
        });
    }

    // check valid user
    const validateUserQuery = "SELECT user_id FROM users WHERE user_token=?";
    connection.query(validateUserQuery, [String(userToken)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot verify user in this time",
            });
        }

        if(results === 0){
            return res.json({
                status: "FAIL",
                message: "User is invalid",
            });
        }

        // query get data
        const searchAlertInformationQuery = "SELECT * FROM alert_information WHERE box_id=? AND alert_id=?";
        connection.query(searchAlertInformationQuery, [String(boxId), String(alertId)], (err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot search data in this time",
                });
            }

            return res.json({
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