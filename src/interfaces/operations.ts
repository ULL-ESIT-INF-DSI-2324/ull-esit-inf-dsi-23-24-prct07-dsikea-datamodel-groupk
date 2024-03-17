/**
 * Interfaz que define las operaciones
 * @interface Operations
 * @method add - Agrega un nuevo registro
 * @method delete - Elimina un registro
 * @method update - Actualiza un registro
 * @method search - Busca un registro
 * @method searchBy - Busca un registro por un criterio
 * 
 */
export interface Operations {
  add(info: object);
  delete(id: string);
  update(newData: object);
  search(value: string);
  searchBy(filter: string, value: string);
}