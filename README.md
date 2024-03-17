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

Siguiendo con las interfaces tenemos Operations, que define las operaciones que deben implementarse para muebles, clientes y proveedores:

```
export interface Operations {
  add(info: object);
  delete(id: string);
  update(newData: object);
  search(value: string);
  searchBy(filter: string, value: string);
}
```

Por último, las dos de transacciones, una para cuando sea una compra y otra para cuando sea una venta, de este modo diferenciamos las acciones.

```
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
```

Con esto terminaríamos las interfaces que hemos empleado, ahora nos centraremos en cómo gestionaremos nuestro sistema de información.

## Clases de operaciones

Dejando atrás las interfaces, ahora aparecen las distintas clases de nuestro programa. Hemos desarrollado 3 clases que contienen las operaciones con muebles, clientes y proveedores, además de la clase Stock, que comentaremos más adelante. Explicaremos una de las operaciones, la de los muebles, puesto que para clientes y proveedores son prácticamente iguales.

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

Las operaciones a realizar por los distintos métodos serían la de añadir un elemento a la base de datos, eliminar uno, buscar un producto utilizando inquirer para almacenar el filtro, buscar una vez conocido ese filtro, actualizar los datos de un producto y los getters del contador del número de muebles y de los muebles que hay en sí.

Nos hemos centrado en la clase `FurnitureOperations`, pero las dos restantes `SupplierOperations`y `CustomerOperations`, implementan la interfaz `Operation` de manera muy similar.

## Clase Stock

Siguiendo con nuestro diseño de clases, ahora comentaremos los aspectos más importantes de la clase Stock, encargada de manejar la cantidad de muebles que hay disponibles y las transacciones.

Lo primero será crear una instancia de SaleTransaction y de Purchasetransaction, que utilizaremos después en nuestros métodos. Definimos también los constructores de estas instancias, haciendo uso de lowdb.

Entrando ya en las funciones, la primera sería la que registra una venta, en la cual se comprueba si ese mueble está disponible y si es así se disminuye su número de stock.

````
async registerSale(customer: Customer, furnitureNames: string[]) {
    const missingFurniture: string[] = [];
    const soldFurniture: Furniture[] = [];
    let totalPrice = 0;

    const allFurniture = this.db.get("furniture").value();

    for (const furnitureName of furnitureNames) {
      const furniture = allFurniture.find((f) => f.name === furnitureName);
      if (furniture && furniture.quantity > 0) {
        soldFurniture.push(furniture);
        totalPrice += furniture.price;

        furniture.quantity -= 1;
      } else {
        missingFurniture.push(furnitureName);
      }
    }

    if (missingFurniture.length > 0) {
      console.log(`The following furniture is not available: ${missingFurniture.join(", ")}`);
      return;
    }
    ```

    A continuación, creamos un objeto de transacción de venta y actualizamos los datos de la db.

    ```
     const saleTransaction = {
      date: new Date(),
      customer,
      furniture: soldFurniture,
      price: totalPrice,
    };

    this.db.update('salesTransactions', (transactions: any[]) => {
      if (!transactions) {
        transactions = [];
      }
      transactions.push(saleTransaction);
      return transactions;
    }).write();
  }
````

Pasamos ahora a la parte de los proveedores. Primero creamos un método para registrar la compra a un proveedor, haciendo uso de inquirer.

```
async registerPurchase(supplier: Supplier) {
    const purchasedFurnitureData = await inquirer.prompt([
        { type: "input", name: "name", message: "Enter furniture name:" },
        { type: "number", name: "quantity", message: "Enter quantity purchased:" },
        { type: "number", name: "price", message: "Enter purchase price per unit:" },
    ]);
}
```

Obtenida la información por consola, creamos un objeto Furniture con los datos, lo añadimos a la base de datos y creamos la nueva transacción, añadiéndola también a la db.

```
const purchasedFurniture: Furniture = {
       id: Date.now().toString(),
       ...purchasedFurnitureData,
   };

   const furnitureData = this.db.get("furniture").value();
   furnitureData.push(purchasedFurniture);
   this.db.set("furniture", furnitureData).write();

   const purchaseTransaction = {
       date: new Date(),
       supplier,
       furniture: purchasedFurniture,
       totalPrice: purchasedFurniture.quantity * purchasedFurniture.price,
   };

   this.db.update("purchaseTransactions", (transactions: any[]) => {
       if (!transactions) {
           transactions = [];
       }
       transactions.push(purchaseTransaction);
       return transactions;
   }).write();
```

Pasamos ahora al método que nos retorna un historial con todas las transacciones, obteniendo los datos de la db.

```
async getTransactionHistory() {
    const salesTransactions = this.db.get('salesTransactions').value();
    const purchaseTransactions = this.db.get('purchaseTransactions').value();
    return {
      sales: salesTransactions,
      purchases: purchaseTransactions
    };
  }
```

Por último, comentar la parte de los informes que se nos especificaba en el guión de la práctica. Definimos dos funciones, la primera que nos da el stock de un mueble a partir de su nombre. La segunda lo que hace es ordenar de manera descendente las transacciones teniendo en cuenta su importe total.

```
async getAvailableStockByFurnitureName(name: string) {
    const furniture = this.db.get("furniture").value().find(f => f.name === name && f.quantity > 0);
    return furniture;
}


  async getTransactionWithHighestAmount() {
    const salesTransactions = await this.getTransactionHistory();

    if (salesTransactions && salesTransactions.sales && salesTransactions.sales.length > 0) {
      const sortedTransactions = salesTransactions.sales.sort((a, b) => b.price - a.price);
      return sortedTransactions[0];
    }
  }
```

Con esto damos por finalizada la explicación con respecto a las interfaces y a las clases de nuestro programa, solo quedaría ver nuestro programa principal, que hace uso de lo comentado anteriormente.

## Main

En nuestro programa principal es donde se ha desarrollado el "menú" que vemos por consola cuando ejecutamos el programa. En primer lugar instanciamos la base de datos, además de la clase Stock y las operaciones.

Las distintas opciones de nuestro menú, las hemos manejado con inquirer haciendo uso de un switch, entrando en el menú de operaciones de cada agente cuando el usuario lo especifique por consola.

```
switch (category.category) {
      case "Furniture":
        // eslint-disable-next-line no-case-declarations
        await furnitureMenu(myFurnitureOperations);
        break;
      case "Customer":
        await customerMenu(myCustomerOperations);
        break;
      case "Supplier":
        await supplierMenu(mySupplierOperations);
        break;
      case "Transactions":
        await transactionMenu(stock, myCustomerOperations, mySupplierOperations);
        break;
      case "Reports":
        await reportMenu(stock);
        break;
      case "Exit":
        process.exit(0);
        break;
```

Esos submenús son también tratados con switch, una vez elegido a qué subcategoría quiere acceder el usuario. Vamos a comentar uno, porque el resto siguen la misma estructura.

```
async function furnitureMenu(myOperations: FurnitureOperations) {
 const operation = await inquirer.prompt({
   type: "list",
   name: "operation",
   message: "Choose operation for Furniture:",
   choices: [
     "Add Furniture",
     "Delete Furniture",
     "Update Furniture",
     "Search Furniture",
     "Stock"
   ],
 });
 switch (operation.operation) {
   case "Add Furniture":
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
       { type: "number", name: "quantity", message: "Enter quantity available:" },
     ]);
     furnitureData.id = Date.now().toString();
     await myOperations.add(furnitureData);
     break;

   case "Delete Furniture":
     const furnitureToDelete = await inquirer.prompt({
       type: "input",
       name: "id",
       message: "Enter furniture ID to delete:",
     });
     await myOperations.delete(furnitureToDelete.id);
     break;

   case "Update Furniture":
     const furnitureToUpdate = await inquirer.prompt({
       type: "input",
       name: "id",
       message: "Enter furniture ID to update:",
     });
     const newFurnitureData = await inquirer.prompt([
       { type: "input", name: "name", message: "Enter new furniture name:" },
       {
         type: "input",
         name: "description",
         message: "Enter new furniture description:",
       },
       {
         type: "input",
         name: "material",
         message: "Enter new furniture material:",
       },
       {
         type: "input",
         name: "dimensions",
         message: "Enter new furniture dimensions:",
       },
       { type: "number", name: "price", message: "Enter new furniture price:" },
       { type: "number", name: "quantity", message: "Enter quantity available:" },
     ]);
     newFurnitureData.id = furnitureToUpdate.id;
     await myOperations.update(newFurnitureData);
     break;
   case "Search Furniture":
     const searchFurnitureCriteria = await inquirer.prompt([
       {
         type: "list",
         name: "filter",
         message: "Choose search filter:",
         choices: ["name", "description"],
       },
       { type: "input", name: "value", message: "Enter search value:" },
     ]);
     await myOperations.search(searchFurnitureCriteria.value);
     break;
   case "Stock":
     console.log("Total furniture count:", myOperations.getCount());
     break;
 }
}
```

Cómo vemos en la implementación, tenemos un switch en el submenú donde cada case son las distintas operaciones que hemos definido en las clase ya comentadas. Depende de lo que el usuario quiera realizar puede escoger entre una opción u otra. El que es un poco diferente es el que realiza los informes, por lo tanto merece también ser comentado.

```
 switch (reportType.reportType) {
    case "Available Stock by Furniture Name":
      await generateAvailableStockByFurnitureNameReport(stock);
      break;
    case "Transaction with Highest Amount":{
      const transactionWithHighestAmount = await stock.getTransactionWithHighestAmount();
      console.log("Transaction with Highest Amount:", transactionWithHighestAmount);
      break;
    }
  }
}

async function generateAvailableStockByFurnitureNameReport(stock: Stock) {
  const name = await inquirer.prompt({
    type: "input",
    name: "name",
    message: "Enter furniture name:",
  });
  const availableStock = await stock.getAvailableStockByFurnitureName(name.name);
  console.log("Available stock by furniture name:", availableStock);
}
```

En este vemos como solo se puede elegir si el informe lo quieres con respecto a si el mueble está disponible o a la transacción de mayor importe.

Este sería todo el código de nuestro programa, acabando con un `main()` para que se ejecute nuestro programa principal.

## Conclusiones

Finalizada la primera práctica grupal de la asignatura podemos ya hacer instrospección en lo que hemos estado haciendo ya en estas 8 semanas. La práctica no es más que un reflejo que del trabajo que venimos realizando en las sesiones de teoría y práctica.

Hemos aprendido las nociones básicas del lenguaje, cómo trabajar con diseño orientado a objetos: interfaces, clases... Además de herramientas que nos facilita el lenguaje typescript. También con el uso de las pruebas empleando mocha y chai, además de Typedoc para la documentación, nos ha servido para simplificar nuestra vida como programadores a partir de ahora.

Después, si nos enfocamos más específicamente en esta práctica grupal, destacamos el uso de herramientas como inquirer y lowdb, desconocidas por nostros hasta entonces. Con inquirer nos acercamos más a un enfoque de empresa, de interacción con el usuario, que es lo que un cliente busca en el día de mañana, programas que tengan una interfaz cómoda y sencilla para el usuario final, e inquirer facilita esto. Lowdb nos ha ayudado con el manejo de nuestra base de datos con los distintos clientes, muebles y proveedores y nos ha resultado una herramienta cómoda y fácil de usar.

En resumen, hemos obtenido conceptos y herramientas que nos serán de gran utilidad en el resto de nuestra carrera y vida profesional.

## Bibliografía

- Essential TypeScript: From Beginner to Pro
- https://www.npmjs.com/package/lowdb
- https://github.com/SBoudrias/Inquirer.js
