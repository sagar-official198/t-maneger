const express = require('express');
const router = express.Router();

require('../models/task');
const task= require("../controller/task");

router.post('/createTask',task.createTask);
router.delete('/deleteTask/:id',task.deleteTask);
router.put('/editTask/:id',task.editTask);
router.get('/getAllTask',task.getAllTask);

module.exports = router; 
