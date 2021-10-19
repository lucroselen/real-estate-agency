const Housing = require("../models/Housing");
const User = require("../models/User");

const create = (data) => Housing.create(data);
// const create = (data) => {
//   let housing = new Housing(data);
//   return housing.save();
// };
const getOne = (id) =>
  Housing.findById(id).populate("renters").populate("owner").lean();
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

const rent = async (housingId, userId) => {
  let house = await Housing.findById(housingId);
  let renter = await User.findById(userId);

  house.renters.push(renter);

  return house.save();
};

const deleteRecord = (id) => Housing.deleteOne({ _id: id });

const housingServices = {
  create,
  getAll,
  getLastThree,
  search,
  getOne,
  update,
  deleteRecord,
  rent,
};

module.exports = housingServices;
