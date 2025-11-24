const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

function verificarToken(req, res, next) {
  const token = req.cookies.token;
  console.log("Middleware: Token present:", !!token);
  if (!token) {
    console.log("Middleware: No token, denying access");
    return res.status(401).json({ error: 'Acceso denegado, token faltante' });
  }

  try {
    const verificado = jwt.verify(token, JWT_SECRET);
    console.log("Middleware: Token verified for user:", verificado.user);
    req.usuario = verificado;
    next();
  } catch (err) {
    console.log("Middleware: Token verification failed:", err.message);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;
