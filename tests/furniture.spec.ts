import { describe, it } from "mocha";
import { expect } from "chai";
import { Stock } from "../src/stock.js";
import FileSync from "lowdb/adapters/FileSync.js";
import { Furniture } from "../src/interfaces/furniture.js";
import { Supplier } from "../src/interfaces/supplier.js";
import { Customer } from "../src/interfaces/customer.js";
import * as lowdb from "lowdb";

describe('Furniture', () => {

    let furniture1: Furniture;
    beforeEach(() => {
        furniture1 = {
            id: '1',
            name: 'Silla',
            description: 'Silla Comoda',
            material: 'Madera',
            dimensions: '20x20x30',
            price: 50,
            quantity: 10
        };
      });

    it ('intance of Furniture', () => {
        expect(furniture1).to.be.an.instanceOf(Object);
        expect(furniture1).to.be.an('object');
    });

    it('should have an id', () => {
        expect(furniture1).to.have.property('id');
        expect(furniture1.id).to.equal('1');
    });

    it('should have a name', () => {
        expect(furniture1).to.have.property('name');
        expect(furniture1.name).to.equal('Silla');
    });

    it('should have a description', () => {
        expect(furniture1).to.have.property('description');
        expect(furniture1.description).to.equal('Silla Comoda');
    });

    it('should have a material', () => {
        expect(furniture1).to.have.property('material');
        expect(furniture1.material).to.equal('Madera');
    });

    it('should have dimensions', () => {
        expect(furniture1).to.have.property('dimensions');
        expect(furniture1.dimensions).to.equal('20x20x30');
    });

    it('should have a price', () => {
        expect(furniture1).to.have.property('price');
        expect(furniture1.price).to.equal(50);
    });

    it('should have a quantity', () => {
        expect(furniture1).to.have.property('quantity');
        expect(furniture1.quantity).to.equal(10);
    });
});