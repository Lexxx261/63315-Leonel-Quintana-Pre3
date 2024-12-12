import { updateCartCount } from './utilidades.js';

const container = document.getElementById('productos-container');
const categoryElements = document.querySelectorAll('.category');
let activeCategory = null;
let productos = [];

// Cargar productos desde el archivo JSON
fetch('../data/products.json')
    .then(response => response.json())
    .then(data => {
        productos = data;
        showProducts();
    })
    .catch(error => console.error('Error al cargar productos:', error));

// Mostrar productos (función existente)
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

            // Crear un slider de imágenes para cada producto
            const sliderGallery = document.createElement('div');
            sliderGallery.classList.add('slider-gallery-content');

            // Crear botones de navegación (flechas)
            const prevButton = document.createElement('button');
            prevButton.classList.add('slider-button', 'slider-button-prev');
            prevButton.textContent = '❮';

            const nextButton = document.createElement('button');
            nextButton.classList.add('slider-button', 'slider-button-next');
            nextButton.textContent = '❯';

            if (producto.imagen && Array.isArray(producto.imagen) && producto.imagen.length > 0) {
                producto.imagen.forEach((imagen, index) => {
                    const img = document.createElement('img');
                    img.src = `../img/productos/${imagen}`;
                    img.alt = `${producto.nombre} - ${index + 1}`;
                    img.classList.add('slider-img-gallery');
                    if (index === 0) img.classList.add('active');
                    sliderGallery.appendChild(img);
                });

                // Agregar botones de navegación al slider
                sliderGallery.appendChild(prevButton);
                sliderGallery.appendChild(nextButton);

                productDiv.appendChild(sliderGallery);

                // Funcionalidad para cambiar imágenes con las flechas
                let currentIndex = 0;
                const images = sliderGallery.querySelectorAll('.slider-img-gallery');

                function showImage(index) {
                    images[currentIndex].classList.remove('active');
                    currentIndex = (index + images.length) % images.length; // Asegura que el índice sea circular
                    images[currentIndex].classList.add('active');
                }

                prevButton.addEventListener('click', () => showImage(currentIndex - 1));
                nextButton.addEventListener('click', () => showImage(currentIndex + 1));
            } else {
                // Si no hay múltiples imágenes, mostrar una imagen por defecto
                const img = document.createElement('img');
                img.src = `../img/productos/${producto.imagen}`;
                img.alt = `${producto.nombre}`;
                productDiv.appendChild(img);
            }


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

            addToCartButton.onclick = () => addToCart(producto, quantityInput);

            addToCartButton.addEventListener('mouseenter', () => showTooltip(addToCartButton, 'Agregar al carrito'));
            addToCartButton.addEventListener('mouseleave', () => hideTooltip(addToCartButton));

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

// Función para manejar la selección de categorías
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

// Manejar clic en categorías
categoryElements.forEach(category => {
    category.addEventListener('click', () => handleCategoryClick(category));
});

// sumar cantidad de producto
function updateQuantity(change, inputElement) {
    let currentQuantity = parseInt(inputElement.value, 10);
    currentQuantity = Math.max(1, currentQuantity + change);
    inputElement.value = currentQuantity;
}

// Función Comprar Ahora
function buyNow(producto, quantityInput) {
    const cantidad = parseInt(quantityInput.value, 10);
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    if (!cart[producto.id]) {
        cart[producto.id] = { ...producto, cantidad: 0 };
    }

    cart[producto.id].cantidad += cantidad;

    localStorage.setItem('cart', JSON.stringify(cart));

    window.location.href = 'carrito.html';
}

function showNotification(producto, cantidad) {
    const notification = document.createElement('div');
    notification.classList.add('floating-notification');

    const texto = document.createElement('span');
    texto.innerHTML = `Se agregó <strong>${cantidad}</strong> de <strong>${producto.nombre}</strong> al carrito`;

    notification.appendChild(texto);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Modificar la función addToCart para incluir la notificación
function addToCart(producto, quantityInput) {
    const cantidad = parseInt(quantityInput.value, 10);
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    if (!cart[producto.id]) {
        cart[producto.id] = { ...producto, cantidad: 0 };
    }

    cart[producto.id].cantidad += cantidad;

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();

    // Mostrar notificación flotante
    showNotification(producto, cantidad);
}

function showTooltip(button, message) {
    if (!button.querySelector('.tooltip')) {
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip');
        tooltip.textContent = message;
        button.style.position = 'relative';
        button.appendChild(tooltip);

        // Forzar el reflow para que la animación funcione
        requestAnimationFrame(() => {
            tooltip.classList.add('show');
        });
    }
}

function hideTooltip(button) {
    const tooltip = button.querySelector('.tooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
        setTimeout(() => {
            tooltip.remove();
        }, 300);
    }
}
