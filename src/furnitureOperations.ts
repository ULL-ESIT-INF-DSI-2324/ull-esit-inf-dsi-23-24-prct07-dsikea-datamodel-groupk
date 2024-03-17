/* eslint-disable @typescript-eslint/no-explicit-any */
import { Furniture } from "./interfaces/furniture.js";
import { Operations } from "./interfaces/operations.js";
import lowdb from "lowdb";

export class FurnitureOperations implements Operations {
  private furnitures: Furniture[]; 
  constructor(private db: lowdb.LowdbSync<any>) {
    this.furnitures = db.get("furniture").value();
  }

  async add(furnitureData: Furniture) {
    this.furnitures.push(furnitureData);
    this.db
    .update("furniture", () => this.furnitures)
      .write();
  }

  async delete(id: string) {
    this.furnitures = this.furnitures.filter((element) => {
      return element.id !== id;
    });
    this.db
      .update("furniture", () => this.furnitures)
        .write();
  }

  async update(newData: Furniture) {
    this.furnitures.forEach((element, index) => {
      if(element.id === newData.id) this.furnitures[index] = newData;
    });
    this.db
      .update("furniture", () => this.furnitures)
      .write();
  }

  async search(searchCriteria: string) {
    const filteredFurniture = this.searchBy(
      searchCriteria
    );
    //console.log(filteredFurniture);
    return filteredFurniture;
  }

  searchBy(value: string) {
    const regex = new RegExp(value, "i");
    return this.db
      .get("furniture")
      .value()
      .filter((furniture) => {
        return regex.test(furniture.name) || regex.test(furniture.description);
      });
  }

  getCount() {
    return this.furnitures.length;
  }

  getFurniture() {
    return this.furnitures;
  }
}
