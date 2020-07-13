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
        // Encrypt Data
        const text = JSON.stringify(
          JSON.parse(fs.readFileSync(path.join(__dirname, "./data.json")))
        ); //text to be encrypted

        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encrypted =
          cipher.update(text, "utf8", "hex") + cipher.final("hex"); // encrypted text
        fs.writeFileSync(path.join(__dirname, "./key.txt"), encrypted);
        // ====

        resolve(JSON.parse(decrypted));
      } catch (error) {
        resolve({ error: true });
      }
    });
  });
};
