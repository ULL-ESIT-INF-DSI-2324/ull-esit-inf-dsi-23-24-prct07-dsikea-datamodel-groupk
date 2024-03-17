/**
 * Interfaz que define los proveedores
 * @interface Supplier
 * @property {string} id - Identificador del proveedor
 * @property {string} name - Nombre del proveedor
 * @property {string} contact - Contacto del proveedor
 * @property {string} address - Dirección del proveedor
 */
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
}
