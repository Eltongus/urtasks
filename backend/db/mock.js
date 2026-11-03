let users = [];
let tasks = [];
let nextUserId = 1;
let nextTaskId = 1;

const copy = (item) => ({ ...item });


export async function createUser({ name, email, passwordHash }) {
  if (users.some((u) => u.email === email)) return null;
  const user = {
    id: nextUserId++,
    name,
    email,
    password_hash: passwordHash,
    created_at: new Date(),
  };
  users.push(user);
  return copy(user);
}

export async function findUserByEmail(email) {
  const user = users.find((u) => u.email === email);
  return user ? copy(user) : null;
}

export async function findUserById(id) {
  const user = users.find((u) => u.id === id);
  return user ? copy(user) : null;
}

export async function getAll(userId) {
  return tasks.filter((t) => t.user_id === userId).map(copy);
}

export async function create(userId, title) {
  const task = {
    id: nextTaskId++,
    user_id: userId,
    title,
    done: false,
    created_at: new Date(),
  };
  tasks.push(task);
  return copy(task);
}

export async function update(userId, id, done) {
  const task = tasks.find((t) => t.id === id && t.user_id === userId);
  if (!task) return null;
  task.done = typeof done === "boolean" ? done : !task.done;
  return copy(task);
}

export async function remove(userId, id) {
  const index = tasks.findIndex((t) => t.id === id && t.user_id === userId);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

export function reset() {
  users = [];
  tasks = [];
  nextUserId = 1;
  nextTaskId = 1;
}