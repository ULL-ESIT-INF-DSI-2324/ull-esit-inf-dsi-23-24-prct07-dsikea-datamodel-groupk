import { describe, it } from "mocha";
import { expect } from "chai";
import { Stock } from "../src/stock.js";
import FileSync from "lowdb/adapters/FileSync.js";
import { Furniture } from "../src/interfaces/furniture.js";
import { Supplier } from "../src/interfaces/supplier.js";
import { Customer } from "../src/interfaces/customer.js";
import { FurnitureOperations } from "../src/furnitureOperations.js";
import { CustomerOperations } from "../src/customerOperations.js";
import { SupplierOperations } from "../src/supplierOperations.js";
import * as lowdb from "lowdb";
import low from "lowdb";
import inquirer from "inquirer";

describe('SupplierOperations', () => {
    let db;
    let supplierOperations;

    before(() => {
        const adapter = new FileSync("tests/db-test/supplier-test.json");
        const db = low(adapter);
        const stock = new Stock(db);
        db.setState({ suppliers: [] }).write();
        supplierOperations = new SupplierOperations(db);
    });

    it('should add a supplier', async () => {
        const supplierData = {
            id: '256',
            name: 'Supplier 1',
            contact: 'supplier1@example.com',
            address: 'La laguna, Tenerife'
        };
        await supplierOperations.add(supplierData);
        const suppliers = supplierOperations.getSuppliers();
        expect(suppliers).to.have.lengthOf(1);
        expect(suppliers[0]).to.deep.equal(supplierData);
    });

    it('should delete a supplier', async () => {
        // Agregar un nuevo proveedor
        const newSupplier: Supplier = {
            id: '48',
            name: 'Supplier 2',
            contact: 'supplier2@example.com',
            address: 'Los Llanos de Aridane, La Palma'
        };
        await supplierOperations.add(newSupplier);
    
        // Verificar que el proveedor fue agregado
        const addedSupplier = supplierOperations.getSuppliers().find(supplier => supplier.id === newSupplier.id);
        expect(addedSupplier).to.exist;
    
        // Eliminar el proveedor
        await supplierOperations.delete(newSupplier.id);
    
        // Verificar que el proveedor fue eliminado
        const deletedSupplier = supplierOperations.getSuppliers().find(supplier => supplier.id === newSupplier.id);
        expect(deletedSupplier).to.not.exist;
    });

    it('should update a supplier', async () => {
        // Agregar un nuevo proveedor
        const newSupplier: Supplier = {
            id: '5989',
            name: 'Supplier 3',
            contact: 'supplier3@example.com',
            address: 'La Orotava'
        };
        await supplierOperations.add(newSupplier);
    
        // Modificar los datos del proveedor
        const updatedSupplierData: Supplier = {
            id: '5989',
            name: 'Updated Supplier 3',
            contact: 'updatedsupplier3@example.com',
            address: 'Santa Ursula, Tenerife'
        };
    
        // Actualizar el proveedor
        await supplierOperations.update(updatedSupplierData);
    
        // Obtener el proveedor actualizado
        const updatedSupplier = supplierOperations.getSuppliers().find(supplier => supplier.id === updatedSupplierData.id);
    
        // Verificar que el proveedor fue actualizado correctamente
        expect(updatedSupplier).to.exist;
        expect(updatedSupplier).to.deep.equal(updatedSupplierData);
    });

    it ("should return the count of suppliers", () => {
        const count = supplierOperations.getCount();
        expect(count).to.be.a('number');
        expect(count).to.be.greaterThan(-1);
    });

    it('should not add supplier if already exists', async () => {
        // Agregar un nuevo proveedor
        const newSupplier: Supplier = {
            id: '789',
            name: 'TestDuplicado',
            contact: 'duplicate@example.com',
            address: 'Duplicate Supplier Address'
        };
    
        // Agregar el mismo proveedor nuevamente
        await supplierOperations.add(newSupplier);
        
        let consoleOutput = '';
        const log = console.log;
        console.log = (message: string) => {
            consoleOutput += message;
        };
    
        // Agregar el proveedor una segunda vez
        await supplierOperations.add(newSupplier);
        console.log = log;
        expect(consoleOutput).to.include('Supplier already exists.');
    });

    it('should search suppliers by name and contact', async () => {
        const suppliersToAdd = [
            {
                id: '8',
                name: 'Juan',
                contact: 'juansupplier@example.com',
                address: 'La Orotava'
            },
            {
                id: '9',
                name: 'Maria',
                contact: 'mariasupplier@example.com',
                address: 'Santa Cruz de la Palma'
            },
            {
                id: '10',
                name: 'Carlos',
                contact: 'carlossupplier@example.com',
                address: 'San Cristóbal de La Laguna'
            }
        ];
        for (const supplierData of suppliersToAdd) {
            await supplierOperations.add(supplierData);
        }

        // Buscar proveedores por nombre
        const searchResultByName = await supplierOperations.search('Juan', true);
        expect(searchResultByName).to.not.be.undefined;
        expect(searchResultByName).to.be.an('array');
        expect(searchResultByName.some(supplier => supplier.name === 'Juan')).to.be.true;

        // Realizar la búsqueda por contacto
        const searchResultByContact = await supplierOperations.search('mariasupplier@example.com', true);
        expect(searchResultByContact).to.not.be.undefined;
        expect(searchResultByContact).to.be.an('array');
        expect(searchResultByContact.some(supplier => supplier.contact === 'mariasupplier@example.com')).to.be.true;

        // Realizar la búsqueda por dirección
        const searchResultByAddress = await supplierOperations.search('San Cristóbal de La Laguna', true);
        expect(searchResultByAddress).to.not.be.undefined;
        expect(searchResultByAddress).to.be.an('array');
        expect(searchResultByAddress.some(supplier => supplier.address === 'San Cristóbal de La Laguna')).to.be.true;

        

    });



});
