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
    const texts = ["Web Applications", "Data Systems", "Enterprise Solutions", "Artificial Intelligence Solutions"];
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

// --- Dynamic Footer Year ---
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// --- Back to Top Button ---
document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});


// --- Toast Notification Helper ---
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg><span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}
window.showToast = showToast;

// --- Quick Actions: Copy Email & Save Contact (vCard) ---
document.addEventListener('DOMContentLoaded', () => {
    // Copy Email
    document.querySelectorAll('.copy-email-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = 'Robert@rmvoss.com';
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email).then(() => {
                    showToast('Email copied to clipboard! (' + email + ')');
                }).catch(() => {
                    fallbackCopy(email);
                });
            } else {
                fallbackCopy(email);
            }
        });
    });

    function fallbackCopy(text) {
        try {
            const temp = document.createElement('input');
            temp.setAttribute('value', text);
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            showToast('Email copied to clipboard! (' + text + ')');
        } catch (err) {
            showToast('Email: ' + text);
        }
    }

    // Save Contact (vCard)
    document.querySelectorAll('.save-contact-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const vcard = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                'N:Voss;Robert;;;',
                'FN:Robert Voss',
                'ORG:Washington County Government / Senior Systems Architect',
                'TITLE:Senior Full Stack Developer & Systems Architect',
                'EMAIL;type=INTERNET;type=WORK:Robert@rmvoss.com',
                'URL:https://rmvoss.com',
                'X-SOCIALPROFILE;type=linkedin:https://linkedin.com/in/robert-voss',
                'NOTE:Enterprise Systems & AI Architect. Specializing in high-throughput C# backend architectures, air-gapped AI server clusters, and financial ERP systems.',
                'END:VCARD'
            ].join('\r\n');

            const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.setAttribute('download', 'Robert_Voss.vcf');
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Contact card downloaded! (Robert_Voss.vcf)');
        });
    });



    // Accessibility for lightbox images
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');
    lightboxTriggers.forEach(img => {
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                img.click();
            }
        });
    });
});
