document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const signupForm = document.getElementById('signupForm');
            const firstNameInput = document.getElementById('firstName');
            const lastNameInput = document.getElementById('lastName');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const companyInput = document.getElementById('company');
            const togglePassword = document.getElementById('togglePassword');
            const termsCheckbox = document.getElementById('termsCheckbox');
            const signupButton = document.getElementById('signupButton');
            const passwordStrength = document.getElementById('passwordStrength');
            const loginLink = document.getElementById('loginLink');

            // Toggle password visibility
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });

            // Terms checkbox
            termsCheckbox.addEventListener('click', function() {
                this.classList.toggle('checked');
            });

            // Password strength indicator
            passwordInput.addEventListener('input', function() {
                updatePasswordStrength(this.value);
            });

            // Form submission
            signupForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const firstName = firstNameInput.value.trim();
                const lastName = lastNameInput.value.trim();
                const email = emailInput.value.trim();
                const password = passwordInput.value;
                const confirmPassword = confirmPasswordInput.value;
                const company = companyInput.value.trim();
                const termsAccepted = termsCheckbox.classList.contains('checked');
                
                // Clear previous errors
                clearErrors();
                
                // Validate form
                if (validateForm(firstName, lastName, email, password, confirmPassword, termsAccepted)) {
                    simulateSignup(firstName, lastName, email, password, company);
                }
            });

            loginLink.addEventListener('click', function(e) {
    e.preventDefault();
    showNotification('Redirecionando para login...', 'info');
    // Adicione um pequeno delay para mostrar a notificação antes de redirecionar
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
});

            // Social signup buttons
            document.querySelectorAll('.social-button').forEach(button => {
                button.addEventListener('click', function() {
                    const provider = this.classList.contains('google') ? 'Google' : 'Microsoft';
                    showNotification(`Cadastrando com ${provider}...`, 'info');
                });
            });

            // Password strength calculation
            function updatePasswordStrength(password) {
                let strength = 0;
                const strengthText = passwordStrength.querySelector('.strength-text');
                
                // Reset classes
                passwordStrength.className = 'password-strength';
                
                if (password.length === 0) {
                    strengthText.textContent = 'Força da senha';
                    return;
                }

                // Length check
                if (password.length >= 8) strength += 1;
                if (password.length >= 12) strength += 1;

                // Character variety checks
                if (/[a-z]/.test(password)) strength += 1;
                if (/[A-Z]/.test(password)) strength += 1;
                if (/[0-9]/.test(password)) strength += 1;
                if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

                // Update display
                if (strength <= 2) {
                    passwordStrength.classList.add('strength-weak');
                    strengthText.textContent = 'Senha fraca';
                } else if (strength <= 4) {
                    passwordStrength.classList.add('strength-medium');
                    strengthText.textContent = 'Senha média';
                } else if (strength <= 5) {
                    passwordStrength.classList.add('strength-strong');
                    strengthText.textContent = 'Senha forte';
                } else {
                    passwordStrength.classList.add('strength-very-strong');
                    strengthText.textContent = 'Senha muito forte';
                }
            }

            // Validation functions
            function validateForm(firstName, lastName, email, password, confirmPassword, termsAccepted) {
                let isValid = true;
                
                if (!firstName) {
                    showFieldError(firstNameInput, 'Por favor, insira seu nome.');
                    isValid = false;
                }
                
                if (!lastName) {
                    showFieldError(lastNameInput, 'Por favor, insira seu sobrenome.');
                    isValid = false;
                }
                
                if (!validateEmail(email)) {
                    showFieldError(emailInput, 'Por favor, insira um e-mail válido.');
                    isValid = false;
                }
                
                if (!password) {
                    showFieldError(passwordInput, 'Por favor, insira uma senha.');
                    isValid = false;
                } else if (password.length < 8) {
                    showFieldError(passwordInput, 'A senha deve ter pelo menos 8 caracteres.');
                    isValid = false;
                }
                
                if (password !== confirmPassword) {
                    showFieldError(confirmPasswordInput, 'As senhas não coincidem.');
                    isValid = false;
                }
                
                if (!termsAccepted) {
                    showNotification('Você precisa aceitar os termos de serviço.', 'error');
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
                
                wrapper.parentNode.appendChild(errorElement);
            }

            function clearErrors() {
                document.querySelectorAll('.error').forEach(element => {
                    element.classList.remove('error');
                });
                
                document.querySelectorAll('.error-message').forEach(element => {
                    element.remove();
                });
            }

            // Simulate signup process
            function simulateSignup(firstName, lastName, email, password, company) {
                signupButton.classList.add('loading');
                
                setTimeout(() => {
                    signupButton.classList.remove('loading');
                    showNotification('Conta criada com sucesso! Redirecionando...', 'success');
                    
                    // In a real app, you would redirect here
                    setTimeout(() => {
                        // window.location.href = '/dashboard';
                        console.log('Redirecting to dashboard...');
                    }, 2000);
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
        });