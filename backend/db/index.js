const impl =
  process.env.DB_MODE === "postgres"
    ? await import("./postgres.js")
    : await import("./mock.js");

export const { getAll, create, update, remove } = impl;