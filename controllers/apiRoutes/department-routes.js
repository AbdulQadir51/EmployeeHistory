const router = require('express').Router();
const db = require('../../db/connection');



router.get('/', (req, res) => {
    const sql = "SELECT * FROM department";
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }
        res.json({ message: 'success', data: rows });;
    })
})



router.get('/:id', (req, res) => {
    const sql = "SELECT * FROM department WHERE id = ?";
    const params = [req.params.id];

    db.query(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }

        res.json({ message: 'success', data: rows });;
    })
})


router.post('/', (req, res) => {
    const sql = "INSERT IGNORE INTO department (name) VALUES (?)";
    const params = [req.body.name];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }
        if (result.affectedRows > 0) {
            req.body.id = result.insertId
            res.json({ message: 'department added successfully!', data: req.body });;
        } else {
            res.status(500).json({ message: "Failed to add!" });
            return;
        }


    })
})

router.put('/:id', (req, res) => {
    const sql = "UPDATE department SET name = ? WHERE id = ?";
    const params = [req.body.name, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        } else if (!result.affectedRows) {
            res.json({ message: "department not found!" });
            return;

        } else {
            res.json({ message: 'success', data: req.body, changes: result.affectedRows });
        }

    })
});


router.delete('/:id', (req, res) => {
    const sql = "DELETE FROM department WHERE id = ?";
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        } else if (result.affectedRows > 0) {
            res.json({ message: 'department deleted successfully!' });
        }

    })
});
module.exports = router