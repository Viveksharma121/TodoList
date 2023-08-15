// <<<<<<< HEAD
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
    required: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
// // =======
// const mongoose = require("mongoose");

// const taskSchema = new mongoose.Schema({
//   task: {
//     type: String,
//     required: true,
//   },
//   completed: {
//     type: Boolean,
//     default: false,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "UserData",
//     required: true,
//   },
// });

// const Task = mongoose.model("Task", taskSchema);

// module.exports = Task;
// >>>>>>> 43ca429e69a0c9c6e539a5d17af3f322c1f4c9df
