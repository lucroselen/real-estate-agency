module.exports = {
  development: {
    PORT: process.env.PORT || 4000,
    DB_CONNECTION_STRING: "mongodb://localhost:27017/apartments",
  },
};
