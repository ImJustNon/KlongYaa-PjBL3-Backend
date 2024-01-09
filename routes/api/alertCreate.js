const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});


router.post("/api/alert/create", urlEncoded, async(req, res) => {
    const { alertTime, userId, boxId, createTimeStamp, ledChannelId } = req.body ?? {};

    if(!alertTime || !userId || !boxId || !createTimeStamp || !ledChannelId){
        return res.json({
            status: "FAIL",
            message: "Please complete your information",
        });
    }
    
});

module.exports = router;