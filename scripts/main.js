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



            // Header hide/show on scroll
            let lastScrollTop = 0;
            const header = document.querySelector('header');

            window.addEventListener('scroll', function() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                if (scrollTop > lastScrollTop) {
                    // Scroll down - hide header only if mobile menu is not active
                    if (!navLinks.classList.contains('active')) {
                        header.classList.add('hidden');
                    }
                } else if (scrollTop < lastScrollTop) {
                    // Scroll up - show header instantly
                    header.classList.remove('hidden');
                }

                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            });

            // FAQ Accordion
            const faqItems = document.querySelectorAll('.faq-item');

            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');

                question.addEventListener('click', function() {
                    // Close all other items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });

                    // Toggle current item
                    item.classList.toggle('active');
                });
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
        });
