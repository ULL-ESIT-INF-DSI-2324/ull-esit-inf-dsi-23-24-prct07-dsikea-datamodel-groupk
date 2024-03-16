/**
 * Interfaz que define a los clientes
 */
export interface Customer {
  id: string;
  name: string;
  contact: string;
  address: string;
}

export interface Purchase {
  customerId: string;
  amount: number;
  // Otros campos relevantes para la compra
}
