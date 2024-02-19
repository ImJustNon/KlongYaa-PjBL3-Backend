const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/box/list", urlEncoded, async(req, res) => {
    const { userToken } = req.body ?? {};

    if(!userToken){
        return res.json({
            status: "FAIL",
            message: "Please complete your information"
        });
    }

    // validate user first
    const validateUserQuery = "SELECT user_id FROM users WHERE user_token=?";
    connection.query(validateUserQuery, [String(userToken)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot verify user in this time",
                error: err
            }); 
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "user is invalid",
            }); 
        }

        // get data
        const searchBoxQuery = "SELECT box_id, box_name FROM box_information WHERE user_token=?";
        connection.query(searchBoxQuery, [String(userToken)], (err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot search your info in this time",
                    error: err
                });
            }
    
            return res.json({
                status: "OK",
                message: "query your data success",
                data: {
                    results: results
                }
            });
        });
    });

    
});

module.exports = router;