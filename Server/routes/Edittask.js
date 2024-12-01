const express = require("express");
const router = express.Router();
const EditTask = require("../models/EditTask");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
router.post("/", async (req, res) => {
  try {
    // const taskid = jwt.verify(token, "JWT_SECRET");
    const { title, task, userId } = req.body;
    const newTask = new EditTask({ title, task, userId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(501).json(error);
    console.log(error + "error in sending task");
  }
});
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.id;
    console.log("userId:", userId);
    const tasks = await EditTask.find({ userId: userId });
    console.log("tasks:", tasks);
    res.status(200).json(tasks);
  } catch (error) {
    console.log("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//fetch for todopage
router.get("/todo/:taskId", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.id;
    const taskId = req.params.taskId;
    console.log(taskId + "bsjkcbkj");
    const task = await EditTask.findOne({ _id: taskId, userId: userId });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.log("Error fetching task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//edot
router.put("/", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json("no token found ");
    }
    const taskId = req.params.taskId;
    const { title, task } = req.body;
    const decodedtoken = jwt.verify(token, JWT_SECRET);
    const userId = decodedtoken.id;

    //lets edit
    const existingTask = await EditTask.findOne({
      _id: taskId,
      userId: userId,
    });
    if (!existingTask) {
      return res.status(401).json("no tadk found");
    }
    existingTask.title = title;
    existingTask.task = task;

    await existingTask.save();
    res.status(201).json(existingTask);
  } catch (error) {
    res.status(501).json(error + "ro");
    console.log("error " + error);
  }
});
//edit
router.put("/todo/:id/edit", async (req, res) => {
  try {
    console.log(req.params.id, " id di di");
    console.log(req.body);
    const result = await EditTask.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        task: req.body.task,
      },
      { new: true }
    );
    console.log(result);
    if (!result) {
      console.log("Task not found");
      return res.json("Task not found");
    }
    res.json(result);
  } catch (err) {
    res.json(err);
    console.log(err);
  }
});
//delete
router.delete("/todo/:id", async (req, res) => {
  try {
    const deletedTask = await EditTask.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      console.log("Task not deleted");
      return res.status(404).json("Task not deleted");
    }
    console.log("Deleted task:", deletedTask);
    res.status(200).json("Task deleted");
  } catch (error) {
    console.log("Error deleting task:", error);
    res.status(500).json("Error deleting task");
  }
});

module.exports = router;
