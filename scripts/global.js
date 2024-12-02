import { updateCartCount } from './utilidades.js';

document.addEventListener('DOMContentLoaded', () => {

    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scroll hacia abajo - ocultar navbar
            navbar.classList.add('nav-hidden');
        } else {
            // Scroll hacia arriba - mostrar navbar
            navbar.classList.remove('nav-hidden');
        }
        lastScrollTop = scrollTop;
    });

    // Scroll to top button
    document.getElementById("goTopBtn").addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    const cartButton = document.querySelector('.cart-all');


    // Asignar evento de clic para redirigir a carrito.html
    cartButton.addEventListener('click', () => {
        window.location.href = './pages/carrito.html'; // Redirige a la página del carrito
    }); 

    // Llama a `updateCartCount` al cargar la página
    document.addEventListener('DOMContentLoaded', () => {
        updateCartCount();
    });
    // Actualizar el contador al cargar la página
    updateCartCount();

});