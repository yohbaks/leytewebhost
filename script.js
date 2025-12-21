// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Animated Counter for Data Center Stats
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const isDecimal = target.toString().includes('.');
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (isDecimal) {
            element.textContent = current.toFixed(2);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for Counter Animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            
            const counter = entry.target.querySelector('.counter');
            const target = parseFloat(entry.target.getAttribute('data-count'));
            
            if (counter && target) {
                animateCounter(counter, target);
            }
        }
    });
}, observerOptions);

// Observe all datacenter stats
const stats = document.querySelectorAll('.datacenter-stat[data-count]');
stats.forEach(stat => statsObserver.observe(stat));

// Domain Search Functionality
const domainInput = document.getElementById('domainInput');
const domainSearchBtn = document.getElementById('domainSearchBtn');

if (domainSearchBtn) {
    domainSearchBtn.addEventListener('click', () => {
        const domain = domainInput.value.trim();
        if (domain) {
            window.location.href = `https://cp.leytewebhost.com/domain-search?domain=${encodeURIComponent(domain)}`;
        } else {
            alert('Please enter a domain name');
        }
    });
}

if (domainInput) {
    domainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            domainSearchBtn.click();
        }
    });
}

// Map Location Interaction Enhancement
const mapLocations = document.querySelectorAll('.map-location');

mapLocations.forEach(location => {
    const badge = location.querySelector('.location-badge');
    
    if (badge) {
        badge.addEventListener('click', () => {
            const locationName = location.getAttribute('data-location');
            const servers = location.getAttribute('data-servers');
            
            // Create a simple info display (you can customize this)
            console.log(`Location: ${locationName}, Servers: ${servers}`);
            
            // Add a brief highlight effect
            badge.style.animation = 'none';
            setTimeout(() => {
                badge.style.animation = '';
            }, 10);
        });
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add scroll effect to navbar
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '';
    }
    
    lastScroll = currentScroll;
});

// Add fade-in animation on scroll for sections
const fadeElements = document.querySelectorAll('.feature-card, .testimonial-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(element);
});

// Toggle Business plan full feature list
const featureToggleBtn = document.querySelector('[data-toggle-target="#business-feature-list"]');
const businessFeatureList = document.querySelector('#business-feature-list');

if (featureToggleBtn && businessFeatureList) {
    featureToggleBtn.addEventListener('click', () => {
        const expanded = businessFeatureList.classList.toggle('expanded');
        featureToggleBtn.textContent = expanded ? 'Hide features' : 'View all features';
    });
}
