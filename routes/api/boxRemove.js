const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/box/remove", urlEncoded, async(req, res) => {
    const { boxId, userToken } = req.body ?? {};

    if(!boxId || !userToken){
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
                error: err
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "Cannot find this user or this user is not available"
            });
        }

        // check if this box is already registered
        const checkBoxRegisteredQuery = "SELECT box_id FROM box_information WHERE user_token=?";
        connection.query(checkBoxRegisteredQuery, [String(userToken)], (err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot query data in this time",
                    error: err
                });
            }

            if(results.length === 0){
                return res.json({
                    status: "FAIL",
                    message: "This box have not registered yet",
                });
            }

            // update for delete data
            const removeBoxQuery = "DELETE FROM box_information WHERE box_id=? AND user_token=?";
            connection.query(removeBoxQuery, [String(boxId), String(userToken)], (err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        message: "cannot query data in this time",
                        error: err
                    });
                }

                return res.json({
                    status: "OK",
                    message: "Remove box information success"
                });
            });
        });
    });
});

module.exports = router;