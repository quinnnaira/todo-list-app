import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TodoList.css";

function TodoList() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState("");
  const [activeTab, setActiveTab] = useState("today");
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const saveTasksToLocalStorage = (tasksToSave) => {
    localStorage.setItem("tasks", JSON.stringify(tasksToSave));
  };

  const handleAddTask = () => {
    if (task.trim()) {
      const newTask = {
        id: Date.now(),
        text: task,
        completed: false,
        createdAt: new Date().toISOString(),
        reminder: "",
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setTask("");
      saveTasksToLocalStorage(updatedTasks);
    }
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleEditTask = () => {
    if (editedTask && editingTaskId !== null) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingTaskId ? { ...task, text: editedTask } : task
      );
      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setEditingTaskId(null);
      setEditedTask("");
    }
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (task) => {
    const taskDate = new Date(task.createdAt);
    const now = new Date();
    const diffInDays = (now - taskDate) / (1000 * 60 * 60 * 24);
    return diffInDays >= 1 && !task.completed;
  };

  const todayTasks = tasks.filter(
    (t) =>
      new Date(t.createdAt).toDateString() === new Date().toDateString() &&
      !t.completed &&
      !isOverdue(t)
  );

  const overdueTasks = tasks.filter((t) => isOverdue(t));
  const completedTasks = tasks.filter((t) => t.completed);

  const getActiveTasks = () => {
    switch (activeTab) {
      case "today":
        return todayTasks;
      case "overdue":
        return overdueTasks;
      default:
        return [];
    }
  };

  const clearCompleted = () => {
    const updatedTasks = tasks.filter((t) => !t.completed);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  

  return (
    <div className="container mt-5">
      <div className="content">
      <h1 className="text-center mb-4 fw-bold">Todo App</h1>

      <div className="d-flex justify-content-center mb-4">
        <button
          className={`btn me-2 ${
            activeTab === "today" ? "btn-success" : "btn-outline-success"
          }`}
          onClick={() => setActiveTab("today")}
        >
          Task
        </button>

        <button
          className={`btn ${
            activeTab === "overdue" ? "btn-danger" : "btn-outline-danger"
          }`}
          onClick={() => setActiveTab("overdue")}
        >
          Overdue
        </button>
      </div>

      {activeTab === "today" && (
        <div className="d-flex mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Add a task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
          <button className="btn btn-success ms-2" onClick={handleAddTask}>
            Add
          </button>
        </div>
      )}

      {/* Task List */}
      <ul className="list-group">
        {getActiveTasks().length > 0 ? (
          getActiveTasks().map((task) => (
            <li className="list-group-item d-flex flex-column" key={task.id}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    className="form-check-input me-2"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                  />
                  {task.id === editingTaskId ? (
                    <input
                      type="text"
                      className="form-control"
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                    />
                  ) : (
                    <span
                      className={
                        task.completed
                          ? "text-muted text-decoration-line-through"
                          : ""
                      }
                    >
                      {task.text}
                    </span>
                  )}
                </div>
                <div className="d-flex align-items-center">
                  <small className="text-muted me-3">
                    {formatDate(task.createdAt)}
                  </small>
                  {task.id !== editingTaskId ? (
                    <button
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => {
                        setEditingTaskId(task.id);
                        setEditedTask(task.text);
                      }}
                    >
                      ✏️
                    </button>
                  ) : (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={handleEditTask}
                    >
                      💾
                    </button>
                  )}
                 
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              
            </li>
          ))
        ) : (
          <p className="alert text-muted text-center mt-3 ">
            {activeTab === "overdue" ? "⚠️ No Overdue Tasks" : "No tasks yet"}
          </p>
        )}
      </ul>

      {/* Completed Tasks */}
      <div className="mt-4">
        <button
          className="btn btn-outline-success w-100 text-start"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          ✅ Completed Tasks ({completedTasks.length})
        </button>

        {showCompleted && (
          <div className="mt-2">
            {completedTasks.length > 0 ? (
              <>
                <div className="d-flex justify-content-end mb-2">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={clearCompleted}
                  >
                    🗑️ Clear All
                  </button>
                </div>
                <ul className="list-group">
                  {completedTasks.map((task) => (
                    <li
                      className="list-group-item d-flex justify-content-between align-items-center"
                      key={task.id}
                    >
                      <span className="ms-2 text-muted text-decoration-line-through">
                        {task.text}
                      </span>
                      <small className="text-muted">
                        {formatDate(task.createdAt)}
                      </small>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="alert text-muted text-center mt-2">
                No completed tasks yet.
              </p>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default TodoList;
