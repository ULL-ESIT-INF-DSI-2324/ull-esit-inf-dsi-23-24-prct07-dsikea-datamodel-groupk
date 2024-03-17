import inquirer from "inquirer";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync.js";
import { Furniture } from "./interfaces/furniture.js";
import { Supplier } from "./interfaces/supplier.js";
import { Customer, Purchase } from "./interfaces/customer.js";
import { SaleTransaction, PurchaseTransaction } from "./interfaces/transaction.js";

/**
 * Clase que maneja el stock de muebles
 */
export class Stock {
  private salesTransactions: SaleTransaction[] = [];
  private purchaseTransactions: PurchaseTransaction[] = [];
  

  constructor(private db: lowdb.LowdbSync<any>) {
    this.salesTransactions = db.get("salesTransactions").value() || [];
    this.purchaseTransactions = db.get("purchaseTransactions").value() || [];
  }
  //------------------------------------------------FUNCIONALIDADES------------------------------------------------------
  //----------------------TRANSACCIONES-------------------

  //----------------------CLIENTES------------------------
  // Método para registrar una venta a un cliente
  async registerSale(customer: Customer, furnitureNames: string[]) {
    const missingFurniture: string[] = [];
    const soldFurniture: Furniture[] = [];
    let totalPrice = 0;
  
    // Verificar si los muebles están disponibles en el stock
    for (const furnitureName of furnitureNames) {
      const furniture = this.db.get("furniture").value().furniture.find((f) => f.name === furnitureName);
      if (furniture && furniture.quantity > 0) {
        soldFurniture.push(furniture);
        totalPrice += furniture.price;
        
        // Disminuir la cantidad de muebles disponibles
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
  // Método para registrar una compra a un proveedor
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

    const existingFurniture = this.db.get("furniture").value().furniture.find((f) => f.name === purchasedFurniture.name);
    if (existingFurniture) {
      existingFurniture.quantity += purchasedFurniture.quantity;
    } else {
      this.db.update("furniture", (existingFurniture: Furniture[]) =>
      [existingFurniture, purchasedFurniture]);
    }

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
  // Método que devuelve el historial completo de transacciones
  async getTransactionHistory() {
    const salesTransactions = this.db.get('salesTransactions').value();
    const purchaseTransactions = this.db.get('purchaseTransactions').value();
    return {
      sales: salesTransactions,
      purchases: purchaseTransactions
    };
  }

  //----------------------INFORMES------------------------

  async getAvailableStockByFurnitureName(name: string) {
    const furniture = this.db.get("furniture").value().furniture.find(f => f.name === name && f.quantity > 0);
    return furniture;
  }


  async getTransactionWithHighestAmount() {
    const salesTransactions = await this.getTransactionHistory();
    
    if (salesTransactions && salesTransactions.sales && salesTransactions.sales.length > 0) {
      // Ordenar las transacciones por el importe total en orden descendente
      const sortedTransactions = salesTransactions.sales.sort((a, b) => b.price - a.price);
      return sortedTransactions[0];
    } else {
      return null;
    }
  }


  async getCustomerWithHighestSpending() {
    const customersData: any = this.db.get("customers").value(); // Obtener los datos de los clientes
  
    // Verificar si customersData es un array antes de continuar
    if (Array.isArray(customersData)) {
      let customerWithHighestSpending: Customer | undefined;
      let highestSpending = 0;
  
      // Iterar sobre los clientes para encontrar el que ha gastado más
      customersData.forEach((customer: Customer) => {
        const customerId = customer.id;
  
        // Obtener las compras del cliente actual
        const purchasesData: any = this.db.get("purchases").value(); // Obtener los datos de compras
  
        // Verificar si purchasesData es un array antes de intentar filtrarlo
        if (Array.isArray(purchasesData)) {
          // Filtrar las compras del cliente actual
          const customerPurchases = purchasesData.filter((purchase: Purchase) => purchase.customerId === customerId);
  
          // Calcular el total gastado por el cliente actual
          const customerTotalSpending = customerPurchases.reduce((total: number, purchase: Purchase) => total + purchase.amount, 0);
  
          // Actualizar el cliente con el gasto más alto si corresponde
          if (customerTotalSpending > highestSpending) {
            highestSpending = customerTotalSpending;
            customerWithHighestSpending = customer;
          }
        } else {
          console.error("No se pudo obtener el array de compras");
        }
      });
  
      return customerWithHighestSpending;
    } else {
      console.error("No se pudo obtener el array de clientes");
      return undefined;
    }
  }
}
