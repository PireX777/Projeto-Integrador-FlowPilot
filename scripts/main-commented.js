/**
 * ============================================
 * FLOWPILOT - Script Principal
 * ============================================
 * 
 * Gerencia funcionalidades da página inicial:
 * - Menu mobile responsivo
 * - Animações de scroll
 * - Accordion FAQ
 * - Navegação suave entre seções
 * 
 * @author Equipe FlowPilot
 * @version 1.0
 * @date 2025
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // ===========================================
    // CACHE DE ELEMENTOS DO DOM
    // ===========================================
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
    const header = document.querySelector('header');
    const faqItems = document.querySelectorAll('.faq-item');
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    /**
     * Abre o menu lateral mobile
     */
    function openSidebar() {
        if (mobileSidebar && mobileOverlay) {
            mobileSidebar.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            if (navigator.vibrate) navigator.vibrate(10);
        }
    }

    /**
     * Fecha o menu lateral mobile
     */
    function closeSidebarFunc() {
        if (mobileSidebar && mobileOverlay) {
            mobileSidebar.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            
            if (navigator.vibrate) navigator.vibrate(10);
        }
    }

    // Event Listeners do Menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            openSidebar();
        });
    }

    if (closeSidebar) closeSidebar.addEventListener('click', closeSidebarFunc);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeSidebarFunc);
    
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeSidebarFunc);
    });

    // Header Hide/Show no Scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            if (mobileSidebar && !mobileSidebar.classList.contains('active')) {
                header?.classList.add('hidden');
            }
        } else {
            header?.classList.remove('hidden');
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });

    // FAQ Accordion
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // Smooth Scrolling
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            if (targetId === '#hero') {
                const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                if (currentScrollPosition < 100) {
                    e.preventDefault();
                    return;
                }
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
});
