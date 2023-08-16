import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
// import "./style.css"; // Import your stylesheet

const Todo = () => {
  const inputRef = useRef(null);
  const history = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskValue, setEditedTaskValue] = useState("");

  // ... (your existing code)

  const handleEdit = (taskId, taskValue) => {
    setEditingTaskId(taskId);
    setEditedTaskValue(taskValue);
  };

  const handleSave = (taskId) => {
    if (editedTaskValue) {
      handleEditRequest(taskId, editedTaskValue);
    } else {
      alert("Please enter a task");
    }
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
    fetch("todo-list-pearl-ten-34.vercel.app/piggy", {
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (inputValue) {
      const newTask = { task: inputValue, userId: getUserIdFromToken() };
      fetch("todo-list-pearl-ten-34.vercel.app/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
        body: JSON.stringify(newTask),
      })
        .then((res) => res.json())
        .then((data) => {
          setTasks([...tasks, data]);
          setInputValue("");
        })
        .catch((error) => {
          console.error("Error while adding task:", error);
        });
    } else {
      alert("Please enter a task");
    }
  };

  const handleDelete = (taskId) => {
    // Send a DELETE request to delete the task
    fetch(`todo-list-pearl-ten-34.vercel.app/tasks/${taskId}`, {
      method: "DELETE",
    })
      .then(() => {
        // Remove the deleted task from the tasks array
        const updatedTasks = tasks.filter((task) => task._id !== taskId);
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error("Error while deleting task:", error);
      });
  };

  function logout(params) {
    localStorage.removeItem("token");
  }
  const handleEditRequest = (taskId, newTaskValue) => {
    fetch(`todo-list-pearl-ten-34.vercel.app/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: newTaskValue }),
    })
      .then((response) => response.json())
      .then(() => {
        const updatedTasks = tasks.map((task) =>
          task._id === taskId ? { ...task, task: newTaskValue } : task
        );
        setTasks(updatedTasks);
        setEditingTaskId(null);
        setEditedTaskValue("");
      })
      .catch((error) => {
        console.error("Error while editing task:", error);
      });
  };

  useEffect(() => {
    if (editingTaskId) {
      inputRef.current.focus();
    }
  }, [editingTaskId]);

  return (
    <div id="pig">
      {/* <div id="pig"> */}
      <header>
        <header id="together">
          <h2 id="h2">TASK LIST</h2>
          <button id="logoutBtn" onClick={logout}>
            Logout
          </button>
        </header>

        <form id="form" onSubmit={handleFormSubmit}>
          <input
            type="text"
            id="inputtext"
            placeholder="enter "
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <input type="submit" id="submit" value="Add Task" />
        </form>
      </header>
      <main>
        <section className="tdolist">
          <h2>TASKS</h2>
          <div id="tasks">
            {tasks.map((task) => (
              <div key={task._id} className="task">
                <div className="content">
                  {editingTaskId === task._id ? (
                    <>
                      <input
                        ref={inputRef}
                        className="taskinput"
                        value={editedTaskValue}
                        onChange={(e) => setEditedTaskValue(e.target.value)}
                      />
                      <button
                        className="savebtn"
                        onClick={() => handleSave(task._id)}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <input className="taskinput" value={task.task} readOnly />
                      <button
                        className="editbtn"
                        onClick={() => handleEdit(task._id, task.task)}
                      >
                        Edit
                      </button>
                      <button
                        className="delbtn"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Todo;
