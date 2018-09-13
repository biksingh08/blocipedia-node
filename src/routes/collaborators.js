const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis/:id/collaborators", collaboratorController.index);
router.post("/wikis/:id/collaborators/add", collaboratorController.create);
router.get("/wikis/:id", collaboratorController.collaboratorList);
router.post("/wikis/:id/collaborators/destroy", collaboratorController.destroy);

module.exports = router;
