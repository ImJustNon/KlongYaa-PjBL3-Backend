const { connection } = require("../database/mysql_connection");

module.exports = {
    promiseQuery: ({ query, values }) =>{
        return new Promise((resolve, reject) => {
            connection.query(query, values, (err, results, fields) =>{
                return resolve({
                    error: err,
                    results: results,
                    fields: fields,
                });
            });
        });
    }
}