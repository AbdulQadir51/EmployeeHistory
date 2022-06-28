const db = require('../db/connection');
const fetch = require('node-fetch');

searchTable = (table, col, search, callback) => {

    const sql = `SELECT * FROM ${table}  WHERE ${col} = ?`;
    const params = [search];
    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log(err)
            return;
        }

        if (rows.length > 0) {
            return callback(rows[0])
        }
        return callback(null)
    });

}



// GET / POST / PUT method
fetchData = (URL, method, body) => {
    if (method == 'POST' || method == 'PUT') {
        return fetch(URL, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            .then(response => response.json())
            .then(json => {
                //console.log(json);
                return json

            })
            .catch(err => console.error(err));
    } else {
        return fetch(URL)
            .then(response => response.json())
            .then(json => {
                return json.data;
            })
            .catch(err => console.error(err));
    }
}



module.exports = {

    searchTable: searchTable,
    fetchData: fetchData

}