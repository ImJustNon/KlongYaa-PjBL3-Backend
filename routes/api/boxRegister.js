const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/box/register", urlEncoded, async(req, res) => {
    const { boxId, boxSlot, userToken } = req.body ?? {};

    if(!boxId || !userToken){
        return res.json({
            status: "FAIL",
            message: "Please complete your information",
        });
    }

    // check if this box is already registered
    const isBoxRegisteredQuery = "SELECT user_name FROM users WHERE box1_id=? OR box2_id=? OR box3_id=?"; 
    connection.query(isBoxRegisteredQuery, [String(boxId), String(boxId), String(boxId)], async(err, results, fields) =>{
        if(err){
            return res.json({
                status: "FAIL",
                message: "Cannot get information from database" + err,
            });
        }

        if(results.length !== 0){
            return res.json({
                status: "FAIL",
                message: `This box was registered by ${results[0].user_name}`,
            }); 
        }

        // if this box is new then will register to this user account
        const updateBoxQuery = `UPDATE users SET box${String(boxSlot)}_id=? WHERE user_token=?`;
        connection.query(updateBoxQuery, [String(boxId), String(userToken)], async(err, results, fields) =>{
            if(err){
                return res.json({
                    status: "FAIL",
                    message: "Cannot update information to database",
                });
            }

            return res.json({
                status: "OK",
                message: `Box Id : ${boxId} is registered success`,
            });
        });
    });

});

module.exports = router;