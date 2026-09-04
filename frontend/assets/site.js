const apiBaseUrl = (() => {
    if (window.location.hostname.endsWith('.app.github.dev') && window.location.port === '5501') {
        return `${window.location.protocol}//${window.location.hostname.replace('-5501.', '-3000.')}`
    }
    if (['localhost', '127.0.0.1'].includes(window.location.hostname) && window.location.port === '5501') {
        return 'http://localhost:3000'
    }
    return ''
})()

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
            'dashboard.verification': 'Verification',
            'how.title': 'How it works',
            'how.subtitle': 'Everything you need before you reach the mandi.',
            'how.introTitle': 'From harvest to payment, clearly.',
            'how.introText': 'KisanSetu keeps every important step visible, so you can plan your day with confidence.',
            'how.step1Title': 'Know your slot', 'how.step1Text': 'See crop-wise schedules and choose a convenient delivery window before leaving your farm.',
            'how.step2Title': 'Get your token', 'how.step2Text': 'Reserve your visit and receive a digital token with your mandi location and arrival time.',
            'how.step3Title': 'Watch the live queue', 'how.step3Text': 'Track your place in line and get an updated estimate while the queue moves forward.',
            'how.step4Title': 'Complete quality check', 'how.step4Text': 'Follow inspection progress and see when your harvest is accepted for procurement.',
            'how.step5Title': 'Receive your payment', 'how.step5Text': 'Review the amount breakdown and track your settlement through to your bank account.',
            'how.checkQueue': 'Check queue',
            'how.openDashboard': 'Open dashboard'
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
            'dashboard.verification': 'सत्यापन',
            'how.title': 'यह कैसे काम करता है', 'how.subtitle': 'मंडी पहुँचने से पहले आपकी हर जरूरत।',
            'how.introTitle': 'फसल से भुगतान तक, सब कुछ स्पष्ट।', 'how.introText': 'KisanSetu हर जरूरी चरण की जानकारी देता है, ताकि आप अपने दिन की योजना आत्मविश्वास से बना सकें।',
            'how.step1Title': 'अपना स्लॉट जानें', 'how.step1Text': 'खेत से निकलने से पहले फसल-वार समय देखें और सुविधाजनक डिलीवरी समय चुनें।',
            'how.step2Title': 'अपना टोकन पाएं', 'how.step2Text': 'अपनी यात्रा बुक करें और मंडी का स्थान व आगमन समय वाला डिजिटल टोकन पाएं।',
            'how.step3Title': 'लाइव कतार देखें', 'how.step3Text': 'कतार में अपना स्थान देखें और आगे बढ़ती कतार का नया अनुमान पाएं।',
            'how.step4Title': 'गुणवत्ता जांच पूरी करें', 'how.step4Text': 'जांच की प्रगति देखें और जानें कि आपकी फसल खरीद के लिए स्वीकार हुई है।',
            'how.step5Title': 'भुगतान पाएं', 'how.step5Text': 'राशि का विवरण देखें और बैंक खाते तक भुगतान का निपटान ट्रैक करें।',
            'how.checkQueue': 'कतार देखें', 'how.openDashboard': 'डैशबोर्ड खोलें'
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
            'dashboard.verification': ' पडताळणी',
            'how.title': 'हे कसे काम करते', 'how.subtitle': 'मंडईत पोहोचण्यापूर्वी आवश्यक सर्व माहिती।',
            'how.introTitle': 'पिकापासून पेमेंटपर्यंत, सर्व काही स्पष्ट.', 'how.introText': 'KisanSetu प्रत्येक महत्त्वाचा टप्पा दाखवते, त्यामुळे तुम्ही तुमच्या दिवसाचे नियोजन आत्मविश्वासाने करू शकता.',
            'how.step1Title': 'तुमचा स्लॉट जाणून घ्या', 'how.step1Text': 'शेतातून निघण्यापूर्वी पिकानुसार वेळापत्रक पाहा आणि सोयीची डिलिव्हरी वेळ निवडा.',
            'how.step2Title': 'तुमचा टोकन मिळवा', 'how.step2Text': 'भेट राखून ठेवा आणि मंडईचा पत्ता व आगमन वेळ असलेला डिजिटल टोकन मिळवा.',
            'how.step3Title': 'लाइव्ह रांग पाहा', 'how.step3Text': 'रांगेतील तुमचे स्थान पाहा आणि रांग पुढे सरकत असताना अद्ययावत अंदाज मिळवा.',
            'how.step4Title': 'गुणवत्ता तपासणी पूर्ण करा', 'how.step4Text': 'तपासणीची प्रगती पाहा आणि तुमचे पीक खरेदीसाठी स्वीकारले आहे का ते जाणून घ्या.',
            'how.step5Title': 'तुमचे पेमेंट मिळवा', 'how.step5Text': 'रकमेचा तपशील पाहा आणि बँक खात्यापर्यंत सेटलमेंट ट्रॅक करा.',
            'how.checkQueue': 'रांग पाहा', 'how.openDashboard': 'डॅशबोर्ड उघडा'
        }
    }

    const additionalLanguages = {
        as: { 'nav.how': 'ই কেনেকৈ কাম কৰে', 'nav.farmers': 'কৃষকৰ বাবে', 'nav.help': 'সহায়', 'nav.login': 'লগ ইন', 'dashboard.account': 'একাউণ্ট', 'dashboard.overview': 'সাৰাংশ', 'dashboard.queue': 'শাৰী', 'dashboard.orders': 'অৰ্ডাৰ', 'dashboard.payments': 'পেমেণ্ট', 'dashboard.support': 'সহায়', 'dashboard.logout': 'লগ আউট', 'dashboard.todayQueue': 'আজিৰ শাৰী', 'dashboard.totalCrop': 'মুঠ শস্যৰ পৰিমাণ', 'dashboard.inspection': 'পৰিদৰ্শন', 'dashboard.liveUpdates': 'লাইভ আপডেট', 'dashboard.queueTracking': 'শাৰী অনুসৰণ', 'dashboard.recentActivity': 'শেহতীয়া কাৰ্যকলাপ', 'dashboard.settlement': 'নিষ্পত্তি', 'dashboard.farmAssistance': 'কৃষি সহায়তা' },
        bn: { 'nav.how': 'এটি কীভাবে কাজ করে', 'nav.farmers': 'কৃষকদের জন্য', 'nav.help': 'সহায়তা', 'nav.login': 'লগইন', 'dashboard.account': 'অ্যাকাউন্ট', 'dashboard.overview': 'ওভারভিউ', 'dashboard.queue': 'সারি', 'dashboard.orders': 'অর্ডার', 'dashboard.payments': 'পেমেন্ট', 'dashboard.support': 'সহায়তা', 'dashboard.logout': 'লগআউট', 'dashboard.todayQueue': 'আজকের সারি', 'dashboard.totalCrop': 'মোট ফসলের পরিমাণ', 'dashboard.inspection': 'পরিদর্শন', 'dashboard.liveUpdates': 'লাইভ আপডেট', 'dashboard.queueTracking': 'সারি ট্র্যাকিং', 'dashboard.recentActivity': 'সাম্প্রতিক কার্যকলাপ', 'dashboard.settlement': 'নিষ্পত্তি', 'dashboard.farmAssistance': 'কৃষি সহায়তা' },
        brx: { 'nav.how': 'बेयो सोलोंग मोनसे?', 'nav.farmers': 'फिसाफोरनि थाखाय', 'nav.help': 'मदद', 'nav.login': 'लगिन', 'dashboard.account': 'हिसाब', 'dashboard.overview': 'फसं', 'dashboard.queue': 'लाइन', 'dashboard.orders': 'अर्डार', 'dashboard.payments': 'पेमेन्ट', 'dashboard.support': 'मदद', 'dashboard.logout': 'लग आउट', 'dashboard.todayQueue': 'दिनैनि लाइन', 'dashboard.totalCrop': 'गासै फसल', 'dashboard.inspection': 'नायबिजिरना', 'dashboard.liveUpdates': 'लाइभ अपडेट', 'dashboard.queueTracking': 'लाइन ट्रेक', 'dashboard.recentActivity': 'दानि हारिनि जेंना', 'dashboard.settlement': 'मिमांसना', 'dashboard.farmAssistance': 'फिसा मदद' },
        doi: { 'nav.how': 'एह्‌ कम्म कैसें चलदा ऐ', 'nav.farmers': 'किसानें आस्तै', 'nav.help': 'मदद', 'nav.login': 'लॉगिन', 'dashboard.account': 'खाता', 'dashboard.overview': 'सार', 'dashboard.queue': 'कतार', 'dashboard.orders': 'आर्डर', 'dashboard.payments': 'भुगतान', 'dashboard.support': 'मदद', 'dashboard.logout': 'लॉग आउट', 'dashboard.todayQueue': 'अज्ज दी कतार', 'dashboard.totalCrop': 'कुल फसल मात्रा', 'dashboard.inspection': 'जांच', 'dashboard.liveUpdates': 'लाइव अपडेट', 'dashboard.queueTracking': 'कतार ट्रैकिंग', 'dashboard.recentActivity': 'हाल दी गतिविधि', 'dashboard.settlement': 'निपटारा', 'dashboard.farmAssistance': 'खेती मदद' },
        gu: { 'nav.how': 'આ કેવી રીતે કામ કરે છે', 'nav.farmers': 'ખેડૂતો માટે', 'nav.help': 'મદદ', 'nav.login': 'લૉગિન', 'dashboard.account': 'ખાતું', 'dashboard.overview': 'ઝાંખી', 'dashboard.queue': 'કતાર', 'dashboard.orders': 'ઓર્ડર', 'dashboard.payments': 'ચુકવણી', 'dashboard.support': 'મદદ', 'dashboard.logout': 'લૉગઆઉટ', 'dashboard.account': 'ખાતું', 'dashboard.todayQueue': 'આજની કતાર', 'dashboard.totalCrop': 'કુલ પાક જથ્થો', 'dashboard.inspection': 'તપાસણી', 'dashboard.liveUpdates': 'લાઇવ અપડેટ', 'dashboard.queueTracking': 'કતાર ટ્રેકિંગ', 'dashboard.recentActivity': 'તાજેતરની પ્રવૃત્તિ', 'dashboard.settlement': 'પતાવટ', 'dashboard.farmAssistance': 'ખેતી સહાય' },
        ka: { 'nav.how': 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ', 'nav.farmers': 'ರೈತರಿಗಾಗಿ', 'nav.help': 'ಸಹಾಯ', 'nav.login': 'ಲಾಗಿನ್', 'dashboard.account': 'ಖಾತೆ', 'dashboard.overview': 'ಅವಲೋಕನ', 'dashboard.queue': 'ಸರದಿ', 'dashboard.orders': 'ಆದೇಶಗಳು', 'dashboard.payments': 'ಪಾವತಿಗಳು', 'dashboard.support': 'ಸಹಾಯ', 'dashboard.logout': 'ಲಾಗ್ ಔಟ್', 'dashboard.todayQueue': 'ಇಂದಿನ ಸರದಿ', 'dashboard.totalCrop': 'ಒಟ್ಟು ಬೆಳೆ ಪ್ರಮಾಣ', 'dashboard.inspection': 'ಪರಿಶೀಲನೆ', 'dashboard.liveUpdates': 'ಲೈವ್ ಅಪ್‌ಡೇಟ್‌ಗಳು', 'dashboard.queueTracking': 'ಸರದಿ ಟ್ರ್ಯಾಕಿಂಗ್', 'dashboard.recentActivity': 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ', 'dashboard.settlement': 'ಇತ್ಯರ್ಥ', 'dashboard.farmAssistance': 'ಕೃಷಿ ಸಹಾಯ' },
        ks: { 'nav.how': 'یہِ کٔس چھُ کار کران', 'nav.farmers': 'کسانن خٲطرٕ', 'nav.help': 'مدد', 'nav.login': 'لاگ اِن', 'dashboard.account': 'کھاتہ', 'dashboard.overview': 'خلاصہ', 'dashboard.queue': 'قطار', 'dashboard.orders': 'آرڈر', 'dashboard.payments': 'ادائیگی', 'dashboard.support': 'مدد', 'dashboard.logout': 'لاگ آؤٹ', 'dashboard.todayQueue': 'آجچ قطار', 'dashboard.totalCrop': 'کُل فصل مقدار', 'dashboard.inspection': 'جانچ', 'dashboard.liveUpdates': 'لائیو اپڈیٹ', 'dashboard.queueTracking': 'قطار ٹریکنگ', 'dashboard.recentActivity': 'حالیہ سرگرمی', 'dashboard.settlement': 'تصفیہ', 'dashboard.farmAssistance': 'کسان مدد' },
        kok: { 'nav.how': 'हें कसें काम करता', 'nav.farmers': 'शेतकऱ्यां खातीर', 'nav.help': 'मजत', 'nav.login': 'लॉग इन', 'dashboard.account': 'खातें', 'dashboard.overview': 'आढावो', 'dashboard.queue': 'रांग', 'dashboard.orders': 'ऑर्डर्स', 'dashboard.payments': 'पेमेण्ट', 'dashboard.support': 'मजत', 'dashboard.logout': 'लॉग आऊट', 'dashboard.todayQueue': 'आजची रांग', 'dashboard.totalCrop': 'एकूण पीक प्रमाण', 'dashboard.inspection': 'तपासणी', 'dashboard.liveUpdates': 'लाइव्ह अपडेट', 'dashboard.queueTracking': 'रांग ट्रॅकिंग', 'dashboard.recentActivity': 'निमाणें काम', 'dashboard.settlement': 'निपटारो', 'dashboard.farmAssistance': 'शेती मजत' },
        mai: { 'nav.how': 'ई केना काज करैत अछि', 'nav.farmers': 'किसान लेल', 'nav.help': 'मदद', 'nav.login': 'लॉगिन', 'dashboard.account': 'खाता', 'dashboard.overview': 'सारांश', 'dashboard.queue': 'कतार', 'dashboard.orders': 'ऑर्डर', 'dashboard.payments': 'भुगतान', 'dashboard.support': 'मदद', 'dashboard.logout': 'लॉगआउट', 'dashboard.todayQueue': 'आजुक कतार', 'dashboard.totalCrop': 'कुल फसल मात्रा', 'dashboard.inspection': 'जाँच', 'dashboard.liveUpdates': 'लाइव अपडेट', 'dashboard.queueTracking': 'कतार ट्रैकिंग', 'dashboard.recentActivity': 'हालक गतिविधि', 'dashboard.settlement': 'निपटारा', 'dashboard.farmAssistance': 'खेती सहायता' },
        ml: { 'nav.how': 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു', 'nav.farmers': 'കർഷകർക്കായി', 'nav.help': 'സഹായം', 'nav.login': 'ലോഗിൻ', 'dashboard.account': 'അക്കൗണ്ട്', 'dashboard.overview': 'അവലോകനം', 'dashboard.queue': 'ക്യൂ', 'dashboard.orders': 'ഓർഡറുകൾ', 'dashboard.payments': 'പേയ്മെന്റുകൾ', 'dashboard.support': 'സഹായം', 'dashboard.logout': 'ലോഗ് ഔട്ട്', 'dashboard.todayQueue': 'ഇന്നത്തെ ക്യൂ', 'dashboard.totalCrop': 'മൊത്തം വിള അളവ്', 'dashboard.inspection': 'പരിശോധന', 'dashboard.liveUpdates': 'തത്സമയ അപ്ഡേറ്റുകൾ', 'dashboard.queueTracking': 'ക്യൂ ട്രാക്കിംഗ്', 'dashboard.recentActivity': 'സമീപകാല പ്രവർത്തനം', 'dashboard.settlement': 'തീർപ്പാക്കൽ', 'dashboard.farmAssistance': 'കൃഷി സഹായം' },
        mni: { 'nav.how': 'মসি করিগী থোকপা', 'nav.farmers': 'ফিসাফোরগী', 'nav.help': 'মতেং', 'nav.login': 'লগ ইন', 'dashboard.account': 'একাউন্ট', 'dashboard.overview': 'অৱলোকন', 'dashboard.queue': 'লাইন', 'dashboard.orders': 'অর্ডর', 'dashboard.payments': 'পেমেন্ট', 'dashboard.support': 'মতেং', 'dashboard.logout': 'লগ আউট', 'dashboard.todayQueue': 'নুমিতকী লাইন', 'dashboard.totalCrop': 'ফসলগী অশাংবা', 'dashboard.inspection': 'যাচ', 'dashboard.liveUpdates': 'লাইভ আপডেট', 'dashboard.queueTracking': 'লাইন ট্রেকিং', 'dashboard.recentActivity': 'নৌনা থোকপা', 'dashboard.settlement': 'থাদোকপা', 'dashboard.farmAssistance': 'ফিসাগী মতেং' },
        ne: { 'nav.how': 'यसले कसरी काम गर्छ', 'nav.farmers': 'किसानहरूका लागि', 'nav.help': 'सहायता', 'nav.login': 'लगइन', 'dashboard.account': 'खाता', 'dashboard.overview': 'अवलोकन', 'dashboard.queue': 'लाइन', 'dashboard.orders': 'अर्डर', 'dashboard.payments': 'भुक्तानी', 'dashboard.support': 'सहायता', 'dashboard.logout': 'लगआउट', 'dashboard.todayQueue': 'आजको लाइन', 'dashboard.totalCrop': 'कुल बाली मात्रा', 'dashboard.inspection': 'निरीक्षण', 'dashboard.liveUpdates': 'लाइभ अपडेट', 'dashboard.queueTracking': 'लाइन ट्र्याकिङ', 'dashboard.recentActivity': 'हालका गतिविधि', 'dashboard.settlement': 'भुक्तानी मिलान', 'dashboard.farmAssistance': 'कृषि सहायता' },
        or: { 'nav.how': 'ଏହା କିପରି କାମ କରେ', 'nav.farmers': 'ଚାଷୀଙ୍କ ପାଇଁ', 'nav.help': 'ସହାୟତା', 'nav.login': 'ଲଗଇନ', 'dashboard.account': 'ଖାତା', 'dashboard.overview': 'ସାରାଂଶ', 'dashboard.queue': 'ଧାଡ଼ି', 'dashboard.orders': 'ଅର୍ଡର', 'dashboard.payments': 'ଦେୟ', 'dashboard.support': 'ସହାୟତା', 'dashboard.logout': 'ଲଗଆଉଟ', 'dashboard.todayQueue': 'ଆଜିର ଧାଡ଼ି', 'dashboard.totalCrop': 'ମୋଟ ଫସଲ ପରିମାଣ', 'dashboard.inspection': 'ଯାଞ୍ଚ', 'dashboard.liveUpdates': 'ଲାଇଭ ଅପଡେଟ', 'dashboard.queueTracking': 'ଧାଡ଼ି ଟ୍ରାକିଂ', 'dashboard.recentActivity': 'ସାମ୍ପ୍ରତିକ କାର୍ଯ୍ୟକଳାପ', 'dashboard.settlement': 'ସମାଧାନ', 'dashboard.farmAssistance': 'କୃଷି ସହାୟତା' },
        pa: { 'nav.how': 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ', 'nav.farmers': 'ਕਿਸਾਨਾਂ ਲਈ', 'nav.help': 'ਮਦਦ', 'nav.login': 'ਲਾਗਇਨ', 'dashboard.account': 'ਖਾਤਾ', 'dashboard.overview': 'ਸੰਖੇਪ', 'dashboard.queue': 'ਕਤਾਰ', 'dashboard.orders': 'ਆਰਡਰ', 'dashboard.payments': 'ਭੁਗਤਾਨ', 'dashboard.support': 'ਮਦਦ', 'dashboard.logout': 'ਲਾਗਆਉਟ', 'dashboard.todayQueue': 'ਅੱਜ ਦੀ ਕਤਾਰ', 'dashboard.totalCrop': 'ਕੁੱਲ ਫਸਲ ਮਾਤਰਾ', 'dashboard.inspection': 'ਜਾਂਚ', 'dashboard.liveUpdates': 'ਲਾਈਵ ਅਪਡੇਟ', 'dashboard.queueTracking': 'ਕਤਾਰ ਟ੍ਰੈਕਿੰਗ', 'dashboard.recentActivity': 'ਹਾਲੀਆ ਸਰਗਰਮੀ', 'dashboard.settlement': 'ਨਿਪਟਾਰਾ', 'dashboard.farmAssistance': 'ਖੇਤੀ ਸਹਾਇਤਾ' },
        sa: { 'nav.how': 'एतत् कथं कार्यं करोति', 'nav.farmers': 'कृषकेभ्यः', 'nav.help': 'सहायता', 'nav.login': 'प्रवेशः', 'dashboard.account': 'खाता', 'dashboard.overview': 'अवलोकनम्', 'dashboard.queue': 'पङ्क्तिः', 'dashboard.orders': 'आदेशाः', 'dashboard.payments': 'भुगतानम्', 'dashboard.support': 'सहायता', 'dashboard.logout': 'निर्गमः', 'dashboard.todayQueue': 'अद्यतन पङ्क्तिः', 'dashboard.totalCrop': 'कुलसस्यप्रमाणम्', 'dashboard.inspection': 'निरीक्षणम्', 'dashboard.liveUpdates': 'सजीव अद्यतनम्', 'dashboard.queueTracking': 'पङ्क्ति अनुसरणम्', 'dashboard.recentActivity': 'अद्यतन क्रिया', 'dashboard.settlement': 'निपटानम्', 'dashboard.farmAssistance': 'कृषि सहायता' },
        sat: { 'nav.how': 'नोआ से होय', 'nav.farmers': 'चासिन हांसाते', 'nav.help': 'मदद', 'nav.login': 'लॉगिन', 'dashboard.account': 'हिसाब', 'dashboard.overview': 'नजर', 'dashboard.queue': 'लाइन', 'dashboard.orders': 'आदेश', 'dashboard.payments': 'टाका', 'dashboard.support': 'मदद', 'dashboard.logout': 'लॉगआउट', 'dashboard.todayQueue': 'आजाक लाइन', 'dashboard.totalCrop': 'गासे फसल', 'dashboard.inspection': 'जांच', 'dashboard.liveUpdates': 'जिउता खबर', 'dashboard.queueTracking': 'लाइन देखना', 'dashboard.recentActivity': 'नावा काज', 'dashboard.settlement': 'मिमांस', 'dashboard.farmAssistance': 'चास मदद' },
        sd: { 'nav.how': 'هي ڪيئن ڪم ڪري ٿو', 'nav.farmers': 'هارين لاءِ', 'nav.help': 'مدد', 'nav.login': 'لاگ ان', 'dashboard.account': 'کاتو', 'dashboard.overview': 'جائزو', 'dashboard.queue': 'قطار', 'dashboard.orders': 'آرڊر', 'dashboard.payments': 'ادائيگي', 'dashboard.support': 'مدد', 'dashboard.logout': 'لاگ آئوٽ', 'dashboard.todayQueue': 'اڄ جي قطار', 'dashboard.totalCrop': 'ڪل فصل مقدار', 'dashboard.inspection': 'جاچ', 'dashboard.liveUpdates': 'لائيو اپڊيٽ', 'dashboard.queueTracking': 'قطار ٽريڪنگ', 'dashboard.recentActivity': 'تازيون سرگرميون', 'dashboard.settlement': 'فيصلو', 'dashboard.farmAssistance': 'زرعي مدد' },
        ta: { 'nav.how': 'இது எப்படி வேலை செய்கிறது', 'nav.farmers': 'விவசாயிகளுக்கு', 'nav.help': 'உதவி', 'nav.login': 'உள்நுழைவு', 'dashboard.account': 'கணக்கு', 'dashboard.overview': 'மேலோட்டம்', 'dashboard.queue': 'வரிசை', 'dashboard.orders': 'ஆர்டர்கள்', 'dashboard.payments': 'கொடுப்பனவுகள்', 'dashboard.support': 'உதவி', 'dashboard.logout': 'வெளியேறு', 'dashboard.todayQueue': 'இன்றைய வரிசை', 'dashboard.totalCrop': 'மொத்த பயிர் அளவு', 'dashboard.inspection': 'ஆய்வு', 'dashboard.liveUpdates': 'நேரலை புதுப்பிப்புகள்', 'dashboard.queueTracking': 'வரிசை கண்காணிப்பு', 'dashboard.recentActivity': 'சமீபத்திய செயல்பாடு', 'dashboard.settlement': 'தீர்வு', 'dashboard.farmAssistance': 'விவசாய உதவி' },
        te: { 'nav.how': 'ఇది ఎలా పనిచేస్తుంది', 'nav.farmers': 'రైతుల కోసం', 'nav.help': 'సహాయం', 'nav.login': 'లాగిన్', 'dashboard.account': 'ఖాతా', 'dashboard.overview': 'అవలోకనం', 'dashboard.queue': 'క్యూ', 'dashboard.orders': 'ఆర్డర్లు', 'dashboard.payments': 'చెల్లింపులు', 'dashboard.support': 'సహాయం', 'dashboard.logout': 'లాగ్ అవుట్', 'dashboard.todayQueue': 'నేటి క్యూ', 'dashboard.totalCrop': 'మొత్తం పంట పరిమాణం', 'dashboard.inspection': 'తనిఖీ', 'dashboard.liveUpdates': 'లైవ్ అప్‌డేట్లు', 'dashboard.queueTracking': 'క్యూ ట్రాకింగ్', 'dashboard.recentActivity': 'ఇటీవలి కార్యకలాపం', 'dashboard.settlement': 'సెటిల్‌మెంట్', 'dashboard.farmAssistance': 'వ్యవసాయ సహాయం' },
        ur: { 'nav.how': 'یہ کیسے کام کرتا ہے', 'nav.farmers': 'کسانوں کے لیے', 'nav.help': 'مدد', 'nav.login': 'لاگ اِن', 'dashboard.account': 'اکاؤنٹ', 'dashboard.overview': 'جائزہ', 'dashboard.queue': 'قطار', 'dashboard.orders': 'آرڈرز', 'dashboard.payments': 'ادائیگیاں', 'dashboard.support': 'مدد', 'dashboard.logout': 'لاگ آؤٹ', 'dashboard.todayQueue': 'آج کی قطار', 'dashboard.totalCrop': 'کل فصل کی مقدار', 'dashboard.inspection': 'معائنہ', 'dashboard.liveUpdates': 'لائیو اپ ڈیٹس', 'dashboard.queueTracking': 'قطار ٹریکنگ', 'dashboard.recentActivity': 'حالیہ سرگرمی', 'dashboard.settlement': 'تصفیہ', 'dashboard.farmAssistance': 'زرعی مدد' }
    }

    const howLabels = {
        as: ['ই কেনেকৈ কাম কৰে', 'ফচলৰ পৰা পেমেণ্টলৈ', 'সময়ৰ স্লট জানক', 'টোকেন লওক', 'লাইভ শাৰী চাওক', 'গুণগত পৰীক্ষা সম্পূৰ্ণ কৰক', 'পেমেণ্ট লাভ কৰক', 'শাৰী চাওক', 'ডেচব’ৰ্ড খোলক'],
        bn: ['এটি কীভাবে কাজ করে', 'ফসল থেকে পেমেন্ট পর্যন্ত', 'আপনার সময় জানুন', 'টোকেন নিন', 'লাইভ সারি দেখুন', 'মান পরীক্ষা সম্পূর্ণ করুন', 'পেমেন্ট পান', 'সারি দেখুন', 'ড্যাশবোর্ড খুলুন'],
        brx: ['बेयो सोलोंग मोनसे', 'फिसा निफ्राय पेमेन्ट सिम', 'नावार सम जान', 'टकेन ला', 'जिउता लाइन नाय', 'गुण नायबिजिरना खालाम', 'पेमेन्ट मोन', 'लाइन नाय', 'डेसबर्ड खेव'],
        doi: ['एह् कम्म कैसें चलदा ऐ', 'फसल थमां भुगतान तगर', 'अपना समां जानो', 'टोकन लैओ', 'लाइव कतार दिक्खो', 'गुणवत्ता जांच करो', 'भुगतान पाओ', 'कतार दिक्खो', 'डैशबोर्ड खोलो'],
        gu: ['આ કેવી રીતે કામ કરે છે', 'પાકથી ચુકવણી સુધી', 'તમારો સમય જાણો', 'ટોકન મેળવો', 'લાઇવ કતાર જુઓ', 'ગુણવત્તા તપાસ પૂર્ણ કરો', 'ચુકવણી મેળવો', 'કતાર જુઓ', 'ડેશબોર્ડ ખોલો'],
        ka: ['ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ', 'ಬೆಳೆಯಿಂದ ಪಾವತಿಯವರೆಗೆ', 'ನಿಮ್ಮ ಸಮಯ ತಿಳಿಯಿರಿ', 'ಟೋಕನ್ ಪಡೆಯಿರಿ', 'ಲೈವ್ ಸರದಿ ನೋಡಿ', 'ಗುಣಮಟ್ಟ ಪರಿಶೀಲನೆ ಮಾಡಿ', 'ಪಾವತಿ ಪಡೆಯಿರಿ', 'ಸರದಿ ನೋಡಿ', 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ'],
        ks: ['یہِ کٔس چھُ کار کران', 'فصلہٕ پیٹھ ادائیگی تام', 'پنُن وقت جانِو', 'ٹوکن حٲصل کٔرِو', 'لائیو قطار دِژِو', 'معیار جانچ مکمل کٔرِو', 'ادائیگی حٲصل کٔرِو', 'قطار دِژِو', 'ڈیش بورڈ کھولِو'],
        kok: ['हें कसें काम करता', 'पिकापासून पेमेण्ट मेरेन', 'तुमचो वेळ जाणात', 'टोकन घेयात', 'लाइव्ह रांग पळोयात', 'गुणवत्ता तपासणी करात', 'पेमेण्ट मेळोयात', 'रांग पळोयात', 'डॅशबोर्ड उगडात'],
        mai: ['ई केना काज करैत अछि', 'फसल सँ भुगतान धरि', 'अपन समय जानू', 'टोकन लिअ', 'लाइव कतार देखू', 'गुणवत्ता जाँच करू', 'भुगतान पाउ', 'कतार देखू', 'डैशबोर्ड खोलू'],
        ml: ['ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു', 'വിളയിൽ നിന്ന് പേയ്മെന്റിലേക്ക്', 'നിങ്ങളുടെ സമയം അറിയുക', 'ടോക്കൺ നേടുക', 'തത്സമയ ക്യൂ കാണുക', 'ഗുണനിലവാര പരിശോധന പൂർത്തിയാക്കുക', 'പേയ്മെന്റ് നേടുക', 'ക്യൂ കാണുക', 'ഡാഷ്ബോർഡ് തുറക്കുക'],
        mni: ['মসি করিগী থোকপা', 'ফিসাফোরদগী পেমেন্ট ফাওবা', 'নহাক্কী মতম খংউ', 'টোকেন লৌউ', 'লাইভ লাইন উ', 'গুণগী যাচ থোকউ', 'পেমেন্ট লৌউ', 'লাইন উ', 'ডেশবর্ড হাংউ'],
        ne: ['यसले कसरी काम गर्छ', 'बालीदेखि भुक्तानीसम्म', 'आफ्नो समय जान्नुहोस्', 'टोकन लिनुहोस्', 'लाइभ लाइन हेर्नुहोस्', 'गुणस्तर जाँच पूरा गर्नुहोस्', 'भुक्तानी पाउनुहोस्', 'लाइन हेर्नुहोस्', 'ड्यासबोर्ड खोल्नुहोस्'],
        or: ['ଏହା କିପରି କାମ କରେ', 'ଫସଲରୁ ଦେୟ ପର୍ଯ୍ୟନ୍ତ', 'ଆପଣଙ୍କ ସମୟ ଜାଣନ୍ତୁ', 'ଟୋକନ ନିଅନ୍ତୁ', 'ଲାଇଭ ଧାଡ଼ି ଦେଖନ୍ତୁ', 'ଗୁଣବତ୍ତା ଯାଞ୍ଚ କରନ୍ତୁ', 'ଦେୟ ପାଆନ୍ତୁ', 'ଧାଡ଼ି ଦେଖନ୍ତୁ', 'ଡ୍ୟାସବୋର୍ଡ ଖୋଲନ୍ତୁ'],
        pa: ['ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ', 'ਫਸਲ ਤੋਂ ਭੁਗਤਾਨ ਤੱਕ', 'ਆਪਣਾ ਸਮਾਂ ਜਾਣੋ', 'ਟੋਕਨ ਲਵੋ', 'ਲਾਈਵ ਕਤਾਰ ਵੇਖੋ', 'ਗੁਣਵੱਤਾ ਜਾਂਚ ਪੂਰੀ ਕਰੋ', 'ਭੁਗਤਾਨ ਲਵੋ', 'ਕਤਾਰ ਵੇਖੋ', 'ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ'],
        sa: ['एतत् कथं कार्यं करोति', 'सस्यात् भुगतानपर्यन्तम्', 'स्वसमयं जानीहि', 'टोकनं गृह्णीहि', 'सजीवपङ्क्तिं पश्य', 'गुणवत्तापरीक्षां कुरु', 'भुगतानं प्राप्नुहि', 'पङ्क्तिं पश्य', 'डैशबोर्ड उद्घाटय'],
        sat: ['नोआ से होय', 'फसल खोन टाका ताम', 'आपन समाय जान', 'टकेन लाव', 'जिउता लाइन नाय', 'गुण जांच खालाम', 'टाका मोन', 'लाइन नाय', 'डेसबर्ड झिज'],
        sd: ['هي ڪيئن ڪم ڪري ٿو', 'فصل کان ادائيگي تائين', 'پنهنجو وقت ڄاڻو', 'ٽوڪن وٺو', 'لائيو قطار ڏسو', 'معيار جي جاچ مڪمل ڪريو', 'ادائيگي حاصل ڪريو', 'قطار ڏسو', 'ڊيش بورڊ کوليو'],
        ta: ['இது எப்படி வேலை செய்கிறது', 'பயிரிலிருந்து பணம் வரை', 'உங்கள் நேரத்தை அறியுங்கள்', 'டோக்கனைப் பெறுங்கள்', 'நேரலை வரிசையைப் பாருங்கள்', 'தரச் சோதனையை முடிக்கவும்', 'பணம் பெறுங்கள்', 'வரிசையைப் பாருங்கள்', 'டாஷ்போர்டைத் திறக்கவும்'],
        te: ['ఇది ఎలా పనిచేస్తుంది', 'పంట నుండి చెల్లింపు వరకు', 'మీ సమయాన్ని తెలుసుకోండి', 'టోకెన్ పొందండి', 'లైవ్ క్యూ చూడండి', 'నాణ్యత తనిఖీ పూర్తి చేయండి', 'చెల్లింపు పొందండి', 'క్యూను చూడండి', 'డ్యాష్‌బోర్డ్ తెరవండి'],
        ur: ['یہ کیسے کام کرتا ہے', 'فصل سے ادائیگی تک', 'اپنا وقت جانیں', 'ٹوکن حاصل کریں', 'لائیو قطار دیکھیں', 'معیار کی جانچ مکمل کریں', 'ادائیگی حاصل کریں', 'قطار دیکھیں', 'ڈیش بورڈ کھولیں']
    }

    Object.entries(additionalLanguages).forEach(([lang, labels]) => {
        const how = howLabels[lang]
        const howTranslation = how ? {
            'how.title': how[0], 'how.introTitle': how[1], 'how.step1Title': how[2], 'how.step2Title': how[3],
            'how.step3Title': how[4], 'how.step4Title': how[5], 'how.step5Title': how[6], 'how.checkQueue': how[7], 'how.openDashboard': how[8]
        } : {}
        translations[lang] = { ...translations.en, ...labels, ...howTranslation }
    })

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
                const label = element.querySelector('.button-label')
                if (label) {
                    label.textContent = selected[key]
                } else if (element.children.length === 0) {
                    element.textContent = selected[key]
                } else {
                    element.innerHTML = selected[key]
                }
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

        try {
            localStorage.setItem('kisansetu-language', lang)
        } catch (error) {
        }

        if (document.documentElement) {
            document.documentElement.lang = lang
        }
    }

    document.querySelectorAll('.language-select').forEach((select) => {
        select.addEventListener('change', (event) => {
            applyLanguage(event.target.value)
        })
    })

    let savedLanguage = 'en'
    try {
        savedLanguage = localStorage.getItem('kisansetu-language') || 'en'
    } catch (error) {
    }
    applyLanguage(savedLanguage)

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href')
            if (!targetId || targetId === '#') return
            const target = document.querySelector(targetId)
            if (target && !target.classList.contains('login-overlay') && !target.classList.contains('how-overlay') && !target.classList.contains('support-overlay')) {
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
        form.addEventListener('submit', async (event) => {
            if (!form.classList.contains('auth-api-form')) return
            event.preventDefault()
            const submitButton = form.querySelector('button[type="submit"]')
            const action = form.dataset.authAction
            const originalText = submitButton.textContent
            submitButton.disabled = true
            submitButton.textContent = action === 'register' ? 'Creating account...' : 'Signing in...'
            try {
                const response = await fetch(`${apiBaseUrl}/api/auth/${action}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(Object.fromEntries(new FormData(form))),
                })
                const responseText = await response.text()
                let result = {}
                if (responseText.trim()) {
                    try {
                        result = JSON.parse(responseText)
                    } catch {
                        throw new Error(`Server returned an invalid response (HTTP ${response.status}).`)
                    }
                }
                if (!response.ok) throw new Error(result.error || 'Unable to continue.')
                window.location.href = form.getAttribute('action') || '../dashboard/index.html'
            } catch (error) {
                showToast(error.message)
                submitButton.disabled = false
                submitButton.textContent = originalText
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
