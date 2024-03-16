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
    choices: ["Furniture", "Customer", "Supplier", "Transactions", "Reports"],
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
    case "Transactions":
      await transactionMenu(stock);
      break;
    case "Reports":
      await reportMenu(stock);
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
      "Stock"
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
    case "Stock":
      console.log("Total furniture count:", stock.getFurnitureCount());
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
    ],
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
    case "Update Customer":
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
    ],
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
    case "Update Supplier":
      await stock.updateSupplier();
      break;
  }

}
//-------------------TRANSACCIONES----------------------
async function transactionMenu(stock: Stock) {
  const transactionType = await inquirer.prompt({
    type: "list",
    name: "transactionType",
    message: "Choose transaction type:",
    choices: ["Sale", "Purchase", "History"],
  });

  switch (transactionType.transactionType) {
    case "Sale": {
      const customers = stock.getCustomers();
      const selectedCustomer = await inquirer.prompt({
        type: "list",
        name: "customer",
        message: "Select customer:",
        choices: customers.map((customer) => ({ name: customer.name, value: customer })),
      });
  
      // Obtener información sobre los muebles vendidos y el monto de la venta
      const soldFurniture = await inquirer.prompt({
        type: "input",
        name: "soldFurniture",
        message: "Enter sold furniture (name):",
      });
  
      await stock.registerSale(selectedCustomer.customer, soldFurniture.soldFurniture.split(','));
      break;
    }
    case "Purchase": {
      const suppliers = stock.getSuppliers();
      const selectedSupplier = await inquirer.prompt({
        type: "list",
        name: "supplier",
        message: "Select supplier:",
        choices: suppliers.map((supplier) => ({ name: supplier.name, value: supplier })),
      });
  
      await stock.registerPurchase(selectedSupplier.supplier);
      break;
    }
    case "History": {
      const history = await stock.getTransactionHistory();
      console.log("Sales transactions:", history.sales);
      console.log("Purchase transactions:", history.purchases);
      break;
    }
}
}

//-------------------REPORTES----------------------
async function reportMenu(stock: Stock) {
  const reportType = await inquirer.prompt({
    type: "list",
    name: "reportType",
    message: "Choose report type:",
    choices: [
      "Available Stock by Furniture Name",
      "Transaction with Highest Amount",
    ],
  });

  switch (reportType.reportType) {
    case "Available Stock by Furniture Name":
      await generateAvailableStockByFurnitureNameReport(stock);
      break;
    case "Transaction with Highest Amount":{
      const transactionWithHighestAmount = await stock.getTransactionWithHighestAmount();
      console.log("Transaction with Highest Amount:", transactionWithHighestAmount);
      break;
    }
  }
}

async function generateAvailableStockByFurnitureNameReport(stock: Stock) {
  const name = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "Enter furniture name:",
  });
  const availableStock = await stock.getAvailableStockByFurnitureName(name.name);
  console.log("Available stock by furniture name:", availableStock);
}

main();
