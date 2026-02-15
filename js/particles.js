class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.hoverParticle = { x: 0, y: 0 };
        this.config = {
            particleColor: 'rgba(56, 189, 248, 0.5)', // Cyan
            lineColor: 'rgba(56, 189, 248, 0.15)',
            particleAmount: 60,
            defaultSpeed: 0.5,
            variantSpeed: 1,
            defaultRadius: 2,
            variantRadius: 2,
            linkRadius: 150,
        };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.hoverParticle.x = e.clientX - rect.left;
            this.hoverParticle.y = e.clientY - rect.top;
        });
        // Handle scroll to update bounds if necessary (fixed canvas doesn't strictly need it but good practice)
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const { width, height } = this.canvas;
        const { particleAmount } = this.config;

        for (let i = 0; i < particleAmount; i++) {
            this.particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                speedX: (Math.random() - 0.5) * this.config.variantSpeed,
                speedY: (Math.random() - 0.5) * this.config.variantSpeed,
                radius: Math.random() * this.config.variantRadius + this.config.defaultRadius,
            });
        }
    }

    drawParticles() {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);

        // Include mouse as a point
        const allParticles = [...this.particles, { ...this.hoverParticle, radius: 0, isMouse: true }];

        this.particles.forEach((p, index) => {
            // Update position
            p.x += p.speedX;
            p.y += p.speedY;

            // Bounce off edges
            if (p.x < 0 || p.x > width) p.speedX *= -1;
            if (p.y < 0 || p.y > height) p.speedY *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.config.particleColor;
            this.ctx.fill();

            // Connect lines
            allParticles.forEach((otherP, otherIndex) => {
                if (index === otherIndex && !otherP.isMouse) return; // Don't verify self unless it's the mouse interaction list

                const dx = p.x - otherP.x;
                const dy = p.y - otherP.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.config.linkRadius) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = this.config.lineColor;
                    this.ctx.lineWidth = 1 - distance / this.config.linkRadius;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(otherP.x, otherP.y);
                    this.ctx.stroke();
                }
            });
        });
    }

    animate() {
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleNetwork('particles-canvas');
});
