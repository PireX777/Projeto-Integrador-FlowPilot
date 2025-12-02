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
            
            // Não está logado - redirecionar para login
            if (isLoggedIn !== 'true') {
                console.log('[AUTH-CHECK] ❌ Não logado - redirecionando para login');
                window.location.replace('login.html');
                return false;
            }
            
            // Logado mas sem dados de usuário (inconsistência)
            if (!userData) {
                console.log('[AUTH-CHECK] ❌ Dados de usuário ausentes - limpando sessão');
                localStorage.removeItem('flowpilot_logged_in');
                window.location.replace('login.html');
                return false;
            }
        }
        
        return true;
    }
    
    // Executar verificação imediatamente
    checkAuth();
})();
