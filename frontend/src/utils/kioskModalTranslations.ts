// Multilingual translations for Kiosk Modals (Digital Receipt, Order Tracker, Staff Login, Entertainment)

export interface ModalTranslations {
  receiptDispatched: (waiter: string) => string;
  receiptConfirmed: string;
  totalAllOrders: (table: number) => string;
  activeTicketsCount: (count: number) => string;
  dishesDeliveredTitle: string;
  rateMealPrompt: (waiter: string) => string;
  boredWaitingText: string;
  playGamesLoungeBtn: string;
}

export const KIOSK_MODAL_TRANSLATIONS: Record<string, ModalTranslations> = {
  en: {
    receiptDispatched: (waiter) => `Ticket dispatched to Kitchen! Attendant: ${waiter} • Live Kitchen Tracker is active.`,
    receiptConfirmed: 'Order confirmed in Kitchen! Moving to Preparing — Live Kitchen Progress is active.',
    totalAllOrders: (table) => `Total For All Placed Orders (Table ${table})`,
    activeTicketsCount: (count) => `You have ${count} active tickets submitted to the kitchen during this table session.`,
    dishesDeliveredTitle: 'Dishes Delivered • How Was Everything?',
    rateMealPrompt: (waiter) => `Rate your meal and service by ${waiter}.`,
    boredWaitingText: 'Bored waiting? Play Ludo, Sudoku or Read Live News!',
    playGamesLoungeBtn: 'Play Games Lounge'
  },
  ta: {
    receiptDispatched: (waiter) => `டிக்கெட் சமையலறைக்கு அனுப்பப்பட்டது! பணியாளர்: ${waiter} • நேரலை சமையலறை டிராக்கர் செயலில் உள்ளது.`,
    receiptConfirmed: 'ஆர்டர் சமையலறையில் உறுதி செய்யப்பட்டது! தயாரிப்பு தொடங்குகிறது — நேரலை முன்னேற்றம் செயலில் உள்ளது.',
    totalAllOrders: (table) => `அனைத்து ஆர்டர்களின் மொத்த தொகை (மேஜை ${table})`,
    activeTicketsCount: (count) => `இந்த மேஜை அமர்வில் சமையலறைக்கு அனுப்பப்பட்ட ${count} செயலில் உள்ள டிக்கெட்டுகள் உள்ளன.`,
    dishesDeliveredTitle: 'உணவு பரிமாறப்பட்டது • எப்படி இருந்தது?',
    rateMealPrompt: (waiter) => `பணியாளர் ${waiter} அவர்களின் சேவையை மதிப்பிடுங்கள்.`,
    boredWaitingText: 'காத்திருக்கும் நேரத்தில் லுடோ, சுடோகு விளையாடுங்கள் அல்லது செய்திகளைப் படியுங்கள்!',
    playGamesLoungeBtn: 'விளையாட்டு அரங்கம்'
  },
  hi: {
    receiptDispatched: (waiter) => `टिकट रसोई में भेजा गया! परिचारक: ${waiter} • लाइव किचन ट्रैकर सक्रिय है।`,
    receiptConfirmed: 'रसोई में ऑर्डर की पुष्टि हुई! तैयारी शुरू — लाइव प्रगति सक्रिय है।',
    totalAllOrders: (table) => `सभी दिए गए ऑर्डरों का कुल योग (टेबल ${table})`,
    activeTicketsCount: (count) => `इस टेबल सत्र के दौरान रसोई में भेजे गए आपके ${count} सक्रिय टिकट हैं।`,
    dishesDeliveredTitle: 'व्यंजन परोसे गए • सब कुछ कैसा लगा?',
    rateMealPrompt: (waiter) => `परिचारक ${waiter} की सेवा और भोजन को रेटिंग दें।`,
    boredWaitingText: 'इंतजार से ऊब गए? लूडो, सुडोकू खेलें या लाइव समाचार पढ़ें!',
    playGamesLoungeBtn: 'गेम्स लाउंज खेलें'
  },
  te: {
    receiptDispatched: (waiter) => `టిక్కెట్ వంటగదికి పంపబడింది! సహాయకుడు: ${waiter} • ప్రత్యక్ష కిచెన్ ట్రాకర్ చురుకుగా ఉంది.`,
    receiptConfirmed: 'వంటగదిలో ఆర్డర్ నిర్ధారించబడింది! తయారీ ప్రారంభమవుతోంది — ప్రత్యక్ష ప్రగతి చురుకుగా ఉంది.',
    totalAllOrders: (table) => `చేసిన అన్ని ఆర్డర్ల మొత్తం (టేబుల్ ${table})`,
    activeTicketsCount: (count) => `ఈ టేబుల్ సెషన్‌లో వంటగదికి పంపబడిన ${count} సక్రియ టిక్కెట్లు ఉన్నాయి.`,
    dishesDeliveredTitle: 'వంటకాలు వడ్డించబడ్డాయి • అనుభవం ఎలా ఉంది?',
    rateMealPrompt: (waiter) => `సహాయకుడు ${waiter} సేవను మరియు భోజనాన్ని రేట్ చేయండి.`,
    boredWaitingText: 'వేచి ఉండటంలో విసుగు చెందారా? లూడో, సుడోకు ఆడండి లేదా వార్తలు చదవండి!',
    playGamesLoungeBtn: 'గేమ్స్ లాంజ్ ఆడండి'
  },
  kn: {
    receiptDispatched: (waiter) => `ಟಿಕೆಟ್ ಅಡುಗೆಮನೆಗೆ ಕಳುಹಿಸಲಾಗಿದೆ! ಸಹಾಯಕ: ${waiter} • ಲೈವ್ ಕಿಚನ್ ಟ್ರ್ಯಾಕರ್ ಸಕ್ರಿಯವಾಗಿದೆ.`,
    receiptConfirmed: 'ಅಡುಗೆಮನೆಯಲ್ಲಿ ಆರ್ಡರ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ! ತಯಾರಿಕೆ ಪ್ರಾರಂಭವಾಗಿದೆ — ಲೈವ್ ಪ್ರಗತಿ ಸಕ್ರಿಯವಾಗಿದೆ.',
    totalAllOrders: (table) => `ಮಾಡಲಾದ ಎಲ್ಲಾ ಆರ್ಡರ್‌ಗಳ ಒಟ್ಟು ಮೊತ್ತ (ಟೇಬಲ್ ${table})`,
    activeTicketsCount: (count) => `ಈ ಟೇಬಲ್ ಅವಧಿಯಲ್ಲಿ ಅಡುಗೆಮನೆಗೆ ಸಲ್ಲಿಸಲಾದ ${count} ಸಕ್ರಿಯ ಟಿಕೆಟ್‌ಗಳಿವೆ.`,
    dishesDeliveredTitle: 'ಊಟ ಬಡಿಸಲಾಗಿದೆ • ಅನುಭವ ಹೇಗಿತ್ತು?',
    rateMealPrompt: (waiter) => `ಸಹಾಯಕ ${waiter} ಅವರ ಸೇವೆಯನ್ನು ರೇಟ್ ಮಾಡಿ.`,
    boredWaitingText: 'ಕಾಯುತ್ತ ಬೇಸರವಾಗಿದೆಯೇ? ಲೂಡೋ, ಸುಡೋಕು ಆಡಿ ಅಥವಾ ಲೈವ್ ಸುದ್ದಿ ಓದಿ!',
    playGamesLoungeBtn: 'ಗೇಮ್ಸ್ ಲೌಂಜ್ ಆಡಿ'
  },
  ml: {
    receiptDispatched: (waiter) => `ടിക്കറ്റ് അടുക്കളയിലേക്ക് അയച്ചു! അറ്റൻഡന്റ്: ${waiter} • തത്സമയ കിച്ചൻ ട്രാക്കർ സജീവമാണ്.`,
    receiptConfirmed: 'അടുക്കളയിൽ ഓർഡർ സ്ഥിരീകരിച്ചു! തയ്യാറാക്കൽ ആരംഭിക്കുന്നു — തത്സമയ പുരോഗതി സജീവമാണ്.',
    totalAllOrders: (table) => `നൽകിയ എല്ലാ ഓർഡറുകളുടെയും ആകെ തുക (ടേബിൾ ${table})`,
    activeTicketsCount: (count) => `ഈ ടേബിൾ സെഷനിൽ അടുക്കളയിലേക്ക് സമർപ്പിച്ച ${count} സജീവ ടിക്കറ്റുകൾ ഉണ്ട്.`,
    dishesDeliveredTitle: 'ഭക്ഷണം വിളമ്പി • അനുഭവം എങ്ങനെയുണ്ടായിരുന്നു?',
    rateMealPrompt: (waiter) => `അറ്റൻഡന്റ് ${waiter} അവരുടെ സേവനത്തിന് റേറ്റിംഗ് നൽകുക.`,
    boredWaitingText: 'കാത്തിരുന്ന് മടുത്തോ? ലുഡോ, സുഡോകു കളിക്കുക അല്ലെങ്കിൽ വാർത്തകൾ വായിക്കുക!',
    playGamesLoungeBtn: 'ഗെയിംസ് ലോഞ്ച് കളിക്കുക'
  },
  ar: {
    receiptDispatched: (waiter) => `تم إرسال التذكرة إلى المطبخ! المضيف: ${waiter} • متتبع المطبخ المباشر نشط.`,
    receiptConfirmed: 'تم تأكيد الطلب في المطبخ! جاري التحضير — متابعة المطبخ المباشرة نشطة.',
    totalAllOrders: (table) => `إجمالي جميع الطلبات المقدمة (طاولة ${table})`,
    activeTicketsCount: (count) => `لديك ${count} تذاكر نشطة تم إرسالها إلى المطبخ خلال هذه الجلسة.`,
    dishesDeliveredTitle: 'تم تقديم الأطباق • كيف كانت تجربتكم؟',
    rateMealPrompt: (waiter) => `يرجى تقييم وجبتكم والخدمة من قبل ${waiter}.`,
    boredWaitingText: 'هل تشعر بالملل أثناء الانتظار؟ العب لودو أو سودوكو أو اقرأ الأخبار!',
    playGamesLoungeBtn: 'صالة الألعاب'
  },
  ko: {
    receiptDispatched: (waiter) => `티켓이 주방으로 전송되었습니다! 담당: ${waiter} • 실시간 주방 조리 현황이 활성화되었습니다.`,
    receiptConfirmed: '주방에서 주문이 확인되었습니다! 조리 시작 — 실시간 조리 현황이 활성화되었습니다.',
    totalAllOrders: (table) => `모든 접수된 주문 총 결제액 (테이블 ${table})`,
    activeTicketsCount: (count) => `이번 테이블 이용 중 주방으로 전달된 활성 티켓이 ${count}개 있습니다.`,
    dishesDeliveredTitle: '요리가 서빙되었습니다 • 음식은 어떠셨나요?',
    rateMealPrompt: (waiter) => `담당 직원 ${waiter}의 서빙과 식사를 평가해 주세요.`,
    boredWaitingText: '기다리기 지루하신가요? 루도, 스도쿠 게임을 즐기거나 실시간 뉴스를 읽어보세요!',
    playGamesLoungeBtn: '게임 라운지 이용하기'
  },
  es: {
    receiptDispatched: (waiter) => `¡Ticket enviado a la cocina! Atendido por: ${waiter} • Seguimiento en vivo activo.`,
    receiptConfirmed: '¡Pedido confirmado en la cocina! En preparación — El seguimiento en vivo está activo.',
    totalAllOrders: (table) => `Total de todos los pedidos realizados (Mesa ${table})`,
    activeTicketsCount: (count) => `Tiene ${count} tickets activos enviados a la cocina durante esta sesión.`,
    dishesDeliveredTitle: 'Platos servidos • ¿Cómo estuvo todo?',
    rateMealPrompt: (waiter) => `Califique su comida y el servicio brindado por ${waiter}.`,
    boredWaitingText: '¿Aburrido de esperar? ¡Juegue Ludo, Sudoku o lea las noticias en vivo!',
    playGamesLoungeBtn: 'Ir a Sala de Juegos'
  },
  fr: {
    receiptDispatched: (waiter) => `Ticket envoyé en cuisine ! Serveur : ${waiter} • Suivi en direct actif.`,
    receiptConfirmed: 'Commande confirmée en cuisine ! En cours de préparation — Suivi en direct actif.',
    totalAllOrders: (table) => `Total de toutes les commandes passées (Table ${table})`,
    activeTicketsCount: (count) => `Vous avez ${count} tickets actifs transmis en cuisine durant cette session.`,
    dishesDeliveredTitle: 'Plats servis • Comment s\'est passé votre repas ?',
    rateMealPrompt: (waiter) => `Évaluez votre repas et le service assuré par ${waiter}.`,
    boredWaitingText: 'Ennuyé d\'attendre ? Jouez au Ludo, au Sudoku ou lisez les actualités !',
    playGamesLoungeBtn: 'Espace Jeux'
  },
  de: {
    receiptDispatched: (waiter) => `Ticket an die Küche gesendet! Betreuer: ${waiter} • Live-Küchen-Tracker ist aktiv.`,
    receiptConfirmed: 'Bestellung in der Küche bestätigt! Zubereitung läuft — Live-Küchen-Tracker ist aktiv.',
    totalAllOrders: (table) => `Gesamtsumme aller aufgegebenen Bestellungen (Tisch ${table})`,
    activeTicketsCount: (count) => `Sie haben ${count} aktive Tickets, die während dieses Tischbesuchs an die Küche übermittelt wurden.`,
    dishesDeliveredTitle: 'Gerichte serviert • Wie war das Essen?',
    rateMealPrompt: (waiter) => `Bewerten Sie Ihre Mahlzeit und den Service von ${waiter}.`,
    boredWaitingText: 'Warten ist langweilig? Spielen Sie Ludo, Sudoku oder lesen Sie Nachrichten!',
    playGamesLoungeBtn: 'Zur Spiele-Lounge'
  }
};

export const getKioskModalText = (lang: string): ModalTranslations => {
  return KIOSK_MODAL_TRANSLATIONS[lang] || KIOSK_MODAL_TRANSLATIONS['en'];
};
