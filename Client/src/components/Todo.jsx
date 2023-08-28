import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Todo.css"; // Import your stylesheet

const Todo = () => {
  const history = useNavigate();
  const [tasks, setTasks] = useState([]);

  const handleEdit = (taskId) => {
    history(`/todo/${taskId}/edit`);
  };

  useEffect(() => {
    checkLoggedIn();
    fetchAndStore();
  }, []);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const checkLoggedIn = () => {
    const token = getToken();
    if (!token) {
      history("/");
      return;
    }

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (!decodedToken) {
        history("/");
        return;
      }

      console.log("User is logged in and has a valid token.");
    } catch (error) {
      console.error("Error while checking login status:", error);
      history("/");
    }
  };

  const fetchAndStore = () => {
    fetch("https://todo-list-pl2e.vercel.app/api/tasks", {
      method: "GET",
      headers: {
        authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const userId = getUserIdFromToken();
        const userTasks = data.filter((task) => task.userId === userId);
        setTasks(userTasks);
      })
      .catch((err) => {
        console.error("Error ", err);
      });
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      return decodedToken.id;
    } catch (error) {
      console.error("Error while decoding token:", error);
      return null;
    }
  };

  const handleDelete = async (taskId) => {
    await fetch(`https://todo-list-pl2e.vercel.app/api/tasks/todo/${taskId}`, {
      method: "DELETE",
    })
      .then(() => {
        setTasks((prev) => prev.filter((tasks) => tasks._id !== taskId));
      })
      .catch((error) => {
        console.error("Error while deleting task:", error);
      });
  };

  function logout() {
    console.log("Logout function started");
    console.log(localStorage.getItem("token"));
    localStorage.removeItem("token");
    history("/");
  }

  return (
    <div id="pig">
      <header>
        <header id="together">
          <h2 id="h2">TASK LIST</h2>
          <button id="logoutBtn" onClick={logout}>
            Logout
          </button>
        </header>
      </header>
      <main>
        <section className="tdolist">
          <h2>TASKS</h2>
          <div id="tasks">
            {tasks.map((task) => (
              <div key={task._id} className="task">
                <div className="content">
                  <input
                    className="taskinput"
                    value={task.title}
                    readOnly
                    onClick={() => history(`/todo/${task._id}/edit`)}
                  />
                  <button
                    className="editbtn"
                    onClick={() => handleEdit(task._id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delbtn"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button class="add-todo-button" onClick={() => history("/todopage")}>
            Add Todo
          </button>
        </section>
      </main>
    </div>
  );
};

export default Todo;
