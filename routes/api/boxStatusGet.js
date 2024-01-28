const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const LastOnlineData = require("../../utilities/lastOnlineData");
const data = new LastOnlineData();

router.post("/api/box/status/get/all", urlEncoded, async(req, res) => {
    const { userToken } = req.body ?? {};

    if(!userToken){
        return res.json({
            status: "FAIL",
            message: "Please complete your information"
        });
    }

    // validate user
    const validateUserQuery = "SELECT user_id FROM users WHERE user_token=?";
    connection.query(validateUserQuery, [String(userToken)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot validate your identity in this time",
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "User not found"
            });
        }

        // get box by user token
        const validateBoxQuery = "SELECT box_id FROM box_information WHERE user_token=?";
        connection.query(validateBoxQuery, [String(userToken)], (err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "cannot validate your information in this time"
                });
            }

            if(results.length === 0){
                return res.json({
                    status: "FAIL",
                    message: "Cannot find your box"
                });
            }

            // i dont know what the f*ck is it, but it works LOL
            let resultsBoxData = [];
            results.forEach(boxData =>{
                if(typeof (data.get(boxData.box_id)[0]) === "undefined") return;
                return resultsBoxData.push((data.get(boxData.box_id)[0]));
            });

            return res.json({
                status: "OK",
                message: "success",
                data: {
                    results: resultsBoxData,
                }
            });
        });
    });

});

module.exports = router;