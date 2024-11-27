document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const couponInput = document.getElementById('coupon-code');
    const applyCouponButton = document.getElementById('apply-coupon-button');
    const couponMessage = document.getElementById('coupon-message');

    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let appliedDiscount = 0;

    const validCoupons = {
        'DESC10': 10,   // 10% de descuento
        'DESC20': 20,   // 20% de descuento
        'FREESHIP': 0   // Otro tipo de lógica para envío gratuito, por ejemplo
    };
    // Función para renderizar el carrito
    function renderCart() {
        cartContainer.innerHTML = ''; // Limpia el contenedor

        if (Object.keys(cart).length === 0) {
            cartContainer.innerHTML = '<p>El carrito está vacío.</p>';
            totalPriceElement.textContent = 'Total: $0';
            return;
        }

        let total = 0;

        Object.values(cart).forEach(producto => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('cart-item');

            productDiv.innerHTML = `
                <h3>${producto.nombre}</h3>
                <p>Precio: $${producto.precio}</p>
                <input type="number" min="1" value="${producto.cantidad}" class="quantity-input" data-id="${producto.id}">
                <button class="remove-button" data-id="${producto.id}">Eliminar</button>
                <p>Subtotal: $${producto.precio * producto.cantidad}</p>
            `;

            cartContainer.appendChild(productDiv);
            total += producto.precio * producto.cantidad;
        });

        // DESCUENTO
        if (appliedDiscount > 0) {
            total = total - (total * appliedDiscount / 100);
            couponMessage.textContent = `Cupón aplicado: ${appliedDiscount}% de descuento`;
        } else {
            couponMessage.textContent = '';
        }

        totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
    }

     // APLICAR CUPON
     applyCouponButton.addEventListener('click', () => {
        const couponCode = couponInput.value.trim().toUpperCase();
        if (validCoupons[couponCode] !== undefined) {
            appliedDiscount = validCoupons[couponCode];
            renderCart();  // Actualiza la vista del carrito con el descuento
            couponMessage.style.color = 'green';
            couponMessage.textContent = `Cupón ${couponCode} aplicado correctamente.`;
        } else {
            appliedDiscount = 0;  // Restablece el descuento si el cupón no es válido
            renderCart();
            couponMessage.style.color = 'red';
            couponMessage.textContent = 'Cupón inválido o expirado.';
        }
    });
    // Event delegation para eliminar productos y actualizar cantidades
    cartContainer.addEventListener('click', (e) => {
        // Manejar la eliminación de productos
        if (e.target.classList.contains('remove-button')) {
            const productId = e.target.getAttribute('data-id');
            if (confirm(`¿Seguro que deseas eliminar ${cart[productId].nombre} del carrito?`)) {
                delete cart[productId];
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
        }
    });

    cartContainer.addEventListener('input', (e) => {
        // Manejar la actualización de cantidades
        if (e.target.classList.contains('quantity-input')) {
            const productId = e.target.getAttribute('data-id');
            const newQuantity = parseInt(e.target.value, 10);
            if (newQuantity > 0) {
                cart[productId].cantidad = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            } else {
                alert('La cantidad no puede ser menor que 1.');
                e.target.value = 1;
            }
        }
    });

    // Evento para vaciar todo el carrito
    document.getElementById('clear-cart-button').addEventListener('click', () => {
        if (confirm('¿Seguro que deseas vaciar el carrito?')) {
            cart = {};
            localStorage.removeItem('cart');
            renderCart();
        }
    });

    // Evento para finalizar la compra
    checkoutButton.addEventListener('click', () => {
        if (Object.keys(cart).length === 0) {
            alert('El carrito está vacío. Agrega productos antes de finalizar la compra.');
            return;
        }
        alert('¡Gracias por tu compra!');
        localStorage.removeItem('cart'); // Limpia el carrito después de la compra
        window.location.href = '../index.html'; // Redirige al inicio
    });

    // Renderiza el carrito inicial
    renderCart();
});


