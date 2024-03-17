import { describe, it } from "mocha";
import { expect } from "chai";
import { Stock } from "../src/stock.js";
import FileSync from "lowdb/adapters/FileSync.js";
import { Furniture } from "../src/interfaces/furniture.js";
import { Supplier } from "../src/interfaces/supplier.js";
import { Customer } from "../src/interfaces/customer.js";
import { FurnitureOperations } from "../src/furnitureOperations.js";
import * as lowdb from "lowdb";
import low from "lowdb";
import inquirer from "inquirer";

describe('FurnitureOperations', () => {
    let db;
    let furnitureOperations;

    before(() => {

        const adapter = new FileSync("tests/db-test/furniture-test.json");
        const db = low(adapter);
        const stock = new Stock(db);
        db.setState({ furniture: [] }).write();
    
    furnitureOperations = new FurnitureOperations(db);

        
    });

    it('should add furniture', async () => {
        const furnitureData = {
            id: '1',
            name: 'Silla',
            description: 'Silla Comodda',
            material: 'Madera',
            dimensions: '20x20x30',
            price: 50,
            quantity: 10
        };

        await furnitureOperations.add(furnitureData);
        const furniture = furnitureOperations.getFurniture();
        expect(furniture).to.have.lengthOf(1);
        expect(furniture[0]).to.deep.equal(furnitureData);
    });

    it('should delete furniture', async () => {
        // Agregar un nuevo mueble
        const newFurniture: Furniture = {
            id: '2',
            name: 'Mesa',
            description: 'Mesa grande',
            material: 'Madera',
            dimensions: '100x50x75',
            price: 100,
            quantity: 5
        };
        await furnitureOperations.add(newFurniture);
    
        // Verificar que el mueble fue agregado
        const addedFurniture = furnitureOperations.getFurniture().find(furniture => furniture.id === newFurniture.id);
        expect(addedFurniture).to.exist;
    
        // Eliminar el mueble
        await furnitureOperations.delete(newFurniture.id);
    
        // Verificar que el mueble fue eliminado
        const deletedFurniture = furnitureOperations.getFurniture().find(furniture => furniture.id === newFurniture.id);
        expect(deletedFurniture).to.not.exist;
    });

    it('should update furniture', async () => {
        // Agregar un nuevo mueble
        const newFurniture: Furniture = {
            id: '3',
            name: 'Mesa',
            description: 'Mesa grande',
            material: 'Madera',
            dimensions: '100x50x75',
            price: 100,
            quantity: 5
        };
        await furnitureOperations.add(newFurniture);
    
        // Modificar los datos del mueble
        const updatedFurnitureData: Furniture = {
            id: '3',
            name: 'Mesa de centro',
            description: 'Mesa grande de centro',
            material: 'Metal',
            dimensions: '80x40x60',
            price: 150,
            quantity: 3
        };
    
        // Actualizar el mueble
        await furnitureOperations.update(updatedFurnitureData);
    
        // Obtener el mueble actualizado
        const updatedFurniture = furnitureOperations.getFurniture().find(furniture => furniture.id === updatedFurnitureData.id);
    
        // Verificar que el mueble fue actualizado correctamente
        expect(updatedFurniture).to.exist;
        expect(updatedFurniture).to.deep.equal(updatedFurnitureData);
    });

    it('should update furniture', async () => {
        // Crear un nuevo mueble
        const newFurniture: Furniture = {
            id: '3',
            name: 'Armario',
            description: 'Armario grande',
            material: 'Madera',
            dimensions: '200x100x50',
            price: 200,
            quantity: 2
        };
        // Agregar el nuevo mueble
        await furnitureOperations.add(newFurniture);
    
        // Modificar los detalles del mueble
        const updatedFurniture: Furniture = {
            id: '3',
            name: 'Armario Grande',
            description: 'Armario grande de madera',
            material: 'Madera de roble',
            dimensions: '200x120x60',
            price: 250,
            quantity: 3
        };
        // Actualizar el mueble existente
        await furnitureOperations.update(updatedFurniture);
    
        // Verificar que los detalles del mueble se han actualizado correctamente
        const retrievedFurniture = furnitureOperations.getFurniture().filter(furniture => furniture.id === updatedFurniture.id);
        // Verificar que el mueble actualizado tiene los detalles correctos
        expect(retrievedFurniture[0]).to.deep.equal(updatedFurniture);
    });
    
    it('should search furniture by name and description', async () => {
        // Agregar un nuevo mueble
        const newFurniture: Furniture = {
            id: '4',
            name: 'SillaSearch',
            description: 'Silla cómoda',
            material: 'Madera',
            dimensions: '20x20x30',
            price: 50,
            quantity: 10
        };
        await furnitureOperations.add(newFurniture);
    
        // Realizar la búsqueda por nombre
        const searchResult = await furnitureOperations.search('SillaSearch');
        expect(searchResult).to.not.be.undefined;
        expect(searchResult).to.be.an('array');
        expect(searchResult.some(furniture => furniture.name === 'SillaSearch')).to.be.true;

        // Realizar la búsqueda por descripción
        const searchResultByDescription = await furnitureOperations.search('cómoda');
        expect(searchResultByDescription).to.not.be.undefined;
        expect(searchResultByDescription).to.be.an('array');
        expect(searchResultByDescription.some(furniture => furniture.description.includes('cómoda'))).to.be.true;
    });

    it ("should return the count of furniture in stock", () => {
        const count = furnitureOperations.getCount();
        expect(count).to.be.a('number');
        expect(count).to.be.greaterThan(-1);
    });


});