const router = require("express").Router();

const employeeRoutes = require("./employee-routes");
const departmentRoutes = require("./department-routes");
const roleRoutes = require("./role-routes");

router.use("/employee", employeeRoutes);
router.use("/department", departmentRoutes);
router.use("/role", roleRoutes);

router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;