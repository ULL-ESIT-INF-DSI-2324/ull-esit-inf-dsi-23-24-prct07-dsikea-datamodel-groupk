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
    this.db.update("furniture", (existingFurniture: Furniture[]) => {
      return [...existingFurniture, furniture];
    }).write();
  }

  /**
   * Función que usa inquirer parqa recibir datos de muebles y borrarlos de la db
   */
  async deleteFurniture() {
    const furnitureId = await inquirer.prompt({
      type: "input",
      name: "id",
      message: "Enter furniture ID to delete:",
    });
    this.db.update("furniture", (existingFurniture: Furniture[]) => {
      return existingFurniture.filter((element) => {
        return element.id !== furnitureId.id;
      })
    }).write();
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
    this.db.update("furniture", (existingFurniture: Furniture[]) => {
      existingFurniture.forEach((element, index) => {
        if (element.id == furnitureId.id) existingFurniture[index] = newData;
      })
      return existingFurniture;
    }).write();
  }

  /**
   * Función que busca según el criterio elegido
   */
  private searchFurnitureBy(filter: string, value: string) {
    return this.db.get("furniture").value().filter((f) =>
      f.name.toLowerCase().includes(value.toLowerCase()),
    );
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

  // Faltan los métodos add, remove, update y search para clientes y proveedores
}
