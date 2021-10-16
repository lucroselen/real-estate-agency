const express = require("express");
const { isAuth } = require("../middlewares/authMiddleware");
const router = express.Router();
const housingServices = require("../services/housingServices");

router.get("/", async (req, res) => {
  let title = "Homepage";
  try {
    let homeApartments = await housingServices.getLastThree();
    res.render("home", { homeApartments, title });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
});

router.get("/search", isAuth, (req, res) => {
  let title = "Search";
  res.render("search", { title });
});

router.get("/search-results", isAuth, async (req, res) => {
  let title = "Search Results";
  let { search } = req.query;

  let apartments = await housingServices.search(search);

  res.render("search-results", { apartments, title });
});

router.get("/404", (req, res) => {
  let title = "404";
  res.status(404).render("404", { title });
});

module.exports = router;
