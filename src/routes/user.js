const express = require("express");
const userController = require("../controllers/userController");
const authorizeRoles = require("../middlewares/authenticate");
const router = express.Router();

router.get("/", userController.index);

// router.get("/register", userController.getRegisterPage);

router.post("/register", userController.register);

router.put("/update/:id", authorizeRoles("admin"), userController.update);

router.delete("/delete/:id", authorizeRoles("admin"), userController.delete);

router.post("/login", userController.login);

module.exports = router;
