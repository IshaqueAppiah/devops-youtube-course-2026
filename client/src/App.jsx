import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_BASE);

        if (!response.ok) {
          throw new Error("Failed to load tasks.");
        }

        const data = await response.json();
        setTasks(data.tasks);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const visibleTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === "completed") {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  }, [tasks, filter]);

  const taskCounts = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return {
      total: tasks.length,
      completed,
      active: tasks.length - completed,
    };
  }, [tasks]);

  const createTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create task.");
      }

      const data = await response.json();
      setTasks((currentTasks) => [data.task, ...currentTasks]);
      setTitle("");
      setDescription("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTask = async (task) => {
    try {
      setError("");

      const response = await fetch(`${API_BASE}/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task.");
      }

      const data = await response.json();
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id ? data.task : currentTask,
        ),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setError("");

      const response = await fetch(`${API_BASE}/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task.");
      }

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      );
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <main className="app-shell">
      <section className="panel">
        <header className="panel-header">
          <p className="eyebrow">DevOps Practice Project</p>
          <h1>Task Manager</h1>
          <p className="subtitle">
            Full stack setup with React + Express. Data is stored in memory for
            now. CI-friendly demo change for GitHub Actions practice.
          </p>
        </header>

        <form className="task-form" onSubmit={createTask}>
          <label>
            Task title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Deploy backend API"
              maxLength={120}
            />
          </label>

          <label>
            Description
            <textarea
              rows="3"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional details"
              maxLength={400}
            />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Task"}
          </button>
        </form>

        <section className="toolbar">
          <div className="stats">
            <span>Total: {taskCounts.total}</span>
            <span>Active: {taskCounts.active}</span>
            <span>Done: {taskCounts.completed}</span>
          </div>

          <div className="filters" role="tablist" aria-label="Task filters">
            {["all", "active", "completed"].map((item) => (
              <button
                key={item}
                type="button"
                className={filter === item ? "filter active" : "filter"}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {error ? <p className="error">{error}</p> : null}

        {loading ? (
          <p className="info">Loading tasks...</p>
        ) : visibleTasks.length === 0 ? (
          <p className="info">No tasks for this filter.</p>
        ) : (
          <ul className="task-list">
            {visibleTasks.map((task) => (
              <li
                key={task.id}
                className={task.completed ? "task done" : "task"}
              >
                <div className="task-content">
                  <h2>{task.title}</h2>
                  {task.description ? <p>{task.description}</p> : null}
                </div>

                <div className="task-actions">
                  <button type="button" onClick={() => toggleTask(task)}>
                    {task.completed ? "Mark Active" : "Mark Done"}
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
