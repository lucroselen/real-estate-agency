const express = require("express");
const { isAuth } = require("../middlewares/authMiddleware");
const router = express.Router();

const housingServices = require("../services/housingServices");

router.get("/housing-for-rent", async (req, res) => {
  let apartments = await housingServices.getAll();
  let title = "Catalog";

  res.render("aprt-for-recent", { apartments, title });
});
router.get("/create-offer", isAuth, (req, res) => {
  let title = "Create Offer";
  res.render("create", { title });
});

router.post("/create-offer", isAuth, async (req, res) => {
  let {
    name,
    type,
    year,
    city,
    homeImageUrl,
    propertyDescription,
    availablePieces,
  } = req.body;
  await housingServices.create(
    name,
    type,
    year,
    city,
    homeImageUrl,
    propertyDescription,
    availablePieces
  );
  res.redirect("/");
});

router.get("/details/:houseId", isAuth, async (req, res) => {
  let record = await housingServices.getOne(req.params.houseId);
  let title = "Offer Details";
  res.render("details", { ...record, title });
});
router.get("/edit/:houseId", isAuth, async (req, res) => {
  let record = await housingServices.getOne(req.params.houseId);
  let title = "Edit Offer";
  res.render("edit", { ...record, title });
});

router.post("/edit/:id", isAuth, async (req, res) => {
  let {
    name,
    type,
    year,
    city,
    homeImageUrl,
    propertyDescription,
    availablePieces,
  } = req.body;
  let id = req.params.id;
  await housingServices
    .update(
      id,
      name,
      type,
      year,
      city,
      homeImageUrl,
      propertyDescription,
      availablePieces
    )
    .catch((err) => console.error(err));
  res.redirect(`/details/${id}`);
});

router.get("/remove/:houseId", isAuth, async (req, res) => {
  await housingServices.deleteRecord(req.params.houseId);
  res.redirect("/housing-for-rent");
});

module.exports = router;
