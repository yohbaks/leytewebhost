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

// Contact Form Submission Handler
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Hide previous messages
        formMessage.style.display = 'none';

        // Collect form data
        const formData = new FormData(contactForm);

        try {
            // Send form data to PHP handler
            const response = await fetch('send_email.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            // Display message
            formMessage.style.display = 'block';
            formMessage.textContent = result.message;

            if (result.success) {
                // Success styling
                formMessage.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                formMessage.style.color = '#fff';
                formMessage.style.border = '1px solid #10b981';

                // Reset form
                contactForm.reset();

                // Hide success message after 5 seconds
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            } else {
                // Error styling
                formMessage.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                formMessage.style.color = '#fff';
                formMessage.style.border = '1px solid #ef4444';
            }
        } catch (error) {
            // Network error
            formMessage.style.display = 'block';
            formMessage.textContent = 'Network error. Please check your connection and try again.';
            formMessage.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            formMessage.style.color = '#fff';
            formMessage.style.border = '1px solid #ef4444';
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message →';
        }
    });

    // Add real-time validation feedback
    const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '#10b981';
            }
        });

        input.addEventListener('focus', () => {
            input.style.borderColor = '#2563eb';
        });
    });

    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                emailInput.style.borderColor = '#ef4444';
            } else {
                emailInput.style.borderColor = '#10b981';
            }
        });
    }
}
