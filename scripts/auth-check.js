/**
 * ============================================
 * FLOWPILOT - Sistema de Verificação de Autenticação
 * ============================================
 * 
 * Script de segurança que protege páginas restritas:
 * - Verifica se usuário está autenticado
 * - Controla acesso ao dashboard
 * - Redireciona usuários não autorizados
 * - Executa ANTES de qualquer outro script
 * 
 * IMPORTANTE: Este arquivo deve ser carregado primeiro no HTML
 * para garantir que a verificação ocorra antes do carregamento da página
 * 
 * @author Equipe FlowPilot
 * @version 1.0
 * @date Dezembro 2025
 */

// ==========================================
// IIFE (Immediately Invoked Function Expression)
// ==========================================
// Encapsula o código para evitar poluição do escopo global
(function() {
    'use strict'; // Modo estrito para melhor segurança e performance
    
    /**
     * Verifica o estado de autenticação do usuário
     * 
     * Processo:
     * 1. Verifica se há dados de sessão no localStorage
     * 2. Identifica a página atual sendo acessada
     * 3. Se for dashboard, valida autenticação
     * 4. Redireciona para registro se não autenticado
     * 
     * @returns {boolean} true se autenticado ou página pública
     */
    function verificarAutenticacao() {
        // ==========================================
        // OBTER DADOS DE AUTENTICAÇÃO
        // ==========================================
        // Verifica no localStorage se usuário fez login
        const usuarioLogado = localStorage.getItem('flowpilot_logged_in');
        const dadosUsuario = localStorage.getItem('flowpilot_user');
        
        // Identifica a página atual (ex: dashboard.html, login.html, etc)
        const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
        
        // ==========================================
        // LOG DE DIAGNÓSTICO
        // ==========================================
        // Útil para debugging e monitoramento
        console.log('[AUTH]', {
            pagina: paginaAtual,
            logado: usuarioLogado === 'true',
            temDados: !!dadosUsuario
        });
        
        // ==========================================
        // CONTROLE DE ACESSO AO DASHBOARD
        // ==========================================
        // Protege a página do dashboard de acessos não autorizados
        if (paginaAtual === 'dashboard.html') {
            // Verifica se o usuário está realmente autenticado
            // Ambas as condições devem ser verdadeiras:
            // 1. Flag de login ativa
            // 2. Dados do usuário presentes
            const estaAutenticado = usuarioLogado === 'true' && dadosUsuario;
            
            if (estaAutenticado) {
                // ✅ Acesso autorizado
                console.log('[AUTH] ✅ Acesso autorizado');
                return true;
            }
            
            // ❌ Acesso negado - iniciar redirecionamento
            console.log('[AUTH] ❌ Acesso negado - redirecionando');
            
            // ==========================================
            // PREVENIR CARREGAMENTO DA PÁGINA
            // ==========================================
            // Impede que o dashboard seja exibido antes do redirect
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function(e) {
                    e.stopImmediatePropagation(); // Bloqueia propagação do evento
                }, true);
            }
            
            // ==========================================
            // REDIRECIONAR PARA CADASTRO
            // ==========================================
            // replace() em vez de href para não criar histórico
            // Previne que usuário use botão "voltar" para burlar segurança
            window.location.replace('register.html');
            
            // Lança erro para interromper execução de outros scripts
            throw new Error('Redirecionamento em andamento');
        }
        
        // Página pública ou autenticada - permite acesso
        return true;
    }
    
    // ==========================================
    // EXECUÇÃO DA VERIFICAÇÃO
    // ==========================================
    try {
        verificarAutenticacao();
    } catch (erro) {
        // Silenciar erros de redirecionamento
        if (!erro.message.includes('Redirecionamento')) {
            console.error('[AUTH] Erro:', erro);
        }
    }
})();
