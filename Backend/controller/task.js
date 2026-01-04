const Task=require("../models/task")
const { ObjectId } = require('mongodb'); 

const createTask = async (req, res) => {
  try {
    const {
      taskname,
      deadline,
      description,
      priority,
      status,
    } = req.body;

    // Validation
    if (!taskname || !deadline) {
      return res.status(422).json({
        error: "Task name and deadline are required",
      });
    }

    // Create task
    const newTask = await Task.create({
      TaskName: taskname,
      Description: description || "",
      Priority: priority || "Medium",
      TaskStatus: status || "Pending",
      Deadline: deadline,
      // user: req.user._id, // ✅ use if JWT middleware exists
    });

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const taskID = new ObjectId(taskId);
    const result = await Task.deleteOne({ _id: taskID });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete Task" });
  }
};

const editTask = async (req, res) => {
  try {
    const { taskname, deadline, description, priority, status } = req.body;
    const { id } = req.params;

    if (!taskname || !deadline) {
      return res.status(422).json({
        error: "Task name and deadline are required",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        TaskName: taskname,
        Description: description || "",
        Priority: priority || "Medium",
        TaskStatus: status || "Pending",
        Deadline: deadline,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};



const getAllTask = (req, res) => {
  Task.find()
    .exec()
    .then(tasks => {
      res.json({ tasks });
    })
    .catch(err => {
      return res.status(422).json({ error: err });
    });
};




module.exports={createTask,deleteTask,editTask,getAllTask}