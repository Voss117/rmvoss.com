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

    // --- GitHub API Fetch ---
    const githubContainer = document.getElementById('github-repos');
    if (githubContainer) {
        fetch('https://api.github.com/users/Voss117/repos?sort=updated&per_page=3')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    githubContainer.innerHTML = ''; // Clear loading
                    data.forEach(repo => {
                        const card = document.createElement('article');
                        card.className = 'project-card scroll-hidden';
                        card.innerHTML = `
                            <div class="project-content">
                                <span class="project-tag">${repo.language || 'Code'}</span>
                                <h3 class="project-title">${repo.name}</h3>
                                <p class="project-description">${repo.description || 'No description available.'}</p>
                                <div class="project-links">
                                    <a href="${repo.html_url}" target="_blank" class="link-text">View Repository &rarr;</a>
                                </div>
                            </div>
                        `;
                        githubContainer.appendChild(card);
                        observer.observe(card); // Add to scroll observer
                    });
                }
            })
            .catch(error => {
                githubContainer.innerHTML = '<p style="text-align: center; width: 100%;">Unable to load GitHub activity at this time.</p>';
                console.error('GitHub Fetch Error:', error);
            });
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
});
