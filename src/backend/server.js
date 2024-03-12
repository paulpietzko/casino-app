require('dotenv').config({ path: '../../.env' });

const mongoose = require("mongoose");
const cors = require("cors");
const app = require("./app");

console.log("database: " + process.env.DATABASE);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

  mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    retryWrites: true,
})
.then(() => {
    console.log("DB connection successful");
});

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
