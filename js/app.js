document.addEventListener("DOMContentLoaded", () => {
    
    // --- MOBILE DRAWER EVENT HANDLERS ---
    const menuToggle = document.querySelector(".menu-toggle-btn");
    const closeDrawer = document.querySelector(".drawer-close-btn");
    const overlay = document.querySelector(".mobile-drawer-overlay");

    const toggleMenu = () => document.body.classList.toggle("drawer-open");

    menuToggle.addEventListener("click", toggleMenu);
    closeDrawer.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", toggleMenu);

    // --- spin wheel animation function ---

    function spinWheel() {
        const wheel = document.querySelector('.wheel-img');
        
        const totalProducts = 8; // Change this to match the number of slices/products on your wheel
        const degreesPerProduct = 360 / totalProducts;
        
        // 1. Pick a random product index (0 to totalProducts - 1)
        const randomProductIndex = Math.floor(Math.random() * totalProducts);
        
        // 2. Calculate the specific angle for that product.
        // We add 3623 degrees (10 full 360-degree spins) first so the wheel spins rapidly before stopping.
        const baseSpins = 1463; 
        const targetAngle = baseSpins + (randomProductIndex * degreesPerProduct);
        
        // 3. Reset the animation so it can run again
        wheel.style.animation = 'none';
        wheel.offsetHeight; /* Trigger a reflow to reset the animation state in the browser */
        
        // 4. Inject the target rotation into the CSS variable and run the animation
        wheel.style.setProperty('--target-rotation', `${targetAngle}deg`);
        wheel.style.animation = 'spin 20s cubic-bezier(0.1, 1, 0.1, 1) forwards';
        
    }

    // --- SWIPER INITIALIZATIONS ---

    // 1. Featured In Slider (Continuous swipe row configuration)
    const featuredSwiper = new Swiper('.featured-swiper', {
        slidesPerView: 2.2,
        spaceBetween: 20,
        freeMode: true,
        breakpoints: {
            768:{slidesPerView: 4, spaceBetween: 60},
            1024: {
                slidesPerView: 'auto',
                allowTouchMove: false, // Locks styling across desktop container safely
            }
        }
    });

    // 2 & 3. Exclusive Tiers Slider Framework
    const wheelsSwiper = new Swiper('.wheels-swiper', {
        slidesPerView: 2, // 2 items on mobile
        spaceBetween: 15,
        navigation: {
            nextEl: '.swiper-next-custom',
            prevEl: '.swiper-prev-custom',
        },
        breakpoints: {
            768: { slidesPerView: 4, spaceBetween: 20 },
            1200: { slidesPerView: 5.5, spaceBetween: 20 }
        }
    });

    // testimonials swiper
    const testimonialsSwiper = new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        grabCursor: true,
        navigation: {
            nextEl: '.swiper-next-testimonial',
            prevEl: '.swiper-prev-testimonial',
        },
        breakpoints: {
            768: { 
                slidesPerView: 2.3, 
                spaceBetween: 20 
            },
            1024: { 
                slidesPerView: 3, 
                spaceBetween: 20 
            },
            1180: { 
                slidesPerView: 4, 
                spaceBetween: 20 
            },
            1240: { 
                slidesPerView: 5, 
                spaceBetween: 20 
            }
        }
    });

    // --- TAB FILTER LOGIC ON SWIPER CAROUSEL ---
    const tabButtons = document.querySelectorAll(".filter-nav .tab-btn");
    const allSlides = Array.from(document.querySelectorAll(".wheels-swiper .swiper-slide"));

    tabButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            tabButtons.forEach(t => t.classList.remove("active"));
            e.target.classList.add("active");

            const filterValue = e.target.getAttribute("data-filter");

            // Clean up slides completely first via Swiper APIs
            wheelsSwiper.removeAllSlides();

            // Re-inject slides that match criteria 
            allSlides.forEach(slide => {
                const category = slide.getAttribute("data-category");
                if (filterValue === "all" || category === filterValue) {
                    wheelsSwiper.appendSlide(slide);
                }
            });

            wheelsSwiper.update();
            wheelsSwiper.slideTo(0);
        });
    });

    // --- FOOTER COLUMN ACCORDIONS ON MOBILE ---
    const footerToggles = document.querySelectorAll(".footer-toggle");
    
    footerToggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            // Safe check to avoid running logic on desktop scale configurations
            if (window.innerWidth >= 768) return;
    
            const parentColumn = toggle.parentElement;
            const isAlreadyActive = parentColumn.classList.contains("active");
    
            // Close all other open columns for accordion action styling
            document.querySelectorAll(".footer-col").forEach(col => col.classList.remove("active"));
    
            // Toggle visibility state for selection target
            if (!isAlreadyActive) {
                parentColumn.classList.add("active");
            }
        });
    });

    // --- Spin wheel interval to call spinWheel ---
    setTimeout(() => {
        console.log("Starting wheel spin interval...");
        spinWheel(); // Initial spin on page load
        setInterval(spinWheel, 15000);
    }, 5000);

    // Open modal on banner click
    document.querySelectorAll('[data-modal-target]').forEach(banner => {
        banner.addEventListener('click', () => {
            const modalId = banner.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        });
    });

    // Helper function to close a modal and stop videos
    function closeModal(modal) {
        modal.classList.remove('active');
        
        // Stop embedded iframe videos (YouTube/Vimeo) by resetting src
        const iframe = modal.querySelector('iframe');
        if (iframe) {
            const iframeSrc = iframe.src;
            iframe.src = iframeSrc; 
        }

        // Pause standard HTML5 videos if used
        const video = modal.querySelector('video');
        if (video) {
            video.pause();
        }
    }

    // Close buttons logic
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal(button.closest('.modal-overlay'));
        });
    });

    // Close when clicking outside the modal box
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    // Close on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal-overlay.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
});
