import { updateCartCount } from './utilidades.js';

document.addEventListener('DOMContentLoaded', () => {

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
        window.location.href = '../pages/carrito.html';
    });

    // codigo carrito.html para que funcione desde gitbuh pages.
    // cartButton.addEventListener('click', () => {
    //     const baseUrl = window.location.origin; 
    //     window.location.href = `${baseUrl}/63315-Leonel-Quintana-Pre3/pages/carrito.html`;
    // });

    document.addEventListener('DOMContentLoaded', () => {
        updateCartCount();
    });
    updateCartCount();
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        // Alterna clase para transformar hamburguesa en "X"
        hamburger.classList.toggle('active');
        // Alterna clase para mostrar el menú
        navLinks.classList.toggle('open');
    });


});

