// Menunggu seluruh konten halaman dimuat sebelum menjalankan skrip
document.addEventListener("DOMContentLoaded", function() {

    // Mendaftarkan plugin ScrollTrigger untuk GSAP
    gsap.registerPlugin(ScrollTrigger);

    // ======================================================
    // ============== INISIALISASI VARIABEL DOM ===============
    // ======================================================
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
    const faqSearchInput = document.getElementById('faqSearchInput');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // === Variabel untuk Chatbot ===
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const chatInput = document.getElementById("chat-input");
    const sendChatBtn = document.getElementById("send-chat-btn");
    const chatbox = document.querySelector(".chatbot-messages");
    const closeChatbotBtn = document.querySelector(".chatbot-close-btn");
    const suggestionChips = document.querySelectorAll(".suggestion-chip");


    // ======================================================
    // ============ LOGIKA UNTUK ASISTEN CHATBOT ============
    // ======================================================
    if(chatbotToggler) { 
        // --- "Database" Jawaban Sederhana ---
        const responsesDB = {
            pendaftaran: {
                keywords: ["pendaftaran", "pendaptaran", "daftar", "daptar", "psb", "murid baru"],
                answer: "Pendaftaran siswa baru biasanya dibuka pada bulan Maret hingga Juni setiap tahunnya. Untuk informasi lebih detail dan akurat, silakan hubungi kontak administrasi kami via WhatsApp."
            },
            biaya: {
                keywords: ["biaya", "spp", "harga", "bayar", "duit"],
                answer: "Mengenai rincian biaya pendaftaran dan SPP, kami sarankan untuk langsung menghubungi bagian administrasi sekolah melalui WhatsApp agar mendapatkan informasi resmi dan terperinci."
            },
            kurikulum: {
                keywords: ["kurikulum"],
                answer: "Madrasah kami menggunakan Kurikulum Merdeka yang diintegrasikan dengan kurikulum keagamaan yang kuat, dengan fokus pada pembentukan karakter Qur'ani."
            },
            lokasi: {
                keywords: ["lokasi", "alamat", "tempat", "di mana"],
                answer: "Lokasi kami berada di Jl. Jatibening 2 Rt.001/012 No.001 Kel. Pondok Kelapa, Kec. Duren Sawit, Jakarta Timur, kode pos 13450."
            },
            program: {
                keywords: ["program", "unggulan"],
                answer: "Program unggulan kami antara lain Tahfidz Al-Qur'an, Muhadhoroh (latihan pidato 3 bahasa), dan Pramuka yang aktif dan berprestasi."
            },
            ekskul: {
                keywords: ["ekskul", "ekstrakurikuler"],
                answer: "Kami memiliki banyak ekstrakurikuler menarik seperti Pramuka, Tahfidz Al-Qur'an, dan Muhadhoroh (latihan pidato). Untuk info ekskul lainnya, silakan hubungi sekolah."
            },
            sapaan: {
                keywords: ["assalamualaikum", "hai", "halo", "apa kabar"],
                answer: "Wa'alaikumussalam! Hai, ada yang bisa saya bantu?"
            },
            terimakasih: {
                keywords: ["terima kasih", "makasih", "thanks"],
                answer: "Sama-sama! Senang bisa membantu."
            },
            default: {
                keywords: [],
                answer: "Maaf, saya belum mengerti pertanyaan Anda. Coba gunakan kata kunci lain seperti 'pendaftaran', 'biaya', atau 'lokasi'. Anda juga bisa menghubungi admin kami langsung."
            }
        };

        const createChatMessage = (message, className) => {
            const chatLi = document.createElement("li");
            chatLi.classList.add("chat-message", className);
            chatLi.innerHTML = `<p>${message}</p>`;
            return chatLi;
        }

        const getBotResponse = (userInput) => {
            const lowerCaseInput = userInput.toLowerCase();
            const orderOfCheck = ["pendaftaran", "biaya", "kurikulum", "lokasi", "program", "ekskul", "terimakasih", "sapaan"];

            for (const category of orderOfCheck) {
                const entry = responsesDB[category];
                for (const keyword of entry.keywords) {
                    if (lowerCaseInput.includes(keyword)) {
                        return entry.answer; 
                    }
                }
            }
            return responsesDB.default.answer;
        }

        const handleChat = (userMessage) => {
            const message = userMessage || chatInput.value.trim();
            if (!message) return; 

            chatbox.appendChild(createChatMessage(message, "outgoing"));
            chatbox.scrollTo(0, chatbox.scrollHeight);
            
            if (!userMessage) {
                chatInput.value = "";
            }

            setTimeout(() => {
                const responseMessage = getBotResponse(message);
                chatbox.appendChild(createChatMessage(responseMessage, "incoming"));
                chatbox.scrollTo(0, chatbox.scrollHeight);
            }, 1000); 
        }
        
        // --- Event Listeners ---
        sendChatBtn.addEventListener("click", () => handleChat());
        chatInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleChat();
            }
        });
        
        chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
        
        if(closeChatbotBtn) {
            closeChatbotBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
        }
        
        if (suggestionChips.length > 0) {
            suggestionChips.forEach(chip => {
                chip.addEventListener("click", () => {
                    handleChat(chip.textContent); 
                });
            });
        }
    }

    // ======================================================
    // ======== LOGIKA BARU UNTUK FORMULIR KE WHATSAPP ======
    // ======================================================
    const contactForm = document.querySelector(".contact-form");

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const adminWhatsAppNumber = "628999699953"; 

            const tujuan = document.querySelector('input[name="Tujuan"]:checked').value;
            const nama = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subjek = document.getElementById('subject').value;
            const pesan = document.getElementById('message').value;

            // PERUBAHAN FINAL: Template pesan WhatsApp yang lebih natural
            const templatePesan = `Assalamualaikum.
            
Saya *${nama}* (dengan email : ${email}), saya ingin bertanya terkait *"${subjek}"* untuk jenjang *${tujuan}*.

Pertanyaan saya :
"${pesan}"

Mohon informasinya, terima kasih..`;

            const pesanEncoded = encodeURIComponent(templatePesan.trim());
            const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${pesanEncoded}`;

            window.open(whatsappUrl, '_blank');
        });
    }
    
    // ======================================================
    // ============== FUNGSI UTILITAS LAINNYA ===============
    // ======================================================
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

    // --- Logika Scroll ---
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('nav-scrolled', window.scrollY > 50);
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });
    
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // --- Logika FAQ ---
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

    if (faqSearchInput && faqItems.length > 0) {
        faqSearchInput.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            faqItems.forEach(item => {
                const questionText = item.querySelector('.faq-question span').textContent.toLowerCase();
                if (questionText.includes(searchTerm)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    }

    // ======================================================
    // ================== ANIMASI GSAP ======================
    // ======================================================
    const mainTitle = document.querySelector('.text-box h1');
    if (mainTitle) {
        mainTitle.innerHTML = mainTitle.textContent.replace(/\S/g, "<span class='char'>$&</span>");
        gsap.from('.char', {
            duration: 0.8, opacity: 0, scale: 0, y: 80, rotationX: 180,
            transformOrigin: "0% 50% -50", ease: "back", stagger: 0.05,
        });
    }
    
    gsap.from('.text-box p, .hero-btn-wrapper', {
        delay: 0.8, duration: 1, y: 50, autoAlpha: 0, ease: "power3.out"
    });
    
    gsap.utils.toArray('.section-header, .info-card, .program-card, .kontak-card, .stat-item, .faq-accordion, .blog-card, .contact-form-container').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: { trigger: elem, start: 'top 85%', toggleActions: 'play none none none' },
            duration: 0.8, autoAlpha: 0, y: 60, ease: 'power3.out'
        });
    });

    if (statsSection) {
        ScrollTrigger.create({
            trigger: statsSection, start: "top 80%", once: true,
            onEnter: () => {
                document.querySelectorAll('.stat-number').forEach(counter => {
                    gsap.to(counter, {
                        innerText: counter.dataset.target, duration: 2, ease: "power2.out",
                        snap: { innerText: 1 },
                        onUpdate: function() { this.targets()[0].innerText = Math.ceil(this.targets()[0].innerText).toLocaleString('id-ID'); }
                    });
                });
            }
        });
    }

    gsap.utils.toArray(".program-card, .blog-card").forEach(card => {
        const image = card.querySelector('img');
        if (image) {
            gsap.to(image, {
                yPercent: -15, ease: "none",
                scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true }
            });
        }
    });
});
