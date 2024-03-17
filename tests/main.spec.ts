import { describe, it } from "mocha";
import { expect } from "chai";
import { Stock } from "../src/stock.js";
import FileSync from "lowdb/adapters/FileSync.js";
import { Furniture } from "../src/interfaces/furniture.js";
import { Supplier } from "../src/interfaces/supplier.js";
import { Customer } from "../src/interfaces/customer.js";
import * as lowdb from "lowdb";
import low from "lowdb";


const adapter = new FileSync("db.json");
const db = low(adapter);
const stock = new Stock(db);

describe('Stock', () => {
  it('should instantiate Stock class', () => {
      const stock = new Stock(db);
      expect(stock).to.be.an.instanceOf(Stock);
  });
});