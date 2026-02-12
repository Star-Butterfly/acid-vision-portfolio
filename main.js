document.addEventListener('DOMContentLoaded', () => {
    
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

    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (window.matchMedia("(pointer: fine)").matches) {
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

    const magneticBtns = document.querySelectorAll('.magnetic-wrap');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            btn.children[0].style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.children[0].style.transform = 'translate(0px, 0px) scale(1)';
        });
    });

    // НОВАЯ ЛОГИКА ГЛИТЧА
    const internalLinks = document.querySelectorAll('a:not([href^="#"]):not([href^="mailto:"]):not([href^="tel:"]):not([target="_blank"])');
    const glitchOverlay = document.getElementById('page-transition-glitch');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const destination = link.href;

            if (destination === window.location.href || destination.endsWith('#')) {
                return;
            }

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

            setTimeout(() => {
                window.location = destination;
            }, 800);
        });
    });

    // ФУНКЦИИ КАЛЬКУЛЯТОРА (Перенесены сюда для чистой области видимости)
    const checkboxes = document.querySelectorAll('.calc-option input');
    const totalPriceDisplay = document.getElementById('total-price');
    let total = 0;

    checkboxes.forEach(check => {
        check.addEventListener('change', () => {
            const price = parseInt(check.getAttribute('data-price'));
            if (check.checked) {
                total += price;
            } else {
                total -= price;
            }
            
            animateValue(totalPriceDisplay, parseInt(totalPriceDisplay.innerText), total, 500);
        });
    });

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString('ru-RU');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // ФУНКЦИИ СЕРВИСОВ
    const serviceItems = document.querySelectorAll('.service-item');
    const bgOverlay = document.querySelector('.services-bg-overlay');

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

    // ФУНКЦИИ DRAG-N-DROP
    const dragWin = document.getElementById('draggableWindow');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    dragWin.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        if (e.target === dragWin || e.target.closest('.window-header')) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            setTranslate(currentX, currentY, dragWin);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    document.querySelector('.close-win').addEventListener('click', () => {
        dragWin.style.display = 'none';
    });


    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('close-lightbox');
    const workImages = document.querySelectorAll('.work-img-wrapper img');

    workImages.forEach(img => {
        img.parentElement.addEventListener('click', () => {
            const imgSrc = img.getAttribute('src');
            lightboxImg.setAttribute('src', imgSrc);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('lightbox-open');
        });
    });

    closeBtn.addEventListener('click', () => {
        closeLightbox();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('lightbox-open');
        setTimeout(() => {
            lightboxImg.setAttribute('src', '');
        }, 400);
    }
});