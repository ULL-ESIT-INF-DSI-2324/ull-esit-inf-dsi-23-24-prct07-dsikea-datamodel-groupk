[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupk/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupk?branch=main)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupk&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupk)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupk/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupk/actions/workflows/node.js.yml)

### Práctica 7 - DSIkea

## Datos identificativos - Grupo K

- Guillermo Díaz Bricio - alu0101505688
- Jóse Miguel Díaz González - alu0101203294
- Diego Díaz Fernández - alu0101130026

## Objetivos

En esta primera práctica grupal de la asignatura se nos pide que desarrollemos un diseño orientado a objetos del modelo de datos de un sistema de información destinado a gestionar una tienda de muebles, de ahí el símil del título con IKEA. Tendremos que familiarizarnos con herramientas nuevas como lowdb e inquirer, que nos ayudarán a manejar la base de datos y a la interacción por consola.

Se nos pide que definamos interfaces para manejar los distintos muebles, proveedores y clientes. Por otro lado, debemos definir una clase Stock que como bien se puede intuir controlará el stock disponible de muebles que hay, además de registrar las transacciones que se hagan y la realización de informes sobre el stock. Pasamos ahora con la implementación.

## Interfaces

A la hora de definir las interfaces, nos centramos el los 3 agentes que tenemos en nuestro sistema de información. En primer lugar, los muebles. Para ello desarollamos la interfaz Furniture, con información básica sobre el producto.

```
export interface Furniture {
  id: string;
  name: string;
  description: string;
  material: string;
  dimensions: string;
  price: number;
}
```

Después de definir esta, pasamos a la de los clientes. En esta se define información sobre el mismo como su nombre, contacto...

```
export interface Customer {
  id: string;
  name: string;
  contact: string;
  address: string;
}
```

La interfaz Supplier que de igual manera guarda datos de ese provedoor en concreto.

```
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
}
```

Por último, tenemos la interfaz Operations, que define las operaciones que deben implementarse para muebles, clientes y proveedores:
```
export interface Operations {
  add(info: object);
  delete(id: string);
  update(newData: object);
  search(value: string);
  searchBy(filter: string, value: string);
}
```

Con esto terminaríamos las interfaces que hemos empleado, ahora nos centraremos en cómo gestionaremos nuestro sistema de información

## Clases de operaciones
Esta clase es la encargada de implementar todas las operaciones respectivas a muebles que podemos realizar en nuestro sistema:
```
export class FurnitureOperations implements Operations {
  private furnitures: Furniture[]; 
  constructor(private db: lowdb.LowdbSync<any>) {
    this.furnitures = db.get("furniture").value();
  }

  async add(furnitureData: Furniture) {
    this.furnitures.push(furnitureData);
    this.db
    .update("furniture", () => this.furnitures)
      .write();
  }

  async delete(id: string) {
    this.furnitures = this.furnitures.filter((element) => {
      return element.id !== id;
    });
    this.db
      .update("furniture", () => this.furnitures)
        .write();
  }

  async update(newData: Furniture) {
    this.furnitures.forEach((element, index) => {
      if(element.id === newData.id) this.furnitures[index] = newData;
    });
    this.db
      .update("furniture", () => this.furnitures)
      .write();
  }

  async search(searchCriteria: string, isTestEnvironment: boolean = false) {
    const filteredSupplier = this.searchBy(searchCriteria);
    if (!isTestEnvironment) {
        console.log(filteredSupplier);
    }
    return filteredSupplier;
}

  searchBy(value: string) {
    const regex = new RegExp(value, "i");
    return this.db
      .get("furniture")
      .value()
      .filter((furniture) => {
        return regex.test(furniture.name) || regex.test(furniture.description);
      });
  }

  getCount() {
    return this.furnitures.length;
  }

  getFurniture() {
    return this.furnitures;
  }
}
```

Lo primero que se hace es almacenar en un array los muebles que se encuentran en la base de datos, de esta manera podemos tratar la información de una mejor manera, pudiéndonos aprovechar de los métodos que ofrece el propio lenguaje. A partir de este array, se implementan el resto de operaciones, actuando directamente sobre el mismo y luego actualizando la base de datos.

Nos hemos centrado en la clase `FurnitureOperations`, pero las dos restantes `SupplierOperations`y `CustomerOperations`, implementan la interfaz `Operation` de manera muy similar.

## Clase Stock


## Conclusiones

## Bibliografía

- Essential TypeScript: From Beginner to Pro
