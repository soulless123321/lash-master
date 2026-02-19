document.addEventListener('DOMContentLoaded', () => {
    let bookedDates = [];
    
    async function loadBookedDates() {
        try {
            const response = await fetch('/api/dates');
            bookedDates = await response.json();
            updateTimeSlots();
        } catch (error) {
            console.error('Error loading booked dates:', error);
        }
    }
    
    function updateTimeSlots() {
        const dateInput = document.querySelector('input[type="date"]');
        const timeSelect = document.querySelector('select[name="time"]');
        
        if (!dateInput || !timeSelect) return;
        
        const selectedDate = dateInput.value;
        
        Array.from(timeSelect.options).forEach(option => {
            if (!option.value) return;
            
            const isBooked = bookedDates.some(b => 
                b.date === selectedDate && b.time === option.value
            );
            
            option.disabled = isBooked;
            option.textContent = isBooked ? option.value + ' (занято)' : option.value;
        });
    }
    
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
        dateInput.addEventListener('change', updateTimeSlots);
    }
    
    loadBookedDates();
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const form = document.getElementById('bookingForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';
        
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
                alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
                form.reset();
                loadBookedDates();
            } else {
                alert('Ошибка: ' + result.error);
            }
        } catch (error) {
            alert('Ошибка отправки. Попробуйте позже.');
            console.error(error);
        }
        
        submitBtn.disabled = false;
        submitBtn.textContent = 'Записаться на приём';
    });

    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            item.classList.toggle('active');
        });
    });

    const dateInputEl = document.querySelector('input[type="date"]');
    if (dateInputEl) {
        const today = new Date().toISOString().split('T')[0];
        dateInputEl.setAttribute('min', today);
    }
    
    if (localStorage.getItem('cookiesAccepted') !== 'true') {
        document.getElementById('cookieBanner').classList.add('show');
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

    document.querySelectorAll('.service-card, .portfolio-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
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
