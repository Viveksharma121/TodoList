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
const taskRoute = require("./routes/Edittask");
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

app.use("/api/tasks", taskRoute);

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
    const userId = new ObjectId(ouruser._id);
    const tasks = await taskSchema.find({ userId: userId });
    res.json(tasks);
    console.log(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/", (req, res) => {
  res.json("Hello hi ");
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

//Delete
