const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const { connectDb } = require("../utils/connectDb");
const User = require("../models/User");
const Product = require("../models/Product");
const products = require("./products");

dotenv.config();

async function run() {
  await connectDb(process.env.MONGO_URI);

  await Promise.all([User.deleteMany({}), Product.deleteMany({})]);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@buildmart.com";
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "Admin123!";

  const admin = await User.create({
    name: "Admin",
    email: adminEmail,
    password: await bcrypt.hash(adminPass, 10),
    role: "admin",
  });

  const user = await User.create({
    name: "Demo User",
    email: "user@buildmart.com",
    password: await bcrypt.hash("User123!", 10),
    role: "user",
  });

  await Product.insertMany(products);

  // eslint-disable-next-line no-console
  console.log("Seed complete:");
  // eslint-disable-next-line no-console
  console.log(`- Admin: ${admin.email} / ${adminPass}`);
  // eslint-disable-next-line no-console
  console.log(`- User: ${user.email} / User123!`);

  await mongoose.connection.close();
}

run().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  try {
    await mongoose.connection.close();
  } catch (_) {}
  process.exit(1);
});

