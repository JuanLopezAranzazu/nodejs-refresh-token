const express = require("express");
const cors = require("cors");
const { config } = require("./config/config");
const { logErrors, errorHandler } = require("./middlewares/errorHandler");
const {
  createDefaultRoles,
  createAdminUser,
} = require("./utils/defaultValues");

const port = config.port;
const app = express();

// config express
const corsOptions = {
  origin: "*",
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// db
require("./config/db");
createDefaultRoles();
createAdminUser();

// routes
const routes = require("./routes/index");
routes(app);

// middlewares
app.use(logErrors);
app.use(errorHandler);

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
