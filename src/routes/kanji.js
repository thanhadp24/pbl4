const express = require("express");
const authorizeRoles = require("../middlewares/authenticate");
const kanjiController = require("../controllers/kanjiController");

const router = express.Router();

router.get("/", kanjiController.index);

router.post("/create", authorizeRoles("admin"), kanjiController.getCreatePage);

router.post("/create", authorizeRoles("admin"), kanjiController.create);

router.get(
  "/update/:id",
  authorizeRoles("admin"),
  kanjiController.getUpdatePage
);

router.put("/update/:id", authorizeRoles("admin"), kanjiController.update);

router.delete("/delete/:id", authorizeRoles("admin"), kanjiController.delete);

module.exports = router;
