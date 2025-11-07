// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add copy functionality to code blocks
document.querySelectorAll('.contract-address').forEach(address => {
    address.style.cursor = 'pointer';
    address.title = 'Click to copy';
    
    address.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(address.textContent);
            const originalText = address.textContent;
            address.textContent = '✅ Copied!';
            setTimeout(() => {
                address.textContent = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    });
});

// Animate stats on scroll
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-value');
    stats.forEach(stat => {
        const target = stat.textContent;
        if (target.includes('+')) {
            const number = parseInt(target.replace(/\D/g, ''));
            animateNumber(stat, 0, number, 2000, '+');
        } else if (target.includes('%')) {
            const number = parseInt(target.replace(/\D/g, ''));
            animateNumber(stat, 0, number, 2000, '%');
        } else if (target.includes('$')) {
            stat.textContent = '$0';
        }
    });
};

const animateNumber = (element, start, end, duration, suffix = '') => {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }
    }, 16);
};

// Trigger stats animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const hero = document.querySelector('.hero');
if (hero) {
    heroObserver.observe(hero);
}

// Add hover effect to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Log page view (for analytics)
console.log('🚀 SomniaAgent SDK Landing Page');
console.log('📊 Built for Somnia AI Hackathon 2025');
console.log('🔗 GitHub: https://github.com/hieple7985/somnia-agent-sdk');

