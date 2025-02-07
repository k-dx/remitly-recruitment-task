import { importTsv } from "./import.js";

(async () => {
  console.log("Importing TSV file...");
  await importTsv();
  console.log("TSV import completed.");
})();
