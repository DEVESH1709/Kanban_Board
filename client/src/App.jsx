import React from "react";
import { useState, useEffect } from "react";
import api from "./api";
import Column from "./components/Columns";
import TaskCard from "./components/TaskCard";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [columnsState, setColumnsState] = useState([
    {
      key: "todo",
      label: "To Do",
    },
    {
      key: "inprogress",
      label: "In Progress",
    },
    {
      key: "done",
      label: "Done",
    },
  ]);

  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showEditColumnModal, setShowEditColumnModal] = useState(false);
  const [editingColumnKey, setEditingColumnKey] = useState(null);
  const [editColumnName, setEditColumnName] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("");
  
  useEffect(() => {
    const savedCols = localStorage.getItem("columns");
    if (savedCols) {
      try {
        const parsed = JSON.parse(savedCols);
        if (Array.isArray(parsed)) setColumnsState(parsed);
        else console.error("Ignored saved columns (not an array", parsed);
      } catch (err) {
        console.warn("Failed to parse saved columns", err);
      }
    }
    
    const saved = localStorage.getItem('tasks')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setTasks(parsed)
        else console.warn('Ignored saved tasks (not an array):', parsed)
      } catch (err) {
        console.warn('Failed to parse saved tasks:', err)
      }
    }

    api.get("/tasks")
      .then((res) => {
        const data = res.data;
        let serverTasks = [];
        if (Array.isArray(data)) serverTasks = data;
        else if (data && Array.isArray(data.tasks)) serverTasks = data.tasks;
        else {
          console.warn(
            "Unexpected /api/tasks response shape, expected array:",
            data
          );
          return;
        }

        setTasks((prevLocal) => {
          const prev = Array.isArray(prevLocal) ? prevLocal : [];
          const serverIds = new Set(serverTasks.map((t) => String(t._id)));
          const localOnly = prev.filter(
            (t) =>
              !t._id ||
              String(t._id).startsWith("temp-") ||
              !serverIds.has(String(t._id))
          );
          return [...serverTasks, ...localOnly];
        });
      })

      .catch((err) => {
        console.error(
          "Failed to fetch server tasks (continuing with local data):",
          err && err.message ? err.message : err
        );
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("columns", JSON.stringify(columnsState));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columnsState));
  }, [columnsState]);

  function addTask() {
    const defaultStatus = (columnsState && columnsState[0] && columnsState[0].key) || 'todo'
    setNewTaskStatus(defaultStatus)
    setShowAddTaskModal(true);
  }

  function addColumn() {
    setShowAddColumnModal(true);
  }

  function submitAddColumn() {
    const label = (newColumnName || "").trim();
    if (!label) return;
    const key = label.toLowerCase().replace(/\s+/g, "-");
    if (columnsState.find((c) => c.key === key)) {
      alert("A column with that name already exists");
      return;
    }
    setColumnsState((prev) => [...prev, { key, label }]);
    setNewColumnName("");
    setShowAddColumnModal(false);
  }

  function editColumn(key) {
    const col = columnsState.find((c) => c.key === key);
    if (!col) return;
    setEditingColumnKey(key);
    setEditColumnName(col.label);
    setShowEditColumnModal(true);
  }

  function deleteColumn(key) {
    if (columnsState.length <= 1) {
      alert("Cannot delete the last column");
      return;
    }
    const firstKey = columnsState[0].key;
    setTasks((prev) =>
      prev.map((t) => (t.status === key ? { ...t, status: firstKey } : t))
    );
    setColumnsState((prev) => prev.filter((c) => c.key !== key));
  }
  function makeTempId() {
    return `temp-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }

  function submitAddTask() {
    const title = (newTaskTitle || "").trim();
    if (!title) return;
    const defaultStatus =
      (columnsState && columnsState[0] && columnsState[0].key) || "todo";

    const tempId = makeTempId();
    const tempTask = {
      _id: tempId,
      title,
      status: defaultStatus,
      isLocal: true,
    };
    setTasks((prev) => [...prev, tempTask]);
    setNewTaskTitle("");
    setShowAddTaskModal(false);

    api.post("/tasks", { title, status: defaultStatus })
      .then((res) => {
        const serverTask = res.data;
        setTasks((prev) =>
          prev.map((t) => (t._id === tempId ? serverTask : t))
        );
      })
      .catch((err) => {
        console.error("create task error (local task kept):", err);
        setTasks((prev) =>
          prev.map((t) => (t._id === tempId ? { ...t, syncError: true } : t))
        );
      });
  }

  function submitEditColumn() {
    const trimmed = (editColumnName || "").trim();
    if (!trimmed) return;
    setColumnsState((prev) =>
      prev.map((c) =>
        c.key === editingColumnKey ? { ...c, label: trimmed } : c
      )
    );
    setEditingColumnKey(null);
    setEditColumnName("");
    setShowEditColumnModal(false);
  }

  function submitEditTask() {
    if (!editingTask) return;
    const id = editingTask._id;
    const title = (editTaskTitle || "").trim();
    if (!title) return;

    setEditingTask(null);
    setEditTaskTitle("");
    if (String(id).startsWith("temp-")) {
      setTasks((prev) => prev.map((t) => (t._id === id ? { ...t, title } : t)));
      return;
    }

    updateTask(id, { title });
  }

  function updateTask(id, updates) {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...updates, syncing: true } : t))
    );

    api.put(`/tasks/${id}`, updates)
      .then((res) => {
        setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      })
      .catch((err) => {
        console.error("updateTask failed:", err);
        setTasks((prev) =>
          prev.map((t) =>
            t._id === id ? { ...t, syncing: false, syncError: true } : t
          )
        );
      });
  }

  function deleteTask(id) {
    let backup = null;
    setTasks((prev) => {
      backup = prev.find((t) => t._id === id);
      return prev.filter((t) => t._id !== id);
    });

    api.delete(`/tasks/${id}`)
      .then(() => {})
      .catch((err) => {
        console.error("deleteTask failed, reverting local delete:", err);
        if (backup) setTasks((prev) => [...prev, backup]);
      });
  }

  function handleDrop(e, newStatus) {
    const id = e.dataTransfer.getData("taskId");
    if (!id) return;
    const task = tasks.find((t) => String(t._id) === String(id));
    if (task && task.status !== newStatus) {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, status: newStatus, syncing: true } : t
        )
      );
      updateTask(id, { status: newStatus });
    }
  }
  function handleDragOver(e) {
    e.preventDefault();
  }

  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const columns = columnsState.reduce((acc, col) => {
    acc[col.key] = safeTasks.filter((t) => t.status === col.key);
    return acc;
  }, {});

  return (
    <div className="app-root min-h-screen bg-white">
      <header className="app-header px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Kanban Board (Styling)</h1>
        </div>
      </header>

      <main className="p-6">
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <button onClick={addTask} className="btn-primary">
              Add Task
            </button>
            <button onClick={addColumn} className="btn-secondary">
              Add Column
            </button>
          </div>
        </div>

<div className="columns-scroll">
        <div className="flex gap-6">
          {columnsState.map((col, idx) => (
            <div
              key={col.key}
              onDrop={(e) => handleDrop(e, col.key)}
              onDragOver={handleDragOver}
              className={`${
                idx > 0 ? "border-l border-gray-200 pl-6" : ""
              } column-wrapper`}
            >
              <Column
                name={col.label}
                onEditColumn={() => editColumn(col.key)}
                onDeleteColumn={() => deleteColumn(col.key)}
              >
                {(columns[col.key] || []).map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={(newTitle) =>
                      updateTask(task._id, { title: newTitle })
                    }
                    onDelete={() => deleteTask(task._id)}
                    onStartEdit={() => {
                      setEditingTask(task);
                      setEditTaskTitle(task.title || "");
                    }}
                  />
                ))}
              </Column>
            </div>
          ))}
        </div>
        </div>
      </main>

      {showAddColumnModal && (
        <Modal
          title="Add New Column"
          onClose={() => setShowAddColumnModal(false)}
        >
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">
                Column Name{" "}
                {!newColumnName.trim() && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </span>
              <input
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
                placeholder="e.g. Archive"
                required
                aria-required="true"
              />
            </label>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddColumnModal(false)}
                className="mr-3 cursor-pointer"
              >
                Cancel
              </button>
              <button onClick={submitAddColumn} className="btn-primary">
                Add Column
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showAddTaskModal && (
        <Modal title="Add New Task" onClose={() => setShowAddTaskModal(false)}>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">
                Task Title{" "}
                {!newTaskTitle.trim() && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </span>
              <input
                value={newTaskTitle}
                required
                aria-required="true"
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium"> Status</span>
              <select
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              >
                {columnsState.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="mr-3 cursor-pointer"
              >
                Cancel
              </button>
              <button onClick={submitAddTask} className="btn-primary">
                Add Task
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showEditColumnModal && (
        <Modal
          title="Edit Column"
          onClose={() => setShowEditColumnModal(false)}
        >
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">
                Column Name{" "}
                {!newColumnName.trim() && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </span>
              <input
                value={editColumnName}
                required
                aria-required="true"
                onChange={(e) => setEditColumnName(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </label>
            <div className="flex justify-end">
              <button
                onClick={() => setShowEditColumnModal(false)}
                className="mr-3"
              >
                Cancel
              </button>
              <button onClick={submitEditColumn} className="btn-primary">
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}

      {editingTask && (
        <Modal
          title="Edit Task"
          onClose={() => {
            setEditingTask(null);
            setEditTaskTitle("");
          }}
        >
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium">
                Task Title{" "}
                {!editTaskTitle.trim() && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </span>
              <input
                value={editTaskTitle}
                onChange={(e) => setEditTaskTitle(e.target.value)}
                className="w-full border rounded px-3 py-2 mt-1"
              />
            </label>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setEditingTask(null);
                  setEditTaskTitle("");
                }}
                className="mr-3"
              >
                Cancel
              </button>
              <button
                onClick={submitEditTask}
                className="btn-primary"
                disabled={!editTaskTitle.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;
