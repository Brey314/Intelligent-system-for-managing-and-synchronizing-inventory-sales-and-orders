const jwt = require('jsonwebtoken');
const JWT_SECRET = "clave_super_segura_que_deberias_guardar_en_.env";

function verificarToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso denegado, token faltante' });

  try {
    const verificado = jwt.verify(token, JWT_SECRET);
    req.usuario = verificado;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;
