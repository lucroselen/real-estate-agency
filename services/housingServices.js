const Housing = require("../models/Housing");
const User = require("../models/User");

const create = (
  name,
  type,
  year,
  city,
  homeImageUrl,
  propertyDescription,
  availablePieces
) => {
  let housing = new Housing({
    name,
    type,
    year,
    city,
    homeImageUrl,
    propertyDescription,
    availablePieces,
  });

  return housing.save();
};
const getOne = (id) => Housing.findById(id).populate("renters").lean();
const getAll = () => Housing.find({}).lean();
const getLastThree = () =>
  Housing.find({}).limit(3).sort({ _id: "desc" }).lean();
const search = async (query) => {
  if (query) {
    let result = await getAll();
    result = result.filter((x) =>
      x.name.toLowerCase().includes(query.toLowerCase())
    );
    return result;
  }
};
const update = (
  id,
  name,
  type,
  year,
  city,
  homeImageUrl,
  propertyDescription,
  availablePieces
) =>
  Housing.updateOne(
    { _id: id },
    {
      name,
      type,
      year,
      city,
      homeImageUrl,
      propertyDescription,
      availablePieces,
    },

    { runValidators: true }
  );

const deleteRecord = (id) => Housing.deleteOne({ _id: id });

const housingServices = {
  create,
  getAll,
  getLastThree,
  search,
  getOne,
  update,
  deleteRecord,
};

module.exports = housingServices;
