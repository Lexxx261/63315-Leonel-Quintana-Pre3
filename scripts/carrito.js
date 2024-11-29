document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const couponInput = document.getElementById('coupon-code');
    const applyCouponButton = document.getElementById('apply-coupon-button');
    const couponMessage = document.getElementById('coupon-message');
    const clearCart = document.getElementById('clear-cart-button');

    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let appliedDiscount = 0;

    const validCoupons = {
        'DESC10': 10,   // 10% de descuento
        'DESC20': 20,   // 20% de descuento
    };

    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (!cartCountElement) return;
        
        let totalQuantity = 0;
    
        Object.values(cart).forEach(producto => {
            totalQuantity += producto.cantidad ? parseInt(producto.cantidad, 10) : 0;
        });
    
        cartCountElement.textContent = totalQuantity;
    }
    
    // Función para renderizar el carrito
    function renderCart() {
        cartContainer.innerHTML = '';

        if (Object.keys(cart).length === 0) {
            cartContainer.innerHTML = '<p class="cart-none">El carrito está vacío.</p>';
            totalPriceElement.style.display = 'none';
            checkoutButton.style.display = 'none';
            applyCouponButton.style.display = 'none';
            couponInput.style.display = 'none';
            clearCart.style.display = 'none';
            return;
        }

        let total = 0;

        Object.values(cart).forEach(producto => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('cart-item');

            // Crear imagen del producto
            const img = document.createElement('img');
            img.src = `../img/productos/${producto.imagen}`;
            img.alt = producto.nombre;
            img.classList.add('cart-item-img');

            // Nombre del producto
            const name = document.createElement('h3');
            name.textContent = producto.nombre;
            name.classList.add('cart-item-name');

            // Controles de cantidad
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = 1;
            quantityInput.value = producto.cantidad;
            quantityInput.classList.add('quantity-input');
            quantityInput.dataset.id = producto.id;

            // Precio
            const price = document.createElement('p');
            price.textContent = `$${producto.precio}`;
            price.classList.add('cart-item-price');

            // Botón de eliminar
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Eliminar';
            removeButton.classList.add('remove-button');
            removeButton.dataset.id = producto.id;

            // item
            productDiv.appendChild(img);
            productDiv.appendChild(name);
            productDiv.appendChild(quantityInput);
            productDiv.appendChild(price);
            productDiv.appendChild(removeButton);

            cartContainer.appendChild(productDiv);

            total += producto.precio * producto.cantidad;
            
        });
        
        // Aplicar descuento si existe
        if (appliedDiscount > 0) {
            total = total - (total * appliedDiscount / 100);
            couponMessage.textContent = `Cupón aplicado: ${appliedDiscount}% de descuento`;
        } else {
            couponMessage.textContent = '';
        }

        totalPriceElement.textContent = `Importe Total: $${total.toFixed(0)}`;
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
        if (e.target.classList.contains('remove-button')) {
            const productId = e.target.getAttribute('data-id');
            if (confirm(`¿Seguro que deseas eliminar ${cart[productId].nombre} del carrito?`)) {
                delete cart[productId];
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            }
            updateCartCount(); 
        }
    });
    
    cartContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const productId = e.target.getAttribute('data-id');
            const newQuantity = parseInt(e.target.value, 10);
            if (newQuantity > 0) {
                cart[productId].cantidad = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart(); // Actualiza la vista del carrito

            } else {
                alert('La cantidad no puede ser menor que 1.');
                e.target.value = 1;
            }
            updateCartCount();
        }
    });
    
    clearCart.addEventListener('click', () => {
        if (confirm('¿Seguro que deseas vaciar el carrito?')) {
            cart = {};
            localStorage.removeItem('cart');
            renderCart(); // Actualiza la vista del carrito
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
    updateCartCount();
    renderCart();
});