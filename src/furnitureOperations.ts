/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module furnitureOperations
 * @summary Furniture Operations
 * @description Gestiona las operaciones relacionadas con los muebles. Esta clase implementa la interfaz Operations y tiene métodos para agregar, eliminar, actualizar y buscar muebles en una base de datos. Utiliza la biblioteca lowdb para interactuar con la base de datos y realiza operaciones como agregar un mueble, eliminarlo por su ID, actualizar sus datos, y buscar muebles según un criterio dado. Además, proporciona métodos para obtener la cantidad total de muebles y la lista completa de muebles almacenados.
 */
import { Furniture } from "./interfaces/furniture.js";
import { Operations } from "./interfaces/operations.js";
import lowdb from "lowdb";

/**
 * Clase que maneja las operaciones de los muebles
 * @class FurnitureOperations
 * @implements Operations
 * @property {Furniture[]} furnitures - Lista de muebles
 * @property {lowdb.LowdbSync<any>} db - Base de datos
 * @method {add} add - Método para agregar un mueble
 * @method {delete} delete - Método para eliminar un mueble
 * @method {update} update - Método para actualizar un mueble
 * @method {search} search - Método para buscar un mueble
 * @method {searchBy} searchBy - Método para buscar un mueble por un criterio
 * @method {getCount} getCount - Método que devuelve la cantidad de muebles
 * @method {getFurniture} getFurniture - Método que devuelve la lista de muebles
 * 
 */
export class FurnitureOperations implements Operations {
  private furnitures: Furniture[]; 
  constructor(private db: lowdb.LowdbSync<any>) {
    this.furnitures = db.get("furniture").value();
  }

  /**
   * Método para agregar un mueble
   * @param furnitureData - Datos del mueble
   * @returns {void}
   * 
   */
  async add(furnitureData: Furniture) {
    this.furnitures.push(furnitureData);
    this.db
    .update("furniture", () => this.furnitures)
      .write();
  }

  /**
   * Método para eliminar un mueble
   * @param id - ID del mueble
   * @returns {void}
   * 
   */
  async delete(id: string) {
    this.furnitures = this.furnitures.filter((element) => {
      return element.id !== id;
    });
    this.db
      .update("furniture", () => this.furnitures)
        .write();
  }

  /**
   * Método para actualizar un mueble
   * @param newData - Nuevos datos del mueble
   * @returns {void}
   * 
   */
  async update(newData: Furniture) {
    this.furnitures.forEach((element, index) => {
      if(element.id === newData.id) this.furnitures[index] = newData;
    });
    this.db
      .update("furniture", () => this.furnitures)
      .write();
  }

  /**
   * Método para buscar un mueble
   * @param searchCriteria - Criterio de búsqueda
   * @param isTestEnvironment - Indica si se está ejecutando en un entorno de prueba
   * @returns {Furniture[]} Lista de muebles
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
   * Método para buscar un mueble por un criterio
   * @param value - Criterio de búsqueda
   * @returns {Furniture[]} Lista de muebles
   * 
   */
  searchBy(value: string) {
    const regex = new RegExp(value, "i");
    return this.db
      .get("furniture")
      .value()
      .filter((furniture) => {
        return regex.test(furniture.name) || regex.test(furniture.description);
      });
  }

  /**
   * Método que devuelve la cantidad de muebles
   * @returns {number} Cantidad de muebles
   * 
   */
  getCount() {
    return this.furnitures.length;
  }

  /**
   * Método que devuelve la lista de muebles
   * @returns {Furniture[]} Lista de muebles
   * 
   */
  getFurniture() {
    return this.furnitures;
  }
}
