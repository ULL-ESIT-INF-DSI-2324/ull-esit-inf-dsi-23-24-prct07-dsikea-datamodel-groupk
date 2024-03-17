/*
import { describe, it } from "mocha";
import { expect } from "chai";
import { Stock } from "../src/stock.js";
import FileSync from "lowdb/adapters/FileSync.js";
import { Furniture } from "../src/interfaces/furniture.js";
import { Supplier } from "../src/interfaces/supplier.js";
import { Customer } from "../src/interfaces/customer.js";
import * as lowdb from "lowdb";

describe('Supplier', () => {

    let supplier1: Supplier;
    beforeEach(() => {
        supplier1 = {
            id: '1',
            name: 'Juan',
            contact: '123456789',
            address: '123 Santa Cruz de Tenerife'
        };
      });


    it('should have an id', () => {
      expect(supplier1).to.be.an('object');
      expect(supplier1).to.have.property('id');
      expect(supplier1.id).to.equal('1');
    });
    it('should have a name', () => {
      expect(supplier1).to.be.an('object');
      expect(supplier1).to.have.property('name');
      expect(supplier1.name).to.equal('Juan');
    });
  
    it('should have a contact', () => {
      expect(supplier1).to.be.an('object');
      expect(supplier1).to.have.property('contact');
      expect(supplier1.contact).to.equal('123456789');
    });
  
    it('should have an address', () => {
      expect(supplier1).to.be.an('object');
      expect(supplier1).to.have.property('address');
      expect(supplier1.address).to.equal('123 Santa Cruz de Tenerife');
    });
  });
  */