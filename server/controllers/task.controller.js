const taskModel = require("../models/task.model");

const getTasks = (_req, res) => {
  const tasks = taskModel.listTasks();
  return res.status(200).json({ tasks });
};

const createTask = (req, res) => {
  const { title, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required." });
  }

  const task = taskModel.createTask({
    title: title.trim(),
    description: typeof description === "string" ? description.trim() : "",
  });

  return res.status(201).json({ task });
};

const updateTask = (req, res) => {
  const { id } = req.params;
  const existingTask = taskModel.findTaskById(id);

  if (!existingTask) {
    return res.status(404).json({ message: "Task not found." });
  }

  const updates = {};

  if (typeof req.body.title === "string") {
    const nextTitle = req.body.title.trim();

    if (!nextTitle) {
      return res.status(400).json({ message: "Title cannot be empty." });
    }

    updates.title = nextTitle;
  }

  if (typeof req.body.description === "string") {
    updates.description = req.body.description.trim();
  }

  if (typeof req.body.completed === "boolean") {
    updates.completed = req.body.completed;
  }

  const task = taskModel.updateTask(id, updates);
  return res.status(200).json({ task });
};

const deleteTask = (req, res) => {
  const { id } = req.params;
  const removed = taskModel.removeTask(id);

  if (!removed) {
    return res.status(404).json({ message: "Task not found." });
  }

  return res.status(200).json({ message: "Task deleted successfully." });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
