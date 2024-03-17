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


before(() => {
const adapter = new FileSync("tests/db-test/stock-test.json");
const db = low(adapter);
db.defaults({ salesTransactions: [], purchaseTransactions: [], furniture: [], customers: [], suppliers: [] }).write(); // Añadir customers y suppliers aquí
initializeCustomers(db);
initializeSuppliers(db);
initializeFurniture(db);
initializePurchaseTransactions(db);

const stock = new Stock(db);

describe('Stock', () => {
  it('should instantiate Stock class', () => {
      const stock = new Stock(db);
      expect(stock).to.be.an.instanceOf(Stock);
  });

  it('should register a sale to a customer', async () => {
    db.set('salesTransactions', []).write();
    // Obtener clientes de la base de datos
    const customers = db.get('customers').value();

    // Elegir un cliente de prueba
    const customer = customers[0];


    // Obtener muebles de la base de datos
    const furniture = db.get('furniture').value();
    
    // Elegir muebles para la venta
    const furnitureNames = [furniture[0].name, furniture[1].name];

    // Registrar la venta
    await stock.registerSale(customer, furnitureNames);

    // Verificar si la venta se registra correctamente en la base de datos
    const salesTransactions = db.get('salesTransactions').value();
    expect(salesTransactions).to.have.lengthOf(1);
    expect(salesTransactions[0].customer).to.deep.equal(customer);
    expect(salesTransactions[0].furniture.map(f => f.name)).to.have.members(furnitureNames);
});

  //PRUEBA PARA EL METODO DE REGISTRAR COMPRA


  // PRUEBA INFORMES

  it('should get transaction with highest amount', async () => {
    const highestTransaction = await stock.getTransactionWithHighestAmount();
    expect(highestTransaction).to.not.be.null;
    expect(highestTransaction).to.have.property('price');
    expect(highestTransaction.price).to.be.a('number');
});

it('should get available stock by furniture name', async () => {
  const furnitureName = 'Silla'; // Assuming 'Silla' exists in the database
  const availableStock = await stock.getAvailableStockByFurnitureName(furnitureName);
  expect(availableStock).to.not.be.null;
  expect(availableStock.name).to.equal(furnitureName);
  expect(availableStock.quantity).to.be.greaterThan(0);
});



});
});


//------------------------------------INCIAR BASE DE DATOS-------------------------------------
// Función para inicializar clientes
function initializeCustomers(db) {
  const customers = [
      { id: '56', name: ' Sandra', contact: 'Sandra@example.com', address: 'Santa Cruz de la Palma' },
      { id: '45', name: 'Cristina', contact: 'Cristina@example.com', address: 'San Cristóbal de La Laguna' }
  ];
  db.set('customers', customers).write();
}

// Función para inicializar proveedores
function initializeSuppliers(db) {
  const suppliers = [
      { id: '99', name: 'Maria', contact: 'mariasupplier@example.com', address: 'Santa Ursula, Tenerife' },
      { id: '96', name: 'Carlos', contact: 'carlossupplier2@example.com', address: 'Santa Cruz de la Palma' }
  ];
  db.set('suppliers', suppliers).write();
}

// Función para inicializar muebles
function initializeFurniture(db) {
  const furniture = [
      { id: '1', name: 'Silla', description: 'Silla Comodda', material: 'Madera', dimensions: '20x20x30', price: 50, quantity: 10 },
      { id: '2', name: 'Mesa', description: 'Mesa grande', material: 'Madera', dimensions: '100x50x75', price: 100, quantity: 5 }
  ];
  db.set('furniture', furniture).write();
}

// Función para inicializar transacciones de venta
function initializePurchaseTransactions(db) {
  const purchaseTransactions = [
      {
          id: '1',
          supplier: { id: '99', name: 'Maria', contact: 'mariasupplier@example.com', address: 'Santa Ursula, Tenerife' },
          furniture: [
              { id: '1', name: 'Silla', description: 'Silla Comoda', material: 'Madera', dimensions: '20x20x30', price: 50, quantity: 5 }
          ],
          totalPrice: 250,
          date: new Date()
      },
      {
          id: '2',
          supplier: { id: '96', name: 'Carlos', contact: 'carlossupplier2@example.com', address: 'Santa Cruz de la Palma' },
          furniture: [
              { id: '2', name: 'Mesa', description: 'Mesa grande', material: 'Madera', dimensions: '100x50x75', price: 100, quantity: 2 }
          ],
          totalPrice: 200,
          date: new Date()
      }
  ];
  db.set('purchaseTransactions', purchaseTransactions).write();
}
