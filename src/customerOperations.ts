/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module customerOperations
 * @summary Customer Operations
 * @description Se encarga de las operaciones relacionadas con los clientes. Esta clase implementa la interfaz Operations y contiene métodos para agregar, eliminar, actualizar y buscar clientes en una base de datos. Utiliza la biblioteca lowdb para interactuar con la base de datos y realiza operaciones como agregar un cliente, eliminarlo por su ID, actualizar sus datos y buscar clientes según un criterio dado. Además, proporciona métodos para obtener la cantidad total de clientes y la lista completa de clientes almacenados.
 */
import { Customer } from "./interfaces/customer.js";
import { Operations } from "./interfaces/operations.js";
import lowdb from "lowdb";

/**
 * Clase que maneja las operaciones de los clientes
 * @class CustomerOperations
 * @implements Operations
 * @property {Customer[]} customers - Lista de clientes
 * @property {lowdb.LowdbSync<any>} db - Base de datos
 * @method {add} add - Método para agregar un cliente
 * @method {delete} delete - Método para eliminar un cliente
 * @method {update} update - Método para actualizar un cliente
 * @method {search} search - Método para buscar un cliente
 * @method {searchBy} searchBy - Método para buscar un cliente por un criterio
 * @method {getCount} getCount - Método que devuelve la cantidad de clientes
 * @method {getCustomers} getCustomers - Método que devuelve la lista de clientes
 * 
 */
export class CustomerOperations implements Operations {
  private customers: Customer[]; 
  constructor(private db: lowdb.LowdbSync<any>) {
    this.customers = db.get("customers").value();
  }

  /**
   * Método para agregar un cliente
   * @param customerData - Datos del cliente
   * @returns {void}
   * 
   */
  async add(customerData: Customer) {
    const existingCustomer = this.customers.find((c) => c.name === customerData.name && c.contact === customerData.contact && c.address === customerData.address);
    if (existingCustomer) {
      console.log("Customer already exists.");
      return;
    }
    this.customers.push(customerData);
    this.db
    .update("customers", () => this.customers)
      .write();
  }

  /**
   * Método para eliminar un cliente
   * @param id - ID del cliente
   * @returns {void}
   * 
   */
  async delete(id: string) {
    this.customers = this.customers.filter((element) => {
      return element.id !== id;
    });
    this.db
      .update("customers", () => this.customers)
        .write();
  }

  /**
   * Método para actualizar un cliente
   * @param newData - Nuevos datos del cliente
   * @returns {void}
   * 
   */
  async update(newData: Customer) {
    this.customers.forEach((element, index) => {
      if(element.id === newData.id) this.customers[index] = newData;
    });
    this.db
      .update("customers", () => this.customers)
      .write();
  }

  /**
   * Método para buscar un cliente
   * @param searchCriteria 
   * @param isTestEnvironment
   * @returns {Customer[]}
   * 
   */
  async search(searchCriteria: string, isTestEnvironment: boolean = false) {
    const filteredCustomer = this.searchBy(searchCriteria);
    if (!isTestEnvironment) {
        console.log(filteredCustomer);
    }
    return filteredCustomer;
}

  /**
   * Método para buscar un cliente por un criterio
   * @param value 
   * @returns {Customer[]}
   * 
   */
  searchBy(value: string) {
    const regex = new RegExp(value, "i");
    return this.db
      .get("customers")
      .value()
      .filter((customer) => {
        return regex.test(customer.name) || regex.test(customer.contact) || regex.test(customer.address);
      });
  }

  /**
   * Método que devuelve la cantidad de clientes
   * @returns {number}
   * 
   */
  getCount() {
    return this.customers.length;
  }

  /**
   * Método que devuelve la lista de clientes
   * @returns {Customer[]}
   * 
   */
  getCustomers() {
    return this.customers;
  }
}