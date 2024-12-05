import { updateCartCount } from './utilidades.js';

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
            renderCart();
            couponMessage.style.color = 'green';
            couponMessage.textContent = `Cupón ${couponCode} aplicado correctamente.`;
        } else {
            appliedDiscount = 0;
            renderCart();
            couponMessage.style.color = 'red';
            couponMessage.textContent = 'Cupón inválido o expirado.';
        }
    });

    // Eliminar producto
    const removeProductModal = document.getElementById('remove-product-modal');
    const confirmRemoveButton = document.getElementById('confirm-remove-button');
    const cancelRemoveButton = document.getElementById('cancel-remove-button');
    const removeModalText = document.getElementById('remove-modal-text');

    let productIdToRemove = null;

    cartContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-button')) {
            productIdToRemove = e.target.getAttribute('data-id');
            removeModalText.textContent = `¿Seguro que deseas eliminar ${cart[productIdToRemove].nombre} del carrito?`;
            removeProductModal.style.display = 'flex';
        }
    });

    confirmRemoveButton.addEventListener('click', () => {
        if (productIdToRemove) {
            delete cart[productIdToRemove];
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
            removeProductModal.style.display = 'none';
            productIdToRemove = null;
        }
    });

    cancelRemoveButton.addEventListener('click', () => {
        removeProductModal.style.display = 'none';
        productIdToRemove = null;
    });

    window.addEventListener('click', (e) => {
        if (e.target === removeProductModal) {
            removeProductModal.style.display = 'none';
            productIdToRemove = null;
        }
    });
    //-------------------------------------------------------------------//

    cartContainer.addEventListener('input', (e) => {
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
            updateCartCount();
        }
    });

    // Vaciar carrito
    const clearCartModal = document.getElementById('clear-cart-modal');
    const confirmClearButton = document.getElementById('confirm-clear-button');
    const cancelClearButton = document.getElementById('cancel-clear-button');

    clearCart.addEventListener('click', () => {
        clearCartModal.style.display = 'flex';
    });

    confirmClearButton.addEventListener('click', () => {
        cart = {};
        localStorage.removeItem('cart');
        renderCart();
        updateCartCount();
        clearCartModal.style.display = 'none';
    });

    cancelClearButton.addEventListener('click', () => {
        clearCartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === clearCartModal) {
            clearCartModal.style.display = 'none';
        }
    });
    //-----------------------------------------------------------------------//

    // Evento para finalizar la compra
    const purchaseModal = document.getElementById('purchase-modal');
    const closeModalButton = document.getElementById('close-modal-button');

    checkoutButton.addEventListener('click', () => {
        if (Object.keys(cart).length === 0) {
            alert('El carrito está vacío. Agrega productos antes de finalizar la compra.');
            return;
        }


        purchaseModal.style.display = 'flex';


        localStorage.removeItem('cart');
        cart = {};
        renderCart();
    });
    //-----------------------------------------------------------------------//

    // Redirige al inicio
    closeModalButton.addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    updateCartCount();
    renderCart();
});