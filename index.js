// index.js
const express = require("express");
const connect_to_db = require("./db");
const app = express();
var cors = require("cors");
const bodyParser = require('body-parser');
const PORT = 4000;

// Middlewears
app.use(cors({
  origin:[ 'http://localhost:3000', "http://localhost:5173/", "https://hotel-crm-frontend.vercel.app"],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
connect_to_db();
app.use(express.json());
app.use(express.urlencoded({ extended:true}))
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
app.use("/account",require("./Routes/Account"))
app.use("/store/attributes",require("./Routes/Store/Attributes"))
app.use("/store",require("./Routes/Store"))
app.use("/products",require("./Routes/Store/Products"))
app.use("/menus",require("./Routes/Store/Menus"))
app.use("/gallery", require("./Routes/Gallery"))
app.use("/stripe", require("./Routes/Stripe"))

// Export the Express API
module.exports = app;
