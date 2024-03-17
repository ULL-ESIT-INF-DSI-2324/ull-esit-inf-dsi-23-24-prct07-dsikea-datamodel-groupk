export interface Operations {
  add(info: object);
  delete(id: string);
  update(newData: object);
  search(value: string);
  searchBy(filter: string, value: string);
}