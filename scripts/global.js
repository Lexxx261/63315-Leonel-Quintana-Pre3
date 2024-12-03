import { updateCartCount } from './utilidades.js';

document.addEventListener('DOMContentLoaded', () => {

    // if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    //     const cartButton = document.getElementById('cartButton');
    //     if (cartButton) {
    //         cartButton.style.display = 'none';
    //     }
    // }

    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
        lastScrollTop = scrollTop;
    });

    document.getElementById("goTopBtn").addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    const cartButton = document.querySelector('.cart-all');


    // Asignar evento de clic para redirigir a carrito
    cartButton.addEventListener('click', () => {
        window.location.href = './pages/carrito.html';
    }); 

    document.addEventListener('DOMContentLoaded', () => {
        updateCartCount();
    });
    updateCartCount();

});