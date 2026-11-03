import jwt from "jsonwebtoken";

export function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: String(userId),
    expiresIn: "1d",
  });
}

export function requireAuth(req, res, next) {
  const [type, token] = (req.headers.authorization ?? "").split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token requerido" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = Number(payload.sub);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}