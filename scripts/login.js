
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile Menu Toggle
            const mobileMenu = document.querySelector('.mobile-menu');
            const navLinks = document.querySelector('.nav-links');
            const authButtons = document.querySelector('.auth-buttons');
            
            if (mobileMenu) {
                mobileMenu.addEventListener('click', function() {
                    navLinks.classList.toggle('active');
                    authButtons.classList.toggle('active');
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

            // Toggle password visibility
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });

            // Remember me checkbox
            rememberCheckbox.addEventListener('click', function() {
                this.classList.toggle('checked');
            });

            // Forgot password modal
            forgotPasswordLink.addEventListener('click', function(e) {
                e.preventDefault();
                forgotPasswordModal.style.display = 'flex';
            });

            closeModal.addEventListener('click', function() {
                forgotPasswordModal.style.display = 'none';
            });

            // Close modal when clicking outside
            window.addEventListener('click', function(e) {
                if (e.target === forgotPasswordModal) {
                    forgotPasswordModal.style.display = 'none';
                }
            });

            // Form submissions
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = emailInput.value.trim();
                const password = passwordInput.value;
                
                // Clear previous errors
                clearErrors();
                
                // Validate form
                if (validateForm(email, password)) {
                    simulateLogin(email, password);
                }
            });

            recoveryForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('recoveryEmail').value.trim();
                
                if (validateEmail(email)) {
                    simulatePasswordRecovery(email);
                } else {
                    showFieldError(document.getElementById('recoveryEmail'), 'Por favor, insira um e-mail válido.');
                }
            });

            // Signup link
            signupLink.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'register.html';
            });

            // Social login buttons
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
                    showFieldError(emailInput, 'Por favor, insira um e-mail válido.');
                    isValid = false;
                }
                
                if (!password) {
                    showFieldError(passwordInput, 'Por favor, insira sua senha.');
                    isValid = false;
                } else if (password.length < 6) {
                    showFieldError(passwordInput, 'A senha deve ter pelo menos 6 caracteres.');
                    isValid = false;
                }
                
                return isValid;
            }

            function validateEmail(email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }

            function showFieldError(field, message) {
                const wrapper = field.parentNode;
                wrapper.classList.add('error');
                
                const errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                errorElement.textContent = message;
                
                wrapper.appendChild(errorElement);
            }

            function clearErrors() {
                document.querySelectorAll('.error').forEach(element => {
                    element.classList.remove('error');
                });
                
                document.querySelectorAll('.error-message').forEach(element => {
                    element.remove();
                });
            }

            // Simulate login process
            function simulateLogin(email, password) {
                loginButton.classList.add('loading');
                
                setTimeout(() => {
                    loginButton.classList.remove('loading');
                    showNotification('Login realizado com sucesso!', 'success');
                    
                    // Store remember me preference
                    if (rememberCheckbox.classList.contains('checked')) {
                        localStorage.setItem('rememberedEmail', email);
                    }
                    
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                }, 2000);
            }

            // Simulate password recovery
            function simulatePasswordRecovery(email) {
                showNotification(`Instruções enviadas para ${email}`, 'success');
                
                setTimeout(() => {
                    forgotPasswordModal.style.display = 'none';
                    recoveryForm.reset();
                }, 2000);
            }

            // Notification system
            function showNotification(message, type) {
                // Remove existing notifications
                document.querySelectorAll('.notification').forEach(el => el.remove());
                
                const notification = document.createElement('div');
                notification.className = `notification notification-${type}`;
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

            // Add animation for notification
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);

            // Check for remembered email
            const rememberedEmail = localStorage.getItem('rememberedEmail');
            if (rememberedEmail) {
                emailInput.value = rememberedEmail;
                rememberCheckbox.classList.add('checked');
            }
        });
    // Smooth Scrolling for Navigation Links
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
                        
                        // Close mobile menu if open
                        if (navLinks.classList.contains('active')) {
                            navLinks.classList.remove('active');
                            authButtons.classList.remove('active');
                        }
                    }
                });
            });