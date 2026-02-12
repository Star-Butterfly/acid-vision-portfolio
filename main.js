document.addEventListener('DOMContentLoaded', () => {
    
    // --- ПРЕЛОАДЕР ---
    const progressBar = document.querySelector('.loader-progress');
    const body = document.body;
    let width = 0;
    
    if (progressBar) {
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    body.classList.add('loaded');
                }, 500);
            } else {
                width++;
                progressBar.style.width = width + '%';
            }
        }, 15);
    } else {
        body.classList.add('loaded');
    }

    // --- КАСТОМНЫЙ КУРСОР ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const magnetics = document.querySelectorAll('.magnetic');
        magnetics.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('hovered');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hovered');
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    }

    // --- ГЛАВНОЕ МЕНЮ ---
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');

    if (menuToggle && menuOverlay) {
        menuToggle.addEventListener('click', () => {
            menuOverlay.classList.toggle('active');
            
            const isOpen = menuOverlay.classList.contains('active');
            const bars = document.querySelectorAll('.menu-bars span');
            const menuText = document.querySelector('.menu-text');

            if (isOpen) {
                menuText.textContent = 'ЗАКРЫТЬ';
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                menuText.textContent = 'МЕНЮ';
                bars[0].style.transform = 'none';
                bars[1].style.transform = 'none';
            }
        });

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
            });
        });
    }

    // --- АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // --- ОБРАБОТКА ФОРМ ---
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = 'ОТПРАВКА...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                btn.textContent = 'СИГНАЛ ПРИНЯТ';
                btn.style.background = '#fff';
                btn.style.color = '#000';
                form.reset();
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    // --- МАГНИТНЫЕ КНОПКИ ---
    const magneticBtns = document.querySelectorAll('.magnetic-wrap');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;
            if(btn.children[0]) {
                btn.children[0].style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
            }
        });

        btn.addEventListener('mouseleave', () => {
            if(btn.children[0]) {
                btn.children[0].style.transform = 'translate(0px, 0px) scale(1)';
            }
        });
    });

    // --- ГЛИТЧ-ПЕРЕХОД МЕЖДУ СТРАНИЦАМИ ---
    const internalLinks = document.querySelectorAll('a:not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([target="_blank"])');
    const glitchOverlay = document.getElementById('page-transition-glitch');
    
    if (glitchOverlay) {
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const destination = link.href;
                if (destination === window.location.href || destination.endsWith('#')) return;

                e.preventDefault();
                glitchOverlay.innerHTML = '';
                const slices = 10;
                for (let i = 0; i < slices; i++) {
                    const slice = document.createElement('div');
                    slice.classList.add('glitch-slice');
                    slice.style.animationDelay = `${Math.random() * 0.2}s`;
                    glitchOverlay.appendChild(slice);
                }
                glitchOverlay.classList.add('active');
                setTimeout(() => { window.location = destination; }, 800);
            });
        });
    }

    // --- КАЛЬКУЛЯТОР (Только на Главной) ---
    const totalPriceDisplay = document.getElementById('total-price');
    const checkboxes = document.querySelectorAll('.calc-option input');
    
    if (totalPriceDisplay && checkboxes.length > 0) {
        let total = 0;
        checkboxes.forEach(check => {
            check.addEventListener('change', () => {
                const price = parseInt(check.getAttribute('data-price'));
                total = check.checked ? total + price : total - price;
                animateValue(totalPriceDisplay, parseInt(totalPriceDisplay.innerText.replace(/\s/g, '')), total, 500);
            });
        });
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString('ru-RU');
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    // --- ИНТЕРАКТИВНЫЕ УСЛУГИ (Только на Главной) ---
    const serviceItems = document.querySelectorAll('.service-item');
    const bgOverlay = document.querySelector('.services-bg-overlay');

    if (serviceItems.length > 0 && bgOverlay) {
        serviceItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const bg = item.getAttribute('data-bg');
                bgOverlay.style.backgroundImage = `url(${bg})`;
                bgOverlay.style.opacity = '0.3';
            });
            item.addEventListener('mouseleave', () => {
                bgOverlay.style.opacity = '0';
            });
        });
    }

    // --- DRAG-N-DROP ОКНО (Только на Главной) ---
    const dragWin = document.getElementById('draggableWindow');
    if (dragWin) {
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        let xOffset = 0, yOffset = 0;

        dragWin.addEventListener('mousedown', (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === dragWin || e.target.closest('.window-header')) isDragging = true;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                dragWin.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
            }
        });

        document.addEventListener('mouseup', () => {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        });

        const closeWinBtn = document.querySelector('.close-win');
        if (closeWinBtn) {
            closeWinBtn.addEventListener('click', () => { dragWin.style.display = 'none'; });
        }
    }

    
    // --- LIGHTBOX (ПРОСМОТР КАРТИНОК) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('close-lightbox');
    
    // Выбираем и обертки на главной, и строки в архиве
    const workItems = document.querySelectorAll('.work-img-wrapper, .project-row');

    if (lightbox && lightboxImg && workItems.length > 0) {
        workItems.forEach(item => {
            item.addEventListener('click', () => {
                // Ищем картинку внутри кликнутого элемента
                const img = item.querySelector('img');
                if (img) {
                    const src = img.getAttribute('src');
                    lightboxImg.setAttribute('src', src);
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    document.body.classList.add('lightbox-open');
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
            document.body.classList.remove('lightbox-open');
            setTimeout(() => { lightboxImg.setAttribute('src', ''); }, 400);
        };

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
    }
});