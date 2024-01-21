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

    const searchBoxQuery = "SELECT * FROM box_information WHERE user_token=?";
    connection.query(searchBoxQuery, [String(userToken)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot search your info in this time"
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

module.exports = router;