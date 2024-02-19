require("dotenv").config();

module.exports = {
    app: {
        port: process.env.PORT,
        address: "http://127.0.0.1",
        secretApiKey: ["there_is_no_key_lol"],
    },
    database: {
        mysql: {
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            port: parseInt(process.env.MYSQL_PORT),
            database: process.env.MYSQL_DATABASE,
            fatal: true
            // ssl: {
            //     rejectUnauthorized: false,
            // },
        }
    },
    mail: {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    },
    apis: {
        google: {
            auth: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL,
            }
        }
    }
}