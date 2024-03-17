/* eslint-disable no-case-declarations */
import inquirer from "inquirer";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";
import { FurnitureOperations } from "./furnitureOperations.js";
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
      // eslint-disable-next-line no-case-declarations
      const myOperations = new FurnitureOperations(db);
      await furnitureMenu(myOperations);
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

async function furnitureMenu(myOperations: FurnitureOperations) {
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
      const furnitureData = await inquirer.prompt([
        { type: "input", name: "name", message: "Enter furniture name:" },
        {
          type: "input",
          name: "description",
          message: "Enter furniture description:",
        },
        { type: "input", name: "material", message: "Enter furniture material:" },
        {
          type: "input",
          name: "dimensions",
          message: "Enter furniture dimensions:",
        },
        { type: "number", name: "price", message: "Enter furniture price:" },
        { type: "number", name: "quantity", message: "Enter quantity available:" },
      ]);
      furnitureData.id = Date.now().toString();
      await myOperations.add(furnitureData);
      break;

    case "Delete Furniture":
      const furnitureToDelete = await inquirer.prompt({
        type: "input",
        name: "id",
        message: "Enter furniture ID to delete:",
      });
      await myOperations.delete(furnitureToDelete.id);
      break;

    case "Update Furniture":
      const furnitureToUpdate = await inquirer.prompt({
        type: "input",
        name: "id",
        message: "Enter furniture ID to update:",
      });
      const newData = await inquirer.prompt([
        { type: "input", name: "name", message: "Enter new furniture name:" },
        {
          type: "input",
          name: "description",
          message: "Enter new furniture description:",
        },
        {
          type: "input",
          name: "material",
          message: "Enter new furniture material:",
        },
        {
          type: "input",
          name: "dimensions",
          message: "Enter new furniture dimensions:",
        },
        { type: "number", name: "price", message: "Enter new furniture price:" },
        { type: "number", name: "quantity", message: "Enter quantity available:" },
      ]);
      newData.id = furnitureToUpdate.id;
      await myOperations.update(newData);
      break;
    case "Search Furniture":
      const searchCriteria = await inquirer.prompt([
        {
          type: "list",
          name: "filter",
          message: "Choose search filter:",
          choices: ["name", "description"],
        },
        { type: "input", name: "value", message: "Enter search value:" },
      ]);
      await myOperations.search(searchCriteria.value);
      break;
    case "Stock":
      console.log("Total furniture count:", myOperations.getCount());
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
