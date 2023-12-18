// index.js
const express = require("express");
const connect_to_db = require("./db");
const app = express();
var cors = require("cors");
const PORT = 4000;

// Middlewears
app.use(cors({
    origin: ['http://localhost:3000', "http://localhost:5173", "http://localhost:5174", "https://hotel-crm-frontend.vercel.app", "https://hotel-crm-admin.vercel.app"],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
connect_to_db();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use("/uploads", cors(), express.static("uploads"));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
app.use("/account", cors(), require("./Routes/Account"))
app.use("/store/attributes", cors(), require("./Routes/Store/Attributes"))
app.use("/store", cors(), require("./Routes/Store"))
app.use("/products", cors(), require("./Routes/Store/Products"))
app.use("/menus", cors(), require("./Routes/Store/Menus"))
app.use("/gallery", cors(), require("./Routes/Gallery"))
app.use("/stripe", cors(), require("./Routes/Stripe"))
app.use("/orders", cors(), require("./Routes/Store/Orders"))

// Export the Express API
module.exports = app;
