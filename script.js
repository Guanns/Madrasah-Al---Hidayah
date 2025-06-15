document.addEventListener("DOMContentLoaded", function() {

    gsap.registerPlugin(ScrollTrigger);

    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById("navLinks");
    const menuShowBtn = document.getElementById('menuShowBtn');
    const menuHideBtn = document.getElementById('menuHideBtn');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const allSections = document.querySelectorAll('main > section[id]');
    const mobileNavLinks = document.querySelectorAll('.nav-links-fullscreen ul li a');
    const statsSection = document.getElementById('statistik');
    const faqQuestions = document.querySelectorAll('.faq-question');

    const openMenu = () => {
        navLinks.classList.add('active');
        body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        navLinks.classList.remove('active');
        body.style.overflow = 'auto';
    };

    if (menuShowBtn) menuShowBtn.addEventListener('click', openMenu);
    if (menuHideBtn) menuHideBtn.addEventListener('click', closeMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMenu));

    const setDarkMode = (isDark) => {
        body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    };

    if (darkModeToggle) {
        const currentMode = localStorage.getItem('darkMode') === 'enabled';
        darkModeToggle.checked = currentMode;
        setDarkMode(currentMode);
        darkModeToggle.addEventListener('change', () => setDarkMode(darkModeToggle.checked));
    }

    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('nav-scrolled', window.scrollY > 50);
        if (backToTopBtn) backToTopBtn.style.display = (window.scrollY > 300) ? "flex" : "none";
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isActive = question.classList.contains('active');
                faqQuestions.forEach(q => {
                    q.classList.remove('active');
                    q.nextElementSibling.style.maxHeight = null;
                    q.nextElementSibling.style.paddingTop = "0px";
                    q.nextElementSibling.style.paddingBottom = "0px";
                });
                if (!isActive) {
                    question.classList.add('active');
                    const answer = question.nextElementSibling;
                    answer.style.paddingTop = "5px";
                    answer.style.paddingBottom = "25px";
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        });
    }

    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const linksToUpdate = [...mobileNavLinks];
                linksToUpdate.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-40% 0px -60% 0px' });

    allSections.forEach(section => {
        if (section) activeLinkObserver.observe(section);
    });

    // GSAP

    const mainTitle = document.querySelector('.text-box h1');
    if (mainTitle) {
        mainTitle.innerHTML = mainTitle.textContent.replace(/\S/g, "<span class='char'>$&</span>");
        gsap.from('.char', {
            duration: 0.8,
            opacity: 0,
            scale: 0,
            y: 80,
            rotationX: 180,
            transformOrigin: "0% 50% -50",
            ease: "back",
            stagger: 0.05,
        });
    }

    gsap.from('.text-box p', {
        delay: 0.8,
        duration: 1,
        y: 50,
        autoAlpha: 0,
        ease: "power3.out"
    });
    
    gsap.utils.toArray('.section-header, .info-card, .program-card, .kontak-card, .stat-item, .faq-accordion').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            duration: 0.8,
            autoAlpha: 0,
            y: 60,
            ease: 'power3.out'
        });
    });

    if (statsSection) {
        ScrollTrigger.create({
            trigger: statsSection,
            start: "top 80%",
            once: true,
            onEnter: () => {
                document.querySelectorAll('.stat-number').forEach(counter => {
                    gsap.to(counter, {
                        innerText: counter.dataset.target,
                        duration: 2,
                        ease: "power2.out",
                        snap: { innerText: 1 },
                        onUpdate: function() {
                            this.targets()[0].innerText = Math.ceil(this.targets()[0].innerText).toLocaleString('id-ID');
                        }
                    });
                });
            }
        });
    }

    gsap.utils.toArray(".program-card").forEach(card => {
        const image = card.querySelector('img');
        if (image) {
            gsap.to(image, {
                yPercent: -15,
                ease: "none",
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }
    });
});
