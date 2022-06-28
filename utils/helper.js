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

getAll = (URL) => {
    return fetch(URL)
        .then(response => response.json())
        .then(json => {
            return json.data;
        })
        .catch(err => console.error(err));
}


postData = (URL, body) => {
    return fetch(URL, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(json => {
            console.log(json.message)
            return json

        })
        .catch(err => console.error(err));
}

module.exports = {

    searchTable: searchTable,
    postData: postData,
    getAll: getAll
}