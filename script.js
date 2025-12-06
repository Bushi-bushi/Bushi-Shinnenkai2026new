// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.addEventListener('DOMContentLoaded', () => {

    // Scroll Animations (IntersectionObserver)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    // Hero Title Animation
    const heroElements = document.querySelectorAll('.hero-title, .hero-date, .hero-content .btn');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('is-visible');
        }, 100 * index + 300); // Slight delay after load
    });

    // Canvas Particle Effect (Gold Embers)
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles(); // Re-init on resize to adjust density
        }

        class Particle {
            constructor() {
                this.reset();
                // Randomize initial Y to fill screen
                this.y = Math.random() * height;
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 100;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = -(Math.random() * 1 + 0.5);
                this.size = Math.random() * 2 + 0.5;
                this.alpha = Math.random() * 0.5 + 0.2;
                this.life = Math.random() * 100 + 50;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life--;
                this.alpha -= 0.002;
                this.x += Math.sin(this.y * 0.01) * 0.2; // Wobbly movement

                if (this.life <= 0 || this.alpha <= 0 || this.y < -10) {
                    this.reset();
                }
            }

            draw() {
                ctx.fillStyle = `rgba(197, 160, 89, ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const particleCount = Math.min(Math.floor(width * 0.15), 150);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', resize);
        resize(); // Initial call
        animateParticles();
    }
});
