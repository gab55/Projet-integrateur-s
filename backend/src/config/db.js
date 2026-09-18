const mongoose = require("mongoose");


async function connecterBD(uri) {
  if (!uri) {
    throw new Error("MONGO_URI est manquante. Vérifiez votre fichier .env.");
  }

  mongoose.connection.on("connected",() => console.log("MongoDB : connecté"));
  mongoose.connection.on("error",(e) => console.error("MongoDB : erreur -", e.message));
  mongoose.connection.on("disconnected",() => console.warn("MongoDB : déconnecté"));

  await mongoose.connect(uri);
}

module.exports = { connecterBD };
