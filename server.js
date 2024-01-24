const mongoose = require("mongoose");

const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

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
