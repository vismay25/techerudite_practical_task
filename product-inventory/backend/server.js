require("dotenv").config();
const express = require("express");
const connectDB = require("./db/connectDB");
const cors = require("cors");
const seedCategories = require("./seeder");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

const port = process.env.PORT;
const username = encodeURIComponent(process.env.MONGO_USERNAME);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const cluster = process.env.MONGO_CLUSTER;
const dbName = process.env.MONGO_DB;

const mongo_url = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

const start = async () => {
  await connectDB(mongo_url);
  await seedCategories();

  app.listen(port, () => {
    console.log(`Server is listening on PORT: ${port}`);
  });
};

start();
