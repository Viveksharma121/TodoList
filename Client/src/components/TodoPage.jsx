import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./TodoPage.css";
// import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
function TodoPage() {
  const history = useNavigate();
  const { taskId } = useParams();
  console.log(taskId + " needed");
  const [title, settitle] = useState("");
  const [text, setText] = useState("");
  const getToken = () => {
    return localStorage.getItem("token");
  };

  const handleTextChange = (newText) => {
    setText(newText);
    console.log(text);
  };

  const CreateTask = async () => {
    try {
      const token = getToken();
      console.log(token + " this is token");
      const decodedtoken = jwt_decode(token);
      const userId = decodedtoken.id;
      const response = await axios.post("http://localhost:3000/api/tasks", {
        title,
        task: text,
        userId,
      });
      console.log("Task create ", response.data);
      settitle("");
      settitle("");
      history("/todo");
    } catch (error) {
      console.log("error");
    }
  };
  const fetchTask = async () => {
    try {
      const token = getToken();
      console.log(token + " this is token");
      const decodedtoken = jwt_decode(token);
      const userId = decodedtoken.id;
      console.log(userId);

      const response = await axios.get(
        `https://todo-list-pl2e.vercel.app/api/tasks/todo/${taskId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // if (response.data.length > 0) {
      const fetchedData = response.data;
      settitle(fetchedData.title);
      handleTextChange(fetchedData.task);
      // }

      console.log(response.title);
    } catch (error) {
      console.log("error");
    }
  };
  useEffect(() => {
    fetchTask();
  }, []);

  const UpdateTask = async () => {
    try {
      const token = getToken();
      console.log(token + " this is token");
      const decodedtoken = jwt_decode(token);
      const userId = decodedtoken.id;
      const response = await axios.put(
        `https://todo-list-pl2e.vercel.app/api/tasks/todo/${taskId}/edit`,
        {
          title,
          task: text,
          userId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setText("");
      settitle("");
      console.log("response", response);
      history("/todo");
    } catch (error) {
      console.log(error + " error");
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-title">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => settitle(e.target.value)}
          className="title-input1"
        />
      </div>
      <br />
      <div className="todo-body">
        <ReactQuill
          value={text}
          onChange={handleTextChange}
          className="body-input"
          placeholder="Enter here ..."
        />
      </div>
      {taskId ? (
        <button onClick={UpdateTask} className="edit-btn">
          Save Changes
        </button>
      ) : (
        <button onClick={CreateTask} className="save-btn">
          Create
        </button>
      )}
    </div>
  );
}

export default TodoPage;
