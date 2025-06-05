require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connectDB");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));

const port = process.env.PORT;
const username = encodeURIComponent(process.env.MONGO_USERNAME);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;
const dbName = process.env.MONGO_DB;

const mongo_url = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;
const start = async () => {
  await connectDB(mongo_url);
  app.listen(port, () => {
    console.log(`Server is listening on PORT: ${port}`);
  });
};

start();
