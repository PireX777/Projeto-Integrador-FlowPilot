document.addEventListener('DOMContentLoaded', function() {
    // Cache all DOM elements
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const rememberCheckbox = document.getElementById('rememberCheckbox');
    const loginButton = document.getElementById('loginButton');
    const forgotPasswordLink = document.getElementById('forgotPassword');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeModal = document.getElementById('closeModal');
    const recoveryForm = document.getElementById('recoveryForm');
    const signupLink = document.getElementById('signupLink');
    const socialButtons = document.querySelectorAll('.social-button');
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

    // Mobile Menu Toggle

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            if (navLinks) navLinks.classList.toggle('active');
            if (authButtons) authButtons.classList.toggle('active');
        });
    }

    // Não usar atributo minlength — usamos um mínimo interno para validação/visual
    const passwordMinLen = 8;

    // Toggle password visibility (guarded)
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    // Remember me checkbox (guarded)
    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('click', function() {
            this.classList.toggle('checked');
        });
        
        // Verificar se há email do registro recente
        const registeredEmail = sessionStorage.getItem('registeredEmail');
        if (registeredEmail && emailInput) {
            // Preencher com email do cadastro e NÃO marcar "lembrar de mim"
            emailInput.value = registeredEmail;
            sessionStorage.removeItem('registeredEmail');
        } else {
            // Carregar email salvo apenas se usuário marcou "lembrar de mim" anteriormente
            const rememberedEmail = localStorage.getItem('rememberedEmail');
            if (rememberedEmail && emailInput) {
                emailInput.value = rememberedEmail;
                rememberCheckbox.classList.add('checked');
            }
        }
    }

    // Forgot password modal (guarded)
    if (forgotPasswordLink && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordModal.style.display = 'flex';
        });
    }
    if (closeModal && forgotPasswordModal) {
        closeModal.addEventListener('click', function() {
            forgotPasswordModal.style.display = 'none';
        });
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === forgotPasswordModal) {
                forgotPasswordModal.style.display = 'none';
            }
        });
    }

    // Form submissions (guarded)
    if (loginForm && emailInput && passwordInput) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            // Clear previous errors
            clearErrors();

            // senha: valida mínimo de caracteres (visual + bloqueio)
            if (password.length < passwordMinLen) {
                showFieldError(passwordInput, `A senha deve ter ao menos ${passwordMinLen} caracteres.`);
                passwordInput.focus();
                return;
            }

            // Fallback para validação de e-mail se existir validateForm
            if (typeof validateForm === 'function') {
                if (!validateForm(email, password)) return;
            }

            simulateLogin(email, password);
        });
    }

    if (recoveryForm) {
        recoveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const recoveryEmailEl = document.getElementById('recoveryEmail');
            const email = recoveryEmailEl ? recoveryEmailEl.value.trim() : '';

            if (validateEmail(email)) {
                simulatePasswordRecovery(email);
            } else if (recoveryEmailEl) {
                showFieldError(recoveryEmailEl, 'Por favor, insira um e-mail válido.');
            }
        });
    }

    // Register link (guarded)
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Redirecionando para Cadastro...', 'info');
            setTimeout(() => {
                window.location.href = 'register.html';
            }, 1000);
        });
    }

    // Social login buttons (safe: NodeList even if empty)
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Microsoft';
            showNotification(`Conectando com ${provider}...`, 'info');
        });
    });

    // Validation functions
    function validateForm(email, password) {
        let isValid = true;

        if (!validateEmail(email)) {
            if (emailInput) showFieldError(emailInput, 'Por favor, insira um e-mail válido.');
            isValid = false;
        }

        if (!password) {
            if (passwordInput) showFieldError(passwordInput, 'Por favor, insira sua senha.');
            isValid = false;
        } else if (password.length < passwordMinLen) {
            if (passwordInput) showFieldError(passwordInput, `A senha deve ter no mínimo ${passwordMinLen} caracteres.`);
            isValid = false;
        }

        return isValid;
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFieldError(field, message) {
        if (!field) return;
        const wrapper = field.parentNode; // .input-wrapper
        const formGroup = wrapper ? (wrapper.closest('.form-group') || wrapper.parentNode) : null;
        if (!formGroup) return;

        // marca o form-group (não o wrapper) para evitar estilizar o ícone diretamente
        formGroup.classList.add('error');

        // evita duplicar mensagens
        const existing = formGroup.querySelector('.error-message');
        if (existing) existing.remove();

        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        // garante espaçamento e que não altere o fluxo do input-wrapper
        errorElement.style.display = 'block';
        errorElement.style.marginTop = '6px';

        formGroup.appendChild(errorElement);
    }

    function clearErrors() {
        document.querySelectorAll('.error').forEach(element => {
            element.classList.remove('error');
        });

        document.querySelectorAll('.error-message').forEach(element => {
            element.remove();
        });
    }

    // Remove erro de um campo específico
    function clearFieldError(field) {
        if (!field) return;
        const formGroup = field.closest('.form-group') || field.parentNode;
        if (!formGroup) return;
        formGroup.classList.remove('error');
        const existing = formGroup.querySelector('.error-message');
        if (existing) existing.remove();
    }

    // Auto-remover erro ao digitar: email
    if (emailInput) {
        emailInput.addEventListener('input', function () {
            const val = this.value.trim();
            // usa função existente validateEmail (se definida)
            if (typeof validateEmail === 'function') {
                if (validateEmail(val)) clearFieldError(this);
            } else if (val.length > 0) {
                clearFieldError(this);
            }
        });
    }

    // Auto-remover erro ao digitar: password (usa min interno)
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            if (this.value.length >= passwordMinLen) {
                clearFieldError(this);
            }
        });
    }

    // Simulate login process
    function simulateLogin(email, password) {
        if (loginButton) loginButton.classList.add('loading');

        setTimeout(() => {
            // Verificar se o usuário existe no localStorage
            const savedUser = localStorage.getItem('flowpilot_user');
            
            if (!savedUser) {
                // Nenhum usuário cadastrado no sistema
                if (loginButton) loginButton.classList.remove('loading');
                showNotification('Nenhum cadastro encontrado. Redirecionando...', 'error');
                
                // Redirecionar para a página de cadastro
                setTimeout(() => {
                    window.location.href = 'register.html';
                }, 2000);
                return;
            }
            
            // Validar credenciais
            const userData = JSON.parse(savedUser);
            
            if (userData.email !== email) {
                // Email não corresponde ao cadastrado
                if (loginButton) loginButton.classList.remove('loading');
                showNotification('E-mail não encontrado. Faça o cadastro primeiro.', 'error');
                
                // Também redirecionar para cadastro após 3 segundos
                setTimeout(() => {
                    window.location.href = 'register.html';
                }, 3000);
                return;
            }
            
            if (userData.password !== password) {
                if (loginButton) loginButton.classList.remove('loading');
                showNotification('Senha incorreta. Tente novamente.', 'error');
                return;
            }
            
            // Login bem-sucedido
            if (loginButton) loginButton.classList.remove('loading');
            
            // Marcar usuário como logado ANTES de mostrar notificação
            localStorage.setItem('flowpilot_logged_in', 'true');

            // Store remember me preference
            if (rememberCheckbox && rememberCheckbox.classList.contains('checked')) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                // Se não marcou "lembrar", remove o email salvo
                localStorage.removeItem('rememberedEmail');
            }
            
            showNotification('Login efetuado! Redirecionando para o painel.', 'success');

            // Redirect to dashboard - usar replace para garantir
            setTimeout(() => {
                window.location.replace('dashboard.html');
            }, 1000);
        }, 2000);
    }

    // Simulate password recovery
    function simulatePasswordRecovery(email) {
        // Verificar se existe usuário cadastrado
        const savedUser = localStorage.getItem('flowpilot_user');
        
        if (!savedUser) {
            showNotification('Nenhum usuário cadastrado no sistema.', 'error');
            setTimeout(() => {
                if (forgotPasswordModal) forgotPasswordModal.style.display = 'none';
                if (recoveryForm) recoveryForm.reset();
            }, 2000);
            return;
        }
        
        const userData = JSON.parse(savedUser);
        
        // Verificar se o email corresponde ao cadastrado
        if (userData.email !== email) {
            showNotification('E-mail não encontrado no sistema.', 'error');
            return;
        }
        
        // Email encontrado - fechar modal de recuperação
        if (forgotPasswordModal) forgotPasswordModal.style.display = 'none';
        if (recoveryForm) recoveryForm.reset();
        
        // Mostrar modal com a senha
        const passwordDisplayModal = document.getElementById('passwordDisplayModal');
        const displayedPassword = document.getElementById('displayedPassword');
        const closePasswordModal = document.getElementById('closePasswordModal');
        const copyPasswordBtn = document.getElementById('copyPasswordBtn');
        
        if (passwordDisplayModal && displayedPassword) {
            displayedPassword.textContent = userData.password;
            passwordDisplayModal.style.display = 'flex';
            
            // Preencher o email e senha no formulário de login
            if (emailInput) emailInput.value = email;
            if (passwordInput) passwordInput.value = userData.password;
            
            // Evento para fechar modal
            if (closePasswordModal) {
                closePasswordModal.onclick = function() {
                    passwordDisplayModal.style.display = 'none';
                };
            }
            
            // Evento para copiar senha
            if (copyPasswordBtn) {
                copyPasswordBtn.onclick = function() {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(userData.password).then(() => {
                            showNotification('Senha copiada!', 'success');
                        }).catch(err => {
                            console.log('Erro ao copiar:', err);
                        });
                    }
                };
            }
            
            // Fechar ao clicar fora
            window.onclick = function(event) {
                if (event.target === passwordDisplayModal) {
                    passwordDisplayModal.style.display = 'none';
                }
            };
        }
    }

    // Notification system
    let currentNotification = null;
    function showNotification(message, type) {
        // Remove existing notification
        if (currentNotification && currentNotification.parentNode) {
            currentNotification.parentNode.removeChild(currentNotification);
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type || 'info'}`;
        notification.textContent = message;

        // Style the notification
        const bgColor = type === 'success' ? 'var(--success)' :
                       type === 'error' ? 'var(--danger)' : '#4CC9F0';

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${bgColor};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            font-weight: 500;
            max-width: 300px;
        `;

        document.body.appendChild(notification);
        currentNotification = notification;

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
                if (currentNotification === notification) {
                    currentNotification = null;
                }
            }
        }, 3000);
    }

    // Add animation for notification (only once)
    if (!document.getElementById('login-notify-style')) {
        const style = document.createElement('style');
        style.id = 'login-notify-style';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // Check for remembered email
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail && emailInput) {
        emailInput.value = rememberedEmail;
        if (rememberCheckbox) rememberCheckbox.classList.add('checked');
    }

    // Smooth Scrolling for Navigation Links (moved inside DOMContentLoaded and guarded)
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Close mobile menu if open (guarded)
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
                if (authButtons && authButtons.classList.contains('active')) {
                    authButtons.classList.remove('active');
                }
            }
        });
    });
});