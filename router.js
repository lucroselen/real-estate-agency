const express = require("express");
const router = express.Router();
const homeController = require("./controllers/homeController.js");
const housingController = require("./controllers/housingController.js");
const authController = require("./controllers/authController.js");

router.use(authController);
router.use(housingController);
router.use(homeController);
router.use("*", (req, res) => {
  res.redirect("/404");
});

module.exports = router;
