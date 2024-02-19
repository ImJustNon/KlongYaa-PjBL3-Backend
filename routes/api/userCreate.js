const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const bcrypt = require('bcrypt');
const { encryptPassword } = require("../../utilities/encryptPassword");
const { connection } = require("../../database/mysql_connection");
const { genToken } = require("../../utilities/genToken");
const { isValidEmail } = require("../../utilities/isValidEmail");
const { isValidPassword } = require("../../utilities/isValidPassword");

router.post("/api/user/create", urlEncoded, async(req, res) => {
    const { userName, userEmail, userPassword } = req.body ?? {};

    if(!userName || !userEmail || !userPassword){
        return res.json({
            status: "FAIL",
            message: "Please complete your information",
        });
    }

    //make email to lowercase
    const lowerCaseEmail = userEmail.toLowerCase();
    // check for validate email
    if(!isValidEmail(lowerCaseEmail)){
        return res.json({
            status: "FAIL",
            message: "This Email is Invalid",
        });
    }
    // check for password length and include charractor require
    if(!isValidPassword(userPassword)){
        return res.json({
            status: "FAIL",
            message: "This Password cannot use",
        });
    }

    

    // check if this user or email already registered 
    const checkUserHistoryQuery = "SELECT user_email, user_name FROM users WHERE user_email=? OR user_name=?";
    connection.query(checkUserHistoryQuery, [String(lowerCaseEmail), String(userName)], async(err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot check your information",
                error: err
            });
        }

        if(results.length !== 0){
            return res.json({
                status: "FAIL",
                message: `You cannot use this ${results[0].user_email === lowerCaseEmail ? "email" : "username"} again`,
            });
        }

        // get information
        const getEncryptedPass = await encryptPassword(userPassword);
        const getToken = await genToken();
        const getCurrentTimeStamp = new Date().getTime();
    
        // create user
        const createUserQuery = "INSERT INTO users(user_token, user_name, user_email, user_password_hash, create_at) VALUES(?, ?, ?, ?, ?)";
        connection.query(createUserQuery, [String(getToken), String(userName), String(lowerCaseEmail), String(getEncryptedPass), String(getCurrentTimeStamp)], async(err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Fail to write data to database",
                    error: err
                });
            }
    
            return res.json({
                status: "OK",
                message: "Create new user success",
            });
        });
    });
});

module.exports = router;