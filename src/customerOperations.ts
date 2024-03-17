/* eslint-disable @typescript-eslint/no-explicit-any */
import { Customer } from "./interfaces/customer.js";
import { Operations } from "./interfaces/operations.js";
import lowdb from "lowdb";

export class CustomerOperations implements Operations {
  private customers: Customer[]; 
  constructor(private db: lowdb.LowdbSync<any>) {
    this.customers = db.get("customers").value();
  }

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

  async delete(id: string) {
    this.customers = this.customers.filter((element) => {
      return element.id !== id;
    });
    this.db
      .update("customers", () => this.customers)
        .write();
  }

  async update(newData: Customer) {
    this.customers.forEach((element, index) => {
      if(element.id === newData.id) this.customers[index] = newData;
    });
    this.db
      .update("customers", () => this.customers)
      .write();
  }

  async search(searchCriteria: string, isTestEnvironment: boolean = false) {
    const filteredCustomer = this.searchBy(searchCriteria);
    if (!isTestEnvironment) {
        console.log(filteredCustomer);
    }
    return filteredCustomer;
}

  searchBy(value: string) {
    const regex = new RegExp(value, "i");
    return this.db
      .get("customers")
      .value()
      .filter((customer) => {
        return regex.test(customer.name) || regex.test(customer.contact) || regex.test(customer.address);
      });
  }

  getCount() {
    return this.customers.length;
  }

  getCustomers() {
    return this.customers;
  }
}