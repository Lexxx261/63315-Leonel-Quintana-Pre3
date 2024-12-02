export function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const itemCount = Object.values(cart).reduce((total, producto) => total + producto.cantidad, 0);

    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {  // Asegura que el elemento exista
        cartCountElement.textContent = itemCount;

        // Agrega la clase de animación
        cartCountElement.classList.add('cart-count-bounce');

        // Elimina la clase de animación después de que termine
        setTimeout(() => {
            cartCountElement.classList.remove('cart-count-bounce');
        }, 500);
    }
}
