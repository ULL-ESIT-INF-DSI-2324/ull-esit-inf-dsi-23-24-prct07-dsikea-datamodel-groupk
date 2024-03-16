import inquirer from "inquirer";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";
import { Furniture } from "./interfaces/furniture.js";
import { Supplier } from "./interfaces/supplier.js";
import { Customer, Purchase } from "./interfaces/customer.js";
import { SaleTransaction, PurchaseTransaction } from "./interfaces/transaction.js";

/**
 * Clase que maneja el stock de muebles
 */
export class Stock {
  private furniture: Furniture[] = [];
  private suppliers: Supplier[] = [];
  private customers: Customer[] = [];
  private salesTransactions: SaleTransaction[] = [];
  private purchaseTransactions: PurchaseTransaction[] = [];
  

  constructor(private db: lowdb.LowdbSync<any>) {
    this.furniture = db.get("furniture").value();
    this.suppliers = db.get("suppliers").value();
    this.customers = db.get("customers").value();
    this.salesTransactions = db.get("salesTransactions").value() || [];
    this.purchaseTransactions = db.get("purchaseTransactions").value() || [];
  }
  
  /**
   * Función que usa inquirer para recibir datos de muebles y añadirlos a la db
   */
  async addFurniture() {
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
    const furniture: Furniture = {
      id: Date.now().toString(),
      ...furnitureData,
    };
    this.furniture.push(furniture);
    this.db
    .update("furniture", () => this.furniture)
      .write();
  }

  /**
   * Función que usa inquirer para recibir datos de muebles y borrarlos de la db
   */
  async deleteFurniture() {
    const furnitureId = await inquirer.prompt({
      type: "input",
      name: "id",
      message: "Enter furniture ID to delete:",
    });
    this.db
      .update("furniture", (existingFurniture: Furniture[]) => {
        return existingFurniture.filter((element) => {
          return element.id !== furnitureId.id;
        });
      })
      .write();
  }

  /**
   * Función que usa inquirer para actualizar los datos de un mueble
   */
  async updateFurniture() {
    const furnitureId = await inquirer.prompt({
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
    newData.id = furnitureId.id;
    this.db
      .update("furniture", (existingFurniture: Furniture[]) => {
        existingFurniture.forEach((element, index) => {
          if (element.id == furnitureId.id) existingFurniture[index] = newData;
        });
        return existingFurniture;
      })
      .write();
  }

  /**
   * Función que busca según el criterio elegido
   */
  private searchFurnitureBy(filter: string, value: string) {
    const regex = new RegExp(value, "i");
    return this.db
      .get("furniture")
      .value()
      .filter((furniture) => {
        return regex.test(furniture.name) || regex.test(furniture.description);
      });
  }

  /**
   * Función que usa inquirer para buscar muebles
   */
  async searchFurniture() {
    const searchCriteria = await inquirer.prompt([
      {
        type: "list",
        name: "filter",
        message: "Choose search filter:",
        choices: ["name", "description"],
      },
      { type: "input", name: "value", message: "Enter search value:" },
    ]);
    const filteredFurniture = this.searchFurnitureBy(
      searchCriteria.filter,
      searchCriteria.value,
    );
    console.log(filteredFurniture);
  }

  /**
   * Función que devuelve la cantidad de muebles en stock
   */
  getFurnitureCount() {
    return this.furniture.length;
  }
  /**
   * ----------------------------------------Métodos para los proveedores---------------------------------------------------------
   */
  getSuppliers() {
    return this.suppliers;
  }

  /**
   * Método para añadir un proveedor a la db
   */
  async addSupplier() {
    const supplierData = await inquirer.prompt([
      { type: "input", name: "name", message: "Enter supplier name:" },
      { type: "input", name: "contact", message: "Enter supplier contact:" },
      { type: "input", name: "address", message: "Enter supplier address:" },
    ]);
  
    const existingSupplier = this.suppliers.find((s) => s.name === supplierData.name && s.contact === supplierData.contact && s.address === supplierData.address);
  if (existingSupplier) {
    console.log("Supplier already exists.");
    return;
  }

  const supplier: Supplier = {
    id: Date.now().toString(),
    ...supplierData,
  };

  this.suppliers.push(supplier);
  this.db
  .set("suppliers", this.suppliers)
  .write();
  }

  /**
   * Método para quitar un proveedor de la db
   */
  async deleteSupplier() {
    const supplierId = await inquirer.prompt({
      type: "input",
      name: "id",
      message: "Enter supplier ID to delete:",
    });
    this.db
      .update("suppliers", (existingSuppliers: Supplier[]) => {
        return existingSuppliers.filter((element) => {
          return element.id !== supplierId.id;
        });
      })
      .write();
  }

  /**
   * Método que usa inquirer para buscar un proveedor
   */
  async searchSupplier() {
    const searchCriteria = await inquirer.prompt([
      {
        type: "list",
        name: "filter",
        message: "Choose search filter:",
        choices: ["name", "contact", "address"],
      },
      { type: "input", name: "value", message: "Enter search value:" },
    ]);
    const filteredSuppliers = this.searchSupplierBy(
      searchCriteria.filter,
      searchCriteria.value,
    );
    console.log(filteredSuppliers);
  }

  /**
   * Método que busca un proveedor según el filtro dado
   * @param filter Filtro
   * @param value Valor a buscar
   * @returns
   */
  private searchSupplierBy(filter: string, value: string) {
    const regex = new RegExp(value, "i");
    return this.db
      .get("suppliers")
      .value()
      .filter((supplier) => {
        return (
          regex.test(supplier.name) ||
          regex.test(supplier.contact) ||
          regex.test(supplier.address)
        );
      });
  }

  /**
   * Método que actualiza los datos de un proveedor
   */
  async updateSupplier() {
    const supplierId = await inquirer.prompt({
      type: "input",
      name: "id",
      message: "Enter supplier ID to update:",
    });

    const newData = await inquirer.prompt([
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

    newData.id = supplierId.id;

    this.db
      .update("suppliers", (existingSuppliers: Supplier[]) => {
        existingSuppliers.forEach((element, index) => {
          if (element.id === supplierId.id) existingSuppliers[index] = newData;
        });
        return existingSuppliers;
      })
      .write();
  }
  //----------------------------------CUSTOMER-----------------------------------
  /**
   * Métodos para los clientes
   */
  getCustomers() {
    return this.customers;
  }
  /**
   * Método que añade un cliente a la db
   */
  async addCustomer() {
    const customerData = await inquirer.prompt([
      { type: "input", name: "name", message: "Enter customer name:" },
      { type: "input", name: "contact", message: "Enter customer contact:" },
      { type: "input", name: "address", message: "Enter customer address:" },
    ]);
  
    // Verificar si ya existe un cliente con los mismos detalles
    const existingCustomer = this.customers.find((c) => c.name === customerData.name && c.contact === customerData.contact && c.address === customerData.address);
    if (existingCustomer) {
      console.log("Customer already exists.");
      return;
    }
  
    // Crear un nuevo cliente y agregarlo a la lista de clientes
    const customer: Customer = {
      id: Date.now().toString(),
      ...customerData,
    };
  
    this.customers.push(customer);
  
    // Actualizar la lista de clientes en la base de datos con la lista actualizada
    this.db
      .set("customers", this.customers)
      .write();
  }

  /**
   * Método que quita un cliente de la db
   */
  async deleteCustomer() {
    const customerId = await inquirer.prompt({
      type: "input",
      name: "id",
      message: "Enter customer ID to delete:",
    });
    this.db
      .update("customers", (existingCustomers: Customer[]) => {
        return existingCustomers.filter((element) => {
          return element.id !== customerId.id;
        });
      })
      .write();
  }

  /**
   * Método que usa inquirer para buscar un cliente
   */
  async searchCustomer() {
    const searchCriteria = await inquirer.prompt([
      {
        type: "list",
        name: "filter",
        message: "Choose search filter:",
        choices: ["name", "contact", "address"],
      },
      { type: "input", name: "value", message: "Enter search value:" },
    ]);
    const filteredCustomers = this.searchCustomerBy(
      searchCriteria.filter,
      searchCriteria.value,
    );
    console.log(filteredCustomers);
  }

  /**
   * Método que busca los clientes según el filtro dado
   * @param filter Filtro
   * @param value Valor a buscar
   * @returns
   */
  private searchCustomerBy(filter: string, value: string) {
    const regex = new RegExp(value, "i");
    return this.db
      .get("customers")
      .value()
      .filter((customer) => {
        return (
          regex.test(customer.name) ||
          regex.test(customer.contact) ||
          regex.test(customer.address)
        );
      });
  }

  /**
   * Método que actualiza los datos de un cliente
   */
  async updateCustomer() {
    const customerId = await inquirer.prompt({
      type: "input",
      name: "id",
      message: "Enter customer ID to update:",
    });

    const newData = await inquirer.prompt([
      { type: "input", name: "name", message: "Enter new customer name:" },
      {
        type: "input",
        name: "contact",
        message: "Enter new customer contact:",
      },
      {
        type: "input",
        name: "address",
        message: "Enter new customer address:",
      },
    ]);

    newData.id = customerId.id;

    this.db
      .update("customers", (existingCustomers: Customer[]) => {
        existingCustomers.forEach((element, index) => {
          if (element.id === customerId.id) existingCustomers[index] = newData;
        });
        return existingCustomers;
      })
      .write();
  }

  //------------------------------------------------FUNCIONALIDADES------------------------------------------------------
  //----------------------TRANSACCIONES-------------------

  //----------------------CLIENTES------------------------
  // Método para registrar una venta a un cliente
  async registerSale(customer: Customer, furnitureNames: string[]) {
    const missingFurniture: string[] = [];
    const soldFurniture: Furniture[] = [];
    let totalPrice = 0;
  
    // Verificar si los muebles están disponibles en el stock
    for (const furnitureName of furnitureNames) {
      const furniture = this.furniture.find((f) => f.name === furnitureName);
      if (furniture && furniture.quantity > 0) {
        soldFurniture.push(furniture);
        totalPrice += furniture.price;
        
        // Disminuir la cantidad de muebles disponibles
        furniture.quantity -= 1;
      } else {
        missingFurniture.push(furnitureName);
      }
    }
  
    // Si algunos muebles no están disponibles, imprimir un mensaje y salir del método
    if (missingFurniture.length > 0) {
      console.log(`The following furniture is not available: ${missingFurniture.join(", ")}`);
      return;
    }
  
    // Crear objeto de transacción de venta
    const saleTransaction = {
      date: new Date(),
      customer,
      furniture: soldFurniture,
      price: totalPrice,
    };
  
    // Agregar la transacción de venta a la base de datos
    this.db.update('salesTransactions', (transactions: any[]) => {
      if (!transactions) {
        transactions = [];
      }
      transactions.push(saleTransaction);
      return transactions;
    }).write();
  }

  //----------------------PROVEEDORES------------------------
  // Método para registrar una compra a un proveedor
  async registerPurchase(supplier: Supplier) {
    const purchasedFurnitureData = await inquirer.prompt([
      { type: "input", name: "name", message: "Enter furniture name:" },
      { type: "number", name: "quantity", message: "Enter quantity purchased:" },
      { type: "number", name: "price", message: "Enter purchase price per unit:" },
    ]);

    const purchasedFurniture: Furniture = {
      id: Date.now().toString(),
      ...purchasedFurnitureData,
    };

    const existingFurniture = this.furniture.find((f) => f.name === purchasedFurniture.name);
    if (existingFurniture) {
      existingFurniture.quantity += purchasedFurniture.quantity;
    } else {
      this.furniture.push(purchasedFurniture);
    }

    const purchaseTransaction = {
      date: new Date(),
      supplier,
      furniture: purchasedFurniture,
      totalPrice: purchasedFurniture.quantity * purchasedFurniture.price,
    };

    this.db.update("purchaseTransactions", (transactions: any[]) => {
      if (!transactions) {
        transactions = [];
      }
      transactions.push(purchaseTransaction);
      return transactions;
    }).write();
}
  


  //----------------------HISTORY------------------------
  // Método que devuelve el historial completo de transacciones
  async getTransactionHistory() {
    const salesTransactions = this.db.get('salesTransactions').value();
    const purchaseTransactions = this.db.get('purchaseTransactions').value();
    return {
      sales: salesTransactions,
      purchases: purchaseTransactions
    };
  }

  //----------------------INFORMES------------------------

  async getAvailableStockByFurnitureName(name: string) {
    const furniture = this.furniture.find(f => f.name === name && f.quantity > 0);
    return furniture;
  }


  async getTransactionWithHighestAmount() {
    const salesTransactions = await this.getTransactionHistory();
    
    if (salesTransactions && salesTransactions.sales && salesTransactions.sales.length > 0) {
      // Ordenar las transacciones por el importe total en orden descendente
      const sortedTransactions = salesTransactions.sales.sort((a, b) => b.price - a.price);
      return sortedTransactions[0];
    } else {
      return null;
    }
  }


  async getCustomerWithHighestSpending() {
    const customersData: any = this.db.get("customers").value(); // Obtener los datos de los clientes
  
    // Verificar si customersData es un array antes de continuar
    if (Array.isArray(customersData)) {
      let customerWithHighestSpending: Customer | undefined;
      let highestSpending = 0;
  
      // Iterar sobre los clientes para encontrar el que ha gastado más
      customersData.forEach((customer: Customer) => {
        const customerId = customer.id;
  
        // Obtener las compras del cliente actual
        const purchasesData: any = this.db.get("purchases").value(); // Obtener los datos de compras
  
        // Verificar si purchasesData es un array antes de intentar filtrarlo
        if (Array.isArray(purchasesData)) {
          // Filtrar las compras del cliente actual
          const customerPurchases = purchasesData.filter((purchase: Purchase) => purchase.customerId === customerId);
  
          // Calcular el total gastado por el cliente actual
          const customerTotalSpending = customerPurchases.reduce((total: number, purchase: Purchase) => total + purchase.amount, 0);
  
          // Actualizar el cliente con el gasto más alto si corresponde
          if (customerTotalSpending > highestSpending) {
            highestSpending = customerTotalSpending;
            customerWithHighestSpending = customer;
          }
        } else {
          console.error("No se pudo obtener el array de compras");
        }
      });
  
      return customerWithHighestSpending;
    } else {
      console.error("No se pudo obtener el array de clientes");
      return undefined;
    }
  }
}
