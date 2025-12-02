// Script de verificação de autenticação e redirecionamento inicial
(function() {
    // Verificar se o usuário está autenticado e cadastrado
    function checkAuth() {
        const isLoggedIn = localStorage.getItem('flowpilot_logged_in');
        const userData = localStorage.getItem('flowpilot_user');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Debug - pode remover depois
        console.log('[AUTH-CHECK]', {
            currentPage,
            isLoggedIn,
            hasUserData: !!userData
        });
        
        // Se está tentando acessar o dashboard
        if (currentPage === 'dashboard.html') {
            // Verificar se está logado E tem dados
            if (isLoggedIn === 'true' && userData) {
                console.log('[AUTH-CHECK] ✅ Acesso permitido ao dashboard');
                return true;
            }
            
            // Não está logado - redirecionar para cadastro IMEDIATAMENTE
            console.log('[AUTH-CHECK] ❌ Não autenticado - redirecionando para cadastro');
            
            // Prevenir carregamento da página
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function(e) {
                    e.stopImmediatePropagation();
                }, true);
            }
            
            // Redirecionar
            window.location.href = 'register.html';
            
            // Parar execução de scripts
            throw new Error('Redirecionando para cadastro...');
        }
        
        return true;
    }
    
    // Executar verificação imediatamente
    try {
        checkAuth();
    } catch (e) {
        // Silenciar erro de redirecionamento
        if (!e.message.includes('Redirecionando')) {
            console.error(e);
        }
    }
})();
