document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const totalPriceElement = document.getElementById('total-price');

    // Leer carrito de localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Renderizar productos en el carrito
    function renderCart() {
        cartContainer.innerHTML = ''; // Limpia el contenedor

        let total = 0;

        Object.values(cart).forEach(producto => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('cart-item');

            const name = document.createElement('h3');
            name.textContent = producto.nombre;
            productDiv.appendChild(name);

            const price = document.createElement('p');
            price.textContent = `Precio: $${producto.precio}`;
            productDiv.appendChild(price);

            const quantity = document.createElement('p');
            quantity.textContent = `Cantidad: ${producto.cantidad}`;
            productDiv.appendChild(quantity);

            const subtotal = producto.precio * producto.cantidad;
            total += subtotal;

            const subtotalElement = document.createElement('p');
            subtotalElement.textContent = `Subtotal: $${subtotal}`;
            productDiv.appendChild(subtotalElement);

            cartContainer.appendChild(productDiv);
        });

        totalPriceElement.textContent = `Total: $${total}`;
    }

    // Inicializar el carrito
    renderCart();

    // Botón de finalizar compra
    document.getElementById('checkout-button').addEventListener('click', () => {
        alert('Gracias por tu compra!');
        localStorage.removeItem('cart'); // Limpia el carrito después de la compra
        window.location.href = '.././index.html'; // Redirige al inicio
    });
});
