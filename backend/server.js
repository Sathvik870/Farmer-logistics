const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const os = require("os");
const cookieParser = require("cookie-parser");
const logger = require("./src/config/logger");

const adminAuthRoutes = require("./src/routes/admin/auth.routes");
const adminUserRoutes = require("./src/routes/admin/user.routes");
const adminProductRoutes = require("./src/routes/admin/product.routes");
const adminPurchaseRoutes = require("./src/routes/admin/purchase.routes");
const adminStockRoutes = require("./src/routes/admin/stock.routes");

const customerAuthRoutes = require("./src/routes/customer/auth.routes");
const customerUserRoutes = require("./src/routes/customer/user.routes");

const publicProductRoutes = require("./src/routes/public/product.routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

function findLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      const { address, family, internal } = iface;
      if (family === "IPv4" && !internal) {
        return address;
      }
    }
  }
  return null;
}

const allowedOrigins = [
  "http://localhost:5173",
  "https://farmer-logistics.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("This origin is not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

const adminRouter = express.Router();
adminRouter.use("/auth", adminAuthRoutes);
adminRouter.use("/users", adminUserRoutes);
adminRouter.use("/products", adminProductRoutes);
adminRouter.use("/purchase-orders", adminPurchaseRoutes);
adminRouter.use("/stock", adminStockRoutes);

app.use("/api/admin", adminRouter);

const customerRouter = express.Router();
customerRouter.use("/auth", customerAuthRoutes);
customerRouter.use("/users", customerUserRoutes);

app.use("/api/customer", customerRouter);


const publicRouter = express.Router();
publicRouter.use("/products", publicProductRoutes);

app.use("/api/public", publicRouter);


app.get("/", (req, res) => {
  res.send("Hello there! Welcome to the Farmer Logistics Backend Server.");
});

app.listen(PORT, HOST, () => {
  const localIp = findLocalIp();
  logger.info("Server running and accessible on:");
  logger.info(`  - Local:   http://localhost:${PORT}`);
  if (localIp) {
    logger.info(`  - Network: http://${localIp}:${PORT}`);
  }
});
