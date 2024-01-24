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
const { isValidPassword } = require("../../utilities/isValidPassword");
const nodemailer = require('nodemailer');
const config = require("../../config/config");
const { ramdomString } = require("../../utilities/randomString");

const transporter = nodemailer.createTransport(config.mail);

router.post("/api/user/resetpass/sendmail", urlEncoded, async(req, res) => {
    const { userEmail } = req.body ?? {};

    if(!userEmail){
        return res.json({
            status: "FAIL",
            message: "Please complete your information"
        });
    }

    const lowerCaseUserEmail = userEmail.toLowerCase();

    const getUserByEmailQuery = "SELECT user_email FROM users WHERE user_email=?";
    connection.query(getUserByEmailQuery, [String(lowerCaseUserEmail)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot verify email in this time",
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "This email never register",
            });
        }

        // check for last code is already exit
        const checkIfLastCodeIsAlreadyExit = "SELECT user_email FROM verify_code WHERE user_email=?";
        connection.query(checkIfLastCodeIsAlreadyExit, [String(lowerCaseUserEmail)], (err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "cannot check the last code in this time",
                });
            }

            if(results.length !== 0){
                const deleteLastVerifyCodeQuery = "DELETE FROM verify_code WHERE user_email=?";
                connection.query(deleteLastVerifyCodeQuery, [String(userEmail)], (err, results, fields) =>{
                    if(err){
                        return res.json({
                            status: "FAIL",
                            message: "Cannot delete data in this time"
                        });
                    }

                    createVerifyCode();
                }); 
            }
            else {
                createVerifyCode();
            }
            
        });

        function createVerifyCode(){
            const verifyCode = ramdomString(6);
            const referPass = ramdomString(20);
            const createAt = new Date().getTime();
            const saveVerifyCodeQuery = "INSERT INTO verify_code(user_email, code, refer_pass, create_at) VALUES (?, ?, ?, ?)";
            connection.query(saveVerifyCodeQuery, [String(lowerCaseUserEmail), String(verifyCode), String(referPass), String(createAt)], (err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        message: "Cannot craete verify code",
                    });
                }

                const mailOptions = {
                    from: 'non.kanakorn006.sg@gmail.com',
                    to: lowerCaseUserEmail,
                    subject: 'Password Reset Code',
                    text: `Your password reset code is: ${verifyCode}`,
                }
                transporter.sendMail(mailOptions, (error, info) => {
                    if(error) {
                        return res.json({
                            status: "FAIL",
                            message: "Fail to send the email"
                        });
                    }
                    return res.json({
                        status: "OK",
                        message: "Password reset code sent to your email",
                        data: {
                            userEmail: lowerCaseUserEmail,
                            referPass: referPass
                        }
                    });
                });
            });
        }
    });
});

router.post("/api/user/resetpass/verify", urlEncoded, async(req, res) => {
    const { newUserPassword, code, userEmail, referPass } = req.body ?? {};

    if(!newUserPassword || !code || !userEmail || !referPass){
        return res.json({
            status: "FAIL",
            message: "Please complete your information"
        }); 
    }

    if(!isValidPassword(newUserPassword)){
        return res.json({
            status: "FAIL",
            message: "This password cannot use",
        });
    }

    const lowerCaseUserEmail = userEmail.toLowerCase();

    // get code create at
    const checkOldCodeQuery = "SELECT create_at FROM verify_code WHERE refer_pass=?";
    connection.query(checkOldCodeQuery, [String(referPass)], (err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot check code age in this tinme",
            });
        }

        if(results.length === 0){
            return res.json({
                status: "FAIL",
                message: "Code not found"
            });
        }

        const codeCreateAt = results[0].create_at;
        
        if(calculateCodeAge(codeCreateAt)){
            const deleteVerifyCodeQuery = "DELETE FROM verify_code WHERE refer_pass=?";
            return connection.query(deleteVerifyCodeQuery, [String(referPass)], (err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        message: "Fail to delete timeout code",
                    });
                }
                return res.json({
                    status: "FAIL",
                    message: "Code Timeout please resend the code again",
                }); 
            });
        }
        else {
            // check for validate code
            const validateCodeQuery = "SELECT user_email FROM verify_code WHERE refer_pass=? AND code=? AND user_email=?";
            connection.query(validateCodeQuery, [String(referPass), String(code), String(lowerCaseUserEmail)], async(err, results, fields) =>{
                if(err){
                    return res.json({
                        status: "FAIL",
                        message: "Cannot verify code in this time",
                    });
                }

                if(results.length === 0){
                    return res.json({
                        status: "FAIL",
                        message: "Code not match",
                    });
                }

                // set new password
                const newUserPasswordHash = await encryptPassword(newUserPassword);
                const setNewUserPasswordQuery = "UPDATE users SET user_password_hash=? WHERE user_email=?";
                connection.query(setNewUserPasswordQuery, [String(newUserPasswordHash), String(lowerCaseUserEmail)], (err, results, fields) =>{
                    if(err){
                        return res.json({
                            status: "FAIL",
                            message: "Fail to save new password",
                        });
                    }

                    // delete used verify code
                    const deleteUsedVerifyCode = "DELETE FROM verify_code WHERE refer_pass=?";
                    connection.query(deleteUsedVerifyCode, [String(referPass)], (err, results, fields) =>{
                        if(err){
                            return res.json({
                                status: "FAIL",
                                message: "Cannot delete used verify code",
                            }); 
                        }

                        return res.json({
                            status: "OK",
                            message: "Change password success"
                        });
                    });
                });
            });
        }
    });
});

module.exports = router;


function calculateCodeAge(time){
    let timestamp = parseInt(time);
    let currentTimestamp = new Date().getTime();
    let timeDifference = currentTimestamp - timestamp;
    let isPass15Minute = timeDifference > 15 * 60000;
    return isPass15Minute;
}