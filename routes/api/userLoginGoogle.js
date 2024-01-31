const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const config = require("../../config/config");

router.get("/api/user/login/google", urlEncoded, async(req, res) => {
    const params = new URLSearchParams({
        client_id: config.apis.google.auth.clientId,
        redirect_uri: config.apis.google.auth.callbackURL,
        response_type: 'code',
        scope: 'profile email',
    });

    return res.redirect(`https://accounts.google.com/o/oauth2/auth?${params}`);
});

module.exports = router;