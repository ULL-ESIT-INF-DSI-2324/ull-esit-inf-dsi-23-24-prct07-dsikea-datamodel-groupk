[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupk/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupk?branch=main)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupk&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2324_ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupk)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupk/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2324/ull-esit-inf-dsi-23-24-prct07-dsikea-datamodel-groupk/actions/workflows/node.js.yml)

### Práctica 7 - DSIkea

## Datos identificativos - Grupo K

- Guillermo Díaz Bricio - alu
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

Por último, la interfaz Supplier que de igual manera guarda datos de ese provedoor en concreto.

```
export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
}
```

Con esto terminaríamos las interfaces que hemos empleado, ahora nos centraremos en cómo gestionaremos nuestro sistema de información

## Clase Stock

Ya metiéndonos en nuestra clase gestora, primero comentaremos la organización de la misma. Esta contiene, al principio, una instancia de cada interfaz, con la que se trabajará en las distintas funciones. También cuenta con una constructor de la base de datos, empleando Lowdb. Partiendo de esto, hemos decidido separar los métodos en 3 partes: muebles, clientes y proveedores.

Si ahondamos en los métodos, son 5 funciones por cada agente: add, delete, search, searchby y update. El primero consiste en añadir un elemento a la base de datos, haciendo uso de inquirer:

```
async addFurniture() {
    const furnitureData = await inquirer.prompt([
      { type: "input", name: "name", message: "Enter furniture name:" },
      {
        type: "input",
        name: "description",
        message: "Enter furniture description:",
      },
      { type: "input", name: "material", message: "Enter furniture material:" },
      {
        type: "input",
        name: "dimensions",
        message: "Enter furniture dimensions:",
      },
      { type: "number", name: "price", message: "Enter furniture price:" },
    ]);
    const furniture: Furniture = {
      id: Date.now().toString(),
      ...furnitureData,
    };
    this.furniture.push(furniture);
    this.db
      .update("furniture", (existingFurniture: Furniture[]) => {
        return [...existingFurniture, furniture];
      })
      .write();
  }
```

El siguiente seía ahora el de eliminar datos de esa db, usando también inquirer.

```
async deleteFurniture() {
  const furnitureId = await inquirer.prompt({
    type: "input",
    name: "id",
    message: "Enter furniture ID to delete:",
  });
  this.db
    .update("furniture", (existingFurniture: Furniture[]) => {
      return existingFurniture.filter((element) => {
        return element.id !== furnitureId.id;
      });
    })
    .write();
}
```

A continuación, el método search, que usa inquirer para pasarle el filtro de búsqueda por consola.

```
async searchFurniture() {
    const searchCriteria = await inquirer.prompt([
      {
        type: "list",
        name: "filter",
        message: "Choose search filter:",
        choices: ["name", "description"],
      },
      { type: "input", name: "value", message: "Enter search value:" },
    ]);
    const filteredFurniture = this.searchFurnitureBy(
      searchCriteria.filter,
      searchCriteria.value,
    );
    console.log(filteredFurniture);
  }
```

El siguiente es el de searchby, que realiza ya la búsqueda con los valores obtenidos en la función anterior.

```
private searchFurnitureBy(filter: string, value: string) {
  const regex = new RegExp(value, "i");
  return this.db
    .get("furniture")
    .value()
    .filter((furniture) => {
      return regex.test(furniture.name) || regex.test(furniture.description);
    });
}
```

Esos tres métodos serán iguales prácticamente para nuestros 3 agentes del sistema de información.

## Conclusiones

## Bibliografía

- Essential TypeScript: From Beginner to Pro
