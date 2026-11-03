import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import * as db from "./db/index.js";

const app = express()

dotenv.config();

app.use(cors())
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello");
});

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get(
  "/api/tasks",
  asyncHandler(async (req, res) => {
    res.json(await db.getAll());
  })
);

app.post(
  "/api/tasks",
  asyncHandler(async (req, res) => {
    const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
    if (!title) {
      return res.status(400).json({ error: "El título es obligatorio" });
    }
    res.status(201).json(await db.create(title));
  })
);

app.patch(
  "/api/tasks/:id",
  asyncHandler(async (req, res) => {
    const task = await db.update(Number(req.params.id), req.body.done);
    if (!task) return res.status(404).json({ error: "Tarea no encontrada" });
    res.json(task);
  })
);

app.delete(
  "/api/tasks/:id",
  asyncHandler(async (req, res) => {
    const deleted = await db.remove(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Tarea no encontrada" });
    res.status(204).send();
  })
);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en el puerto ${PORT}`));
