/**
 * Interfaz que define a los clientes
 * @interface Customer
 * @property {string} id - Identificador del cliente
 * @property {string} name - Nombre del cliente
 * @property {string} contact - Contacto del cliente
 * @property {string} address - Dirección del cliente
 */
export interface Customer {
  id: string;
  name: string;
  contact: string;
  address: string;
}

/**
 * Interfaz Purchase
 * @interface Purchase
 * @property {string} customerId - Identificador del cliente
 * @property {number} amount - Monto de la compra
 */
export interface Purchase {
  customerId: string;
  amount: number;
}
