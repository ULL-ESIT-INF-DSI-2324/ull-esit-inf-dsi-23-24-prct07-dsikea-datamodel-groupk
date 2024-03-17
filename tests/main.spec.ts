import { describe, it } from "mocha";
import { expect } from "chai";
import { Stock } from "../src/stock.js";
import FileSync from "lowdb/adapters/FileSync.js";
import { FurnitureOperations } from "../src/furnitureOperations.js";
import { SupplierOperations } from "../src/supplierOperations.js";
import { CustomerOperations } from "../src/customerOperations.js";
import { Furniture } from "../src/interfaces/furniture.js";
import { Supplier } from "../src/interfaces/supplier.js";
import { Customer } from "../src/interfaces/customer.js";
import * as lowdb from "lowdb";
import low from "lowdb";
import inquirer from "inquirer";

