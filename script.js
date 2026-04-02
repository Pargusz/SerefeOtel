document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.getElementById('nav-menu');
    const loader = document.getElementById('loader');

    // Loader
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }, 500);
    });

    // Scroll Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
        header.classList.toggle('menu-open');
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        
        // Hamburger animation
        const spans = hamburger.querySelectorAll('span');
        if (nav.classList.contains('active')) {
            spans[0].style.transform = 'translateY(10px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-10px) rotate(-45deg)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Form Submit Popup & Web3Forms Logic
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // --- E-POSTA GÖNDERİM İŞLEMİ (Web3Forms) ---
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            
            // Web3Forms API Anahtarı
            object.access_key = 'fbcfe867-339d-46c1-bc42-165db1d48566';
            object.subject = 'Yeni Rezervasyon Talebi Şerefe Hotel';
            object.from_name = 'Şerefe Hotel Web Rezervasyon';
            
            const json = JSON.stringify(object);
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'GÖNDERİLİYOR...';
            submitBtn.disabled = true;

            // HTML5/Tarayıcı uyarıları yerine kendi tasarımımızla popup çağıran fonksiyon
            const showCustomPopup = (isSuccess, title, message) => {
                const overlay = document.createElement('div');
                overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 3000; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.4s ease;';
                
                const popup = document.createElement('div');
                popup.style.cssText = 'background: var(--white); padding: 50px; border-radius: var(--radius); text-align: center; max-width: 500px; transform: scale(0.9); transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 40px 100px rgba(0,0,0,0.3); margin: 20px; position: relative;';
                
                const isEnglish = window.location.pathname.includes('/en/');
                const btnText = isEnglish ? 'CLOSE' : 'KAPAT';
                const iconColor = isSuccess ? 'var(--gold)' : '#cc0000';
                const iconClass = isSuccess ? 'fa-check' : 'fa-times';
                
                popup.innerHTML = `
                    <div style="width: 80px; height: 80px; background: var(--stone-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; color: ${iconColor}; font-size: 2rem;">
                        <i class="fas ${iconClass}"></i>
                    </div>
                    <h3 style="font-family: var(--font-heading); color: var(--text-main); font-size: 1.8rem; margin-bottom: 20px; font-weight: normal;">${title}</h3>
                    <p style="color: var(--text-muted); margin-bottom: 40px; font-size: 1.05rem; line-height: 1.6;">${message}</p>
                    <button class="btn-luxury close-popup" style="width: 100%; cursor: pointer;">${btnText}</button>
                `;
                
                overlay.appendChild(popup);
                document.body.appendChild(overlay);
                
                requestAnimationFrame(() => {
                    overlay.style.opacity = '1';
                    popup.style.transform = 'scale(1)';
                });
                
                const closeBtn = popup.querySelector('.close-popup');
                closeBtn.addEventListener('click', () => {
                    overlay.style.opacity = '0';
                    popup.style.transform = 'scale(0.9)';
                    setTimeout(() => overlay.remove(), 400);
                    if (isSuccess) contactForm.reset();
                });
            };

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
            .then(async (response) => {
                let data = await response.json().catch(() => null);
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                
                if (response.status === 200) {
                    const isEnglish = window.location.pathname.includes('/en/');
                    const title = isEnglish ? 'Reservation Request Received' : 'Talebiniz Alındı';
                    const message = isEnglish ? 'Dear guest, we have received your reservation request. We will contact you as soon as possible to confirm your reservation. Have a great day!' : 'Değerli misafirimiz rezervasyon talebilinizi aldık, en kısa sürede iletişime geçip rezervasyonunuzu onaylayacağız. İyi günler dileriz.';
                    showCustomPopup(true, title, message);
                } else {
                    console.error('Web3Forms Error:', data);
                    const isEnglish = window.location.pathname.includes('/en/');
                    const errTitle = isEnglish ? 'Submission Failed' : 'Gönderilemedi';
                    const errMsg = data && data.message ? data.message : (isEnglish ? 'Please check your connection and try again.' : 'Bir ağ bağlantısı sorunu oluştu, lütfen daha sonra tekrar deneyiniz.');
                    showCustomPopup(false, errTitle, errMsg);
                }
            })
            .catch(error => {
                console.error('Error submitting form:', error);
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                const isEnglish = window.location.pathname.includes('/en/');
                const errTitle = isEnglish ? 'Connection Error' : 'Bağlantı Hatası';
                const errMsg = isEnglish ? 'Unable to reach the server. Please try again later.' : 'Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.';
                showCustomPopup(false, errTitle, errMsg);
            });
        });
    }
});
