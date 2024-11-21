// Genera una tarjeta de producto para cada objeto en el array `productos`
productos.forEach((producto) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('card');

    // Imagen del producto
    const img = document.createElement('img');
    img.src = `../img/productos/${producto.imagen}`;
    img.alt = `${producto.nombre}`;
    productDiv.appendChild(img);

    // Nombre del producto
    const name = document.createElement('h3');
    name.textContent = producto.nombre;
    productDiv.appendChild(name);

    // Precio del producto
    const price = document.createElement('p');
    price.textContent = `$${producto.precio}`;
    productDiv.appendChild(price);

    // Contenedor de cantidad
    const quantityContainer = document.createElement('div');
    quantityContainer.classList.add('quantity-container');

    // Boton -
    const minusButton = document.createElement('button');
    minusButton.classList.add('quantity-btn');
    minusButton.textContent = '-';
    minusButton.onclick = () => updateQuantity(-1, quantityInput);

    // Cantidad
    const quantityInput = document.createElement('input');
    quantityInput.type = 'text';
    quantityInput.classList.add('quantity-input');
    quantityInput.value = 1;
    quantityInput.readOnly = true;

    // Boton +
    const plusButton = document.createElement('button');
    plusButton.classList.add('quantity-btn');
    plusButton.textContent = '+';
    plusButton.onclick = () => updateQuantity(1, quantityInput);

    quantityContainer.appendChild(minusButton);
    quantityContainer.appendChild(quantityInput);
    quantityContainer.appendChild(plusButton);
    productDiv.appendChild(quantityContainer);

    // Contenedor botones
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    // Boton Comprar Ahora
    const buyNowButton = document.createElement('button');
    buyNowButton.classList.add('card-button', 'buy-now');
    buyNowButton.textContent = 'Comprar ahora';
    buyNowButton.onclick = () => buyNow(producto, quantityInput); // Pasamos `producto` y `quantityInput`
    buttonContainer.appendChild(buyNowButton);

    // Boton de Añadir al Carrito
    const addToCartButton = document.createElement('button');
    addToCartButton.classList.add('card-button', 'cart-add');
    addToCartButton.onclick = () => addToCart(producto, quantityInput); // Pasamos `producto` y `quantityInput`

    // Creación del icono SVG
    const cartIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    cartIcon.setAttribute("width", "30");
    cartIcon.setAttribute("height", "30");
    cartIcon.setAttribute("viewBox", "0 0 24 24");
    cartIcon.setAttribute("fill", "currentColor");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z");

    cartIcon.appendChild(path);
    addToCartButton.appendChild(cartIcon);
    buttonContainer.appendChild(addToCartButton);

    productDiv.appendChild(buttonContainer);
    container.appendChild(productDiv);
});


// Función para sumar cantidad
function updateQuantity(change, inputElement) {
    let currentQuantity = parseInt(inputElement.value, 10);
    currentQuantity = Math.max(1, currentQuantity + change);
    inputElement.value = currentQuantity;
}

// Función de comprar
function buyNow(producto, quantityInput) {
    const cantidad = parseInt(quantityInput.value, 10);
    if (isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, selecciona una cantidad válida.');
        return;
    }

    const total = producto.precio * cantidad;

    alert(`Compraste ${producto.nombre} por $${producto.precio} cada uno. Total: $${total}`);
}

function addToCart(producto, quantityInput) {
    const cantidad = parseInt(quantityInput.value, 10);
    if (isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, selecciona una cantidad válida.');
        return;
    }

    const total = producto.precio * cantidad;

    alert(`Añadido ${producto.nombre} al carrito. Total: $${total}`);
}
