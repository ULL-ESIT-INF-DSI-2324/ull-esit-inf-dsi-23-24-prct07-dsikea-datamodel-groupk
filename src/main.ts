import inquirer from "inquirer";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";
import { Stock } from "./stock.js";

async function main() {
  const adapter = new FileSync("db.json");
  const db = lowdb(adapter);
  db.defaults({ furniture: [], suppliers: [], customers: [] }).write();

  const stock = new Stock(db);

  const category = await inquirer.prompt({
    type: "list",
    name: "category",
    message: "Choose category:",
    choices: ["Furniture", "Customer", "Supplier"],
  });

  switch (category.category) {
    case "Furniture":
      await furnitureMenu(stock);
      break;
    case "Customer":
      await customerMenu(stock);
      break;
    case "Supplier":
      await supplierMenu(stock);
      break;
  }
}

async function furnitureMenu(stock: Stock) {
  const operation = await inquirer.prompt({
    type: "list",
    name: "operation",
    message: "Choose operation for Furniture:",
    choices: [
      "Add Furniture",
      "Delete Furniture",
      "Update Furniture",
      "Search Furniture",
    ],
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
      break;
  }
}

async function customerMenu(stock: Stock) {
  const operation = await inquirer.prompt({
    type: "list",
    name: "operation",
    message: "Choose operation for Customer:",
    choices: [
      "Add Customer",
      "Delete Customer",
      "Search Customer",
      "Update Customer",
    ], // Agregamos "Update Customer"
  });

  switch (operation.operation) {
    case "Add Customer":
      await stock.addCustomer();
      break;
    case "Delete Customer":
      await stock.deleteCustomer();
      break;
    case "Search Customer":
      await stock.searchCustomer();
      break;
    case "Update Customer": // Nuevo caso para actualizar cliente
      await stock.updateCustomer();
      break;
  }
}

async function supplierMenu(stock: Stock) {
  const operation = await inquirer.prompt({
    type: "list",
    name: "operation",
    message: "Choose operation for Supplier:",
    choices: [
      "Add Supplier",
      "Delete Supplier",
      "Search Supplier",
      "Update Supplier",
    ], // Agregamos "Update Supplier"
  });

  switch (operation.operation) {
    case "Add Supplier":
      await stock.addSupplier();
      break;
    case "Delete Supplier":
      await stock.deleteSupplier();
      break;
    case "Search Supplier":
      await stock.searchSupplier();
      break;
    case "Update Supplier": // Nuevo caso para actualizar proveedor
      await stock.updateSupplier();
      break;
  }
}

main();
