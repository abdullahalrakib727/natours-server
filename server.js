const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((error) => {
    console.log("error while connecting to mongodb", error);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
