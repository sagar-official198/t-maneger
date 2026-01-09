import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "./logo.png";
import "./task.css";
const API_URL = import.meta.env.VITE_API_URL;

const TaskCard = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [taskName, setTaskName] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");

  const [edittask, setEditTask] = useState(null);
  const isCreateDisabled = !edittask && (!taskName.trim() || !taskDate);

  useEffect(() => {
    fetch("https://manage.onrender.com/api/auth/getAllTask", {
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.tasks || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAddTask = () => {
    if (!taskName || !taskDate) {
      alert("Please fill all required fields");
      return;
    }

    fetch("https://manage.onrender.com/api/auth/createTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        taskname: taskName,
        deadline: taskDate,
        description,
        priority,
        status,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (!result.task) {
          console.error("Invalid response", result);
          return;
        }

        setData((prev) => [...prev, result.task]);
        resetForm();
      })
      .catch((err) => console.error(err));
  };

  const handleEditTask = (task) => {
    setShowModal(true);
    setEditTask(task._id);
    setTaskName(task.TaskName);
    setTaskDate(new Date(task.Deadline).toISOString().split("T")[0]);
    setDescription(task.Description || "");
    setPriority(task.Priority || "Medium");
    setStatus(task.TaskStatus || "Pending");
  };

  const handleEdit = () => {
    fetch(`https://manage.onrender.com/api/auth/editTask/${edittask}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        taskname: taskName,
        deadline: taskDate,
        description,
        priority,
        status,
      }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setData((prev) =>
          prev.map((t) => (t._id === edittask ? updatedTask : t))
        );
        resetForm();
      })
      .catch((err) => console.error(err));
  };

  const deleteTask = (id) => {
    fetch(`https://manage.onrender.com/api/auth/deleteTask/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then(() => {
        setData((prev) => prev.filter((t) => t._id !== id));
      })
      .catch((err) => console.error(err));
  };

  const resetForm = () => {
    setTaskName("");
    setTaskDate("");
    setDescription("");
    setPriority("Medium");
    setStatus("Pending");
    setEditTask(null);
    setShowModal(false);
  };

  return (
    <>
      <div className="container py-4">
        <h1>Task Manager</h1>
        <button
          className="btn btn-dark rounded-circle fab-btn"
          onClick={() => setShowModal(true)}
        >
          <i className="bi bi-plus-lg fs-2"></i>
        </button>

        {data
          .filter((item) => item && item.TaskName)
          .map((item) => (
            <div className="card p-3 mb-3 shadow-sm" key={item._id}>
  <div className="row align-items-center">
    
    {/* LEFT SIDE */}
    <div className="col-12 col-md-8">
      <h6 className="mb-1">{item.TaskName}</h6>
      <p className="text-muted mb-1">{item.Description}</p>
      <small className="text-muted">
        Deadline: {new Date(item.Deadline).toISOString().split("T")[0]}
      </small>
    </div>

    {/* RIGHT SIDE */}
    <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0">
      <div className="mb-2">
        <span
          className={`badge me-1 ${
            item.Priority === "Low"
              ? "bg-success"
              : item.Priority === "High"
              ? "bg-danger"
              : "bg-warning"
          }`}
        >
          {item.Priority}
        </span>

        <span
          className={`badge ${
            item.TaskStatus === "Complete"
              ? "bg-success"
              : "bg-secondary"
          }`}
        >
          {item.TaskStatus}
        </span>
      </div>

      <button
        className="btn btn-sm btn-outline-success me-1"
        onClick={() => handleEditTask(item)}
      >
        <i className="bi bi-pencil"></i>
      </button>

      <button
        className="btn btn-sm btn-outline-danger"
        onClick={() => deleteTask(item._id)}
      >
        <i className="bi bi-trash"></i>
      </button>
    </div>

  </div>
</div>

          ))}
      </div>

      {showModal && (
        <div className="modal show fade d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{edittask ? "Update Task" : "Add Task"}</h5>
                <button className="btn-close" onClick={resetForm}></button>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Task Name"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                />

                <input
                  type="date"
                  className="form-control mb-2"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <select
                  className="form-select mb-2"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>

                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option>Pending</option>
                  <option>Complete</option>
                </select>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button
  className="btn btn-dark"
  onClick={edittask ? handleEdit : handleAddTask}
  disabled={isCreateDisabled}
>
  {edittask ? "Update" : "Submit"}
</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskCard;
