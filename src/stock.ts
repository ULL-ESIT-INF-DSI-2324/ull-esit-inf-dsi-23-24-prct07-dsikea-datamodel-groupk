/**
 * @module stock
 * @summary Modulo Stock
 * @description
 * El módulo stock es responsable de gestionar el inventario de muebles, transacciones de venta y compra en una tienda de muebles. La clase Stock proporciona métodos para registrar ventas a clientes, compras a proveedores y generar informes sobre el historial de transacciones.
 * La clase Stock contiene propiedades que almacenan las transacciones de venta y compra, así como una instancia de la base de datos proporcionada por Lowdb para acceder y manipular los datos.  
 * Los métodos disponibles son:   
 * **registerSale**: Registra una venta a un cliente, actualizando el stock de muebles disponibles y almacenando la transacción en la base de datos.   
 * **registerPurchase**: Registra una compra a un proveedor, añadiendo muebles al inventario y almacenando la transacción de compra en la base de datos.   
 * **getTransactionHistory**: Devuelve el historial completo de transacciones, incluyendo ventas y compras.   
 * **getAvailableStockByFurnitureName**: Obtiene el stock disponible de un mueble específico por su nombre.   
 * **getTransactionWithHighestAmount**: Devuelve la transacción de venta con el importe más alto.   
 */
import inquirer from "inquirer";
import lowdb from "lowdb";
import { Furniture } from "./interfaces/furniture.js";
import { Supplier } from "./interfaces/supplier.js";
import { Customer } from "./interfaces/customer.js";
import { SaleTransaction, PurchaseTransaction } from "./interfaces/transaction.js";

/**
 * Clase que maneja el stock de muebles
 * @class Stock
 * @property {SaleTransaction[]} salesTransactions - Lista de transacciones de venta
 * @property {PurchaseTransaction[]} purchaseTransactions - Lista de transacciones de compra
 * @property {lowdb.LowdbSync<any>} db - Base de datos
 * @method {registerSale} registerSale - Método para registrar una venta a un cliente
 * @method {registerPurchase} registerPurchase - Método para registrar una compra a un proveedor
 * @method {getTransactionHistory} getTransactionHistory - Método que devuelve el historial completo de transacciones
 * @method {getAvailableStockByFurnitureName} getAvailableStockByFurnitureName - Método que devuelve el stock disponible de un mueble
 * @method {getTransactionWithHighestAmount} getTransactionWithHighestAmount - Método que devuelve la transacción con el importe más alto
 */
export class Stock {
  private salesTransactions: SaleTransaction[] = [];
  private purchaseTransactions: PurchaseTransaction[] = [];
  
  /**
   * 
   * @param db - Base de datos
   */
  constructor(private db: lowdb.LowdbSync<any>) {
    this.salesTransactions = db.get("salesTransactions").value() || [];
    this.purchaseTransactions = db.get("purchaseTransactions").value() || [];
  }
  /***
   * Método para registrar una venta a un cliente
   * @param customer - Cliente
   * @param furnitureNames - Nombres de los muebles
   * @returns {void}
   * 
   */
  async registerSale(customer: Customer, furnitureNames: string[]) {
    const missingFurniture: string[] = [];
    const soldFurniture: Furniture[] = [];
    let totalPrice = 0;
    
    /**
     * Obtener la lista completa de muebles de la base de datos
     */
    const allFurniture = this.db.get("furniture").value();
  
    /**
     * Verificar si los muebles están disponibles en el stock
     */
    for (const furnitureName of furnitureNames) {
      const furniture = allFurniture.find((f) => f.name === furnitureName);
      if (furniture && furniture.quantity > 0) {
        soldFurniture.push(furniture);
        totalPrice += furniture.price;
        
      /**
       * Actualizar la cantidad de muebles en el stock
       */
        furniture.quantity -= 1;
      } else {
        missingFurniture.push(furnitureName);
      }
    }
  
    // Si algunos muebles no están disponibles, imprimir un mensaje y salir del método
    if (missingFurniture.length > 0) {
      console.log(`The following furniture is not available: ${missingFurniture.join(", ")}`);
      return;
    }
  
    // Crear objeto de transacción de venta
    const saleTransaction = {
      date: new Date(),
      customer,
      furniture: soldFurniture,
      price: totalPrice,
    };
  
    // Agregar la transacción de venta a la base de datos
    this.db.update('salesTransactions', (transactions: any[]) => {
      if (!transactions) {
        transactions = [];
      }
      transactions.push(saleTransaction);
      return transactions;
    }).write();
  }

  //----------------------PROVEEDORES------------------------
  /**
   * Método para registrar una compra a un proveedor
   * @param supplier - Proveedor
   * @returns {void}
   * 
   */
  async registerPurchase(supplier: Supplier) {
    const purchasedFurnitureData = await inquirer.prompt([
        { type: "input", name: "name", message: "Enter furniture name:" },
        { type: "number", name: "quantity", message: "Enter quantity purchased:" },
        { type: "number", name: "price", message: "Enter purchase price per unit:" },
    ]);

    const purchasedFurniture: Furniture = {
        id: Date.now().toString(),
        ...purchasedFurnitureData,
    };

    const furnitureData = this.db.get("furniture").value();
    furnitureData.push(purchasedFurniture);
    this.db.set("furniture", furnitureData).write();

    const purchaseTransaction = {
        date: new Date(),
        supplier,
        furniture: purchasedFurniture,
        totalPrice: purchasedFurniture.quantity * purchasedFurniture.price,
    };

    this.db.update("purchaseTransactions", (transactions: any[]) => {
        if (!transactions) {
            transactions = [];
        }
        transactions.push(purchaseTransaction);
        return transactions;
    }).write();
}
  


  //----------------------HISTORY------------------------
  /**
   * Método que devuelve el historial completo de transacciones
   * @returns {Promise<{sales: SaleTransaction[], purchases: PurchaseTransaction[]}>}
   * 
   */
  async getTransactionHistory() {
    const salesTransactions = this.db.get('salesTransactions').value();
    const purchaseTransactions = this.db.get('purchaseTransactions').value();
    return {
      sales: salesTransactions,
      purchases: purchaseTransactions
    };
  }

  //----------------------INFORMES------------------------

  /**
   * Método que devuelve el stock disponible de un mueble
   * @param name - Nombre del mueble
   * @returns {Promise<Furniture>}
   * 
   */
  async getAvailableStockByFurnitureName(name: string) {
    const furniture = this.db.get("furniture").value().find(f => f.name === name && f.quantity > 0);
    return furniture;
}


  /**
   * Método que devuelve la transacción con el importe más alto
   * @returns {Promise<SaleTransaction>}
   * 
   */
  async getTransactionWithHighestAmount() {
    const salesTransactions = await this.getTransactionHistory();
    
    if (salesTransactions && salesTransactions.sales && salesTransactions.sales.length > 0) {
      // Ordenar las transacciones por el importe total en orden descendente
      const sortedTransactions = salesTransactions.sales.sort((a, b) => b.price - a.price);
      return sortedTransactions[0];
    }
  }

}
