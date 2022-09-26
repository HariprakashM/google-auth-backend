const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

router.post('/adddata', async (req, res) => {

    try {
        const newemployee = new Employee(req.body);
        const user = await newemployee.save();
        res.json({ message: "Employee Registered Successfully" });
    } catch (error) {
        res.json({ message: "Registration Failed" });
    }
});

router.get('/getalldata', async (req, res) => {

    try {
        const employees = await Employee.find();
        res.status(200).send(employees)
    } catch (error) {
        res.json({ message: "failed to get data" });
    }
});

module.exports = router;