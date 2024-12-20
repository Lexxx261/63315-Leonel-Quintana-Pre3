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

            // Crear imagen del producto para el carrito
            const img = document.createElement('img');

            // Verificar si 'producto.imagenes' es un array válido y tiene al menos una imagen
            if (producto.imagen && Array.isArray(producto.imagen) && producto.imagen.length > 0) {
                img.src = `../img/productos/${producto.imagen[0]}`; // Toma solo la primera imagen
            } else {
                img.src = '../img/productos/logo-round.png'; // Imagen por defecto si no hay imágenes
            }

            img.alt = producto.nombre;
            img.classList.add('cart-item-img');

            // Nombre del producto
            const name = document.createElement('h3');
            name.textContent = producto.nombre;
            name.classList.add('cart-item-name');

            // Controles de cantidad
            const quantityContainer = document.createElement('div');
            quantityContainer.classList.add('quantity-container');

            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = '-';
            decreaseButton.classList.add('quantity-button');
            decreaseButton.dataset.id = producto.id;

            const quantityInput = document.createElement('input');
            quantityInput.type = 'text';
            quantityInput.min = 1;
            quantityInput.value = producto.cantidad;
            quantityInput.classList.add('quantity-input');
            quantityInput.dataset.id = producto.id;

            const increaseButton = document.createElement('button');
            increaseButton.textContent = '+';
            increaseButton.classList.add('quantity-button');
            increaseButton.dataset.id = producto.id;

            quantityContainer.appendChild(decreaseButton);
            quantityContainer.appendChild(quantityInput);
            quantityContainer.appendChild(increaseButton);

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
            productDiv.appendChild(quantityContainer);
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

    // Event listeners para botones de cantidad
    cartContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-button')) {
            const productId = e.target.dataset.id;
            const quantityInput = e.target.parentNode.querySelector('.quantity-input');

            if (e.target.textContent === '+') {
                cart[productId].cantidad++;
            } else if (e.target.textContent === '-' && cart[productId].cantidad > 1) {
                cart[productId].cantidad--;
            }

            quantityInput.value = cart[productId].cantidad;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
            updateCartCount();
        }
    });

    // APLICAR CUPÓN
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
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutModalButton = document.getElementById('close-checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');

    checkoutButton.addEventListener('click', () => {
        if (Object.keys(cart).length === 0) {
            alert('El carrito está vacío. Agrega productos antes de finalizar la compra.');
            return;
        }
        checkoutModal.style.display = 'flex';
    });    

    closeCheckoutModalButton.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });
    // Calcular la fecha y hora mínima
    const now = new Date();
    const minDate = new Date(now.getTime() + 36 * 60 * 60 * 1000);

    const minDateStr = minDate.toISOString().split('T')[0];
    const minTimeStr = minDate.toTimeString().split(' ')[0].substring(0,5);

    // Inicializar Flatpickr para la fecha
    flatpickr("#fecha", {
        altInput: true,
        altFormat: "d/m/Y",
        dateFormat: "Y-m-d",
        minDate: minDate,
        disable: [
            function(date) {
                return (date.getDay() === 0);
            }
            // Agrega más condiciones para bloquear fechas si es necesario
        ],
        onChange: function(selectedDates, dateStr, instance) {
            // Obtener la fecha seleccionada
            const selectedDate = selectedDates[0];
            const today = new Date();
            const isMinDate = selectedDate.toDateString() === minDate.toDateString();

            // Configurar las opciones de hora basadas en la fecha seleccionada
            flatpickr("#hora", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true,
                minuteIncrement: 30,
                minTime: isMinDate ? minDateStr.substring(0,5) : "09:00",
                maxTime: "18:00",
            });
        }
    });
    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();
    
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const celular = document.getElementById('celular').value.trim();
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const direccion = document.getElementById('direccion').value.trim();
        const errorMessage = document.getElementById('error-message');
    
        if (!nombre || !email || !celular || !fecha || !hora || !direccion) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'Todos los campos son obligatorios.';
        } else {
            errorMessage.style.display = 'none';
    
            // Mostrar el modal de agradecimiento
            purchaseModal.style.display = 'flex';
            checkoutModal.style.display = 'none';
    
            localStorage.removeItem('cart');
            cart = {};
            renderCart();
            checkoutForm.reset();
        }
    });

    closeModalButton.addEventListener('click', () => {
        purchaseModal.style.display = 'none';
        window.location.href = '../index.html';
    });

    window.addEventListener('click', (event) => {
        if (event.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
        if (event.target === purchaseModal) {
            purchaseModal.style.display = 'none';
        }
    });

    //-----------------------------------------------------------------------//

    // Redirige al inicio
    closeModalButton.addEventListener('click', () => {
        window.location.href = '../index.html';
    });

    updateCartCount();
    renderCart();
});