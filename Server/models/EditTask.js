const { default: mongoose } = require("mongoose");

const EditTaskSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  task: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
    required: true,
  },
});

const EditTask = mongoose.model("newTasks", EditTaskSchema);

module.exports = EditTask;
