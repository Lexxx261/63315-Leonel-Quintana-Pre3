export function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const itemCount = Object.values(cart).reduce((total, producto) => total + producto.cantidad, 0);

    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = itemCount;

        cartCountElement.classList.add('cart-count-bounce');

        setTimeout(() => {
            cartCountElement.classList.remove('cart-count-bounce');
        }, 500);
    }
}
