const archiver = require("archiver");
const fs = require("fs");
const target = process.argv[2];

const version = require("./manifest.json").version;
const distName = `${target}-${version}.zip`;
const archive = archiver.create("zip", {});

try{
  fs.rmSync(distName);
}catch(e){}
const output = fs.createWriteStream(distName);
archive.pipe(output);

let manifest = "";
switch (target) {
  case "chrome":
    manifest = "manifest.v3.json";
    break;
  case "firefox":
    manifest = "manifest.v2.json";
    break;
  default:
    throw new Error(`Unknown target: ${target}`);
}
archive.file(manifest, { name: "manifest.json" });
archive.file("icon.js")
archive.file("material-icons.json")
archive.file("languages.json");
archive.glob("icons/*.svg");
archive.finalize();
output.on("close", () => {
  console.log(`${distName} created`);
});
output.on("error", (err) => {
  throw err;
});
