const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
const packagePath = path.join(cwd, "package.json");
const hasPackage = fs.existsSync(packagePath);

console.log("Browser agent local do RotaNota");
console.log(`Diretorio: ${cwd}`);
console.log(`package.json: ${hasPackage ? "ok" : "ausente"}`);
console.log("");
console.log("Comandos uteis:");
console.log("npm run open -- http://127.0.0.1:3000");
console.log("npm run codegen -- http://127.0.0.1:3000");
console.log("npm run snapshot -- http://127.0.0.1:3000");
