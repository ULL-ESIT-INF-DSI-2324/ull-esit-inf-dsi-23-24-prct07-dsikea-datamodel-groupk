/* eslint-disable no-case-declarations */
import inquirer from "inquirer";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";
import { FurnitureOperations } from "./furnitureOperations.js";
import { Stock } from "./stock.js";
import { CustomerOperations } from "./customerOperations.js";
import { SupplierOperations } from "./supplierOperations.js";

async function main() {
  const adapter = new FileSync("db.json");
  const db = lowdb(adapter);
  db.defaults({ furniture: [], suppliers: [], customers: [] }).write();
  
  const stock = new Stock(db);
  const myFurnitureOperations = new FurnitureOperations(db);
  const myCustomerOperations = new CustomerOperations(db);
  const mySupplierOperations = new SupplierOperations(db);

  const category = await inquirer.prompt({
    type: "list",
    name: "category",
    message: "Choose category:",
    choices: ["Furniture", "Customer", "Supplier", "Transactions", "Reports"],
  });

  switch (category.category) {
    case "Furniture":
      // eslint-disable-next-line no-case-declarations
      await furnitureMenu(myFurnitureOperations);
      break;
    case "Customer":
      await customerMenu(myCustomerOperations);
      break;
    case "Supplier":
      await supplierMenu(mySupplierOperations);
      break;
    case "Transactions":
      await transactionMenu(stock, myCustomerOperations, mySupplierOperations);
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
      const newFurnitureData = await inquirer.prompt([
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
      newFurnitureData.id = furnitureToUpdate.id;
      await myOperations.update(newFurnitureData);
      break;
    case "Search Furniture":
      const searchFurnitureCriteria = await inquirer.prompt([
        {
          type: "list",
          name: "filter",
          message: "Choose search filter:",
          choices: ["name", "description"],
        },
        { type: "input", name: "value", message: "Enter search value:" },
      ]);
      await myOperations.search(searchFurnitureCriteria.value);
      break;
    case "Stock":
      console.log("Total furniture count:", myOperations.getCount());
      break;
  }
}

async function customerMenu(myOperations: CustomerOperations) {
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
      const customerData = await inquirer.prompt([
        { type: "input", name: "name", message: "Enter customer name:" },
        { type: "input", name: "contact", message: "Enter customer contact:" },
        { type: "input", name: "address", message: "Enter customer address:" },
      ]);
      customerData.id = Date.now().toString();
      await myOperations.add(customerData);
      break;
    case "Delete Customer":
      const customerToDelete = await inquirer.prompt({
        type: "input",
        name: "id",
        message: "Enter customer ID to delete:",
      });
      await myOperations.delete(customerToDelete.id);
      break;

    case "Search Customer":
      const searchCustomerCriteria = await inquirer.prompt([
        {
          type: "list",
          name: "filter",
          message: "Choose search filter:",
          choices: ["name", "contact", "address"],
        },
        { type: "input", name: "value", message: "Enter search value:" },
      ]);
      await myOperations.search(searchCustomerCriteria.value);
      break;
    case "Update Customer":
      const customerToUpdate = await inquirer.prompt({
        type: "input",
        name: "id",
        message: "Enter customer ID to update:",
      });
      const newCustomerData = await inquirer.prompt([
        { type: "input", name: "name", message: "Enter new customer name:" },
        { type: "input", name: "contact", message: "Enter new customer contact:" },
        { type: "input", name: "address", message: "Enter new customer address:" },
      ]);
      newCustomerData.id = customerToUpdate.id;
      await myOperations.update(newCustomerData);
      break;
  }
}

async function supplierMenu(myOperations: SupplierOperations) {
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
      const supplierData = await inquirer.prompt([
        { type: "input", name: "name", message: "Enter supplier name:" },
        { type: "input", name: "contact", message: "Enter supplier contact:" },
        { type: "input", name: "address", message: "Enter supplier address:" },
      ]);
      supplierData.id = Date.now().toString();
      await myOperations.add(supplierData);
      break;
    case "Delete Supplier":
      const supplierToDelete = await inquirer.prompt({
        type: "input",
        name: "id",
        message: "Enter supplier ID to delete:",
      });
      await myOperations.delete(supplierToDelete.id);
      break;
    case "Search Supplier":
      const searchSupplierCriteria = await inquirer.prompt([
        {
          type: "list",
          name: "filter",
          message: "Choose search filter:",
          choices: ["name", "contact", "address"],
        },
        { type: "input", name: "value", message: "Enter search value:" },
      ]);
      await myOperations.search(searchSupplierCriteria.value);
      break;
    case "Update Supplier":
      const supplierToUpdate = await inquirer.prompt({
        type: "input",
        name: "id",
        message: "Enter supplier ID to update:",
      });
  
      const newSupplierData = await inquirer.prompt([
        { type: "input", name: "name", message: "Enter new supplier name:" },
        {
          type: "input",
          name: "contact",
          message: "Enter new supplier contact:",
        },
        {
          type: "input",
          name: "address",
          message: "Enter new supplier address:",
        },
      ]);
      newSupplierData.id = supplierToUpdate.id;
      await myOperations.update(newSupplierData);
      break;
  }

}
//-------------------TRANSACCIONES----------------------
async function transactionMenu(stock: Stock, myCustomerOperations: CustomerOperations, mySupplierOperations: SupplierOperations) {
  const transactionType = await inquirer.prompt({
    type: "list",
    name: "transactionType",
    message: "Choose transaction type:",
    choices: ["Sale", "Purchase", "History"],
  });

  switch (transactionType.transactionType) {
    case "Sale": {
      const customers = myCustomerOperations.getCustomers();
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
      const suppliers = mySupplierOperations.getSuppliers();
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
