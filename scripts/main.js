document.addEventListener('DOMContentLoaded', function() {
    // Mobile Sidebar Navigation
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const swipeIndicator = document.getElementById('swipe-indicator');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    // Função para abrir sidebar
    function openSidebar() {
        if (mobileSidebar && mobileOverlay) {
            mobileSidebar.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    }

    // Função para fechar sidebar
    function closeSidebarFunc() {
        if (mobileSidebar && mobileOverlay) {
            mobileSidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    }

    // Toggle do menu mobile
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            openSidebar();
        });
    }

    // Fechar sidebar
    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarFunc);
    }

    // Fechar ao clicar no overlay
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeSidebarFunc);
    }

    // Fechar ao clicar em links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeSidebarFunc();
        });
    });

    // Swipe para abrir/fechar menu
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let touchStartTime = 0;
    let isSwiping = false;

    // Mostrar indicador após 3 segundos
    if (swipeIndicator && window.innerWidth <= 768) {
        setTimeout(() => {
            swipeIndicator.classList.add('visible');
            setTimeout(() => {
                swipeIndicator.classList.remove('visible');
            }, 2000);
        }, 3000);
    }

    const handleTouchStart = (e) => {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
        touchStartTime = Date.now();
        isSwiping = false;

        // Mostrar indicador se tocar na borda
        if (touchStartX < 50 && !mobileSidebar.classList.contains('active') && swipeIndicator) {
            swipeIndicator.classList.add('visible');
        }
    };

    const handleTouchMove = (e) => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;

        const swipeDistanceX = touchEndX - touchStartX;
        const swipeDistanceY = Math.abs(touchEndY - touchStartY);

        // Detectar swipe horizontal
        if (Math.abs(swipeDistanceX) > 10 && swipeDistanceY < 30) {
            isSwiping = true;

            // Feedback visual durante o swipe
            if (mobileSidebar && touchStartX < 80 && swipeDistanceX > 0 && !mobileSidebar.classList.contains('active')) {
                const translateX = Math.min(swipeDistanceX - mobileSidebar.offsetWidth, 0);
                mobileSidebar.style.transform = `translateX(${translateX}px)`;
                mobileSidebar.style.transition = 'none';

                if (swipeIndicator) {
                    swipeIndicator.style.opacity = Math.min(swipeDistanceX / 100, 0.8);
                }
            } else if (mobileSidebar && mobileSidebar.classList.contains('active') && swipeDistanceX < 0) {
                const translateX = Math.max(swipeDistanceX, -mobileSidebar.offsetWidth);
                mobileSidebar.style.transform = `translateX(${translateX}px)`;
                mobileSidebar.style.transition = 'none';
            }
        }
    };

    const handleTouchEnd = (e) => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;

        if (mobileSidebar) {
            mobileSidebar.style.transform = '';
            mobileSidebar.style.transition = '';
        }

        if (swipeIndicator) {
            swipeIndicator.classList.remove('visible');
            swipeIndicator.style.opacity = '';
        }

        if (isSwiping) {
            handleSwipe();
        }
    };

    const handleSwipe = () => {
        const swipeDistanceX = touchEndX - touchStartX;
        const swipeDistanceY = Math.abs(touchEndY - touchStartY);
        const swipeTime = Date.now() - touchStartTime;
        const swipeVelocity = Math.abs(swipeDistanceX) / swipeTime;

        // Verificar se é swipe horizontal
        if (swipeDistanceY < 80) {
            // Swipe da esquerda para direita para abrir
            if ((swipeDistanceX > 100 || (swipeDistanceX > 50 && swipeVelocity > 0.5)) 
                && touchStartX < 80 && !mobileSidebar.classList.contains('active')) {
                openSidebar();
            }

            // Swipe da direita para esquerda para fechar
            if ((swipeDistanceX < -100 || (swipeDistanceX < -50 && swipeVelocity > 0.5)) 
                && mobileSidebar.classList.contains('active')) {
                closeSidebarFunc();
            }
        }
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Header hide/show on scroll
    let lastScrollTop = 0;
    const header = document.querySelector('header');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scroll down - hide header only if sidebar is not active
            if (mobileSidebar && !mobileSidebar.classList.contains('active')) {
                header.classList.add('hidden');
            }
        } else if (scrollTop < lastScrollTop) {
            // Scroll up - show header
            header.classList.remove('hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
                    item.classList.toggle('active');
                });
            });

            // Smooth Scrolling for Navigation Links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;

                    // Lógica especial para o link "Início"
                    if (targetId === '#hero') {
                        const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                        
                        // Se já estiver no topo (menos de 100px do início), não faz nada
                        if (currentScrollPosition < 100) {
                            e.preventDefault();
                            return;
                        }
                        
                        // Se não estiver no topo, sobe para o topo da página (não para o #hero)
                        e.preventDefault();
                        window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        if (navLinks.classList.contains('active')) {
                            navLinks.classList.remove('active');
                            authButtons.classList.remove('active');
                        }
                        return;
                    }

                    e.preventDefault();

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });

                        // Close mobile menu if open
                        if (navLinks.classList.contains('active')) {
                            navLinks.classList.remove('active');
                            authButtons.classList.remove('active');
                        }
                    }
                });
            });
        });
