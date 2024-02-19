// const mysql = require("mysql2");
// const config = require("../config/config.js");
// const connection = mysql.createConnection(config.database.mysql);

// const connect = async() =>{
//     connection.connect((err) =>{
//         if (err) {
//             console.log(("[DATABASE] ") + (`MySQL : Cannot connect to database ERROR : `) + (err));
//         } 
//         else {
//             console.log(("[DATABASE] ") + (`MySQL : Connected`));
//         }
//     });
// }

// exports.connection = connection;
// exports.connect = connect;

const mysql = require("mysql2/promise");
const config = require("../config/config.js");

const pool = mysql.createPool(config.database.mysql);


const connect = () =>{
    pool.getConnection().then(connection => {
        console.log("[Database] MySQL: Connected");
        connection.release();
    }).catch(err => {
        console.error("[Database] MySQL: Connection error", err);
    });
}

const connection = {
    query: async(query, params, callback) => {
        let mysqlConnection;

        try {
            mysqlConnection = await pool.getConnection();

            const [rows, fields] = await mysqlConnection.execute(query, params);
            return callback(null, rows, fields);
            // return {
            //     error: null,
            //     results: rows, 
            //     fields: fields,
            // }
        } catch (err) {
            return callback(err, [], []);
            // return {
            //     error: err,
            //     results: [],
            //     fields: [],
            // }
        } finally {
            if (mysqlConnection) {
                mysqlConnection.release();
            }
        }
    }
}

exports.pool = pool;
exports.connect = connect;
exports.connection = connection;