import { productos } from './productos.js';

const container = document.getElementById('productos-container');
const categoryElements = document.querySelectorAll('.category');
let activeCategory = null;

// Formato del card y ver prod
function showProducts(categoryId = null) {
    container.classList.add('fade-out');

    setTimeout(() => {
        container.innerHTML = '';
        const filteredProducts = categoryId
            ? productos.filter(producto => producto.category === categoryId)
            : productos;

        filteredProducts.forEach((producto) => {
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

            const minusButton = document.createElement('button');
            minusButton.classList.add('quantity-btn');
            minusButton.textContent = '-';
            const quantityInput = document.createElement('input');
            quantityInput.type = 'text';
            quantityInput.classList.add('quantity-input');
            quantityInput.value = 1;
            quantityInput.readOnly = true;
            const plusButton = document.createElement('button');
            plusButton.classList.add('quantity-btn');
            plusButton.textContent = '+';

            // Eventos para botones de cantidad
            minusButton.onclick = () => updateQuantity(-1, quantityInput);
            plusButton.onclick = () => updateQuantity(1, quantityInput);

            // Grafica en el dom
            quantityContainer.appendChild(minusButton);
            quantityContainer.appendChild(quantityInput);
            quantityContainer.appendChild(plusButton);
            productDiv.appendChild(quantityContainer);

            // Contenedor botones compra/carrito
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            const buyNowButton = document.createElement('button');
            buyNowButton.classList.add('card-button', 'buy-now');
            buyNowButton.textContent = 'Comprar ahora';

            buyNowButton.onclick = () => buyNow(producto, quantityInput); // esto

            const addToCartButton = document.createElement('button');
            addToCartButton.classList.add('card-button', 'cart-add');

            const cartIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            cartIcon.setAttribute("width", "30");
            cartIcon.setAttribute("height", "30");
            cartIcon.setAttribute("viewBox", "0 0 24 24");
            cartIcon.setAttribute("fill", "currentColor");
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z");
            cartIcon.appendChild(path);
            addToCartButton.appendChild(cartIcon);

            addToCartButton.onclick = () => addToCart(producto, quantityInput); //esto

            buttonContainer.appendChild(buyNowButton);
            buttonContainer.appendChild(addToCartButton);
            productDiv.appendChild(buttonContainer);

            container.appendChild(productDiv);

            // animacion en el dom
            setTimeout(() => productDiv.classList.add('fade-in'), 100);

        });

        container.classList.remove('fade-out');
    }, 300);
}

showProducts();

// Seleccionar categoria
function handleCategoryClick(category) {
    const categoryId = parseInt(category.getAttribute('data-category'), 10);
    if (activeCategory === categoryId) {
        activeCategory = null;
        category.classList.remove('active');
        showProducts();
    } else {
        activeCategory = categoryId;
        categoryElements.forEach(cat => cat.classList.remove('active'));
        category.classList.add('active');
        showProducts(categoryId);
    }
}

categoryElements.forEach(category => {
    category.addEventListener('click', () => handleCategoryClick(category));
});

// sumar cantidad de producto
function updateQuantity(change, inputElement) {
    let currentQuantity = parseInt(inputElement.value, 10);
    currentQuantity = Math.max(1, currentQuantity + change);
    inputElement.value = currentQuantity;
}

// Objeto para almacenar los productos en el carrito
const cart = JSON.parse(localStorage.getItem('cart')) || {};  // Recuperar carrito si existe

// Función Comprar Ahora
function buyNow(producto, quantityInput) {
    const cantidad = parseInt(quantityInput.value, 10);

    // Verifica si el producto ya está en el carrito
    if (!cart[producto.id]) {
        cart[producto.id] = { ...producto, cantidad: 0 };
    }
    cart[producto.id].cantidad += cantidad;  // Suma la cantidad seleccionada

    // Guarda el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Redirige a la página del carrito
    window.location.href = 'carrito.html';
}

// Función Añadir al Carrito
function addToCart(producto, quantityInput) {
    const cantidad = parseInt(quantityInput.value, 10);

    if (!cart[producto.id]) {
        cart[producto.id] = { ...producto, cantidad: 0 };
    }
    cart[producto.id].cantidad += cantidad;

    // Guarda el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${producto.nombre} añadido al carrito.`);
}