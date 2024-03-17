/**
 * Interfaz que define los muebles
 * @interface Furniture
 * @property {string} id - Identificador del mueble
 * @property {string} name - Nombre del mueble
 * @property {string} description - Descripción del mueble
 * @property {string} material - Material del mueble
 * @property {string} dimensions - Dimensiones del mueble
 * @property {number} price - Precio del mueble
 * @property {number} quantity - Cantidad de muebles
 * 
 */
export interface Furniture {
  id: string;
  name: string;
  description: string;
  material: string;
  dimensions: string;
  price: number;
  quantity: number;
}
