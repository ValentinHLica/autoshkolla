const hddserial = require("hddserial");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
module.exports = () => {
  return new Promise((resolve) => {
    hddserial.first(function (err, serial) {
      const algorithm = "aes-192-cbc";
      let password = serial;

      const key = crypto.scryptSync(password, "salt", 24); //create key
      const iv = Buffer.alloc(16, 0);

      try {
        // Decrypt Data
        const encrypted = fs.readFileSync(
          path.join(__dirname, "./key.txt"),
          "utf8"
        );
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        const decrypted =
          decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8"); //deciphered text
        // ====

        resolve(JSON.parse(decrypted));
      } catch (error) {
        resolve({ error: true });
      }
    });
  });
};
