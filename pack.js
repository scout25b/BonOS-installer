import fs from 'fs'
import path from 'path'
console.log("Reading installer template...")
let installer = fs.readFileSync("installer.html", "utf-8")
console.log("Reading bundle...")
let bundle = fs.readFileSync(path.resolve("./dist/bundle.js"), "utf-8")
console.log("Writing new installer...")
fs.writeFileSync(path.resolve("./dist/installer.html"), installer.replace('"script-data"', bundle), "utf-8")
console.log("✅ All done!")