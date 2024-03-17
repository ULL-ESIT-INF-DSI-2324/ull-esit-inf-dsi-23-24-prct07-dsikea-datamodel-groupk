import { describe, it } from "mocha";
import { expect } from "chai";
import { Stock } from "../src/stock.js";
import FileSync from "lowdb/adapters/FileSync.js";
import { Furniture } from "../src/interfaces/furniture.js";
import { Supplier } from "../src/interfaces/supplier.js";
import { Customer } from "../src/interfaces/customer.js";
import * as lowdb from "lowdb";

describe('Customer', () => {
    let customer1: Customer;

    beforeEach(() => {
      customer1 = {
        id: '1',
        name: 'Antonio',
        contact: '123456789',
        address: '123 La Laguna'
      };
    });

    it('should have an id', () => {
      expect(customer1).to.be.an('object');
      expect(customer1).to.have.property('id');
      expect(customer1.id).to.equal('1');
    });
    it('should have a name', () => {
      expect(customer1).to.be.an('object');
      expect(customer1).to.have.property('name');
      expect(customer1.name).to.equal('Antonio');
    });
  
    it('should have a contact', () => {
      expect(customer1).to.be.an('object');
      expect(customer1).to.have.property('contact');
      expect(customer1.contact).to.equal('123456789');
    });
  
    it('should have an address', () => {
      expect(customer1).to.be.an('object');
      expect(customer1).to.have.property('address');
      expect(customer1.address).to.equal('123 La Laguna');
    });
  });