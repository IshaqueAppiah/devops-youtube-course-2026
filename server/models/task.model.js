const { randomUUID } = require("crypto");

const tasks = [
  {
    id: randomUUID(),
    title: "Set up backend routes",
    description: "Create CRUD endpoints for tasks.",
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: randomUUID(),
    title: "Build React UI",
    description: "Create task list and task form components.",
    completed: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const listTasks = () => tasks;

const createTask = ({ title, description = "" }) => {
  const task = {
    id: randomUUID(),
    title,
    description,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(task);
  return task;
};

const updateTask = (id, updates) => {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return null;
  }

  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
  };

  tasks[taskIndex] = updatedTask;
  return updatedTask;
};

const removeTask = (id) => {
  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return false;
  }

  tasks.splice(taskIndex, 1);
  return true;
};

const findTaskById = (id) => tasks.find((task) => task.id === id) || null;

module.exports = {
  listTasks,
  createTask,
  updateTask,
  removeTask,
  findTaskById,
};
