document.addEventListener('DOMContentLoaded', () => {
    // Slide
    const slides = document.querySelector('.gallery .slides');
    const slideWidth = slides.querySelector('.slide').clientWidth;
    let currentSlide = 0;

    function showSlide(index) {
        slides.style.transform = `translateX(-${index * slideWidth}px)`;
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.children.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = slides.children.length - 1;
        }
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 10000);

    // Manual navegacion
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;

});