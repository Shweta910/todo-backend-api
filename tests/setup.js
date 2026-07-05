const { connectTestDB, closeTestDB } = require("./setup/db");

beforeAll(async () => {
  console.log("🔌 Connecting Test Database...");
  await connectTestDB();
});

afterAll(async () => {
  console.log("🔌 Closing Test Database...");
  await closeTestDB();
});
