   // Billing Toggle Functionality
        const billingToggle = document.getElementById('billing-toggle');
        const monthlyOption = document.getElementById('monthly-option');
        const annualOption = document.getElementById('annual-option');
        const priceValues = document.querySelectorAll('.price-value');
        const annualSavings = document.querySelectorAll('.annual-saving');
        const pricingPeriods = document.querySelectorAll('.pricing-period');
        const totalPrices = document.querySelectorAll('.total-price');
        
        billingToggle.addEventListener('change', function() {
            if (this.checked) {
                // Switch to annual billing
                monthlyOption.classList.remove('active');
                annualOption.classList.add('active');
                
                priceValues.forEach(value => {
                    const monthlyPrice = value.getAttribute('data-monthly');
                    const annualPrice = value.getAttribute('data-annual');
                    value.textContent = annualPrice;
                });
                
                annualSavings.forEach(saving => {
                    saving.style.display = 'block';
                });
                
                pricingPeriods.forEach(period => {
                    period.textContent = 'por mês, cobrado anualmente';
                });
                
                // Update total prices for annual billing
                document.getElementById('basic-total').textContent = 'Total: R$ 468/ano';
                document.getElementById('pro-total').textContent = 'Total: R$ 948/ano';
                document.getElementById('enterprise-total').textContent = 'Total: R$ 1.908/ano';
            } else {
                // Switch to monthly billing
                monthlyOption.classList.add('active');
                annualOption.classList.remove('active');
                
                priceValues.forEach(value => {
                    const monthlyPrice = value.getAttribute('data-monthly');
                    value.textContent = monthlyPrice;
                });
                
                annualSavings.forEach(saving => {
                    saving.style.display = 'none';
                });
                
                pricingPeriods.forEach(period => {
                    period.textContent = 'por mês';
                });
                
                // Update total prices for monthly billing
                document.getElementById('basic-total').textContent = 'Total: R$ 588/ano';
                document.getElementById('pro-total').textContent = 'Total: R$ 1.188/ano';
                document.getElementById('enterprise-total').textContent = 'Total: R$ 2.388/ano';
            }
        });
        
        // FAQ Accordion Functionality
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentNode;
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // If the clicked item wasn't active, open it
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
        
        // Mobile Menu Toggle
        const mobileMenu = document.querySelector('.mobile-menu');
        const navLinks = document.querySelector('.nav-links');
        const authButtons = document.querySelector('.auth-buttons');
        
        mobileMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            authButtons.classList.toggle('active');
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
