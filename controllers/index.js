const router = require("express").Router();

const apiRoutes = require("./apiRoutes");
router.use("/api", apiRoutes);




router.get("/", (req, res) => {
    res.send("backend server running!");
});
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;