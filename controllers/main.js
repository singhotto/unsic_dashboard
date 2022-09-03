const {
  clientSchema,
  accountSchema,
  calenderSchema,
  citySchema,
} = require("../mongo/schema");
const newpath = __dirname.slice(0, -12) + "/uploads/";
const fs = require("fs");
const pdf = require("pdf-parse");
const csv = require("csvtojson");
//SNGHJB76M17Z222J

//GLOBAL
const rgx = /^[0-9]/g;

async function AddContactDb({
  cf,
  cognome,
  nome,
  telefono,
  comune,
  regione,
  nazione,
}) {
  try {
    const dd = await clientSchema.create({
      cf,
      cognome,
      nome,
      telefono,
      comune,
      regione,
      nazione,
    });
  } catch (error) {
    if ("E11000" == error.message.split(" ")[0]) {
      console.log("DUPLICATE!!");
    } else {
      console.log(error);
    }
  }
}

//CLIENTS
const nClients = async (req, res) => {
  try {
    const response = await clientSchema.find().count();
    if (response) {
      res.json(response);
    }
  } catch (error) {
    console.log(error);
  }
};

//Add User
const getUserByCf = async (req, res) => {
  try {
    const response = await clientSchema.findOne({ cf: req.params.cf });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const updateUserByCf = async (req, res) => {
  try {
    const response = await clientSchema.findOneAndUpdate(
      { cf: req.params.cf },
      req.body,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    if (response) {
      res.json({ status: "ok" });
    }
  } catch (error) {
    console.log(error);
  }
};

//Ricongiungimento Familiare
const searchRic = async (req, res) => {
  try {
    const { cf, nome, cognome, limit } = req.query;
    let q = { ric: true };
    if (cf) {
      q["cf"] = cf;
    } else if (nome && cognome) {
      q["nome"] = nome;
      q["cognome"] = cognome;
    } else if (nome) {
      q["nome"] = nome;
    } else if (cognome) {
      q["cognome"] = cognome;
    }
    const response = await clientSchema
      .find(q)
      .sort({ dataRic: -1 })
      .skip(limit)
      .limit(10);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const nRic = async (req, res) => {
  try {
    const response = await clientSchema.find({ ric: true }).count();
    if (response) {
      res.json(response);
    }
  } catch (e) {
    console.log(e);
  }
};

//Cittadinanza
const searchCit = async (req, res) => {
  try {
    const { cf, nome, cognome, limit } = req.query;
    let q = { cit: true };
    if (cf) {
      q["cf"] = cf;
    } else if (nome && cognome) {
      q["nome"] = nome;
      q["cognome"] = cognome;
    } else if (nome) {
      q["nome"] = nome;
    } else if (cognome) {
      q["cognome"] = cognome;
    }
    const response = await clientSchema
      .find(q)
      .sort({ dataCit: -1 })
      .skip(limit)
      .limit(10);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const nCit = async (req, res) => {
  try {
    const response = await clientSchema.find({cit:true}).count();
    res.json(response);
  } catch (e) {
    console.log(e);
  }
};

//PAK ID
const searchId = async (req, res) => {
  try {
    const { cf, nome, cognome, limit } = req.query;
    let q = { pakId: true };
    if (cf) {
      q["cf"] = cf;
    } else if (nome && cognome) {
      q["nome"] = nome;
      q["cognome"] = cognome;
    } else if (nome) {
      q["nome"] = nome;
    } else if (cognome) {
      q["cognome"] = cognome;
    }
    const response = await clientSchema
      .find(q)
      .sort({ dataCit: -1 })
      .skip(limit)
      .limit(10);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const nPakId = async (req, res) => {
  try {
    const response = await clientSchema.find({ pakId: true }).count();
    if (response) {
      res.json(response);
    }
  } catch (e) {
    console.log(e);
  }
};

//Pak Passport
const searchPassport = async (req, res) => {
  try {
    const { cf, nome, cognome, limit } = req.query;
    let q = { pakPass: true };
    if (cf) {
      q["cf"] = cf;
    } else if (nome && cognome) {
      q["nome"] = nome;
      q["cognome"] = cognome;
    } else if (nome) {
      q["nome"] = nome;
    } else if (cognome) {
      q["cognome"] = cognome;
    }
    const response = await clientSchema
      .find(q)
      .sort({ dataCit: -1 })
      .skip(limit)
      .limit(10);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const nPassport = async (req, res) => {
  try {
    const response = await clientSchema.find({ pakPass: true }).count();
    if (response) {
      res.json(response);
    }
  } catch (e) {
    console.log(e);
  }
};

//Settings
const getAllCities = async (req, res) => {
  try {
    //client Schema
    //const response = await clientSchema.find().distinct("comune");
    const response = await clientSchema.aggregate([
      {
        $group: {
          _id: null,
          nazione: { $addToSet: "$nazione" },
          comune: { $addToSet: "$comune" },
        },
      },
    ]);
    res.json(response);
  } catch (e) {
    console.log(e);
  }
};

const readFile = async (req, res) => {
  try {
    const file = req.files.file;
    const filename = file.name;
    file.mv(`${newpath}${filename}`, async (err) => {
      if (err) throw err;
      const jsonArray = await csv().fromFile(`${newpath}${filename}`);
      for (let i = 0; i < 10; i++) {
        if (
          jsonArray[i]["Codice Fiscale"] &&
          jsonArray[i]["Cognome"] &&
          jsonArray[i]["Nome"] &&
          jsonArray[i]["Cellulare"] &&
          jsonArray[i]["Comune residenza"] &&
          jsonArray[i]["Pv residenza"] &&
          jsonArray[i]["Comune nascita"]
        ) {
          AddContactDb({
            cf: jsonArray[i]["Codice Fiscale"],
            cognome: jsonArray[i]["Cognome"],
            nome: jsonArray[i]["Nome"],
            telefono: jsonArray[i]["Cellulare"],
            comune: jsonArray[i]["Comune residenza"],
            regione: jsonArray[i]["Pv residenza"],
            nazione: jsonArray[i]["Comune nascita"],
          });
        }
      }
      fs.unlink(`${newpath}${filename}`, (err) => {
        if (err) {
          throw err;
        }
        console.log("File is deleted.");
      });
      return res.status(200).send({ message: "Clients Updated", code: 200 });
    });
  } catch (error) {
    if ("E11000" == error.message.split(" ")[0]) {
      console.log("DUPLICATED!!");
    } else {
      return res.status(200).send({ message: "ERROR!!!", code: 400 });
    }
  }
};

const addCities = async (req, res) => {
  try {
    const response = await citySchema.create(req.body);
    res.json(response);
  } catch (e) {
    console.log(e);
  }
};

const getCities = async (req, res) => {
  try {
    const response = await citySchema.find();
    res.json(response);
  } catch (e) {
    console.log(e);
  }
};

const deleteCity = async (req, res) => {
  try {
    const response = await citySchema.deleteOne({ comune: req.params.city });
    res.json(response);
  } catch (e) {
    console.log(e);
  }
};

//Account
const getAccounts = async (req, res) => {
  try {
    const response = await accountSchema.find();
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const getAccoutById = async (req, res) => {
  try {
    const response = await accountSchema.findOne({ _id: req.params.id });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const addAccount = async (req, res) => {
  try {
    const response = await accountSchema.create(req.body);
    res.json(response);
  } catch (error) {
    if ("E11000" == error.message.split(" ")[0]) {
      res.json({ duplicate: true });
    } else {
      console.log(error);
    }
  }
};

const updateAccoutById = async (req, res) => {
  try {
    const response = await accountSchema.updateOne(
      { _id: req.body.id },
      req.body
    );
    if (response) {
      res.json({ status: "ok" });
    }
  } catch (error) {
    console.log(error);
  }
};

const removeAccount = async (req, res) => {
  try {
    const response = await accountSchema.deleteOne({ _id: req.params.id });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

//Calender

const addAppointment = async (req, res) => {
  try {
    const response = await calenderSchema.create(req.body);
    res.json(response);
  } catch (e) {
    console.log(e);
  }
};

const getAppointments = async (req, res) => {
  try {
    const response = await calenderSchema.find();
    res.json(response);
  } catch (e) {
    console.log(e);
  }
};
const deleteAppointment = async (req, res) => {
  try {
    const response = await calenderSchema.deleteOne({ _id: req.params.id });
    if (response.deletedCount > 0) {
      res.json({ status: "ok" });
    }
  } catch (e) {
    console.log(e);
  }
};

const updateAppointment = async (req, res) => {
  try {
    console.log(req.body, req.params);
    const response = await calenderSchema.updateOne(
      { _id: req.params.id },
      req.body
    );
    if (response) {
      res.json({ status: "ok" });
    }
  } catch (e) {
    console.log(e);
  }
};

//WHATSAPP
const getCountries = async (req, res) => {
  try {
    const response = await clientSchema.find().distinct("nazione");
    res.json(response);
  } catch (e) {
    console.log(e);
  }
};

const getUsersForWp = async (req, res) => {
  try {
    const { nazione, comune } = req.query;
    let q = {};
    if (comune && nazione != "All") {
      q["comune"] = { $in: comune.split(",") };
      q["nazione"] = nazione;
    } else if (nazione != "All") {
      q["nazione"] = nazione;
    } else if (comune) {
      q["comune"] = { $in: comune.split(",") };
    }

    const response = await clientSchema.find(q).count();
    if (response) {
      res.json(response);
    }
  } catch (e) {
    console.log(e);
  }
};

const uploadFile = async (req, res) => {
  try {
    const file = req.files.file;
    const filename = file.name;
    file.mv(`${newpath}${filename}`, (err) => {
      if (err) {
        console.log("faill");
        return res
          .status(500)
          .send({ message: "File upload failed", code: 500 });
      }
      return res.status(200).send({ message: "File Uploaded", code: 200 });
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getAllCities,
  addAccount,
  getAccoutById,
  updateAccoutById,
  removeAccount,
  addAppointment,
  getAccounts,
  getAppointments,
  updateAppointment,
  deleteAppointment,
  getUserByCf,
  updateUserByCf,
  searchRic,
  searchCit,
  uploadFile,
  readFile,
  searchPassport,
  searchId,
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
};
