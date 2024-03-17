/*
import { describe, it } from "mocha";
import { expect } from "chai";
import { Stock } from "../src/stock.js";
import FileSync from "lowdb/adapters/FileSync.js";
import { Furniture } from "../src/interfaces/furniture.js";
import { Supplier } from "../src/interfaces/supplier.js";
import { Customer } from "../src/interfaces/customer.js";
import * as lowdb from "lowdb";
import low from "lowdb";
import inquirer from "inquirer";


const adapter = new FileSync("db-test.json");
const db = low(adapter);
const stock = new Stock(db);

describe('Stock', () => {
  it('should instantiate Stock class', () => {
      const stock = new Stock(db);
      expect(stock).to.be.an.instanceOf(Stock);
  });

  it('should return the count of furniture in stock', () => {
    const stock = new Stock(db);
    const count = stock.getFurnitureCount();
    expect(count).to.be.a('number');
    expect(count).to.be.greaterThan(-1);
    expect(count).to.equal(2);
  });

  it('should return the list of suppliers', () => {
    const stock = new Stock(db);
    const suppliers = stock.getSuppliers();
    expect(suppliers).to.be.an('array');
    expect(suppliers).to.have.length.greaterThan(-1);
    expect(suppliers).to.have.lengthOf(2);
    expect
  });

  it('should return the list of customers', () => {
    const stock = new Stock(db);
    const customers = stock.getCustomers();
    expect(customers).to.be.an('array');
    expect(customers).to.have.length.greaterThan(-1);
    expect(customers).to.have.lengthOf(2);
  });

  it('should return the list of furniture', () => {
    const stock = new Stock(db);
    const furniture = stock.getFurniture();
    expect(furniture).to.be.an('array');
    expect(furniture).to.have.length.greaterThan(-1);
    expect(furniture).to.have.lengthOf(2);
  });

  it('should get available stock by furniture name', async () => {
    const furnitureName = stock.getFurniture()[0].name;
    const availableStock = await stock.getAvailableStockByFurnitureName(furnitureName);
    expect(availableStock).to.not.be.undefined;
  });

  it('should get the transaction with the highest amount', async () => {
    const highestTransaction = await stock.getTransactionWithHighestAmount();
    expect(highestTransaction).to.not.be.null;
  });

});
*/