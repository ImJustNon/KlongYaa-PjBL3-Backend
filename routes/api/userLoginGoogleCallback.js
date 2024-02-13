const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser");
const { connection } = require("../../database/mysql_connection");
const urlEncoded = bodyparser.urlencoded({
    limit: "50mb",
    extended: true,
});
const config = require("../../config/config");


router.post("/api/user/login/google/callback", urlEncoded, async(req, res) => {
    const { code } = req.body ?? {};

    if(!code){
        return res.json({
            status: "FAIL",
            message: "Code not found"
        });
    } 

    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', `code=${code}&client_id=${config.apis.google.auth.clientId}&client_secret=${config.apis.google.auth.clientSecret}&redirect_uri=${config.apis.google.auth.callbackURL}&grant_type=authorization_code`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = response.data.access_token;

        // Fetch user data from Google API using the access token
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const user = userResponse.data;

        return res.json({
            status: "OK",
            message: "success",
            data: {
                user: user,
            }
        });
    } catch (error) {
        // console.error('Error exchanging code for access token:', error.response.data);
        // res.status(500).send('An error occurred during login.');
        return res.json({
            status: "FAIL",
            message: "An error occurred during login.",
            error: error.response.data
        });
    }
});

module.exports = router;