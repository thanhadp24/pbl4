const express = require("express");
const configViewEngine = require("./config/viewEngine");
const route = require("./routes");
require("dotenv").config();
const app = express();
const cors = require("cors");

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

configViewEngine(app);

//Define routes
route(app);

app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});
