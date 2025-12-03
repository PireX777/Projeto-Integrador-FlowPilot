/**
 * ============================================
 * FLOWPILOT - Script de Registro/Cadastro
 * ============================================
 * 
 * Gerencia todo o processo de cadastro de novos usuários:
 * - Validação de formulário em tempo real
 * - Máscara de telefone
 * - Indicador de força de senha
 * - Verificação de senhas correspondentes
 * - Criação de conta e redirecionamento
 * 
 * @author Equipe FlowPilot
 * @version 1.0
 * @date Dezembro 2025
 */

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // CACHE DE ELEMENTOS DO DOM
    // ==========================================
    // Armazena referências a todos os campos e elementos da página
    
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    const signupForm = document.getElementById('signupForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const companyInput = document.getElementById('company');
    const cargoInput = document.getElementById('cargo');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const termsCheckbox = document.getElementById('termsCheckbox');
    const signupButton = document.getElementById('signupButton');
    const passwordStrength = document.getElementById('passwordStrength');
    const loginLink = document.getElementById('loginLink');
    const socialButtons = document.querySelectorAll('.social-button');
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    // ==========================================
    // MENU MOBILE
    // ==========================================
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            if (navLinks) navLinks.classList.toggle('active');
            if (authButtons) authButtons.classList.toggle('active');
        });
    }

    // ==========================================
    // MÁSCARA DE TELEFONE
    // ==========================================
    // Formata automaticamente o número enquanto usuário digita
    // Formato: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove todos os caracteres não numéricos
            let value = e.target.value.replace(/\D/g, '').slice(0, 11);
            
            // Aplica a máscara conforme o tamanho
            if (value.length <= 10) {
                // Telefone fixo: (XX) XXXX-XXXX
                value = value.replace(/(\d{2})(\d{0,4})(\d{0,4})/, function(_, p1, p2, p3) {
                    return p1 ? `(${p1}${p2 ? ') ' + p2 : ''}${p3 ? '-' + p3 : ''}` : '';
                });
            } else {
                // Celular: (XX) XXXXX-XXXX
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, `($1) $2${value.length > 7 ? '-' : ''}$3`);
            }
            
            e.target.value = value;
        });
    }

    // ==========================================
    // MOSTRAR/OCULTAR SENHA
    // ==========================================
    // Permite visualizar a senha digitada
    
    // Toggle para campo de senha principal
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }

    // Toggle para campo de confirmação de senha
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);

            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // ==========================================
    // CHECKBOX DE TERMOS
    // ==========================================
    // Toggle visual do checkbox customizado
    
    if (termsCheckbox) {
        termsCheckbox.addEventListener('click', function() {
            this.classList.toggle('checked');
        });
    }

    // ==========================================
    // INDICADOR DE FORÇA DE SENHA
    // ==========================================
    // Atualiza em tempo real enquanto usuário digita
    
    if (passwordInput && passwordStrength) {
        passwordInput.addEventListener('input', function() {
            updatePasswordStrength(this.value);
        });
    }

    // ==========================================
    // SUBMISSÃO DO FORMULÁRIO
    // ==========================================
    // Valida e processa o cadastro do novo usuário
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
                e.preventDefault(); // Previne envio padrão do formulário
                
                // Coleta todos os valores dos campos
                const firstName = firstNameInput.value.trim();
                const lastName = lastNameInput.value.trim();
                const email = emailInput.value.trim();
                const phone = phoneInput ? phoneInput.value.trim() : '';
                const password = passwordInput.value;
                const confirmPassword = confirmPasswordInput.value;
                const cargo = cargoInput.value;
                const company = companyInput.value.trim();
                const termsAccepted = termsCheckbox.classList.contains('checked');
                
                // Limpa mensagens de erro anteriores
                clearErrors();
                
                // ==========================================
                // VALIDAÇÃO E PROCESSAMENTO
                // ==========================================
                // Valida todos os campos antes de criar conta
                if (validateForm(firstName, lastName, email, password, confirmPassword, termsAccepted, cargo)) {
                    // Tudo válido - processa o cadastro
                    simulateSignup(firstName, lastName, email, phone, password, company, cargo);
                }
        });
    }

    // ==========================================
    // LINK PARA LOGIN
    // ==========================================
    // Redireciona usuário que já tem conta
    
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Redirecionando para Login...', 'info');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        });
    }

    // ==========================================
    // CADASTRO COM REDES SOCIAIS
    // ==========================================
    // Google e Microsoft (integração futura)
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Identifica qual provedor foi clicado
            const provider = this.classList.contains('google') ? 'Google' : 'Microsoft';
            showNotification(`Cadastrando com ${provider}...`, 'info');
            // TODO: Implementar OAuth2 com Google/Microsoft
        });
    });

    // ==========================================
    // INDICADOR DE FORÇA DE SENHA
    // ==========================================
    /**
     * Calcula e exibe a força da senha em tempo real
     * 
     * Critérios avaliados:
     * - Comprimento (8+ caracteres = +1, 12+ = +2)
     * - Letras minúsculas = +1
     * - Letras maiúsculas = +1
     * - Números = +1
     * - Caracteres especiais = +1
     * 
     * @param {string} password - A senha a ser avaliada
     */
    function updatePasswordStrength(password) {
        let strength = 0; // Pontuação inicial
        const strengthText = passwordStrength.querySelector('.strength-text');
        
        // Reseta as classes CSS anteriores
        passwordStrength.className = 'password-strength';
        
        // Se senha vazia, mostra texto padrão
        if (password.length === 0) {
            strengthText.textContent = 'Força da senha';
            return;
        }

        // ==========================================
        // VERIFICAÇÕES DE FORÇA
        // ==========================================
        
        // Comprimento: quanto maior, melhor
        if (password.length >= 8) strength += 1;  // Mínimo aceitável
        if (password.length >= 12) strength += 1; // Bom comprimento

        // Variedade de caracteres aumenta segurança
        if (/[a-z]/.test(password)) strength += 1;      // Tem minúsculas
        if (/[A-Z]/.test(password)) strength += 1;      // Tem maiúsculas
        if (/[0-9]/.test(password)) strength += 1;      // Tem números
        if (/[^a-zA-Z0-9]/.test(password)) strength += 1; // Tem especiais (!@#$%)

        // ==========================================
        // CLASSIFICAÇÃO VISUAL
        // ==========================================
        // Atualiza cor e texto baseado na pontuação
        
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
            // 6 pontos = senha muito forte
            passwordStrength.classList.add('strength-very-strong');
            strengthText.textContent = 'Senha muito forte';
        }
    }

    // ==========================================
    // FUNÇÕES DE VALIDAÇÃO
    // ==========================================
    /**
     * Valida todos os campos do formulário de cadastro
     * 
     * @param {string} firstName - Nome do usuário
     * @param {string} lastName - Sobrenome do usuário
     * @param {string} email - E-mail do usuário
     * @param {string} password - Senha escolhida
     * @param {string} confirmPassword - Confirmação da senha
     * @param {boolean} termsAccepted - Se aceitou os termos
     * @param {string} cargo - Cargo selecionado
     * @returns {boolean} true se formulário válido, false caso contrário
     */
    function validateForm(firstName, lastName, email, password, confirmPassword, termsAccepted, cargo) {
        let isValid = true; // Assume válido até encontrar erro
        
        // Verifica campo nome
        if (!firstName) {
            showFieldError(firstNameInput, 'Por favor, insira seu nome.');
            isValid = false;
        }
        
        // Verifica campo sobrenome
        if (!lastName) {
            showFieldError(lastNameInput, 'Por favor, insira seu sobrenome.');
            isValid = false;
        }
        
        // Verifica se selecionou cargo
        if (!cargo) {
            showFieldError(document.getElementById('cargo'), 'Por favor, selecione seu cargo.');
            isValid = false;
        }
        
        // Valida formato do e-mail
        if (!validateEmail(email)) {
            showFieldError(emailInput, 'Por favor, insira um e-mail válido.');
            isValid = false;
        }
        
        // Verifica se digitou senha
        if (!password) {
            showFieldError(passwordInput, 'Por favor, insira uma senha.');
            isValid = false;
        } else if (password.length < 8) {
            // Senha muito curta - vulnerável a ataques
            showFieldError(passwordInput, 'A senha deve ter pelo menos 8 caracteres.');
            isValid = false;
        }
        
        // Verifica se as senhas correspondem
        if (password !== confirmPassword) {
            showFieldError(confirmPasswordInput, 'As senhas não coincidem.');
            isValid = false;
        }
        
        // Verifica aceitação dos termos
        if (!termsAccepted) {
            showNotification('Você precisa aceitar os termos de serviço.', 'error');
            isValid = false;
        }
        
        return isValid; // Retorna resultado final da validação
    }

    /**
     * Valida formato de e-mail usando expressão regular
     * @param {string} email - E-mail a ser validado
     * @returns {boolean} true se e-mail válido
     */
    function validateEmail(email) {
        // Regex: usuario@dominio.extensao
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Exibe mensagem de erro em campo específico
     * @param {HTMLElement} field - Campo com erro
     * @param {string} message - Mensagem de erro a exibir
     */
    function showFieldError(field, message) {
        // Adiciona classe de erro ao wrapper do input
        const wrapper = field.parentNode;
        wrapper.classList.add('error');
        
        // Cria elemento de texto com a mensagem
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        // Insere mensagem após o wrapper
        wrapper.parentNode.appendChild(errorElement);
    }

    /**
     * Remove todas as mensagens de erro do formulário
     */
    function clearErrors() {
        // Remove classes de erro de todos os campos
        document.querySelectorAll('.error').forEach(element => {
            element.classList.remove('error');
        });
        
        // Remove mensagens de erro do DOM
        document.querySelectorAll('.error-message').forEach(element => {
            element.remove();
        });
    }

    // ==========================================
    // SIMULAÇÃO DE CADASTRO
    // ==========================================
    /**
     * Simula criação de conta e salva dados do novo usuário
     * Em produção, isso enviaria dados para um servidor
     * 
     * @param {string} firstName - Nome
     * @param {string} lastName - Sobrenome
     * @param {string} email - E-mail
     * @param {string} phone - Telefone formatado
     * @param {string} password - Senha
     * @param {string} company - Empresa (opcional)
     * @param {string} cargo - Cargo selecionado
     */
    function simulateSignup(firstName, lastName, email, phone, password, company, cargo) {
        // Mostra indicador de carregamento no botão
        signupButton.classList.add('loading');
        
        // Simula delay de rede (2 segundos)
        setTimeout(() => {
            // ==========================================
            // MAPEAMENTO CARGO → SETOR
            // ==========================================
            // Define setor baseado no cargo escolhido
            const cargoParaSetor = {
                'Desenvolvedor': 'TI',
                'Designer': 'Marketing',
                'Contador': 'Financeiro',
                'Vendedor': 'Vendas',
                'Atendente': 'Atendimento',
                'RH': 'Recursos Humanos',
                'Marketing': 'Marketing'
            };
            
            // ==========================================
            // CRIAÇÃO DO OBJETO DE USUÁRIO
            // ==========================================
            // Estrutura completa do perfil do novo usuário
            const userData = {
                nome: `${firstName} ${lastName}`,
                email: email,
                telefone: phone || '(21) 98765-4321', // Padrão se não preenchido
                password: password,
                cargo: cargo,
                departamento: cargoParaSetor[cargo] || company || 'Operações',
                dataEntrada: new Date().toLocaleDateString('pt-BR'),
                bio: 'Bem-vindo ao FlowPilot!',
                // Avatar padrão SVG inline
                avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><circle cx='32' cy='32' r='32' fill='%234361ee'/><circle cx='32' cy='24' r='12' fill='white'/><path d='M12 54c4-10 16-14 20-14s16 4 20 14' fill='white'/></svg>"
            };
            
            // ==========================================
            // PERSISTÊNCIA DOS DADOS (COM CHECAGEM DE E-MAIL)
            // ==========================================
            // Recupera usuários já cadastrados (compatível com chave antiga)
            function getStoredUsers() {
                const raw = localStorage.getItem('flowpilot_users');
                if (raw) {
                    try { return JSON.parse(raw); } catch (e) { return []; }
                }
                const single = localStorage.getItem('flowpilot_user');
                if (single) {
                    try { return [JSON.parse(single)]; } catch (e) { return []; }
                }
                return [];
            }

            const existingUsers = getStoredUsers();

            // Checa se já existe usuário com o mesmo e-mail (case-insensitive)
            const emailExists = existingUsers.some(u => u.email && u.email.toLowerCase() === email.toLowerCase());
            if (emailExists) {
                signupButton.classList.remove('loading');
                showFieldError(emailInput, 'Este e-mail já está cadastrado.');
                showNotification('E-mail já cadastrado. Faça login ou recupere a senha.', 'error');
                return;
            }

            // Adiciona novo usuário ao array e persiste
            existingUsers.push(userData);
            try {
                localStorage.setItem('flowpilot_users', JSON.stringify(existingUsers));
            } catch (e) {
                // Falha ao salvar array (espaço/permissão) — fallback para chave única
                localStorage.setItem('flowpilot_user', JSON.stringify(userData));
            }

            // Mantém chaves antigas para compatibilidade com outras partes da aplicação
            localStorage.setItem('flowpilot_user', JSON.stringify(userData));
            localStorage.setItem('flowpilot_perfil', JSON.stringify(userData));
            sessionStorage.setItem('registeredEmail', email);

            // Remove indicador de carregamento
            signupButton.classList.remove('loading');
            showNotification('Cadastro efetuado! Redirecionando para o login...', 'success');

            // Redireciona para página de login após 1.2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1200);
        }, 2000);
    }

    // ==========================================
    // SISTEMA DE NOTIFICAÇÕES
    // ==========================================
    let currentNotification = null; // Rastreia notificação ativa
    
    /**
     * Exibe notificação temporária no canto superior direito
     * 
     * @param {string} message - Mensagem a exibir
     * @param {string} type - Tipo: 'success', 'error' ou 'info'
     */
    function showNotification(message, type) {
        // Remove notificação anterior se existir
        if (currentNotification && currentNotification.parentNode) {
            currentNotification.parentNode.removeChild(currentNotification);
        }
        
        // Cria elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Define cor de fundo baseado no tipo
        const bgColor = type === 'success' ? 'var(--success)' : 
                       type === 'error' ? 'var(--danger)' : '#4CC9F0';
        
        // Estilização inline da notificação
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
        
        // Adiciona ao DOM
        document.body.appendChild(notification);
        currentNotification = notification;
    
        // Remove automaticamente após 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
                if (currentNotification === notification) {
                    currentNotification = null;
                }
            }
        }, 3000);
    }

    // ==========================================
    // ANIMAÇÃO DE NOTIFICAÇÃO
    // ==========================================
    // Adiciona keyframe CSS apenas uma vez
    if (!document.getElementById('register-notify-style')) {
        const style = document.createElement('style');
        style.id = 'register-notify-style';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // ROLAGEM SUAVE
    // ==========================================
    // Para links de navegação âncora (#)
    smoothScrollLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Ignora links vazios
            if (targetId === '#') return;
            
            e.preventDefault();
            
            // Encontra elemento de destino
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Rola suavemente até elemento com offset de 80px
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Fecha menu mobile se estiver aberto
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (authButtons) authButtons.classList.remove('active');
                }
            }
        });
    });
});

// ==========================================
// FIM DO SCRIPT DE REGISTRO
// ==========================================