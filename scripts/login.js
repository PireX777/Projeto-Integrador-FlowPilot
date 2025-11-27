document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            if (navLinks) navLinks.classList.toggle('active');
            if (authButtons) authButtons.classList.toggle('active');
        });
    }

    // Elements
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
    document.querySelectorAll('.social-button').forEach(button => {
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
            if (loginButton) loginButton.classList.remove('loading');
            showNotification('Login efetuado. Redirecionando para o painel.', 'success');

            // Store remember me preference
            if (rememberCheckbox && rememberCheckbox.classList.contains('checked')) {
                localStorage.setItem('rememberedEmail', email);
            }

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }, 2000);
    }

    // Simulate password recovery
    function simulatePasswordRecovery(email) {
        showNotification(`Instruções enviadas para ${email}`, 'success');

        setTimeout(() => {
            if (forgotPasswordModal) forgotPasswordModal.style.display = 'none';
            if (recoveryForm) recoveryForm.reset();
        }, 2000);
    }

    // Notification system
    function showNotification(message, type) {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(el => el.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type || 'info'}`;
        notification.textContent = message;

        // Style the notification
        const bgColor = type === 'success' ? 'var(--success)' :
                       type === 'error' ? 'var(--danger)' : 'var(--primary)';

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

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
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
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
                const navLinksEl = document.querySelector('.nav-links');
                const authButtonsEl = document.querySelector('.auth-buttons');
                if (navLinksEl && navLinksEl.classList.contains('active')) {
                    navLinksEl.classList.remove('active');
                }
                if (authButtonsEl && authButtonsEl.classList.contains('active')) {
                    authButtonsEl.classList.remove('active');
                }
            }
        });
    });
});