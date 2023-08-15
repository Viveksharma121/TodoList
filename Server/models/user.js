const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const user = mongoose.model("UserData", userSchema);

module.exports = user;
// =======
// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   password: { type: String, required: true },
// });

// const user = mongoose.model("UserData", userSchema);

// module.exports = user;
// >>>>>>> 43ca429e69a0c9c6e539a5d17af3f322c1f4c9df
