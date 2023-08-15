const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const ObjectId = mongoose.Types.ObjectId;
const bodyParser = require("body-parser");
const taskSchema = require("./models/task");
const user = require("./models/user");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());
// const DATABASEURL = process.env.DATABASEURL;
const PORT = 3000;

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://vivek:SODWx5KTCqA36XX3@cluster0.uicqxfz.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Db connected");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect db", err);
  });

// reg
app.post("/register", async (req, res) => {
  try {
    const existinguser = await user.findOne({
      email: req.body.email,
    });
    if (existinguser) {
      return res.status(500).json("User already exist ");
    }
    const salt = 10;
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const newUser = await user.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPass,
    });
    res.json({ status: "ok", newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//login
app.post("/login", async (req, res) => {
  try {
    const salt = 10;
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    // console.log(hashedPass);
    const existinguser = await user.findOne({
      email: req.body.email,
    });
    if (!existinguser) {
      return res.status(500).json("Email id doesnt exist");
    }
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      existinguser.password
    );
    if (isValidPassword) {
      const token = jwt.sign(
        {
          name: existinguser.name,
          email: existinguser.email,
          id: existinguser._id,
        },
        "secret123"
      );
      return res.json({ status: "ok", existinguser: token });
    } else {
      return res.json({ status: "error", existinguser: false });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//logout
app.get("/logout", async (req, res) => {
  try {
    res.json({ message: "logout succesful" });
  } catch (error) {}
});
//use body parser
app.get("/piggy", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "token Unauthorised" });
    }
    const decodedToken = jwt.verify(token, "secret123");
    if (!decodedToken) {
      return res.status(401).json({ error: " decoded Unauthorised" });
    }
    const ouruser = await user.findOne({ email: decodedToken.email });
    if (!ouruser) {
      return res.status(401).json({ error: "user Unauthorised" });
    }
    //converting user id to mongoose objectId, because ouruserId is string but in mongooose it stores object id as a totally diff data type so we were comparing string with objext id data type so token unauthorised error so in this line we will jyst convert ouruser._id to objectid data type
    const userId = new ObjectId(ouruser._id);
    const tasks = await taskSchema.find({ userId: userId });
    res.json(tasks);
    console.log(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});

//creating new task
app.post("/tasks", async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "no token Unauthorised" });
    }
    const decodedToken = jwt.verify(token, "secret123");
    if (!decodedToken) {
      return res.status(401).json({ error: "no decode Unauthorised" });
    }
    const ouruser = await user.findOne({ email: decodedToken.email });
    if (!ouruser) {
      return res.status(401).json({ error: " no user Unauthorised" });
    }
    const tasks = new taskSchema({
      task: req.body.task,
      userId: ouruser._id,
    });
    await tasks.save();
    // res.json(tasks);
    res.json({ id: tasks.id, task: tasks.task, userId: tasks.userId });
    console.log(tasks);
    console.log(tasks.id);
  } catch (error) {
    res.status(500).send(error);
  }
});

//edit
//edit
app.put("/tasks/:id", async (req, res) => {
  try {
    console.log(req.params.id); // check the value of the id parameter
    console.log(req.body); // check the value of the request body
    const result = await taskSchema.findByIdAndUpdate(
      req.params.id,
      { task: req.body.task },
      { new: true }
      // returns the updated data as response (optional)
    );
    console.log(result); // check the value of the result from the update operation
    if (!result) {
      console.log("Task not found");
    }
    res.json(result);
  } catch (err) {
    res.json(err);
    console.log(err); // log the error
  }
});

//Delete
app.delete("/tasks/:id", async (req, res) => {
  try {
    const del = await taskSchema.deleteOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
    });
    if (del.deletedCount === 0) {
      console.log("Task not found");
      res.json("Task not found");
    }
    res.json("Task deleted");
  } catch (error) {
    res.json(error);
  }
});

// const express = require("express");

// const mongoose = require("mongoose");
// const cors = require("cors");
// const bcrypt = require("bcryptjs");
// const ObjectId = mongoose.Types.ObjectId;
// const bodyParser = require("body-parser");
// const taskSchema = require("../models/task");
// const user = require("../models/user");
// const jwt = require("jsonwebtoken");
// const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, ".env") });

// const app = express();
// app.use(cors());
// app.use(express.json());
// // const DATABASEURL = process.env.DATABASEURL;
// const PORT = 3000;

// mongoose.set("strictQuery", false);
// mongoose
//   .connect(
//     "mongodb+srv://vivek:SODWx5KTCqA36XX3@cluster0.uicqxfz.mongodb.net/?retryWrites=true&w=majority",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     console.log("Db connected");
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to connect db", err);
//   });
// // reg
// app.post("/register", async (req, res) => {
//   try {
//     const existinguser = await user.findOne({
//       email: req.body.email,
//     });
//     if (existinguser) {
//       return res.status(500).json("User already exist ");
//     }
//     const salt = 10;
//     const hashedPass = await bcrypt.hash(req.body.password, salt);
//     const newUser = await user.create({
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPass,
//     });
//     res.json({ status: "ok", newUser });
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// //login
// app.post("/login", async (req, res) => {
//   try {
//     const salt = 10;
//     const hashedPass = await bcrypt.hash(req.body.password, salt);
//     // console.log(hashedPass);
//     const existinguser = await user.findOne({
//       email: req.body.email,
//     });
//     if (!existinguser) {
//       return res.status(500).json("Email id doesnt exist");
//     }
//     const isValidPassword = await bcrypt.compare(
//       req.body.password,
//       existinguser.password
//     );
//     if (isValidPassword) {
//       const token = jwt.sign(
//         {
//           name: existinguser.name,
//           email: existinguser.email,
//           id: existinguser._id,
//         },
//         "secret123"
//       );
//       return res.json({ status: "ok", existinguser: token });
//     } else {
//       return res.json({ status: "error", existinguser: false });
//     }
//   } catch (error) {
//     console.error("Error during registration:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
// //use body parser
// app.get("/piggy", async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: "token Unauthorised" });
//     }
//     const decodedToken = jwt.verify(token, "secret123");
//     if (!decodedToken) {
//       return res.status(401).json({ error: " decoded Unauthorised" });
//     }
//     const ouruser = await user.findOne({ email: decodedToken.email });
//     if (!ouruser) {
//       return res.status(401).json({ error: "user Unauthorised" });
//     }
//     //converting user id to mongoose objectId, because ouruserId is string but in mongooose it stores object id as a totally diff data type so we were comparing string with objext id data type so token unauthorised error so in this line we will jyst convert ouruser._id to objectid data type
//     const userId = new ObjectId(ouruser._id);
//     const tasks = await taskSchema.find({ userId: userId });
//     res.json(tasks);
//     console.log(tasks);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// //creating new task
// app.post("/tasks", async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     if (!token) {
//       return res.status(401).json({ error: "no token Unauthorised" });
//     }
//     const decodedToken = jwt.verify(token, "secret123");
//     if (!decodedToken) {
//       return res.status(401).json({ error: "no decode Unauthorised" });
//     }
//     const ouruser = await user.findOne({ email: decodedToken.email });
//     if (!ouruser) {
//       return res.status(401).json({ error: " no user Unauthorised" });
//     }
//     const tasks = new taskSchema({
//       task: req.body.task,
//       userId: ouruser._id,
//     });
//     await tasks.save();
//     // res.json(tasks);
//     res.json({ id: tasks.id, task: tasks.task, userId: tasks.userId });
//     console.log(tasks);
//     console.log(tasks.id);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// //edit
// //edit
// app.put("/tasks/:id", async (req, res) => {
//   try {
//     console.log(req.params.id); // check the value of the id parameter
//     console.log(req.body); // check the value of the request body
//     const result = await taskSchema.findByIdAndUpdate(
//       req.params.id,
//       { task: req.body.task },
//       { new: true }
//       // returns the updated data as response (optional)
//     );
//     console.log(result); // check the value of the result from the update operation
//     if (!result) {
//       console.log("Task not found");
//     }
//     res.json(result);
//   } catch (err) {
//     res.json(err);
//     console.log(err); // log the error
//   }
// });

// //Delete
// app.delete("/tasks/:id", async (req, res) => {
//   try {
//     const del = await taskSchema.deleteOne({
//       _id: new mongoose.Types.ObjectId(req.params.id),
//     });
//     if (del.deletedCount === 0) {
//       console.log("Task not found");
//       res.json("Task not found");
//     }
//     res.json("Task deleted");
//   } catch (error) {
//     res.json(error);
//   }
// });
// >>>>>>> 43ca429e69a0c9c6e539a5d17af3f322c1f4c9df