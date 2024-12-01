import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./TodoPage.css";
// import jwt from "jsonwebtoken";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate, useParams } from "react-router";
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
  const removeHtmlTags = (input) => {
    return input.replace(/<\/?[^>]+(>|$)/g, "");
  };
  const CreateTask = async () => {
    try {
      const token = getToken();
      console.log(token + " this is token");
      const decodedtoken = jwt_decode(token);
      const userId = decodedtoken.id;
      const response = await axios.post(
        "https://todo-list-c9yo.vercel.app/api/tasks",
        {
          title: removeHtmlTags(title || text.split(" ").slice(0, 3).join(" ")),
          task: text,
          userId,
        }
      );
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
        `https://todo-list-c9yo.vercel.app/api/tasks/todo/${taskId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // if (response.data.length > 0) {
      const fetchedData = response.data;
      const cleanTitle = removeHtmlTags(fetchedData.title);
      const cleanText = fetchedData.task;
      settitle(cleanTitle);
      handleTextChange(cleanText);
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
        `https://todo-list-c9yo.vercel.app/api/tasks/todo/${taskId}/edit`,
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
