import { productos } from './productos.js';

document.addEventListener('DOMContentLoaded', () => {
    const carouselWrapper = document.getElementById('carousel-wrapper');

    function mostrarDestacados() {
        const productosDestacados = productos.filter(producto => producto.destacado);

        productosDestacados.forEach(producto => {
            const slideDiv = document.createElement('div');
            slideDiv.classList.add('swiper-slide');
            slideDiv.innerHTML = `
                <div class="prod-content">
                    <div class="prod-overlay">
                        <h3 class="prod-name">${producto.nombre}</h3>
                        <img src="./img/productos/${producto.imagen}" alt="${producto.nombre}">
                        <div class="prod-hover">
                            <p class="prod-description">${producto.descripcionCorta}</p>
                            <div class="control">
                                <button class="btn buy-now">
                                    <span class="price">$${producto.precio}</span>
                                    <span class="shopping-cart"><svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size"
                                    viewBox="0 0 24 24" fill="currentColor" width="30" height="30">
                                    <path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z">
                                    </path></svg></span>
                                    <span class="buy">Comprar Ahora</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            carouselWrapper.appendChild(slideDiv);

            // Add event listener to the button
            const buyNowButton = slideDiv.querySelector('.buy-now');
            buyNowButton.addEventListener('click', () => buyNow(producto));
        });

        // Initialize Swiper
        new Swiper('.swiper-container', {
            loop: true,
            centeredSlides: true,
            slidesPerView: 3,
            spaceBetween: 10,
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 200,
                modifier: 1.5,
                slideShadows: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
            },
        });
    }

    function buyNow(producto) {
        let cart = JSON.parse(localStorage.getItem('cart')) || {};
        if (!cart[producto.id]) {
            cart[producto.id] = { ...producto, cantidad: 1 };
        } else {
            cart[producto.id].cantidad += 1;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = './pages/carrito.html';
    }

    mostrarDestacados();

    //swiper de galeria
    new Swiper('.swiper-gallery', {
        loop: true,
        centeredSlides: true,
        slidesPerView: 1,
        spaceBetween: 10,

        autoplay: {
            delay: 7000,
            disableOnInteraction: false,
        },

        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

});