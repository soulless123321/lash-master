document.addEventListener('DOMContentLoaded', () => {
    // Hide loader immediately
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => loader.style.display = 'none', 100);
    }
    
    // Particles
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle?.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
    }
    
    // Typewriter Effect
    const heroTitle = document.querySelector('.hero-title span');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 80);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
    
    // Scroll Progress
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });
    
    // Toast Notifications
    window.showToast = function(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    };
    
    // Lightbox
    let lightboxIndex = 0;
    const lightboxItems = [];
    
    window.openLightbox = function(index) {
        const lightbox = document.getElementById('lightbox');
        const img = document.getElementById('lightboxImg');
        
        if (lightboxItems[index]) {
            img.src = lightboxItems[index];
            lightboxIndex = index;
            lightbox.classList.add('active');
        }
    };
    
    window.closeLightbox = function() {
        document.getElementById('lightbox').classList.remove('active');
    };
    
    window.lightboxNext = function() {
        lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
        document.getElementById('lightboxImg').src = lightboxItems[lightboxIndex];
    };
    
    window.lightboxPrev = function() {
        lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
        document.getElementById('lightboxImg').src = lightboxItems[lightboxIndex];
    };
    
    // Portfolio Slider
    let currentSlide = 0;
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderDots = document.getElementById('sliderDots');
    let itemsPerView = 3;
    
    function updateItemsPerView() {
        if (window.innerWidth <= 480) itemsPerView = 1;
        else if (window.innerWidth <= 768) itemsPerView = 2;
        else itemsPerView = 3;
    }
    
    window.sliderNext = function() {
        updateItemsPerView();
        const items = sliderTrack?.children.length || 0;
        const maxSlide = Math.max(0, items - itemsPerView);
        currentSlide = Math.min(currentSlide + 1, maxSlide);
        updateSlider();
    };
    
    window.sliderPrev = function() {
        currentSlide = Math.max(currentSlide - 1, 0);
        updateSlider();
    };
    
    window.goToSlide = function(index) {
        currentSlide = index;
        updateSlider();
    };
    
    function updateSlider() {
        if (sliderTrack) {
            sliderTrack.style.transform = `translateX(-${currentSlide * (100 / itemsPerView)}%)`;
        }
        updateDots();
    }
    
    function updateDots() {
        if (!sliderDots) return;
        const dots = sliderDots.children;
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.toggle('active', i === currentSlide);
        }
    }
    
    function initSlider() {
        updateItemsPerView();
        
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach((item, index) => {
            const src = item.dataset.src;
            if (src) lightboxItems.push(src);
            
            item.addEventListener('click', () => {
                openLightbox(index);
            });
        });
        
        // Create dots
        if (sliderDots && portfolioItems.length > 0) {
            sliderDots.innerHTML = '';
            const totalDots = Math.ceil(portfolioItems.length / itemsPerView);
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('div');
                dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
                dot.onclick = () => goToSlide(i);
                sliderDots.appendChild(dot);
            }
        }
    }
    
    initSlider();
    window.addEventListener('resize', () => {
        updateItemsPerView();
        updateSlider();
    });
    
    // Close lightbox on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') lightboxNext();
        if (e.key === 'ArrowLeft') lightboxPrev();
    });
    
    // Click outside lightbox to close
    document.getElementById('lightbox')?.addEventListener('click', (e) => {
        if (e.target.id === 'lightbox') closeLightbox();
    });
    
    // Ripple Effect
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Custom Cursor
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    document.querySelectorAll('a, button, .service-card, .review-card, .portfolio-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    
    // 3D Tilt Effect
    document.querySelectorAll('.service-card, .review-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    });

    // Form with validation and localStorage
    const form = document.getElementById('bookingForm');
    
    // Load saved data
    const savedName = localStorage.getItem('bookingName');
    const savedPhone = localStorage.getItem('bookingPhone');
    if (savedName) form?.querySelector('[name="name"]').value = savedName;
    if (savedPhone) form?.querySelector('[name="phone"]').value = savedPhone;
    
    // Validation
    function validateField(field) {
        const parent = field.parentElement;
        const value = field.value.trim();
        let isValid = true;
        let message = '';
        
        if (field.required && !value) {
            isValid = false;
            message = 'Это поле обязательно';
        } else if (field.name === 'phone' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = 'Введите корректный номер телефона';
            }
        } else if (field.name === 'name' && value && value.length < 2) {
            isValid = false;
            message = 'Имя должно содержать минимум 2 символа';
        }
        
        parent.classList.remove('error', 'success');
        
        let errorEl = parent.querySelector('.error-message');
        if (!errorEl) {
            errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            parent.appendChild(errorEl);
        }
        
        if (!isValid) {
            parent.classList.add('error');
            errorEl.textContent = message;
        } else if (value) {
            parent.classList.add('success');
            errorEl.textContent = '';
        }
        
        return isValid;
    }
    
    form?.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.parentElement.classList.contains('error')) {
                validateField(field);
            }
        });
    });
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isFormValid = true;
        form.querySelectorAll('input[required], select[required]').forEach(field => {
            if (!validateField(field)) isFormValid = false;
        });
        
        if (!isFormValid) {
            showToast('Пожалуйста, заполните все поля правильно', 'error');
            return;
        }
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Save to localStorage
        localStorage.setItem('bookingName', data.name);
        localStorage.setItem('bookingPhone', data.phone);
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span>Отправка...';
        
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showToast('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами для согласования времени.', 'success');
                form.reset();
                // Restore saved data
                form.querySelector('[name="name"]').value = data.name;
                form.querySelector('[name="phone"]').value = data.phone;
            } else {
                showToast(result.error || 'Ошибка отправки', 'error');
            }
        } catch (error) {
            showToast('Ошибка соединения. Попробуйте позже.', 'error');
            console.error(error);
        }
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    });

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.faq-answer').style.maxHeight = null;
            });
            
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
    
    document.querySelectorAll('.faq-answer').forEach(answer => {
        answer.style.transition = 'max-height 0.4s ease, padding 0.4s ease';
    });
    
    if (localStorage.getItem('cookiesAccepted') !== 'true') {
        document.getElementById('cookieBanner')?.classList.add('show');
    }

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

    document.querySelectorAll('.service-card, .portfolio-item, .review-card, .certificate-card, .faq-item, .about-grid, .contacts-grid, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
