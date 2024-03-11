import * as inquirer from "inquirer";
import * as lowdb from "lowdb";
import * as FileSync from "lowdb/adapters/FileSync";
import { Furniture } from "./interfaces/furniture";
import { Supplier } from "./interfaces/supplier";
import { Customer } from "./interfaces/customer";

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
    this.db.get("furniture").value().push(furniture).write();
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
    this.db.get("furniture").value().remove({ id: furnitureId.id }).write();
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
    this.db
      .get("furniture")
      .value()
      .find({ id: furnitureId.id })
      .assign(newData)
      .write();
  }

  /**
   * Función que busca según el criterio elegido
   */
  private searchFurnitureBy(filter: string, value: string) {
    return this.furniture.filter((f) =>
      f[filter].toLowerCase().includes(value.toLowerCase()),
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
