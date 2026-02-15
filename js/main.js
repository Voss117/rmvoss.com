document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Typewriter Effect ---
    const typewriterElement = document.getElementById('typewriter');
    const texts = ["Full Stack Developer", "Database Expert", "Problem Solver"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster when deleting
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Normal typing speed
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    // Start typewriter if element exists
    if (typewriterElement) {
        type();
    }


    // --- Scroll Reveal ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.scroll-hidden, .project-card, .skill-card');
    hiddenElements.forEach((el) => {
        el.classList.add('scroll-hidden'); // Ensure initial state is hidden
        observer.observe(el);
    });

    // --- 3D Tilt Effect ---
    document.querySelectorAll('.project-card, .skill-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation (center is 0,0)
            const xPct = (x / rect.width) - 0.5;
            const yPct = (y / rect.height) - 0.5;

            // Max rotation degrees
            const maxTilt = 5; // Subtle tilt

            const xTilt = yPct * -maxTilt; // Tilt x based on y position (up/down)
            const yTilt = xPct * maxTilt;  // Tilt y based on x position (left/right)

            card.style.transform = `perspective(1000px) rotateX(${xTilt}deg) rotateY(${yTilt}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
});
