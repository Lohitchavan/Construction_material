const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const { connectDb } = require("./utils/connectDb");

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDb(process.env.MONGO_URI);

  const server = http.createServer(app);
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${PORT}`);
  });

  const shutdown = async (signal) => {
    // eslint-disable-next-line no-console
    console.log(`\n${signal} received. Shutting down...`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


