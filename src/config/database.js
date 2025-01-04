const mongoooseDB = require("mongoose");

const DBConnect = async () => {
  try {
    await mongoooseDB.connect(
      "mongodb+srv://sukumar1118:ARrzIB0QcSPrYhjM@cluster0.62nhlhp.mongodb.net/DevConnect"
    );
  } catch (error) {
    console.log("Error while connecting to database", error);
  }
};

module.exports = DBConnect;
