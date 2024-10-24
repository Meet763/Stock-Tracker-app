const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index")
})

router.get("/user/login", (req, res) => {
    res.render("login")
})

router.get("/user/signup", (req, res) => {
    res.render("signup")
})

router.get("/dashboard/add-stock", (req, res) => {
    res.render("dashboard")
})

router.get("/dashboard/view/:symbol", (req, res) => {
    res.render("stockdetail")
})

router.get("/dashboard/view/:symbol/chart", (req, res) => {
    res.render("chart")
})


module.exports = router