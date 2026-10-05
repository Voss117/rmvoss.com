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
    const texts = ["Web Applications", "Data Systems", "Enterprise Solutions"];
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
        card.addEventListener('mouseenter', () => {
            // Fast transition while moving to avoid stutter
            card.style.transition = 'all 0.1s ease';
        });

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
            // Smooth, bouncy transition when resetting to default
            card.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            
            // Remove the inline style after transition completes so CSS takes over again
            setTimeout(() => {
                card.style.transition = '';
            }, 500);
        });
    });

    // --- Project Detail Toggle ---
    document.querySelectorAll('.toggle-details').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectCard = button.closest('.project-content');
            const deepDive = projectCard.querySelector('.tech-deep-dive');

            if (deepDive.style.display === 'none') {
                deepDive.style.display = 'block';
                button.textContent = 'Hide Technical Details';
                // Optional: Fade in
                deepDive.style.opacity = 0;
                setTimeout(() => deepDive.style.opacity = 1, 10);
                deepDive.style.transition = 'opacity 0.5s ease';
            } else {
                deepDive.style.display = 'none';
                button.textContent = 'View Technical Details';
            }
        });
    });
    // --- Contact Form AJAX ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.textContent;

            button.disabled = true;
            button.textContent = 'Sending...';

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    form.style.display = 'none'; // Hide form
                    const successMessage = document.getElementById('success-message');
                    if (successMessage) {
                        successMessage.style.display = 'block'; // Show success message
                    }

                } else {
                    // Error from server
                    const result = await response.json();
                    alert(result.error || "Oops! There was a problem submitting your form.");
                    button.disabled = false;
                    button.textContent = originalText;
                }
            } catch (error) {
                // Network error
                alert("Oops! There was a problem submitting your form.");
                button.disabled = false;
                button.textContent = originalText;
            }
        });
    }

});

// --- Mobile Menu Toggle ---
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('.nav');

if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        nav.classList.toggle('active');

        // Toggle aria-expanded for accessibility
        const isExpanded = mobileMenuBtn.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            nav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', false);
        });
    });
}

// --- Image Lightbox Modal ---
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("image-modal");
    if (!modal) return; // Exit if modal doesn't exist on this page

    const modalImg = document.getElementById("modal-img");
    const captionText = document.getElementById("modal-caption");
    const triggers = document.querySelectorAll('.lightbox-trigger');
    const span = document.getElementsByClassName("close-modal")[0];

    // Open Modal
    triggers.forEach(img => {
        img.addEventListener('click', function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;
        });
    });

    // Close Modal on X click
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Close Modal on background click
    modal.onclick = function(e) {
        if (e.target !== modalImg) {
            modal.style.display = "none";
        }
    }

    // Close Modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && modal.style.display === "block") {
            modal.style.display = "none";
        }
    });
});
