document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    const loader = document.getElementById('loader');

    // --- Premium Loader Logic ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 800);
            }
        }, 1000); // 1s visual focus on logo
    });

    // Page Transition (Fade-in on exit)
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Internal links only
            if (href && !href.startsWith('http') && !href.startsWith('#') && !this.target) {
                e.preventDefault();
                if (loader) {
                    loader.style.display = 'flex';
                    setTimeout(() => {
                        loader.style.opacity = '1';
                    }, 10);
                    setTimeout(() => {
                        window.location.href = href;
                    }, 600);
                } else {
                    window.location.href = href;
                }
            }
        });
    });

    // --- Header Scroll Effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            if (document.body.classList.contains('home-page')) {
                header.classList.remove('scrolled');
            } else {
                header.classList.add('scrolled');
            }
        }
    });

    if (!document.body.classList.contains('home-page')) {
        header.classList.add('scrolled');
    }

    // --- Mobile Menu Toggle ---
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            const spans = hamburger.querySelectorAll('span');
            if (nav.classList.contains('active')) {
                spans[0].style.transform = 'translateY(5px) rotate(45deg)';
                spans[1].style.transform = 'translateY(-5px) rotate(-45deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.transform = 'none';
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.transform = 'none';
        });
    });

    // --- Reveal On Scroll ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.bento-item, .section-head, .editorial-flex, .hero-content');
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
        revealObserver.observe(el);
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .revealed { opacity: 1 !important; transform: translateY(0) !important; }
    `;
    document.head.appendChild(style);

    // --- Form Simulation ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'GÖNDERİLİYOR...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Talebiniz başarıyla alındı. Teşekkür ederiz.');
                btn.innerText = 'BAŞARILI';
                contactForm.reset();
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 3000);
            }, 2000);
        });
    }
});
