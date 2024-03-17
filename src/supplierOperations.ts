/* eslint-disable @typescript-eslint/no-explicit-any */
import { Supplier } from "./interfaces/supplier.js";
import { Operations } from "./interfaces/operations.js";
import lowdb from "lowdb";

export class SupplierOperations implements Operations {
  private suppliers: Supplier[]; 
  constructor(private db: lowdb.LowdbSync<any>) {
    this.suppliers = db.get("suppliers").value();
  }

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

  async delete(id: string) {
    this.suppliers = this.suppliers.filter((element) => {
      return element.id !== id;
    });
    this.db
      .update("suppliers", () => this.suppliers)
        .write();
  }

  async update(newData: Supplier) {
    this.suppliers.forEach((element, index) => {
      if(element.id === newData.id) this.suppliers[index] = newData;
    });
    this.db
      .update("suppliers", () => this.suppliers)
      .write();
  }

  async search(searchCriteria: string) {
    const filteredSupplier = this.searchBy(
      searchCriteria
    );
    console.log(filteredSupplier);
  }

  searchBy(value: string) {
    const regex = new RegExp(value, "i");
    return this.db
      .get("suppliers")
      .value()
      .filter((Supplier) => {
        return regex.test(Supplier.name) || regex.test(Supplier.description);
      });
  }

  getCount() {
    return this.suppliers.length;
  }

  getSuppliers() {
    return this.suppliers;
  }
}