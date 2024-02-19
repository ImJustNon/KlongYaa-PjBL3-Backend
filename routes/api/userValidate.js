const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const { comparePassword } = require("../../utilities/comparePassword");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/user/validate", urlEncoded, async(req, res) => {
    const { userEmail, userPassword } = req.body ?? {};

    if(!userEmail || !userPassword){
        return res.json({
            status: "FAIL",
            message: "Please complete your informaition",
        });
    }

    //make email to lowercase
    const lowerCaseEmail = userEmail.toLowerCase();

    const getInformationQuery = "SELECT user_password_hash, user_token FROM users WHERE user_email=?";
    connection.query(getInformationQuery, [String(lowerCaseEmail)], async(err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Can't get information from database",
                error: err
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "Cannot find user",
            });
        }

        const hashPassword = results[0].user_password_hash;
        const isPassCorrect = await comparePassword(userPassword, hashPassword);

        if(!isPassCorrect){
            return res.json({
                status: "FAIL",
                message: "sorry your password not match"
            });
        }

        return res.json({
            status: "OK",
            message: "success",
            data: {
                userToken: results[0].user_token,
            }
        });
    }); 
});

module.exports = router;