document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        var loader = document.getElementById('loader');
        if (loader) loader.remove();
    }, 1200);
    
    var particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (var i = 0; i < 20; i++) {
            var particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    var themeToggle = document.getElementById('themeToggle');
    var savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            var currentTheme = document.documentElement.getAttribute('data-theme');
            var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        var icon = themeToggle ? themeToggle.querySelector('i') : null;
        if (icon) {
            icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
        }
    }
    
    var heroTitle = document.querySelector('.hero-title span');
    if (heroTitle) {
        var text = heroTitle.textContent;
        heroTitle.textContent = '';
        var charIndex = 0;
        
        function typeWriter() {
            if (charIndex < text.length) {
                heroTitle.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 80);
            }
        }
        
        setTimeout(typeWriter, 500);
    }
    
    var scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', function() {
        var scrollTop = window.pageYOffset;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var scrollPercent = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrollPercent + '%';
        }
    });
    
    window.showToast = function(message, type) {
        type = type || 'success';
        var container = document.getElementById('toastContainer');
        if (!container) return;
        
        var toast = document.createElement('div');
        toast.className = 'toast ' + type;
        toast.textContent = message;
        container.appendChild(toast);
        
        setTimeout(function() { toast.remove(); }, 3000);
    };
    
    var lightboxIndex = 0;
    var lightboxItems = [];
    
    window.openLightbox = function(index) {
        var lightbox = document.getElementById('lightbox');
        var img = document.getElementById('lightboxImg');
        
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
    
    var currentSlide = 0;
    var sliderTrack = document.getElementById('sliderTrack');
    var sliderDots = document.getElementById('sliderDots');
    var itemsPerView = 3;
    
    function updateItemsPerView() {
        if (window.innerWidth <= 480) itemsPerView = 1;
        else if (window.innerWidth <= 768) itemsPerView = 2;
        else itemsPerView = 3;
    }
    
    window.sliderNext = function() {
        updateItemsPerView();
        var items = sliderTrack ? sliderTrack.children.length : 0;
        var maxSlide = Math.max(0, items - itemsPerView);
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
            sliderTrack.style.transform = 'translateX(-' + (currentSlide * (100 / itemsPerView)) + '%)';
        }
        updateDots();
    }
    
    function updateDots() {
        if (!sliderDots) return;
        var dots = sliderDots.children;
        for (var i = 0; i < dots.length; i++) {
            if (i === currentSlide) {
                dots[i].classList.add('active');
            } else {
                dots[i].classList.remove('active');
            }
        }
    }
    
    function initSlider() {
        updateItemsPerView();
        
        var portfolioItems = document.querySelectorAll('.portfolio-item');
        for (var i = 0; i < portfolioItems.length; i++) {
            (function(index) {
                var item = portfolioItems[index];
                var src = item.dataset.src;
                if (src) lightboxItems.push(src);
                
                item.addEventListener('click', function() {
                    openLightbox(index);
                });
            })(i);
        }
        
        if (sliderDots && portfolioItems.length > 0) {
            sliderDots.innerHTML = '';
            var totalDots = Math.ceil(portfolioItems.length / itemsPerView);
            for (var i = 0; i < totalDots; i++) {
                var dot = document.createElement('div');
                dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
                dot.onclick = (function(idx) {
                    return function() { goToSlide(idx); };
                })(i);
                sliderDots.appendChild(dot);
            }
        }
    }
    
    initSlider();
    window.addEventListener('resize', function() {
        updateItemsPerView();
        updateSlider();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') lightboxNext();
        if (e.key === 'ArrowLeft') lightboxPrev();
    });
    
    var lightboxEl = document.getElementById('lightbox');
    if (lightboxEl) {
        lightboxEl.addEventListener('click', function(e) {
            if (e.target.id === 'lightbox') closeLightbox();
        });
    }
    
    var btns = document.querySelectorAll('.btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', function(e) {
            var ripple = document.createElement('span');
            ripple.className = 'ripple';
            var rect = this.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height);
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            this.appendChild(ripple);
            setTimeout(function() { ripple.remove(); }, 600);
        });
    }
    
    var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (!isTouchDevice) {
        var cursor = document.createElement('div');
        cursor.className = 'cursor';
        document.body.appendChild(cursor);
        
        var cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        document.body.appendChild(cursorDot);
        
        var mouseX = window.innerWidth / 2;
        var mouseY = window.innerHeight / 2;
        var cursorX = mouseX;
        var cursorY = mouseY;
        var isCursorVisible = false;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isCursorVisible) {
                cursor.classList.add('visible');
                cursorDot.classList.add('visible');
                isCursorVisible = true;
            }
            
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });
        
        document.addEventListener('mouseleave', function() {
            cursor.classList.remove('visible');
            cursorDot.classList.remove('visible');
            isCursorVisible = false;
        });
        
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        var hoverElements = document.querySelectorAll('a, button, .service-card, .review-card, .portfolio-item');
        for (var i = 0; i < hoverElements.length; i++) {
            hoverElements[i].addEventListener('mouseenter', function() {
                cursor.classList.add('hover');
            });
            hoverElements[i].addEventListener('mouseleave', function() {
                cursor.classList.remove('hover');
            });
        }
    }
    
    var tiltCards = document.querySelectorAll('.service-card, .review-card');
    for (var i = 0; i < tiltCards.length; i++) {
        tiltCards[i].addEventListener('mousemove', function(e) {
            var rect = this.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / 15;
            var rotateY = (centerX - x) / 15;
            
            this.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
        });
        
        tiltCards[i].addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    }
    
    var menuToggle = document.querySelector('.menu-toggle');
    var navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    if (navLinks) {
        var navLinkItems = navLinks.querySelectorAll('a');
        for (var i = 0; i < navLinkItems.length; i++) {
            navLinkItems[i].addEventListener('click', function() {
                navLinks.classList.remove('active');
            });
        }
    }

    var header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        var currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            if (header) header.classList.add('scrolled');
        } else {
            if (header) header.classList.remove('scrolled');
        }
    });

    var form = document.getElementById('bookingForm');
    
    var savedName = localStorage.getItem('bookingName');
    var savedPhone = localStorage.getItem('bookingPhone');
    if (savedName && form) form.querySelector('[name="name"]').value = savedName;
    if (savedPhone && form) form.querySelector('[name="phone"]').value = savedPhone;
    
    function validateField(field) {
        var parent = field.parentElement;
        var value = field.value.trim();
        var isValid = true;
        var message = '';
        
        if (field.required && !value) {
            isValid = false;
            message = 'Это поле обязательно';
        } else if (field.name === 'phone' && value) {
            var phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = 'Введите корректный номер телефона';
            }
        } else if (field.name === 'name' && value && value.length < 2) {
            isValid = false;
            message = 'Имя должно содержать минимум 2 символа';
        }
        
        parent.classList.remove('error', 'success');
        
        var errorEl = parent.querySelector('.error-message');
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
    
    if (form) {
        var formFields = form.querySelectorAll('input, select, textarea');
        for (var i = 0; i < formFields.length; i++) {
            formFields[i].addEventListener('blur', function() {
                validateField(this);
            });
            formFields[i].addEventListener('input', function() {
                if (this.parentElement.classList.contains('error')) {
                    validateField(this);
                }
            });
        }
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var isFormValid = true;
            var requiredFields = form.querySelectorAll('input[required], select[required]');
            for (var i = 0; i < requiredFields.length; i++) {
                if (!validateField(requiredFields[i])) isFormValid = false;
            }
            
            if (!isFormValid) {
                showToast('Пожалуйста, заполните все поля правильно', 'error');
                return;
            }
            
            var formData = new FormData(form);
            var data = {};
            formData.forEach(function(value, key) {
                data[key] = value;
            });
            
            localStorage.setItem('bookingName', data.name);
            localStorage.setItem('bookingPhone', data.phone);
            
            var submitBtn = form.querySelector('button[type="submit"]');
            var originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner"></span>Отправка...';
            
            fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(function(response) { return response.json(); })
            .then(function(result) {
                if (result.success) {
                    showToast('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами для согласования времени.', 'success');
                    form.reset();
                    form.querySelector('[name="name"]').value = data.name;
                    form.querySelector('[name="phone"]').value = data.phone;
                } else {
                    showToast(result.error || 'Ошибка отправки', 'error');
                }
            })
            .catch(function(error) {
                showToast('Ошибка соединения. Попробуйте позже.', 'error');
                console.error(error);
            })
            .finally(function() {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            });
        });
    }

    var faqQuestions = document.querySelectorAll('.faq-question');
    for (var i = 0; i < faqQuestions.length; i++) {
        faqQuestions[i].addEventListener('click', function() {
            var item = this.parentElement;
            var answer = item.querySelector('.faq-answer');
            var isActive = item.classList.contains('active');
            
            var allItems = document.querySelectorAll('.faq-item');
            for (var j = 0; j < allItems.length; j++) {
                allItems[j].classList.remove('active');
                allItems[j].querySelector('.faq-answer').style.maxHeight = null;
            }
            
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    }
    
    var faqAnswers = document.querySelectorAll('.faq-answer');
    for (var i = 0; i < faqAnswers.length; i++) {
        faqAnswers[i].style.transition = 'max-height 0.4s ease, padding 0.4s ease';
    }
    
    if (localStorage.getItem('cookiesAccepted') !== 'true') {
        var cookieBanner = document.getElementById('cookieBanner');
        if (cookieBanner) cookieBanner.classList.add('show');
    }

    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function(entries) {
        for (var i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                entries[i].target.style.opacity = '1';
                entries[i].target.style.transform = 'translateY(0)';
            }
        }
    }, observerOptions);

    var animateElements = document.querySelectorAll('.service-card, .portfolio-item, .review-card, .certificate-card, .faq-item, .about-grid, .contacts-grid, .section-title');
    for (var i = 0; i < animateElements.length; i++) {
        animateElements[i].style.opacity = '0';
        animateElements[i].style.transform = 'translateY(40px)';
        animateElements[i].style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(animateElements[i]);
    }

    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
        anchors[i].addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                var headerHeight = header ? header.offsetHeight : 0;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    var scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
