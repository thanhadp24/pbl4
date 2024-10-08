const jwt = require("jsonwebtoken");

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).send({ message: "Access denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userRole = decoded.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).send({ message: "Access denied" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).send({ message: "Invalid token" });
    }
  };
}

module.exports = authorizeRoles;
