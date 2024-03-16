import { Furniture } from "../interfaces/furniture.js";
export interface SaleTransaction {
    id: string;
    date: Date;
    customerId: string;
    itemsSold: Furniture[];
    totalAmount: number;
  }
  
  // Interfaz para las transacciones de compra
export interface PurchaseTransaction {
    id: string;
    date: Date;
    supplierId: string;
    itemsPurchased: Furniture[];
    totalAmount: number;
  }