document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            'nav.how': 'How it works',
            'nav.farmers': 'For farmers',
            'nav.help': 'Help',
            'nav.login': 'Login',
            'hero.tag': 'Procurement made predictable',
            'hero.title': 'Sell your harvest without the wait.',
            'hero.text': 'KisanSetu gives you a clear time slot, a live place in the queue, and updates from quality check to payment.',
            'hero.cta.primary': 'Open farmer dashboard',
            'hero.cta.secondary': 'See how it works',
            'hero.trust': 'Trusted by 12,000+ farmers across Madhya Pradesh',
            'hero.card.token': 'Your token is confirmed',
            'hero.card.queue': 'Live queue',
            'hero.card.moving': 'Moving steadily',
            'proof.farmers': 'farmers onboarded',
            'proof.centers': 'collection centers',
            'proof.payments': 'on-time payments',
            'proof.support': 'support available',
            'steps.eyebrow': 'A simpler harvest day',
            'steps.heading': 'Everything you need, before you reach the mandi.',
            'steps.one.title': 'Know your slot',
            'steps.one.text': 'See crop-wise schedules and reserve a convenient delivery window.',
            'steps.two.title': 'Skip the uncertainty',
            'steps.two.text': 'Get a digital token and watch your live place in the queue.',
            'steps.three.title': 'Track every step',
            'steps.three.text': 'Follow quality checks, procurement status, and payment updates.',
            'cta.eyebrow': 'Your harvest. Your time.',
            'cta.title': 'Plan with confidence.',
            'cta.text': 'Spend less time waiting and more time on your farm.',
            'cta.button': 'Start with your dashboard',
            'footer.tag': 'Built for farmers, with care.',
            'footer.help': 'Help center · Privacy',
            'auth.welcome': 'Welcome',
            'auth.title': 'Access your account',
            'auth.subtitle': 'Choose how you want to continue.',
            'auth.login': 'Log in',
            'auth.signup': 'Sign up',
            'auth.mobile': 'Mobile number or email',
            'auth.mobilePlaceholder': 'Enter mobile number or email',
            'auth.password': 'Password',
            'auth.passwordPlaceholder': 'Enter your password',
            'auth.continue': 'Continue',
            'auth.fullName': 'Full name',
            'auth.fullNamePlaceholder': 'Enter your full name',
            'auth.email': 'Email address',
            'auth.emailPlaceholder': 'Enter your email',
            'auth.mobileNumber': 'Mobile number',
            'auth.mobileNumberPlaceholder': 'Enter your mobile number',
            'auth.createPasswordPlaceholder': 'Create a password',
            'auth.createAccount': 'Create account',
            'dashboard.account': 'Account',
            'dashboard.farmerProfile': 'Farmer Profile',
            'dashboard.overview': 'Overview',
            'dashboard.queue': 'Queue',
            'dashboard.orders': 'Orders',
            'dashboard.payments': 'Payments',
            'dashboard.support': 'Support',
            'dashboard.logout': 'Logout',
            'dashboard.todayQueue': 'Today’s queue',
            'dashboard.totalCrop': 'Total crop volume',
            'dashboard.paymentStatus': 'Payment status',
            'dashboard.inspection': 'Inspection',
            'dashboard.liveUpdates': 'Live updates',
            'dashboard.queueTracking': 'Queue tracking',
            'dashboard.recentActivity': 'Recent activity',
            'dashboard.settlement': 'Settlement',
            'dashboard.farmAssistance': 'Farm assistance',
            'dashboard.helpLine': 'Help line',
            'dashboard.cropGuide': 'Crop guide',
            'dashboard.verification': 'Verification'
        },
        hi: {
            'nav.how': 'यह कैसे काम करता है',
            'nav.farmers': 'किसानों के लिए',
            'nav.help': 'सहायता',
            'nav.login': 'लॉगिन',
            'hero.tag': 'प्र procurement स्पष्ट और विश्वसनीय',
            'hero.title': 'अपना फसल बेचें बिना देरी के।',
            'hero.text': 'KisanSetu आपको स्पष्ट समय स्लॉट, लाइव कतार की स्थिति और गुणवत्ता जांच से भुगतान तक की जानकारी देता है।',
            'hero.cta.primary': 'किसान डैशबोर्ड खोलें',
            'hero.cta.secondary': 'यह कैसे काम करता है देखें',
            'hero.trust': 'मध्य प्रदेश के 12,000+ किसानों द्वारा भरोसेमंद',
            'hero.card.token': 'आपका टोकन पुष्टि हो गया',
            'hero.card.queue': 'लाइव कतार',
            'hero.card.moving': 'धीरे-धीरे आगे बढ़ रहा है',
            'proof.farmers': 'किसान जुड़ चुके हैं',
            'proof.centers': 'संग्रह केंद्र',
            'proof.payments': 'समय पर भुगतान',
            'proof.support': 'सहायता उपलब्ध',
            'steps.eyebrow': 'और सरल फसल दिवस',
            'steps.heading': 'मंडी पहुँचने से पहले आपकी हर जरूरत।',
            'steps.one.title': 'अपना स्लॉट देखें',
            'steps.one.text': 'फसल-वार समय सारणी देखें और आराम से डिलीवरी समय चुनें।',
            'steps.two.title': 'अनिश्चितता कम करें',
            'steps.two.text': 'डिजिटल टोकन लें और लाइव कतार की स्थिति देखें।',
            'steps.three.title': 'हर कदम ट्रैक करें',
            'steps.three.text': 'गुणवत्ता जांच, खरीद स्थिति और भुगतान अपडेट देखें।',
            'cta.eyebrow': 'आपका फसल। आपका समय।',
            'cta.title': 'आत्मविश्वास से योजना बनाएँ।',
            'cta.text': 'कतार में इंतजार कम करें और अपने खेत पर अधिक समय दें।',
            'cta.button': 'अपने डैशबोर्ड से शुरू करें',
            'footer.tag': 'किसानों के लिए बनाया गया, स्नेह से।',
            'footer.help': 'सहायता केंद्र · गोपनीयता',
            'auth.welcome': 'स्वागत है',
            'auth.title': 'अपना खाता एक्सेस करें',
            'auth.subtitle': 'जारी रखने का तरीका चुनें।',
            'auth.login': 'लॉग इन',
            'auth.signup': 'साइन अप',
            'auth.mobile': 'मोबाइल नंबर या ईमेल',
            'auth.mobilePlaceholder': 'मोबाइल नंबर या ईमेल दर्ज करें',
            'auth.password': 'पासवर्ड',
            'auth.passwordPlaceholder': 'अपना पासवर्ड दर्ज करें',
            'auth.continue': 'जारी रखें',
            'auth.fullName': 'पूरा नाम',
            'auth.fullNamePlaceholder': 'अपना पूरा नाम दर्ज करें',
            'auth.email': 'ईमेल पता',
            'auth.emailPlaceholder': 'अपना ईमेल दर्ज करें',
            'auth.mobileNumber': 'मोबाइल नंबर',
            'auth.mobileNumberPlaceholder': 'अपना मोबाइल नंबर दर्ज करें',
            'auth.createPasswordPlaceholder': 'पासवर्ड बनाएं',
            'auth.createAccount': 'खाता बनाएं',
            'dashboard.account': 'खाता',
            'dashboard.farmerProfile': 'किसान प्रोफाइल',
            'dashboard.overview': 'ओवरव्यू',
            'dashboard.queue': 'क़तार',
            'dashboard.orders': 'ऑर्डर',
            'dashboard.payments': 'भुगतान',
            'dashboard.support': 'सहायता',
            'dashboard.logout': 'लॉगआउट',
            'dashboard.todayQueue': 'आज की कतार',
            'dashboard.totalCrop': 'कुल फसल मात्रा',
            'dashboard.paymentStatus': 'भुगतान स्थिति',
            'dashboard.inspection': 'निरीक्षण',
            'dashboard.liveUpdates': 'लाइव अपडेट',
            'dashboard.queueTracking': 'कतार ट्रैकिंग',
            'dashboard.recentActivity': 'हाल की गतिविधि',
            'dashboard.settlement': 'निपटान',
            'dashboard.farmAssistance': 'खेती सहायता',
            'dashboard.helpLine': 'सहायता लाइन',
            'dashboard.cropGuide': 'फसल मार्गदर्शिका',
            'dashboard.verification': 'सत्यापन'
        },
        mr: {
            'nav.how': 'हे कसे काम करते',
            'nav.farmers': 'शेतकऱ्यांसाठी',
            'nav.help': 'मदत',
            'nav.login': 'लॉगिन',
            'hero.tag': 'खरेदी अधिक स्पष्ट आणि विश्वासार्ह',
            'hero.title': 'काळजी न करता आपले पीक विका.',
            'hero.text': 'KisanSetu तुम्हाला स्पष्ट वेळ स्लॉट, लाइव्ह रांगेचा अंदाज आणि गुणवत्ता तपासणी ते पेमेंटपर्यंतची माहिती देते.',
            'hero.cta.primary': 'शेतकरी डॅशबोर्ड उघडा',
            'hero.cta.secondary': 'हे कसे काम करते ते पहा',
            'hero.trust': 'महाराष्ट्रातील 12,000+ शेतकऱ्यांद्वारे विश्वासार्ह',
            'hero.card.token': 'तुमचा टोकन निश्चित झाला',
            'hero.card.queue': 'लाइव्ह रांग',
            'hero.card.moving': 'हळूहळू पुढे जात आहे',
            'proof.farmers': 'शेतकरी जोडले गेले',
            'proof.centers': 'संकलन केंद्र',
            'proof.payments': 'वेळेवर पेमेंट',
            'proof.support': 'मदत उपलब्ध',
            'steps.eyebrow': 'आणखी सोपे पीक दिवस',
            'steps.heading': 'मंडीपर्यंत पोहोचण्यापूर्वी सर्व काही तुमच्यासाठी.',
            'steps.one.title': 'तुमचा स्लॉट पाहा',
            'steps.one.text': 'पीकनिहाय वेळापत्रक पाहा आणि सोयीचे डिलिव्हरी वेळpick करा.',
            'steps.two.title': 'अनिश्चितता कमी करा',
            'steps.two.text': 'डिजिटल टोकन घ्या आणि लाइव्ह रांगेची स्थिती पहा.',
            'steps.three.title': 'प्रत्येक पायरी ट्रॅक करा',
            'steps.three.text': 'गुणवत्ता तपासणी, खरेदी स्थिती आणि पेमेंट अपडेट पहा.',
            'cta.eyebrow': 'तुमचे पीक. तुमचा वेळ.',
            'cta.title': 'आत्मविश्वासाने नियोजन करा.',
            'cta.text': 'रांगेत थोडा वेळ वाचवा आणि शेतावर अधिक वेळ द्या.',
            'cta.button': 'आपल्या डॅशबोर्डपासून सुरू करा',
            'footer.tag': 'शेतकऱ्यांसाठी, प्रेमाने बनवलेले.',
            'footer.help': 'मदत केंद्र · गोपनीयता',
            'auth.welcome': 'स्वागत आहे',
            'auth.title': 'तुमचे खाते उघडा',
            'auth.subtitle': 'जारी ठेवण्यासाठी पद्धत निवडा.',
            'auth.login': 'लॉग इन',
            'auth.signup': 'साइन अप',
            'auth.mobile': 'मोबाइल नंबर किंवा ईमेल',
            'auth.mobilePlaceholder': 'मोबाइल नंबर किंवा ईमेल प्रविष्ट करा',
            'auth.password': 'पासवर्ड',
            'auth.passwordPlaceholder': 'तुमचा पासवर्ड प्रविष्ट करा',
            'auth.continue': 'पुढे',
            'auth.fullName': 'पूर्ण नाव',
            'auth.fullNamePlaceholder': 'तुमचे पूर्ण नाव प्रविष्ट करा',
            'auth.email': 'ईमेल पत्ता',
            'auth.emailPlaceholder': 'तुमचा ईमेल प्रविष्ट करा',
            'auth.mobileNumber': 'मोबाइल नंबर',
            'auth.mobileNumberPlaceholder': 'तुमचा मोबाइल नंबर प्रविष्ट करा',
            'auth.createPasswordPlaceholder': 'पासवर्ड तयार करा',
            'auth.createAccount': 'खाते तयार करा',
            'dashboard.account': 'खाते',
            'dashboard.farmerProfile': 'शेतकरी प्रोफाइल',
            'dashboard.overview': 'ओव्हरव्ह्यू',
            'dashboard.queue': 'रांग',
            'dashboard.orders': 'ऑर्डर',
            'dashboard.payments': 'पेमेंट',
            'dashboard.support': 'मदत',
            'dashboard.logout': 'लॉगआउट',
            'dashboard.todayQueue': 'आजची रांग',
            'dashboard.totalCrop': 'एकूण पिकांची मात्रा',
            'dashboard.paymentStatus': 'पेमेंट स्थिती',
            'dashboard.inspection': 'तपासणी',
            'dashboard.liveUpdates': 'लाइव्ह अपडेट',
            'dashboard.queueTracking': 'रांग ट्रॅकिंग',
            'dashboard.recentActivity': 'अलीकडील क्रिया',
            'dashboard.settlement': 'सेटलमेंट',
            'dashboard.farmAssistance': 'शेत मदत',
            'dashboard.helpLine': 'मदतलाइन',
            'dashboard.cropGuide': 'पीक मार्गदर्शक',
            'dashboard.verification': ' पडताळणी'
        }
    }

    const page = document.body
    const toast = document.createElement('div')
    toast.className = 'site-toast'
    toast.setAttribute('role', 'status')
    page.appendChild(toast)
    const style = document.createElement('style')
    style.textContent = '.site-toast{position:fixed;right:20px;bottom:20px;z-index:30;max-width:290px;padding:12px 16px;border-radius:7px;color:#fff;background:#176b45;box-shadow:0 10px 25px #172d1f30;font:600 12px/1.4 sans-serif;opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .2s,transform .2s}.site-toast.visible{opacity:1;transform:translateY(0)}.menu-open{display:flex!important}@media(max-width:560px){.site-toast{right:15px;left:15px;bottom:15px;max-width:none;text-align:center}}'
    document.head.appendChild(style)
    let toastTimer
    const showToast = (message) => {
        toast.textContent = message
        toast.classList.add('visible')
        clearTimeout(toastTimer)
        toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200)
    }

    const applyLanguage = (lang) => {
        const selected = translations[lang] || translations.en
        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.dataset.i18n
            if (selected[key]) {
                const inner = element.innerHTML
                if (inner.includes('<span') && !selected[key].includes('<')) {
                    const span = element.querySelector('span')
                    if (span) {
                        span.textContent = selected[key]
                    }
                    return
                }
                element.textContent = selected[key]
            }
        })

        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            const key = element.dataset.i18nPlaceholder
            if (selected[key]) {
                element.placeholder = selected[key]
            }
        })

        document.querySelectorAll('.language-select').forEach((select) => {
            select.value = lang
        })

        if (document.documentElement) {
            document.documentElement.lang = lang
        }
    }

    document.querySelectorAll('.language-select').forEach((select) => {
        select.addEventListener('change', (event) => {
            applyLanguage(event.target.value)
        })
    })

    applyLanguage('en')

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href')
            if (!targetId || targetId === '#') return
            const target = document.querySelector(targetId)
            if (target && !target.classList.contains('login-overlay')) {
                event.preventDefault()
                target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        })
    })

    document.querySelectorAll('.auth-toggle-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const targetMode = button.dataset.authMode
            document.querySelectorAll('.auth-toggle-btn').forEach((toggle) => {
                const isActive = toggle === button
                toggle.classList.toggle('active', isActive)
                toggle.setAttribute('aria-selected', String(isActive))
            })

            document.querySelectorAll('.auth-panel').forEach((panel) => {
                const isActive = panel.id === `${targetMode}-panel`
                panel.classList.toggle('active', isActive)
                panel.hidden = !isActive
            })

            document.querySelectorAll('.role-choice').forEach((choice) => {
                choice.hidden = targetMode !== 'signup'
            })
        })
    })

    document.querySelectorAll('.role-btn').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.role-btn').forEach((roleButton) => {
                const isActive = roleButton === button
                roleButton.classList.toggle('active', isActive)
                roleButton.setAttribute('aria-pressed', String(isActive))
            })

            const selectedRole = button.dataset.role
            document.querySelectorAll('input[name="role"]').forEach((roleInput) => {
                roleInput.value = selectedRole
            })
        })
    })

    document.querySelectorAll('.auth-panel').forEach((panel) => {
        const isLogin = panel.id === 'login-panel'
        panel.classList.toggle('active', isLogin)
        panel.hidden = !isLogin
    })

    document.querySelectorAll('.role-choice').forEach((choice) => {
        choice.hidden = true
    })

    document.querySelectorAll('form').forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (form.closest('.login-modal, .login-card')) {
                event.preventDefault()
                showToast('Thanks. We will verify your details shortly.')
            }
        })
    })

    const mobileMenu = document.querySelector('.mobile-menu')
    const mainNav = document.querySelector('.main-nav')
    if (mobileMenu && mainNav) {
        mobileMenu.addEventListener('click', () => {
            mainNav.classList.toggle('menu-open')
        })
    }
})
