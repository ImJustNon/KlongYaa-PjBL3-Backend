const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/box/register", urlEncoded, async(req, res) => {
    const { boxId, boxName, userToken } = req.body ?? {};

    if(!boxId || !boxName || !userToken){
        return res.json({
            status: "FAIL",
            message: "Please complete your information"
        });
    }

    // check if this user is avaiable
    const checkAvailableUserQuery = "SELECT user_id FROM users WHERE user_token=?";
    connection.query(checkAvailableUserQuery, [String(userToken)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot query data in this time",
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "Cannot find this user or this user is not available",
            });
        }

        // check if this box is already registered
        const checkBoxRegisteredQuery = "SELECT box_id FROM box_information WHERE user_token=? AND box_id=?";
        connection.query(checkBoxRegisteredQuery, [String(userToken), String(boxId)], (err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot query data in this time"
                });
            }

            if(results.length !== 0){
                return res.json({
                    status: "FAIL",
                    message: "This box already registerd"
                });
            }

            // insert new data to table
            const currentTimestamp = new Date().getTime();
            const registerNewBoxQuery = "INSERT INTO box_information(box_id, box_name, user_token, register_at) VALUES(?,?,?,?)";
            connection.query(registerNewBoxQuery, [String(boxId), String(boxName), String(userToken), String(currentTimestamp)], (err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        message: "Cannot query data in this time",                
                    });
                }

                return res.json({
                    status: "OK",
                    message: "Register the new box Successful",
                });
            });
        });
    });
});

module.exports = router;