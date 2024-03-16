import inquirer from "inquirer";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";
import { Furniture } from "./interfaces/furniture.js";
import { Supplier } from "./interfaces/supplier.js";
import { Customer } from "./interfaces/customer.js";

/**
 * Clase que maneja el stock de muebles
 */
export class Stock {
  private furniture: Furniture[] = [];
  private suppliers: Supplier[] = [];
  private customers: Customer[] = [];

  constructor(private db: lowdb.LowdbSync<any>) {}

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
    ]);
    const furniture: Furniture = {
      id: Date.now().toString(),
      ...furnitureData,
    };
    this.furniture.push(furniture);
    this.db
      .update("furniture", (existingFurniture: Furniture[]) => {
        return [...existingFurniture, furniture];
      })
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
   * Métodos para los proveedores
   */

  /**
   * Método para añadir un proveedor a la db
   */
  async addSupplier() {
    const supplierData = await inquirer.prompt([
      { type: "input", name: "name", message: "Enter supplier name:" },
      {
        type: "input",
        name: "contact",
        message: "Enter supplier contact:",
      },
      { type: "input", name: "address", message: "Enter supplier address:" },
    ]);
    const supplier: Supplier = {
      id: Date.now().toString(),
      ...supplierData,
    };
    this.suppliers.push(supplier);
    this.db
      .update("suppliers", (existingSuppliers: Supplier[]) => {
        return [...existingSuppliers, supplier];
      })
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

  /**
   * Métodos para los clientes
   */

  /**
   * Método que añade un cliente a la db
   */
  async addCustomer() {
    const customerData = await inquirer.prompt([
      { type: "input", name: "name", message: "Enter customer name:" },
      {
        type: "input",
        name: "contact",
        message: "Enter customer contact:",
      },
      { type: "input", name: "address", message: "Enter customer address:" },
    ]);
    const customer: Customer = {
      id: Date.now().toString(),
      ...customerData,
    };
    this.customers.push(customer);
    this.db
      .update("customers", (existingCustomers: Customer[]) => {
        return [...existingCustomers, customer];
      })
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
}
