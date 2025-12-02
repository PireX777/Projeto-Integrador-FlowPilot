// Sistema de verificação de autenticação
(function() {
    'use strict';
    
    /**
     * Verifica autenticação do usuário e controla acesso às páginas
     */
    function verificarAutenticacao() {
        const usuarioLogado = localStorage.getItem('flowpilot_logged_in');
        const dadosUsuario = localStorage.getItem('flowpilot_user');
        const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
        
        // Log de diagnóstico
        console.log('[AUTH]', {
            pagina: paginaAtual,
            logado: usuarioLogado === 'true',
            temDados: !!dadosUsuario
        });
        
        // Controle de acesso ao dashboard
        if (paginaAtual === 'dashboard.html') {
            const estaAutenticado = usuarioLogado === 'true' && dadosUsuario;
            
            if (estaAutenticado) {
                console.log('[AUTH] ✅ Acesso autorizado');
                return true;
            }
            
            // Usuário não autenticado - redirecionar
            console.log('[AUTH] ❌ Acesso negado - redirecionando');
            
            // Prevenir carregamento da página
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function(e) {
                    e.stopImmediatePropagation();
                }, true);
            }
            
            // Redirecionar para cadastro
            window.location.replace('register.html');
            
            // Interromper execução
            throw new Error('Redirecionamento em andamento');
        }
        
        return true;
    }
    
    // Executar verificação
    try {
        verificarAutenticacao();
    } catch (erro) {
        // Silenciar erros de redirecionamento
        if (!erro.message.includes('Redirecionamento')) {
            console.error('[AUTH] Erro:', erro);
        }
    }
})();
