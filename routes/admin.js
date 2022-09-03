const express = require("express");
const {
  getAllCities,
  addAccount,
  updateAccoutById,
  getAccoutById,
  removeAccount,
  getAccounts,
  addAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  getUserByCf,
  searchRic,
  searchCit,
  updateUserByCf,
  uploadFile,
  readFile,
  searchId,
  searchPassport,
  getCities,
  addCities,
  deleteCity,
  getCountries,
  getUsersForWp,
  nClients,
  nPassport,
  nPakId,
  nCit,
  nRic,
} = require("../controllers/main.js");

const router = express.Router();

//File
router.route("/file").post(uploadFile);
router.route("/read").post(readFile);

//CLIENTS 
router.route("/clients").get(nClients);

//DEFAULT CITIES
router.route("/cities").get(getCities);
router.route("/all-cities").get(getAllCities);
router.route("/cities").post(addCities);
router.route("/rmcity/:city").delete(deleteCity);

//Accounts
router.route("/account").get(getAccounts);
router.route("/account").post(addAccount);
router.route("/account/:id").get(getAccoutById);
router.route("/rmac/:id").delete(removeAccount);
router.route("/accountUpdate").put(updateAccoutById);

//Calender
router.route("/add-appointment").post(addAppointment);
router.route("/get-appointments").get(getAppointments);
router.route("/update-appointment/:id").put(updateAppointment);
router.route("/delete-appointment/:id").delete(deleteAppointment);

//Add Users
router.route("/user/:cf").get(getUserByCf);
router.route("/user/:cf").post(updateUserByCf);

//Ricongiungimento
router.route("/rf").get(searchRic);
router.route("/nrf").get(nRic);

//Cittadinanza
router.route("/ct").get(searchCit);
router.route("/nct").get(nCit);

//pakId
router.route("/id").get(searchId);
router.route("/nid").get(nPakId);

//pak Passport
router.route("/passport").get(searchPassport);
router.route("/npassport").get(nPassport);

//WHATSAPP
router.route("/wpusers").get(getUsersForWp)
router.route("/country").get(getCountries)

module.exports = router;
