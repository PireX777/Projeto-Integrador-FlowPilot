// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Toggle Password Visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Simulate login process
            simulateLogin(email, password, rememberMe);
        });
    }
    
    // Forgot Password Modal
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const closeModal = document.querySelector('.close');
    
    if (forgotPasswordLink && forgotPasswordModal) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            forgotPasswordModal.style.display = 'block';
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            forgotPasswordModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === forgotPasswordModal) {
            forgotPasswordModal.style.display = 'none';
        }
    });
    
    // Forgot Password Form Submission
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('recoveryEmail').value;
            
            // Simulate password recovery
            simulatePasswordRecovery(email);
        });
    }
    
    // Social Login Buttons
    const googleBtn = document.querySelector('.btn-google');
    const microsoftBtn = document.querySelector('.btn-microsoft');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            showNotification('Redirecionando para autenticação do Google...', 'info');
            // In a real application, this would redirect to Google OAuth
        });
    }
    
    if (microsoftBtn) {
        microsoftBtn.addEventListener('click', function() {
            showNotification('Redirecionando para autenticação da Microsoft...', 'info');
            // In a real application, this would redirect to Microsoft OAuth
        });
    }
    
    // Form Input Validation
    const formInputs = document.querySelectorAll('input[required]');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
});

// Simulate Login Process
function simulateLogin(email, password, rememberMe) {
    const loginBtn = document.querySelector('.btn-login');
    
    // Show loading state
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Basic validation (in a real app, this would be done server-side)
        if (email && password) {
            // Successful login
            showNotification('Login realizado com sucesso! Redirecionando...', 'success');
            
            // Store login state (in a real app, this would be a token)
            if (rememberMe) {
                localStorage.setItem('userEmail', email);
            }
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            // Failed login
            showNotification('E-mail ou senha incorretos. Tente novamente.', 'error');
            
            // Reset button state
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    }, 2000);
}

// Simulate Password Recovery
function simulatePasswordRecovery(email) {
    if (email) {
        showNotification(`Instruções de recuperação enviadas para ${email}`, 'success');
        
        // Close modal after a delay
        setTimeout(() => {
            document.getElementById('forgotPasswordModal').style.display = 'none';
            document.getElementById('forgotPasswordForm').reset();
        }, 2000);
    } else {
        showNotification('Por favor, insira um e-mail válido.', 'error');
    }
}

// Field Validation
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.id;
    
    // Clear previous error
    clearFieldError(field);
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Por favor, insira um e-mail válido.');
            return false;
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 6) {
            showFieldError(field, 'A senha deve ter pelo menos 6 caracteres.');
            return false;
        }
    }
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo é obrigatório.');
        return false;
    }
    
    return true;
}

function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--danger);
        font-size: 0.8rem;
        margin-top: 5px;
    `;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.remove();
    });
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${getNotificationColor(type)};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s, slideOut 0.3s 2.7s;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function getNotificationColor(type) {
    const colors = {
        success: '#4bb543',
        error: '#dc3545',
        info: '#4361ee',
        warning: '#ffcc00'
    };
    
    return colors[type] || colors.info;
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .error {
        border-color: var(--danger) !important;
    }
    
    .input-with-icon.error i {
        color: var(--danger);
    }
`;
document.head.appendChild(style);

// Check for remembered email on page load
window.addEventListener('load', function() {
    const rememberedEmail = localStorage.getItem('userEmail');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('rememberMe').checked = true;
    }
});