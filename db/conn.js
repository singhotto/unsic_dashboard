const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");
const Db = `mongodb+srv://unsic:Angel%40123@unsic.fmney.mongodb.net/caf_Boretto?retryWrites=true&w=majority`;
//const Db = `mongodb+srv://unsic:Angel%40123@unsic.fmney.mongodb.net/?retryWrites=true&w=majority`;

 
module.exports = {
  connectToServer: function (callback) {
    mongoose
    .connect(Db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async() =>{
      console.log("Successfully connected to MongoDB."); 
    }
    )
    .catch((err) => callback("Unable to connect ot MongoDB line 14 file conn.js",err));
  },
 
};