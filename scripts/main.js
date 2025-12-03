/**
 * ============================================
 * FLOWPILOT - Script Principal da Landing Page
 * ============================================
 * 
 * Responsável por gerenciar todas as interações da página inicial:
 * - Menu mobile responsivo (sidebar)
 * - Efeitos de scroll no header
 * - Sistema de accordion para FAQ
 * - Navegação suave entre seções
 * 
 * @author Equipe FlowPilot
 * @version 1.0
 * @date Dezembro 2025
 */

// ==========================================
// INICIALIZAÇÃO DO SCRIPT
// ==========================================
// Aguarda o carregamento completo do DOM antes de executar
// Garante que todos os elementos HTML estejam disponíveis
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // CACHE DE ELEMENTOS DO DOM
    // ==========================================
    // Armazena referências aos elementos para evitar múltiplas consultas
    // Melhora significativamente a performance do script
    
    const mobileSidebar = document.getElementById('mobile-sidebar');      // Menu lateral mobile
    const mobileOverlay = document.querySelector('.mobile-overlay');      // Overlay escuro de fundo
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle'); // Botão hambúrguer
    const closeSidebar = document.getElementById('close-sidebar');        // Botão X de fechar
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a'); // Links do menu
    const header = document.querySelector('header');                      // Cabeçalho da página
    const faqItems = document.querySelectorAll('.faq-item');             // Itens de perguntas frequentes
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]'); // Links de navegação interna

    // ==========================================
    // FUNÇÕES DO MENU MOBILE
    // ==========================================
    
    /**
     * Abre o menu lateral mobile
     * 
     * Ações executadas:
     * 1. Adiciona classe 'active' ao sidebar e overlay
     * 2. Bloqueia o scroll da página principal
     * 3. Fornece feedback tátil (vibração) em dispositivos compatíveis
     */
    function openSidebar() {
        // Verifica se os elementos existem antes de manipulá-los
        if (mobileSidebar && mobileOverlay) {
            mobileSidebar.classList.add('active');           // Mostra o menu
            mobileOverlay.classList.add('active');           // Mostra o overlay
            document.body.style.overflow = 'hidden';         // Bloqueia scroll do body
            
            // Feedback háptico para melhor UX em mobile
            if (navigator.vibrate) {
                navigator.vibrate(10); // Vibração de 10ms
            }
        }
    }

    /**
     * Fecha o menu lateral mobile
     * 
     * Ações executadas:
     * 1. Remove classes 'active' do sidebar e overlay
     * 2. Restaura o scroll normal da página
     * 3. Fornece feedback tátil
     */
    function closeSidebarFunc() {
        if (mobileSidebar && mobileOverlay) {
            mobileSidebar.classList.remove('active');        // Esconde o menu
            mobileOverlay.classList.remove('active');        // Esconde o overlay
            document.body.style.overflow = '';               // Restaura scroll
            
            // Feedback háptico
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    }

    // ==========================================
    // EVENT LISTENERS - MENU MOBILE
    // ==========================================
    
    // Botão de abrir menu (ícone hambúrguer no canto superior)
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Previne propagação do evento
            openSidebar();
        });
    }

    // Botão X para fechar o menu
    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarFunc);
    }

    // Clicar fora do menu (no overlay escuro) também fecha
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeSidebarFunc);
    }

    // Fechar menu ao clicar em qualquer link de navegação
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeSidebarFunc();
        });
    });

    // ==========================================
    // EFEITO DE HIDE/SHOW DO HEADER NO SCROLL
    // ==========================================
    // Esconde o header ao rolar para baixo, mostra ao rolar para cima
    // Melhora a experiência de leitura em mobile
    
    let lastScrollTop = 0; // Armazena a última posição do scroll

    window.addEventListener('scroll', function() {
        // Obtém a posição atual do scroll (compatível com todos os browsers)
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Rolando para BAIXO - esconde header
            // Só esconde se o menu mobile não estiver aberto
            if (mobileSidebar && !mobileSidebar.classList.contains('active')) {
                header?.classList.add('hidden');
            }
        } else if (scrollTop < lastScrollTop) {
            // Rolando para CIMA - mostra header
            header?.classList.remove('hidden');
        }

        // Atualiza a última posição (evita valores negativos)
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true }); // passive: true melhora performance

    // ==========================================
    // SISTEMA DE ACCORDION - FAQ
    // ==========================================
    // Permite expandir/recolher perguntas frequentes
    // Fecha automaticamente outras perguntas ao abrir uma nova
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', function() {
            // Fecha todos os outros itens (comportamento accordion)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Alterna o estado do item clicado (abre/fecha)
            item.classList.toggle('active');
        });
    });

    // ==========================================
    // NAVEGAÇÃO SUAVE (SMOOTH SCROLL)
    // ==========================================
    // Implementa scroll suave para links de navegação interna (#section)
    // Melhora a experiência do usuário ao navegar pela página
    
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Ignora links vazios ou externos
            if (targetId === '#') return;

            // Tratamento especial para o link "Início"
            if (targetId === '#hero') {
                const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                
                // Se já estiver no topo (<100px), não faz nada
                if (currentScrollPosition < 100) {
                    e.preventDefault();
                    return;
                }
                
                // Se não estiver no topo, rola suavemente para o início
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                // Fecha o menu mobile se estiver aberto
                if (mobileSidebar && mobileSidebar.classList.contains('active')) {
                    closeSidebarFunc();
                }
                return;
            }

            // Para outras seções, rola até o elemento alvo
            e.preventDefault();

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Rola até o elemento menos 80px (altura do header fixo)
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Fecha o menu mobile se estiver aberto
                if (mobileSidebar && mobileSidebar.classList.contains('active')) {
                    closeSidebarFunc();
                }
            }
        });
    });
});
