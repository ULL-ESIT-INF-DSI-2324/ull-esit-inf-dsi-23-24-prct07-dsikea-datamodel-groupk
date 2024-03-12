import inquirer from "inquirer";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";
import { Stock } from "./stock.js";

async function main() {
  const adapter = new FileSync("db.json");
  const db = lowdb(adapter);
  db.defaults({ furniture: [], suppliers: [], customers: [] }).write();

  const stock = new Stock(db);

  const operation = await inquirer.prompt({
    type: "list",
    name: "operation",
    message: "Choose operation:",
    choices: [
      "Add Furniture",
      "Delete Furniture",
      "Update Furniture",
      "Search Furniture",
    ], // Añadir las de clientes y proveedores
  });

  switch (operation.operation) {
    case "Add Furniture":
      await stock.addFurniture();
      break;
    case "Delete Furniture":
      await stock.deleteFurniture();
      break;
    case "Update Furniture":
      await stock.updateFurniture();
      break;
    case "Search Furniture":
      await stock.searchFurniture();
      break; // Añadir los casos que faltan
  }
}

main();
