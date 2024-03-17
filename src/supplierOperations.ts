/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module supplierOperations
 * @summary Supplier Operations
 * @description Se encarga de gestionar las operaciones relacionadas con los proveedores. Esta clase implementa la interfaz Operations y contiene métodos para agregar, eliminar, actualizar y buscar proveedores en una base de datos. Utiliza la biblioteca lowdb para interactuar con la base de datos y realiza operaciones como agregar un proveedor, eliminarlo por su ID, actualizar sus datos y buscar proveedores según un criterio dado. Además, proporciona métodos para obtener la cantidad total de proveedores y la lista completa de proveedores almacenados.
 */
import { Supplier } from "./interfaces/supplier.js";
import { Operations } from "./interfaces/operations.js";
import lowdb from "lowdb";

/**
 * Clase que maneja las operaciones de los proveedores
 * @class SupplierOperations
 * @implements Operations
 * @property {Supplier[]} suppliers - Lista de proveedores
 * @property {lowdb.LowdbSync<any>} db - Base de datos
 * @method {add} add - Método para agregar un proveedor
 * @method {delete} delete - Método para eliminar un proveedor
 * @method {update} update - Método para actualizar un proveedor
 * @method {search} search - Método para buscar un proveedor
 * @method {searchBy} searchBy - Método para buscar un proveedor por un criterio
 * @method {getCount} getCount - Método que devuelve la cantidad de proveedores
 * @method {getSuppliers} getSuppliers - Método que devuelve la lista de proveedores
 * 
 */
export class SupplierOperations implements Operations {
  private suppliers: Supplier[]; 
  constructor(private db: lowdb.LowdbSync<any>) {
    this.suppliers = db.get("suppliers").value();
  }

  /**
   * Método para agregar un proveedor
   * @param supplierData - Datos del proveedor
   * @returns {void}
   * 
   */
  async add(supplierData: Supplier) {
    const existingSupplier = this.suppliers.find((c) => c.name === supplierData.name && c.contact === supplierData.contact && c.address === supplierData.address);
     if (existingSupplier) {
       console.log("Supplier already exists.");
       return;
     }
    this.suppliers.push(supplierData);
    this.db
    .update("suppliers", () => this.suppliers)
      .write();
  }

  /**
   * Método para eliminar un proveedor
   * @param id - ID del proveedor
   * @returns {void}
   * 
   */
  async delete(id: string) {
    this.suppliers = this.suppliers.filter((element) => {
      return element.id !== id;
    });
    this.db
      .update("suppliers", () => this.suppliers)
        .write();
  }

  /**
   * Método para actualizar un proveedor
   * @param newData - Nuevos datos del proveedor
   * @returns {void}
   * 
   */
  async update(newData: Supplier) {
    this.suppliers.forEach((element, index) => {
      if(element.id === newData.id) this.suppliers[index] = newData;
    });
    this.db
      .update("suppliers", () => this.suppliers)
      .write();
  }

  /**
   * Método para buscar un proveedor
   * @param searchCriteria - Criterio de búsqueda
   * @param isTestEnvironment - Indica si se está en un ambiente de pruebas
   * @returns {Supplier[]} - Lista de proveedores
   * 
   */
  async search(searchCriteria: string, isTestEnvironment: boolean = false) {
    const filteredSupplier = this.searchBy(searchCriteria);
    if (!isTestEnvironment) {
        console.log(filteredSupplier);
    }
    return filteredSupplier;
}

/**
 * Método para buscar un proveedor por un criterio
 * @param value - Valor a buscar
 * @returns {Supplier[]} - Lista de proveedores
 * 
 */
searchBy(value: string) {
  const regex = new RegExp(value, "i");
  return this.db
    .get("suppliers")
    .value()
    .filter((supplier) => {
      return regex.test(supplier.name) || regex.test(supplier.contact) || regex.test(supplier.address);
    });
}

  /**
   * Método que devuelve la cantidad de proveedores
   * @returns {number} - Cantidad de proveedores
   */
  getCount() {
    return this.suppliers.length;
  }

  /**
   * Método que devuelve la lista de proveedores
   * @returns {Supplier[]} - Lista de proveedores
   */
  getSuppliers() {
    return this.suppliers;
  }
}