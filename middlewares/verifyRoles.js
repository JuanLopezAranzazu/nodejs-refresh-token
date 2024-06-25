function verifyRoles(...roles) {
  return (req, res, next) => {
    if (!req?.roles) return res.status(401).json({ error: "Acceso denegado" });
    const rolesArray = [...roles];
    if (!rolesArray.some((role) => req.roles.includes(role)))
      return res.status(401).json({ error: "Acceso denegado" });
    next();
  };
}

module.exports = verifyRoles;
