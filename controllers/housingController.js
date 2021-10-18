const express = require("express");
const { isAuth, isOwner } = require("../middlewares/authMiddleware");
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
  let owner = req.user._id;

  await housingServices.create({
    name,
    type,
    year,
    city,
    homeImageUrl,
    propertyDescription,
    availablePieces,
    owner,
  });
  res.redirect("/");
});

router.get("/details/:houseId", async (req, res) => {
  let record = await housingServices.getOne(req.params.houseId);
  let title = "Offer Details";
  let rentedBy = record.renters.map((x) => x.name).join(", ");
  let alreadyRented = false;
  if (req.user) {
    alreadyRented = record.renters.find((x) => x._id == req.user._id);
  }
  let isOwnedBy = false;
  if (req.user) {
    isOwnedBy = record.owner._id.toString() == req.user._id;
  }

  res.render("details", {
    ...record,
    title,
    rentedBy,
    alreadyRented,
    isOwnedBy,
  });
});

router.get("/edit/:houseId", isAuth, isOwner, async (req, res) => {
  let record = await housingServices.getOne(req.params.houseId);
  let title = "Edit Offer";
  res.render("edit", { ...record, title });
});

router.get("/rent/:houseId", isAuth, async (req, res) => {
  let houseId = req.params.houseId;
  let userId = req.user._id;
  let housing = await housingServices.getOne(houseId);
  if (!(housing.owner._id.toString() == req.user._id)) {
    await housingServices.rent(houseId, userId);
    res.redirect(`/details/${houseId}`);
  } else {
    res.status(403).send("<h1>You cannot rent your own place!</h1>");
  }
});

router.post("/edit/:id", isAuth, isOwner, async (req, res) => {
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

router.get("/remove/:houseId", isAuth, isOwner, async (req, res) => {
  await housingServices.deleteRecord(req.params.houseId);
  res.redirect("/housing-for-rent");
});

module.exports = router;
