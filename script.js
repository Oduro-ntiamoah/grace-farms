// ============================================
// GRACE FARMS - Main JavaScript
// ============================================

'use strict';

// Global variables
let currentImageIndex = 0;
const galleryImages = [];
const galleryCaptions = [];

// ============================================
// 1. LOAD HEADER AND FOOTER
// ============================================

function loadComponent(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Could not load ${filePath}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            
            // After loading header, initialize navigation
            if (elementId === 'header-placeholder') {
                initNavigation();
            }
        })
        .catch(error => {
            console.error('Error loading component:', error);
            // Fallback: create simple header/footer if fetch fails
            if (elementId === 'header-placeholder') {
                createFallbackHeader();
            } else if (elementId === 'footer-placeholder') {
                createFallbackFooter();
            }
        });
}

// Fallback header in case fetch fails
function createFallbackHeader() {
    const headerHTML = `
        <header class="header">
            <nav class="navbar">
                <a href="index.html" class="logo">
                    <span class="logo-text">🌾 Grace Farms</span>
                </a>
                <ul class="nav-menu">
                    <li class="nav-item"><a href="index.html">Home</a></li>
                    <li class="nav-item"><a href="about.html">About</a></li>
                    <li class="nav-item"><a href="products.html">Products</a></li>
                    <li class="nav-item"><a href="gallery.html">Gallery</a></li>
                    <li class="nav-item"><a href="contact.html">Contact</a></li>
                </ul>
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </nav>
        </header>
    `;
    document.getElementById('header-placeholder').innerHTML = headerHTML;
    initNavigation();
}

// Fallback footer in case fetch fails
function createFallbackFooter() {
    const footerHTML = `
        <footer class="footer">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-section">
                        <h3>Grace Farms</h3>
                        <p>Your trusted source for quality poultry and livestock in Jejeti, Eastern Region, Ghana.</p>
                    </div>
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="index.html">Home</a></li>
                            <li><a href="about.html">About Us</a></li>
                            <li><a href="products.html">Products</a></li>
                            <li><a href="gallery.html">Gallery</a></li>
                            <li><a href="contact.html">Contact</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Contact Info</h3>
                        <p>📍 Jejeti, Eastern Region, Ghana</p>
                        <p>📞 +233 20 000 0000</p>
                        <p>✉️ info@gracefarms.com</p>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 Grace Farms. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
    document.getElementById('footer-placeholder').innerHTML = footerHTML;
}

// Load header and footer on page load
document.addEventListener('DOMContentLoaded', function() {
    loadComponent('header-placeholder', 'header.html');
    loadComponent('footer-placeholder', 'footer.html');
    
    // Initialize other features
    initGallery();
    handleProductParam();
});

// ============================================
// 2. NAVIGATION
// ============================================

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        // Toggle mobile menu
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // Highlight active page
    highlightActivePage();
    
    // Sticky header shadow on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (header && window.scrollY > 50) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else if (header) {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
}

function highlightActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ============================================
// 3. GALLERY LIGHTBOX
// ============================================

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length > 0) {
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption');
            
            if (img) {
                galleryImages[index] = img.src;
            }
            if (caption) {
                galleryCaptions[index] = caption.textContent;
            }
        });
    }
}

function openLightbox(index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (lightbox && lightboxImg) {
        currentImageIndex = index;
        lightbox.classList.add('active');
        lightboxImg.src = galleryImages[index];
        
        if (lightboxCaption && galleryCaptions[index]) {
            lightboxCaption.textContent = galleryCaptions[index];
        }
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function changeImage(direction) {
    currentImageIndex += direction;
    
    // Loop around
    if (currentImageIndex >= galleryImages.length) {
        currentImageIndex = 0;
    } else if (currentImageIndex < 0) {
        currentImageIndex = galleryImages.length - 1;
    }
    
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    if (lightboxImg) {
        lightboxImg.src = galleryImages[currentImageIndex];
    }
    if (lightboxCaption && galleryCaptions[currentImageIndex]) {
        lightboxCaption.textContent = galleryCaptions[currentImageIndex];
    }
}

// Close lightbox on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        changeImage(-1);
    } else if (e.key === 'ArrowRight') {
        changeImage(1);
    }
});

// ============================================
// 4. CONTACT FORM - PRODUCT PARAMETER
// ============================================

function handleProductParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const productParam = urlParams.get('product');
    const productSelect = document.getElementById('product');
    
    if (productParam && productSelect) {
        // Try to match and select the product in dropdown
        const options = productSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value === productParam) {
                productSelect.selectedIndex = i;
                break;
            }
        }
    }
}

// ============================================
// 5. FORM VALIDATION (Optional Enhancement)
// ============================================

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Basic validation
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const product = document.getElementById('product');
        const message = document.getElementById('message');
        
        if (!name.value || !phone.value || !product.value || !message.value) {
            e.preventDefault();
            alert('Please fill in all required fields.');
            return false;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(phone.value)) {
            e.preventDefault();
            alert('Please enter a valid phone number.');
            return false;
        }
        
        // Form will submit to FormSubmit.co
        console.log('Form is being submitted to FormSubmit.co');
    });
}

// ============================================
// 6. LAZY LOADING IMAGES
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports lazy loading
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
});

// ============================================
// 7. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Log success message
console.log('Grace Farms website initialized successfully!');
console.log('Contact form will submit to FormSubmit.co');