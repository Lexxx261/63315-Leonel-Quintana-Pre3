import { productos } from './productos.js';

// Variables globales
let carrito = [];

// Func menu
function mostrarMenu() {
    let opcion;
    do {
        opcion = prompt(
            "Seleccione una opción:\n" +
            "1. Listar productos\n" +
            "2. Buscar producto\n" +
            "3. Filtrar por categoría\n" +
            "4. Comprar productos\n" +
            "5. Salir"
        );

        switch (opcion) {
            case "1":
                listarProductos();
                break;
            case "2":
                buscarProducto();
                break;
            case "3":
                filtrarPorCategoria();
                break;
            case "4":
                comprarProductos();
                break;
            case "5":
                alert("Gracias por tu visita.");
                break;
            default:
                alert("Seleccione una opción válida.");
                break;
        }
    } while (opcion !== "5");
}

// normalizador de texto
function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Listado de prod
function listarProductos() {
    let mensaje = "Listado de Productos:\n";
    productos.forEach(prod => {
        mensaje += `ID: ${prod.id} - ${prod.nombre} - Precio: $${prod.precio} - Categoría: ${prod.categoria}\n`;
    });
    alert(mensaje);
}

// Busqueda de prod por string
function buscarProducto() {
    let termino = prompt("Buscar producto:");
    let terminoNormalizado = normalizarTexto(termino);

    let resultados = productos.filter(prod =>
        normalizarTexto(prod.nombre).includes(terminoNormalizado)
    );

    if (resultados.length > 0) {
        let mensaje = "Resultado:\n";
        resultados.forEach(prod => {
            mensaje += `ID: ${prod.id} - ${prod.nombre} - Precio: $${prod.precio}\n`;
        });
        alert(mensaje);
    } else {
        alert("Producto no encontrado.");
    }
}

// funcion filtro
function filtrarPorCategoria() {
    let opcion = prompt(
        "Seleccione una categoría para filtrar:\n" +
        "1. Box´s\n" +
        "2. Tortas\n" +
        "3. Desayunos\n" +
        "4. Eventos\n" +
        "5. Volver"
    );

    let categoria;

    switch (opcion) {
        case "1":
            categoria = "Box´s";
            break;
        case "2":
            categoria = "Tortas";
            break;
        case "3":
            categoria = "Desayunos";
            break;
        case "4":
            categoria = "Eventos";
            break;
        case "5":
            return; //vuelve hacia el menu principal
        default:
            alert("Seleccione una opción correcta.");
            return;
    }

    // Filtro por categoria
    let resultados = productos.filter(prod => prod.categoria === categoria);

    if (resultados.length > 0) {
        let mensaje = `Productos de "${categoria}":\n`;
        resultados.forEach(prod => {
            mensaje += `ID: ${prod.id} - ${prod.nombre} - Precio: $${prod.precio}\n`;
        });
        alert(mensaje);
    } else {
        alert(`No se encontraron productos en la categoría "${categoria}".`);
    }
}

// Compra de productos.
function comprarProductos() {
    let seleccion;
    do {
        let mensaje = "Listado de Productos:\n";
        productos.forEach(prod => {
            mensaje += `ID: ${prod.id} - ${prod.nombre} - Precio: $${prod.precio} - Categoría: ${prod.categoria}\n`;
        });
        mensaje += "\nIngrese el ID del producto que desea agregar al carrito o 'F' para finalizar la compra:";

        seleccion = prompt(mensaje);

        if (seleccion.toLowerCase() === 'f') {
            finalizarCompra();
            break;
        }

        const producto = productos.find(prod => prod.id === parseInt(seleccion));
        if (producto) {
            let cantidad = parseInt(prompt(`Ingrese la cantidad de '${producto.nombre}' que desea agregar al carrito:`));

            if (!isNaN(cantidad) && cantidad > 0) {
                carrito.push({ ...producto, cantidad: cantidad });
                alert(`Se agregaron ${cantidad} unidades de '${producto.nombre}' al carrito.`);
            } else {
                alert("Cantidad no válida. Intente nuevamente.");
            }
        } else {
            alert("Producto no encontrado. Intente con otro ID.");
        }
    } while (true);
}

// Funcion de compra
function finalizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío. No se ha realizado ninguna compra.");
        return;
    }

    // Total del carrito
    let total = 0;
    let mensaje = "Resumen de compra:\n";
    carrito.forEach(prod => {
        let subtotal = prod.precio * prod.cantidad;
        mensaje += `- ${prod.nombre} (x${prod.cantidad}) - Precio: $${prod.precio} - Subtotal: $${subtotal}\n`;
        total += subtotal;
    });
    mensaje += `\nTotal a pagar: $${total}`;
    alert(mensaje);

    carrito = [];
}

mostrarMenu();