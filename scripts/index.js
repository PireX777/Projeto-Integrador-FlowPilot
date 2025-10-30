// FlowPilot Application JavaScript

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
    
    // Dashboard Tabs Functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to current tab and content
            this.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Task Completion Toggle
    const taskCheckboxes = document.querySelectorAll('.task-checkbox input');

    // Inicializa currentPoints a partir do DOM de forma robusta
    const pointsElement = document.querySelector('.user-points');
    let currentPoints = 0;
    if (pointsElement) {
        const rawInitial = pointsElement.textContent || '';
        currentPoints = parseInt(rawInitial.replace(/[^\d-]/g, ''), 10) || 0;
        pointsElement.textContent = currentPoints.toLocaleString();
    }

    taskCheckboxes.forEach(checkbox => {
        // Marca checkbox já contado se estiver checked ao carregar
        checkbox.dataset.counted = checkbox.checked ? 'true' : 'false';

        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            if (this.checked) {
                if (taskItem) {
                    taskItem.style.opacity = '0.6';
                    taskItem.style.textDecoration = 'line-through';
                }

                // Só adiciona pontos se ainda não foi contado
                if (this.dataset.counted !== 'true') {
                    addPoints(10);
                    this.dataset.counted = 'true';
                }
            } else {
                if (taskItem) {
                    taskItem.style.opacity = '1';
                    taskItem.style.textDecoration = 'none';
                }

                // Só remove pontos se anteriormente foi contado
                if (this.dataset.counted === 'true') {
                    addPoints(-10);
                    this.dataset.counted = 'false';
                }
            }
        });
    });

    // Points System
    function addPoints(points) {
        const pointsElement = document.querySelector('.user-points');
        if (!pointsElement) return;

        currentPoints = (typeof currentPoints === 'number' ? currentPoints : 0) + points;
        currentPoints = Math.round(currentPoints);
        pointsElement.textContent = currentPoints.toLocaleString();

        // Notificação de ganho / perda imediata
        if (points > 0) {
            showNotification(`+${points} pontos`, 'success');
        } else if (points < 0) {
            showNotification(`${points} pontos`, 'warning');
        }

        // Notificação especial ao cruzar 1300 pontos
        if (points > 0) {
            const previousPoints = currentPoints - points;
            if (previousPoints < 1300 && currentPoints >= 1300) {
                showNotification('Parabéns! Você alcançou 1300 pontos!', 'success');
            } else if (points >= 1300) {
                // Caso raro: um único ganho muito grande
                showNotification(`+${points} pontos!`, 'success');
            }
        }
    }
    
    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Escolhe cor com base no tipo
        const colorMap = {
            success: '#4bb543',
            warning: '#e53935',
        };
        const bg = colorMap[type] || colorMap.info;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 12px 16px;
            background-color: ${bg};
            color: white;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.3s, slideOut 0.3s 2.7s;
            font-weight: 600;
            min-width: 140px;
            text-align: center;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 1000);
    }
    
    // Add CSS for notification animation
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
    `;
    document.head.appendChild(style);
    
    // Modal Functionality
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    
    // Adiciona redirecionamento para as páginas de login e cadastro
    if (loginBtn) {
        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // Ajuste o caminho abaixo conforme a localização real do arquivo
            window.location.href = 'login.html';
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // Ajuste o caminho abaixo conforme a localização real do arquivo
            window.location.href = 'register.html';
        });
    }
});