const router = require('express').Router();
const db = require('../../db/connection');

router.get('/', (req, res) => {
    const sql = "SELECT * FROM employee";
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'success', data: rows });;
    })
})

router.get('/:id', (req, res) => {
    const sql = "SELECT * FROM employee WHERE id = ?";
    const params = [req.params.id];
    db.query(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        res.json({ message: 'success', data: rows });;
    })
})

router.post('/', (req, res) => {
    const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
    const params = [req.body.name];
    db.query(sql, params, (err, data) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (data.affectedRows > 0) {
            res.json({ message: 'employee added successfully!' });;
        } else {
            res.status(500).json({ error: "Failed to add!" });
            return;
        }


    })
})

router.put('/:id', (req, res) => {
    const sql = "UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?";
    const params = [req.body.name, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        } else if (!result.affectedRows) {
            res.json({ message: "employee not found!" });
            return;

        } else {
            res.json({ message: 'success', data: req.body, changes: result.affectedRows });
        }


    })
})

module.exports = router