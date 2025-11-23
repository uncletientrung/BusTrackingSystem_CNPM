const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/UserControllers");
router.get("/", UserController.getAll);
router.get("/by-account/:matk", UserController.getByAccountId);
router.post("/", UserController.create);
router.put("/:mand", UserController.update);
router.delete("/:mand", UserController.delete);
module.exports = router;
