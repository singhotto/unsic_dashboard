const mongoose = require("mongoose");

const reqData = {
  type: String,
  required: true,
  uppercase: true,
};

const facoltativo = { type: String, default: "" };
const option = { type: Boolean, default: false };

const clientSchema1 = mongoose.Schema({
  cf: { type: String, required: true, unique: true },
  cognome: reqData,
  nome: reqData,
  spid: facoltativo,
  PassSpid: facoltativo,
  telefono: reqData,
  ric: option,
  cit: option,
  pakPass: option,
  pakId: option,
  dataRic: facoltativo,
  dataCit: facoltativo,
  idCardId: facoltativo,
  dateOfId: { type: Date, default: Date.now },
  pakPassId: facoltativo,
  dateOfPakPass: { type: Date, default: Date.now },
  comune: reqData,
  regione: { type: String, default: "" },
  nazione: reqData,
  date: { type: Date, default: Date.now },
  note: { type: String, default: "" },
});

const accountSchema1 = mongoose.Schema({
  account: {
    type: String,
    required: true,
    uppercase: true,
    unique: true,
  },
  user: {
    type: String,
    required: true,
    uppercase: true,
  },
  password: { type: String, required: true },
});

const calenderSchema1 = mongoose.Schema({
  title: { type: String, required: true, uppercase: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  notes: { type: String, uppercase: true, default: "" },
});

const defaultCities = mongoose.Schema({
  comune: reqData,
});

const clientSchema = mongoose.model("clients", clientSchema1);
const accountSchema = mongoose.model("accounts", accountSchema1);
const calenderSchema = mongoose.model("appointments", calenderSchema1);
const citySchema = mongoose.model("defaultCities", defaultCities);

module.exports = { clientSchema, accountSchema, calenderSchema, citySchema };
