document.addEventListener('DOMContentLoaded', function() {
    // Mobile Sidebar Navigation
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');

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
