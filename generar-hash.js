const bcrypt = require("bcryptjs");

bcrypt.hash("12345", 10).then(hash => {
  console.log("🔐 Hash generado:", hash);
});