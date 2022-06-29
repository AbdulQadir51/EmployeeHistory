const router = require('express').Router();
const db = require('../../db/connection');

router.get('/', (req, res) => {
    const sql = "SELECT r.id,r.title,d.name as department,r.salary FROM role r LEFT JOIN department d ON r.department_id = d.id";
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'success', data: rows });;
    })
})

router.get('/:id', (req, res) => {
    const sql = "SELECT * FROM role WHERE id = ?";
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
    const sql = "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)";
    const params = [req.body.title, req.body.salary, req.body.department_id];
    db.query(sql, params, (err, data) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }
        if (data.affectedRows > 0) {
            res.json({ message: 'role added successfully!' });;
        } else {
            res.status(500).json({ message: "Failed to add!" });
            return;
        }


    })
})

router.put('/:id', (req, res) => {
    const sql = "UPDATE role SET title = ?, salary = ?, department_id = ? WHERE id = ?";
    const params = [req.body.name, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        } else if (!result.affectedRows) {
            res.json({ message: "role not found!" });
            return;

        } else {
            res.json({ message: 'success', data: req.body, changes: result.affectedRows });
        }


    })
})


router.delete('/:id', (req, res) => {
    const sql = "DELETE FROM role WHERE id = ?";
    const params = [req.params.id];
    db.query(sql, params, (err, data) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (data.affectedRows > 0) {
            res.json({ message: 'role deleted successfully!' });;
        } else {
            res.status(500).json({ error: "Failed to delete!" });
            return;
        }
    })
})
module.exports = router