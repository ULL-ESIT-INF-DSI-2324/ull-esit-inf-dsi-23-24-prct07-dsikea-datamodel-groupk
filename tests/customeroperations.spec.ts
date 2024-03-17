import { describe, it } from "mocha";
import { expect } from "chai";
import { Stock } from "../src/stock.js";
import FileSync from "lowdb/adapters/FileSync.js";
import { Furniture } from "../src/interfaces/furniture.js";
import { Supplier } from "../src/interfaces/supplier.js";
import { Customer } from "../src/interfaces/customer.js";
import { FurnitureOperations } from "../src/furnitureOperations.js";
import { CustomerOperations } from "../src/customerOperations.js";
import * as lowdb from "lowdb";
import low from "lowdb";
import inquirer from "inquirer";

describe('CustomerOperations', () => {
    let db;
    let customerOperations;

    before(() => {
        const adapter = new FileSync("tests/db-test/customer-test.json");
        const db = low(adapter);
        const stock = new Stock(db);
        db.setState({ customers: [] }).write();
        customerOperations = new CustomerOperations(db);
    });

    it('should add a customer', async () => {
        const customerData = {
            id: '1',
            name: 'Antonio',
            contact: 'antoniomr@example.com',
            address: '6, La Laguna'
        };
        await customerOperations.add(customerData);
        const customers = customerOperations.getCustomers();
        expect(customers).to.have.lengthOf(1);
        expect(customers[0]).to.deep.equal(customerData);
    });

    it('should delete a customer', async () => {
        // Agregar un nuevo cliente
        const newCustomer: Customer = {
            id: '2',
            name: 'Gabri',
            contact: 'gabriwe@example.com',
            address: '6, Santa Cruz de Tenerife'
        };
        await customerOperations.add(newCustomer);
    
        // Verificar que el cliente fue agregado
        const addedCustomer = customerOperations.getCustomers().find(customer => customer.id === newCustomer.id);
        expect(addedCustomer).to.exist;
    
        // Eliminar el cliente
        await customerOperations.delete(newCustomer.id);
    
        // Verificar que el cliente fue eliminado
        const deletedCustomer = customerOperations.getCustomers().find(customer => customer.id === newCustomer.id);
        expect(deletedCustomer).to.not.exist;
    });

    it('should update a customer', async () => {
        // Agregar un nuevo cliente
        const newCustomer: Customer = {
            id: '3',
            name: 'Alicia',
            contact: 'alicia45@example.com',
            address: 'Los Llanos de Aridane'
        };
        await customerOperations.add(newCustomer);
    
        // Modificar los datos del cliente
        const updatedCustomerData: Customer = {
            id: '3',
            name: 'Alicia Cruz',
            contact: 'alicia.j@example.com',
            address: 'Los Llanos de Aridane'
        };
    
        // Actualizar el cliente
        await customerOperations.update(updatedCustomerData);
    
        // Obtener el cliente actualizado
        const updatedCustomer = customerOperations.getCustomers().find(customer => customer.id === updatedCustomerData.id);
    
        // Verificar que el cliente fue actualizado correctamente
        expect(updatedCustomer).to.exist;
        expect(updatedCustomer).to.deep.equal(updatedCustomerData);
    });

    it ("should return the count of customers", () => {
        const count = customerOperations.getCount();
        expect(count).to.be.a('number');
        expect(count).to.be.greaterThan(-1);
    });

    it('should search customers by name, contact, and address', async () => {
        // Agregar clientes de prueba
        const customersToAdd = [
            {
                id: '8',
                name: 'Pedro',
                contact: 'pedrope@example.com',
                address: 'La Orotava'
            },
            {
                id: '9',
                name: 'Sandra',
                contact: 'sandr78@example.com',
                address: 'Santa Cruz de la Palma'
            },
            {
                id: '10',
                name: 'Laura',
                contact: 'lauuu@example.com',
                address: 'San Cristóbal de La Laguna'
            }
        ];
    
        // Agregar los clientes a la base de datos
        for (const customerData of customersToAdd) {
            await customerOperations.add(customerData);
        }
    
        // Realizar la búsqueda por nombre
        const searchResultByName = await customerOperations.search('Pedro');
        expect(searchResultByName).to.not.be.undefined;
        expect(searchResultByName).to.be.an('array');
        expect(searchResultByName.some(customer => customer.name === 'Pedro')).to.be.true;
    
        // Realizar la búsqueda por contacto
        const searchResultByContact = await customerOperations.search('sandr78@example.com');
        expect(searchResultByContact).to.not.be.undefined;
        expect(searchResultByContact).to.be.an('array');
        expect(searchResultByContact.some(customer => customer.contact === 'sandr78@example.com')).to.be.true;
    
        // Realizar la búsqueda por dirección
        const searchResultByAddress = await customerOperations.search('San Cristóbal de La Laguna');
        expect(searchResultByAddress).to.not.be.undefined;
        expect(searchResultByAddress).to.be.an('array');
        expect(searchResultByAddress.some(customer => customer.address === 'San Cristóbal de La Laguna')).to.be.true;
    });

    it('should not add customer if already exists', async () => {
        // Agregar un nuevo cliente
        const newCustomer: Customer = {
            id: '456',
            name: 'Cristina',
            contact: 'criss@example.com',
            address: 'Santa Úrsula'
        };
    
        // Agregar el mismo cliente nuevamente
        await customerOperations.add(newCustomer);
        
        let consoleOutput = '';
        const log = console.log;
        console.log = (message: string) => {
            consoleOutput += message;
        };
    
        // Agregar el cliente una segunda vez
        await customerOperations.add(newCustomer);
        console.log = log;
        expect(consoleOutput).to.include('Customer already exists.');
    });


});