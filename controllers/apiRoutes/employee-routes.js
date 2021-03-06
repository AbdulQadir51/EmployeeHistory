const router = require('express').Router();
const db = require('../../db/connection');

router.get('/', (req, res) => {
        const sql = "SELECT e.id,CONCAT(CONCAT(e.first_name , ' '),e.last_name) as name,r.title as role,CONCAT(CONCAT(m.first_name , ' '),m.last_name) as manager FROM employee e INNER JOIN role r ON e.role_id = r.id LEFT JOIN employee m ON e.manager_id = m.id";
        db.query(sql, (err, rows) => {
            if (err) {
                res.status(500).json({ message: err.message });
                return;
            }
            res.json({ message: 'success', data: rows });;
        })
    })
    //get employee by manager
router.get('/bymanager', (req, res) => {
    const sql = "SELECT e.id,CONCAT(CONCAT(e.first_name , ' '),e.last_name) as name, CONCAT(CONCAT(m.first_name , ' '),m.last_name) as manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id";
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }
        res.json({ message: 'success', data: rows });;
    })
})

//get employee by department
router.get('/bydepartment', (req, res) => {
    const sql = "SELECT e.id,CONCAT(CONCAT(e.first_name , ' '),e.last_name) as name, d.name as department FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id";
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }
        res.json({ message: 'success', data: rows });;
    })
})

//get combined salary in each department
router.get('/salaryby_department', (req, res) => {
    const sql = "SELECT COUNT(e.id) as 'employee count', d.name as department, SUM(r.salary) as 'combined salary' FROM employee e INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id GROUP BY d.name";
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ message: err.message });
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
            res.status(500).json({ message: err.message });
            return;
        }

        res.json({ message: 'success', data: rows[0] });;
    })
})



router.post('/', (req, res) => {
    const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
    const params = [req.body.first_name, req.body.last_name, req.body.role_id, req.body.manager_id];
    db.query(sql, params, (err, data) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        }
        if (data.affectedRows > 0) {
            res.json({ message: 'employee added successfully!' });;
        } else {
            res.status(500).json({ message: "Failed to add!" });
            return;
        }


    })
})

router.put('/:id', (req, res) => {
    const sql = "UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?";
    const params = [req.body.first_name, req.body.last_name, req.body.role_id, req.body.manager_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        } else if (!result.affectedRows) {
            res.status(500).json({ message: "employee not found!" });
            return;

        } else {
            res.json({ message: 'Employee updated successfully!', data: req.body, changes: result.affectedRows });
        }

    })
})

router.delete('/:id', (req, res) => {
    const sql = "DELETE FROM employee WHERE id = ?";
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(500).json({ message: err.message });
            return;
        } else if (!result.affectedRows) {
            res.status(500).json({ message: "employee not found!" });
            return;

        } else {
            res.json({ message: 'Employee deleted successfully!', changes: result.affectedRows });
        }

    })
})

module.exports = router