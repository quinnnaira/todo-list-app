import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function TodoList() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const saveTasksToLocalStorage = (tasksToSave) => {
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
  };

  const handleAddTask = () => {
    if (task) {
      const newTask = { id: nextId, text: task, completed: false, deleted: false };
      const updatedTasks = [...tasks, newTask];
      setTask('');
      setTasks(updatedTasks);
      setNextId(nextId + 1);
      saveTasksToLocalStorage(updatedTasks); // Update local storage here
    }
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, deleted: true } : task
    );
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
      setEditedTask('');
    }
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const undeletedTasks = tasks.filter((task) => !task.deleted);

  return (
    <div className="container mt-4">
      <h2>My To-Do List</h2>
      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Add a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddTask}>
          Add
        </button>
      </div>

      <ul className="list-group">
        {undeletedTasks.map((task) => (
          <li className={`list-group-item d-flex justify-content-between ${task.completed ? 'completed' : ''}`} key={task.id}>
            <div>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />
              {task.id === editingTaskId ? (
                <input
                  type="text"
                  value={editedTask}
                  onChange={(e) => setEditedTask(e.target.value)}
                />
              ) : (
                <span>{task.id === editingTaskId ? editedTask : task.text}</span>
              )}
            </div>
            <div>
              {task.id !== editingTaskId ? (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditingTaskId(task.id);
                    setEditedTask(task.text);
                  }}
                >
                  Edit
                </button>
              ) : (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleEditTask}
                >
                  Save
                </button>
              )}
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTask(task.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;

// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css'; 

// function TodoList() {
//   const [tasks, setTasks] = useState([]);
//   const [task, setTask] = useState('');

//   const handleAddTask = () => {
//     if (task) {
//       setTasks([...tasks, task]);
//       setTask('');
//     }
//   };

//   const handleDeleteTask = (index) => {
//     const updatedTasks = tasks.filter((_, i) => i !== index);
//     setTasks(updatedTasks);
//   };

//   return (
//     <div className="container mt-4">
//       <h2>My To-Do List</h2>
//       <div className="input-group mb-3">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Add a task"
//           value={task}
//           onChange={(e) => setTask(e.target.value)}
//         />
//         <button className="btn btn-primary" onClick={handleAddTask}>
//           Add
//         </button>
//       </div>

//       <ul className="list-group">
//         {tasks.map((task, index) => (
//           <li className="list-group-item d-flex justify-content-between" key={index}>
//             {task}
//             <button
//               className="btn btn-danger btn-sm"
//               onClick={() => handleDeleteTask(index)}
//             >
//               Delete
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// export default TodoList;
