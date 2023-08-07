const mongoose = require("mongoose");
const env = require("./env");

const databaseURI = (
    process.env.NODE_ENV === "production" ?
        env.MONGODB_URI :
        env.LOCAL_MONGODB_URI);

async function connectMongo() {
    await mongoose.connect(databaseURI, { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports = { connectMongo };