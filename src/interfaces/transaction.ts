/**
 * Interfaz para las transacciones de venta
 * @interface SaleTransaction
 * @property {string} id - Identificador de la transacción
 * @property {Date} date - Fecha de la transacción
 * @property {string} customerId - Identificador del cliente
 * @property {Furniture[]} itemsSold - Muebles vendidos
 * @property {number} totalAmount - Monto total de la venta
 * 
 */
import { Furniture } from "../interfaces/furniture.js";
export interface SaleTransaction {
    id: string;
    date: Date;
    customerId: string;
    itemsSold: Furniture[];
    totalAmount: number;
  }
  
  /**
   * Interfaz para las transacciones de compra
   * @interface PurchaseTransaction
   * @property {string} id - Identificador de la transacción
   * @property {Date} date - Fecha de la transacción
   * @property {string} supplierId - Identificador del proveedor
   * @property {Furniture[]} itemsPurchased - Muebles comprados
   * @property {number} totalAmount - Monto total de la compra
   * 
   */
export interface PurchaseTransaction {
    id: string;
    date: Date;
    supplierId: string;
    itemsPurchased: Furniture[];
    totalAmount: number;
  }