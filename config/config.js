require("dotenv").config();

module.exports = {
    app: {
        port: process.env.PORT,
        address: "http://127.0.0.1"
    },
    database: {
        mysql: {
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            port: parseInt(process.env.MYSQL_PORT),
            database: process.env.MYSQL_DATABASE,
            // ssl: {
            //     rejectUnauthorized: false,
            // },
        }
    }
}