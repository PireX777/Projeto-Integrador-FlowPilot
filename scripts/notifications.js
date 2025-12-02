/**
 * ===================================
 * Sistema de Notificações FlowPilot
 * ===================================
 * 
 * Sistema centralizado e padronizado para exibir notificações
 * em todo o aplicativo.
 * 
 * Uso:
 * showNotification('Mensagem', 'success');
 * showNotification('Título', 'Mensagem detalhada', 'error');
 * showNotification('Carregando...', 'loading', 0); // Sem auto-close
 */

(function() {
    'use strict';

    // Container de notificações
    let notificationContainer = null;
    let notificationCount = 0;
    const MAX_NOTIFICATIONS = 5;
    const DEFAULT_DURATION = 5000; // 5 segundos

    /**
     * Inicializa o container de notificações
     */
    function initNotificationContainer() {
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        return notificationContainer;
    }

    /**
     * Exibe uma notificação
     * @param {string} titleOrMessage - Título ou mensagem única
     * @param {string} messageOrType - Mensagem detalhada ou tipo (se apenas 2 parâmetros)
     * @param {string|number} typeOrDuration - Tipo ou duração (se 3 parâmetros)
     * @param {number} duration - Duração em ms (opcional, padrão 5000)
     */
    window.showNotification = function(titleOrMessage, messageOrType, typeOrDuration, duration) {
        const container = initNotificationContainer();

        // Parse dos parâmetros (suporta 2 ou 3+ argumentos)
        let title, message, type, autoCloseDuration;

        if (arguments.length === 2) {
            // showNotification('message', 'type')
            title = null;
            message = titleOrMessage;
            type = messageOrType || 'info';
            autoCloseDuration = DEFAULT_DURATION;
        } else if (arguments.length === 3) {
            // showNotification('title', 'message', 'type')
            // OU showNotification('message', 'type', duration)
            if (typeof typeOrDuration === 'number') {
                title = null;
                message = titleOrMessage;
                type = messageOrType || 'info';
                autoCloseDuration = typeOrDuration;
            } else {
                title = titleOrMessage;
                message = messageOrType;
                type = typeOrDuration || 'info';
                autoCloseDuration = DEFAULT_DURATION;
            }
        } else {
            // showNotification('title', 'message', 'type', duration)
            title = titleOrMessage;
            message = messageOrType;
            type = typeOrDuration || 'info';
            autoCloseDuration = duration !== undefined ? duration : DEFAULT_DURATION;
        }

        // Validação do tipo
        const validTypes = ['success', 'error', 'warning', 'info', 'loading'];
        if (!validTypes.includes(type)) {
            console.warn(`Tipo de notificação inválido: ${type}. Usando 'info'.`);
            type = 'info';
        }

        // Limitar número de notificações
        if (notificationCount >= MAX_NOTIFICATIONS) {
            const firstNotification = container.querySelector('.notification');
            if (firstNotification) {
                closeNotification(firstNotification);
            }
        }

        // Criar notificação
        const notification = createNotificationElement(title, message, type, autoCloseDuration);
        container.appendChild(notification);
        notificationCount++;

        // Auto fechar (se duration > 0)
        if (autoCloseDuration > 0) {
            setTimeout(() => {
                closeNotification(notification);
            }, autoCloseDuration);
        }

        return notification;
    };

    /**
     * Cria o elemento HTML da notificação
     */
    function createNotificationElement(title, message, type, duration) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        // Ícone
        const icon = document.createElement('div');
        icon.className = 'notification-icon';
        notification.appendChild(icon);

        // Conteúdo
        const content = document.createElement('div');
        content.className = 'notification-content';

        if (title) {
            const titleEl = document.createElement('div');
            titleEl.className = 'notification-title';
            titleEl.textContent = title;
            content.appendChild(titleEl);
        }

        const messageEl = document.createElement('div');
        messageEl.className = 'notification-message';
        messageEl.textContent = message;
        content.appendChild(messageEl);

        notification.appendChild(content);

        // Botão fechar
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.setAttribute('aria-label', 'Fechar notificação');
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            closeNotification(notification);
        };
        notification.appendChild(closeBtn);

        // Barra de progresso (apenas se auto-close)
        if (duration > 0) {
            const progress = document.createElement('div');
            progress.className = 'notification-progress';
            progress.style.animationDuration = `${duration}ms`;
            notification.appendChild(progress);
        }

        // Fechar ao clicar na notificação
        notification.onclick = () => {
            closeNotification(notification);
        };

        return notification;
    }

    /**
     * Fecha uma notificação com animação
     */
    function closeNotification(notification) {
        if (!notification || !notification.parentNode) return;

        notification.classList.add('closing');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
                notificationCount--;

                // Remover container se vazio
                if (notificationCount === 0 && notificationContainer) {
                    notificationContainer.remove();
                    notificationContainer = null;
                }
            }
        }, 300);
    }

    /**
     * Fecha todas as notificações
     */
    window.closeAllNotifications = function() {
        if (!notificationContainer) return;

        const notifications = notificationContainer.querySelectorAll('.notification');
        notifications.forEach(notification => {
            closeNotification(notification);
        });
    };

    /**
     * Atalhos para tipos específicos
     */
    window.showSuccess = function(titleOrMessage, messageOrDuration, duration) {
        if (typeof messageOrDuration === 'string') {
            return showNotification(titleOrMessage, messageOrDuration, 'success', duration);
        } else {
            return showNotification(titleOrMessage, 'success', messageOrDuration);
        }
    };

    window.showError = function(titleOrMessage, messageOrDuration, duration) {
        if (typeof messageOrDuration === 'string') {
            return showNotification(titleOrMessage, messageOrDuration, 'error', duration);
        } else {
            return showNotification(titleOrMessage, 'error', messageOrDuration);
        }
    };

    window.showWarning = function(titleOrMessage, messageOrDuration, duration) {
        if (typeof messageOrDuration === 'string') {
            return showNotification(titleOrMessage, messageOrDuration, 'warning', duration);
        } else {
            return showNotification(titleOrMessage, 'warning', messageOrDuration);
        }
    };

    window.showInfo = function(titleOrMessage, messageOrDuration, duration) {
        if (typeof messageOrDuration === 'string') {
            return showNotification(titleOrMessage, messageOrDuration, 'info', duration);
        } else {
            return showNotification(titleOrMessage, 'info', messageOrDuration);
        }
    };

    window.showLoading = function(titleOrMessage, message) {
        // Loading nunca fecha automaticamente (duration = 0)
        if (message) {
            return showNotification(titleOrMessage, message, 'loading', 0);
        } else {
            return showNotification(titleOrMessage, 'loading', 0);
        }
    };

    /**
     * Substitui alerts nativos por notificações
     */
    window.replaceAlerts = function() {
        const originalAlert = window.alert;
        window.alert = function(message) {
            showNotification(message, 'info');
        };
        
        // Guardar referência ao alert original
        window.alert.native = originalAlert;
    };

    /**
     * Restaura alerts nativos
     */
    window.restoreAlerts = function() {
        if (window.alert.native) {
            window.alert = window.alert.native;
        }
    };

    // Log de inicialização
    console.log('✓ Sistema de notificações FlowPilot carregado');
})();
