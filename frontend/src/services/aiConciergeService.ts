import { MenuItem, Order } from '../types';
import { Language, getLocalizedItemName } from '../utils/translations';

export interface AIResponse {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  highlightItems?: MenuItem[];
  action?: {
    type: 'call_waiter' | 'track_order' | 'open_cart' | 'view_category';
    label: string;
    payload?: string;
  };
  suggestedQuestions?: string[];
  isFallback?: boolean;
  timestamp: string;
}

// Royal Ember Restaurant Operating Timings
export const RESTAURANT_HOURS = {
  name: 'Royal Ember Restaurant & Banquet',
  lunch: '11:30 AM – 03:30 PM',
  dinner: '06:30 PM – 11:30 PM',
  days: 'Monday to Sunday (All 7 Days Open)',
  lastOrderLunch: '03:00 PM',
  lastOrderDinner: '11:00 PM',
  tableReservation: 'Recommended for dinner after 8:00 PM',
  valetParking: 'Complimentary valet parking available at the main porch'
};

// Available domain questions shown when a query is completely unmatched
export const getAvailableQuestionPrompts = (lang: Language = 'en'): string[] => {
  switch (lang) {
    case 'ta':
      return [
        '👑 உங்கள் சிறப்பு உணவுகள் எவை?',
        '⭐ அதிக ரேட்டிங் பெற்ற உணவுகள் எவை?',
        '🕒 உணவகம் திறக்கும் மற்றும் மூடும் நேரம் என்ன?',
        '🌿 சுத்த சைவ உணவுகளைக் காட்டு',
        '🌶️ குழந்தைகளுக்கான காரமற்ற உணவுகள்',
        '🔔 எனது வெயிட்டரை எவ்வாறு அழைப்பது?',
        '💳 என்னென்ன கட்டண முறைகள் உள்ளன?'
      ];
    case 'hi':
      return [
        '👑 आपके सिग्नेचर व्यंजन कौन से हैं?',
        '⭐ सबसे अधिक रेटिंग वाले व्यंजन कौन से हैं?',
        '🕒 दुकान खुलने और बंद होने का समय क्या है?',
        '🌿 शुद्ध शाकाहारी व्यंजन दिखाएं',
        '🌶️ बच्चों के लिए कम तीखा भोजन',
        '🔔 वेटर को कैसे बुलाएं?',
        '💳 भुगतान के कौन से तरीके उपलब्ध हैं?'
      ];
    case 'te':
      return [
        '👑 మీ సిగ్నేచర్ వంటకాలు ఏమిటి?',
        '⭐ టాప్ రేటెడ్ వంటకాలు ఏమిటి?',
        '🕒 రెస్టారెంట్ సమయాలు ఏమిటి?',
        '🌿 శుద్ధ శాకాహార వంటకాలు చూపించండి',
        '🔔 నా వెయిటర్‌ను ఎలా పిలవాలి?',
        '💳 పేమెంట్ పద్ధతులు ఏమిటి?'
      ];
    case 'kn':
      return [
        '👑 ನಿಮ್ಮ ವಿಶೇಷ ಖಾದ್ಯಗಳು ಯಾವುವು?',
        '⭐ ಉನ್ನತ ರೇಟಿಂಗ್ ಹೊಂದಿರುವ ಆಹಾರಗಳು ಯಾವುವು?',
        '🕒 ರೆಸ್ಟೋರೆಂಟ್ ತೆರೆಯುವ ಮತ್ತು ಮುಚ್ಚುವ ಸಮಯವೇನು?',
        '🌿 ಶುದ್ಧ ಸಸ್ಯಾಹಾರಿ ಖಾದ್ಯಗಳನ್ನು ತೋರಿಸಿ',
        '🔔 ವೈಟರ್ ಅನ್ನು ಹೇಗೆ ಕರೆಯುವುದು?'
      ];
    case 'ml':
      return [
        '👑 നിങ്ങളുടെ പ്രത്യേക വിഭവങ്ങൾ ഏതാണ്?',
        '⭐ ഏറ്റവും ഉയർന്ന റേറ്റിംഗുള്ള വിഭവങ്ങൾ ഏതാണ്?',
        '🕒 റെസ്റ്റോറന്റ് സമയം എന്താണ്?',
        '🌿 വെജിറ്റേറിയൻ വിഭവങ്ങൾ കാണിക്കൂ',
        '🔔 വെയിറ്ററെ എങ്ങനെ വിളിക്കാം?'
      ];
    case 'es':
      return [
        '👑 ¿Cuáles son sus platos estrella?',
        '⭐ ¿Cuáles tienen la mejor calificación?',
        '🕒 ¿Cuáles son los horarios de apertura y cierre?',
        '🌿 Mostrar especialidades vegetarianas',
        '🔔 ¿Cómo llamo a mi mesero?'
      ];
    case 'fr':
      return [
        '👑 Quels sont vos plats signatures ?',
        '⭐ Quels sont les plats les mieux notés ?',
        '🕒 Quels sont vos horaires d\'ouverture et de fermeture ?',
        '🌿 Montrez les spécialités végétariennes',
        '🔔 Comment appeler mon serveur ?'
      ];
    case 'de':
      return [
        '👑 Welche Spezialitäten empfehlen Sie?',
        '⭐ Welche Gerichte sind am besten bewertet?',
        '🕒 Wann sind die Öffnungszeiten?',
        '🌿 Zeigen Sie vegetarische Spezialitäten',
        '🔔 Wie rufe ich meinen Kellner?'
      ];
    case 'ar':
      return [
        '👑 ما هي أطباقكم المميزة؟',
        '⭐ ما هي الأطباق الأعلى تقييماً؟',
        '🕒 ما هي ساعات العمل والإغلاق؟',
        '🌿 أظهر الأطباق النباتية الخاصة',
        '🔔 كيف يمكنني استدعاء النادل؟'
      ];
    case 'ko':
      return [
        '👑 시그니처 메뉴는 무엇인가요?',
        '⭐ 가장 평점이 높은 요리는 무엇인가요?',
        '🕒 오픈 및 마감 시간은 언제인가요?',
        '🌿 채식(베지) 메뉴 보여주세요',
        '🔔 직원은 어떻게 호출하나요?'
      ];
    default:
      return [
        '👑 Which foods are your Signatures?',
        '⭐ Which foods have excellent rating (4.8★+)?',
        '🕒 What is the shop opening and closing time?',
        '🌿 Show Pure Vegetarian & Jain specialties',
        '🌶️ Recommend mild / non-spicy dishes for kids',
        '🔔 How do I call my assigned waiter?',
        '💳 What payment methods are supported?'
      ];
  }
};

export const AVAILABLE_QUESTION_PROMPTS = getAvailableQuestionPrompts('en');

// Helper to determine live kitchen operation status
export const getLiveRestaurantStatus = (lang: Language = 'en'): { isOpen: boolean; statusText: string; nextOpeningText: string } => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  const lunchStart = 11 * 60 + 30; // 11:30 AM
  const lunchEnd = 15 * 60 + 30;   // 03:30 PM
  const dinnerStart = 18 * 60 + 30; // 06:30 PM
  const dinnerEnd = 23 * 60 + 30;  // 11:30 PM

  const isOpenLunch = currentMinutes >= lunchStart && currentMinutes < lunchEnd;
  const isOpenDinner = currentMinutes >= dinnerStart && currentMinutes < dinnerEnd;

  if (isOpenLunch || isOpenDinner) {
    const isLunch = isOpenLunch;
    if (lang === 'ta') {
      return {
        isOpen: true,
        statusText: isLunch ? '🟢 தற்போது மதிய உணவுக்கு திறந்துள்ளது' : '🟢 தற்போது இரவு உணவுக்கு திறந்துள்ளது',
        nextOpeningText: isLunch ? 'மதிய உணவு சேவை பிற்பகல் 03:30 வரை இயங்கும் (இரவு சேவை 06:30-க்கு தொடங்கும்)' : 'இரவு உணவு சேவை இரவு 11:30 வரை இயங்கும்'
      };
    }
    if (lang === 'hi') {
      return {
        isOpen: true,
        statusText: isLunch ? '🟢 अभी लंच के लिए खुला है' : '🟢 अभी डिनर के लिए खुला है',
        nextOpeningText: isLunch ? 'लंच सेवा 03:30 PM तक सक्रिय है' : 'डिनर सेवा 11:30 PM तक सक्रिय है'
      };
    }
    return {
      isOpen: true,
      statusText: isLunch ? '🟢 Currently Open for Lunch Dining' : '🟢 Currently Open for Dinner Dining',
      nextOpeningText: isLunch ? 'Lunch Service active until 03:30 PM (Dinner resumes at 06:30 PM)' : 'Dinner Service active until 11:30 PM (Last kitchen order at 11:00 PM)'
    };
  } else if (currentMinutes < lunchStart) {
    if (lang === 'ta') {
      return {
        isOpen: false,
        statusText: '🟡 காலை சமையலறை தயாரிப்பு நடக்கிறது',
        nextOpeningText: 'மதிய உணவு சேவை இன்று காலை 11:30 மணிக்கு தொடங்கும்'
      };
    }
    return {
      isOpen: false,
      statusText: '🟡 Morning Prep in Progress',
      nextOpeningText: 'Doors open for Lunch Service today at 11:30 AM'
    };
  } else {
    if (lang === 'ta') {
      return {
        isOpen: false,
        statusText: '🟡 பிற்பகல் சமையலறை பராமரிப்பு',
        nextOpeningText: 'மாலை இரவு உணவு சேவை 06:30 மணிக்கு தொடங்கும்'
      };
    }
    return {
      isOpen: false,
      statusText: '🟡 Afternoon Kitchen Resupply & Cleanse',
      nextOpeningText: 'Doors open for Evening Dinner Service at 06:30 PM'
    };
  }
};

/**
 * Smart Multilingual Local AI Engine for Royal Ember Kiosk
 */
export const processCustomerQuery = (
  rawQuery: string,
  menuItems: MenuItem[],
  tableNumber: number,
  assignedWaiterName: string,
  activeOrder: Order | null,
  lang: Language = 'en'
): AIResponse => {
  const query = rawQuery.trim().toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. SIGNATURE FOODS QUERY
  const isSignatureQuery = 
    query.includes('signature') || 
    query.includes('special') || 
    query.includes('famous') || 
    query.includes('chef special') || 
    query.includes('must try') || 
    query.includes('popular dish') ||
    query.includes('what to eat') ||
    query.includes('சிறப்பு') ||
    query.includes('சிக்னேச்சர்') ||
    query.includes('பிரபலம்') ||
    query.includes('सिग्नेचर') ||
    query.includes('खास') ||
    query.includes('प्रसिद्ध') ||
    query.includes('సిగ్నేచర్') ||
    query.includes('ప్రత్యేక') ||
    query.includes('spécial') ||
    query.includes('مميز') ||
    query.includes('특선');

  if (isSignatureQuery) {
    const signatureItems = menuItems.filter(i => i.isSignature && i.isAvailable);
    const topSignatures = signatureItems.length > 0 ? signatureItems.slice(0, 4) : menuItems.slice(0, 4);

    let text = `👑 **Royal Ember Signature Creations**\n\nOur Master Chef handcrafts these signature delicacies using heritage slow-tandoor roasting and rich aromatic gravies. Here are our crowned specialties for Table ${tableNumber}:`;
    let suggestedQuestions = ['⭐ Which foods have highest rating?', '🌿 Show Veg Signature dishes only', '🕒 What are your shop timings?'];

    if (lang === 'ta') {
      text = `👑 **ராயல் எம்பர் சிறப்பு சமையல் படைப்புகள் (Signatures)**\n\nஎங்கள் தலைமை சமையல் கலைஞர் பாரம்பரிய சுவையோடும் பிரத்யேக மசாலாக்களோடும் தயாரிக்கும் புகழ்பெற்ற உணவுகள் இவை. மேஜை ${tableNumber}-க்கு எங்கள் பரிந்துரைகள்:`;
      suggestedQuestions = ['⭐ அதிக ரேட்டிங் பெற்ற உணவுகள் எவை?', '🌿 சைவ சிறப்பு உணவுகளை மட்டும் காட்டு', '🕒 உணவகம் திறக்கும் மற்றும் மூடும் நேரம் என்ன?'];
    } else if (lang === 'hi') {
      text = `👑 **रॉयल एम्बर के सिग्नेचर शाही व्यंजन**\n\nहमारे मास्टर शेफ द्वारा पारंपरिक तंदूर और समृद्ध सुगंधित मसालों से तैयार की गई विशेष थालियां। टेबल ${tableNumber} के लिए हमारी खास सिफारिशें:`;
      suggestedQuestions = ['⭐ सबसे ज्यादा रेटिंग वाले व्यंजन कौन से हैं?', '🌿 केवल शाकाहारी सिग्नेचर दिखाएं', '🕒 दुकान का समय क्या है?'];
    } else if (lang === 'te') {
      text = `👑 **రాయల్ ఎంబర్ సిగ్నేచర్ వంటకాలు**\n\nమా మాస్టర్ చెఫ్ చేతితో ప్రత్యేకంగా రూపొందించిన రాయల్ రుచులు. టేబుల్ ${tableNumber} కొరకు మా సిఫార్సులు:`;
      suggestedQuestions = ['⭐ టాప్ రేటెడ్ వంటకాలు ఏమిటి?', '🌿 శాకాహార సిగ్నేచర్ వంటకాలు చూపించండి', '🕒 రెస్టారెంట్ సమయాలు ఏమిటి?'];
    } else if (lang === 'fr') {
      text = `👑 **Créations Signatures Royal Ember**\n\nNotre Chef élabore ces délices emblématiques au tandoor traditionnel. Voici nos spécialités couronnées pour la Table ${tableNumber} :`;
      suggestedQuestions = ['⭐ Plats les mieux notés', '🌿 Spécialités végétariennes', '🕒 Horaires d\'ouverture'];
    } else if (lang === 'de') {
      text = `👑 **Königliche Spezialitäten von Royal Ember**\n\nVon unserem Meisterkoch im traditionellen Tandoor veredelt. Hier sind unsere Empfehlungen für Tisch ${tableNumber}:`;
      suggestedQuestions = ['⭐ Bestbewertete Gerichte', '🌿 Nur vegetarische Spezialitäten', '🕒 Öffnungszeiten'];
    } else if (lang === 'ar') {
      text = `👑 **إبداعات رويال إمبر الملكية الخاصة**\n\nأطباق يحضرها كبير الطهاة بمهارة عالية وتوابل أصيلة في التنور التراثي. إليكم التوصيات الخاصة بالطاولة ${tableNumber}:`;
      suggestedQuestions = ['⭐ الأطباق الأعلى تقييماً', '🌿 الأطباق النباتية الخاصة فقط', '🕒 ما هي ساعات العمل؟'];
    } else if (lang === 'ko') {
      text = `👑 **로얄 엠버 마스터 셰프 시그니처 요리**\n\n전통 탄두리 로스팅과 풍부한 아로마 그레이비로 정성껏 준비한 테이블 ${tableNumber}번 추천 메뉴입니다:`;
      suggestedQuestions = ['⭐ 최고 평점 요리 보기', '🌿 채식 시그니처 메뉴만 보기', '🕒 영업 시간 확인'];
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      highlightItems: topSignatures,
      suggestedQuestions,
      timestamp
    };
  }

  // 2. EXCELLENT RATING FOODS QUERY
  const isRatingQuery = 
    query.includes('rating') || 
    query.includes('excellent') || 
    query.includes('highest rated') || 
    query.includes('top rated') || 
    query.includes('best food') || 
    query.includes('best dish') || 
    query.includes('5 star') || 
    query.includes('review') || 
    query.includes('delicious') ||
    query.includes('ரேட்டிங்') ||
    query.includes('சிறந்த') ||
    query.includes('அருமையான') ||
    query.includes('रेटिंग') ||
    query.includes('सर्वश्रेष्ठ') ||
    query.includes('ఉత్తమ') ||
    query.includes('meilleur') ||
    query.includes('تقييم') ||
    query.includes('평점');

  if (isRatingQuery) {
    const ratedItems = [...menuItems]
      .filter(i => i.isAvailable && i.rating >= 4.7)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);

    let text = `⭐ **Top-Rated Culinary Masterpieces (4.8★ - 5.0★)**\n\nThese dishes consistently receive rave reviews from Royal Ember guests for exceptional taste, plating, and authenticity:`;
    let suggestedQuestions = ['👑 Which foods are signature?', '🕒 What time does the restaurant close?', '🌶️ Are any of these mild for children?'];

    if (lang === 'ta') {
      text = `⭐ **அதிக வாடிக்கையாளர் நன்மதிப்பு பெற்ற உணவுகள் (4.8★ - 5.0★)**\n\nசுவை, தரம் மற்றும் நேர்த்தியான பரிமாறலுக்காக எங்கள் விருந்தினர்களால் தொடர்ந்து பாராட்டப்படும் முதன்மை உணவுகள்:`;
      suggestedQuestions = ['👑 சிக்னேச்சர் உணவுகள் எவை?', '🕒 உணவகம் எப்போது மூடப்படும்?', '🌶️ குழந்தைகளுக்கு ஏற்ற காரமற்ற உணவுகள் உண்டா?'];
    } else if (lang === 'hi') {
      text = `⭐ **सर्वोच्च रेटिंग प्राप्त शाही व्यंजन (4.8★ - 5.0★)**\n\nरॉयल एम्बर के अतिथियों द्वारा बेमिसाल स्वाद और प्रामाणिकता के लिए सबसे अधिक सराहे गए व्यंजन:`;
      suggestedQuestions = ['👑 सिग्नेचर व्यंजन कौन से हैं?', '🕒 भोजनालय बंद होने का समय क्या है?', '🌶️ क्या इनमें बच्चों के लिए हल्के मसाले हैं?'];
    } else if (lang === 'te') {
      text = `⭐ **టాప్ రేటెడ్ రుచికరమైన వంటకాలు (4.8★ - 5.0★)**\n\nవిశిష్ట రుచి మరియు నాణ్యత కోసం అత్యధిక రేటింగ్ పొందిన వంటకాలు:`;
      suggestedQuestions = ['👑 సిగ్नेచర్ వంటకాలు ఏమిటి?', '🕒 రెస్టారెంట్ ముగిసే సమయం ఏమిటి?'];
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      highlightItems: ratedItems,
      suggestedQuestions,
      timestamp
    };
  }

  // 3. RESTAURANT TIMINGS QUERY
  const isTimingQuery = 
    query.includes('time') || 
    query.includes('timing') || 
    query.includes('open') || 
    query.includes('close') || 
    query.includes('hour') || 
    query.includes('schedule') || 
    query.includes('when do you') || 
    query.includes('working hours') || 
    query.includes('shop time') ||
    query.includes('நேரம்') ||
    query.includes('திறக்கும்') ||
    query.includes('மூடும்') ||
    query.includes('समय') ||
    query.includes('खुलने') ||
    query.includes('बंद') ||
    query.includes('సమయం') ||
    query.includes('horaire') ||
    query.includes('ساعات') ||
    query.includes('영업 시간');

  if (isTimingQuery) {
    const status = getLiveRestaurantStatus(lang);

    let text = `🕒 **Royal Ember Operating Hours**\n\n` +
      `• **Lunch Service:** ${RESTAURANT_HOURS.lunch}\n` +
      `• **Dinner Service:** ${RESTAURANT_HOURS.dinner}\n` +
      `• **Operating Days:** ${RESTAURANT_HOURS.days}\n` +
      `• **Last Kiosk Order:** 03:00 PM (Lunch) / 11:00 PM (Dinner)\n\n` +
      `**Live Status:** ${status.statusText}\n_${status.nextOpeningText}_\n\n` +
      `Complimentary valet parking and table-side concierge assistance are available throughout dining hours.`;

    if (lang === 'ta') {
      text = `🕒 **ராயல் எம்பர் உணவக செயல்படும் நேரம்**\n\n` +
        `• **மதிய உணவு சேவை:** முற்பகல் 11:30 – பிற்பகல் 03:30\n` +
        `• **இரவு உணவு சேவை:** மாலை 06:30 – இரவு 11:30\n` +
        `• **இயங்கும் நாட்கள்:** திங்கள் முதல் ஞாயிறு வரை (வாரத்தின் 7 நாட்களும்)\n` +
        `• **கடைசி ஆர்டர் நேரம்:** பிற்பகல் 03:00 (மதியம்) / இரவு 11:00 (இரவு)\n\n` +
        `**நேரடி நிலை:** ${status.statusText}\n_${status.nextOpeningText}_\n\n` +
        `எங்கள் உணவகத்தில் இலவச வேலட் பார்க்கிங் மற்றும் உடனடி மேஜை உதவி எப்போதும் கிடைக்கும்.`;
    } else if (lang === 'hi') {
      text = `🕒 **रॉयल एम्बर खुलने और बंद होने का समय**\n\n` +
        `• **दोपहर का भोजन (लंच):** 11:30 AM – 03:30 PM\n` +
        `• **रात्रि का भोजन (डिनर):** 06:30 PM – 11:30 PM\n` +
        `• **खुले रहने के दिन:** सोमवार से रविवार (सातों दिन खुला)\n` +
        `• **अंतिम कियोस्क ऑर्डर:** 03:00 PM (लंच) / 11:00 PM (डिनर)\n\n` +
        `**लाइव स्थिति:** ${status.statusText}\n_${status.nextOpeningText}_\n\n` +
        `मुफ्त वैलेट पार्किंग और टेबल सहायता पूरे समय उपलब्ध है।`;
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      suggestedQuestions: lang === 'ta' 
        ? ['👑 சிறப்பு உணவுகள் எவை?', '⭐ அதிக ரேட்டிங் பெற்ற உணவுகள் எவை?', '🔔 வெயிட்டரை அழைக்க']
        : ['👑 Which foods are your Signatures?', '⭐ What are your top rated foods?', '🔔 Call waiter to table'],
      timestamp
    };
  }

  // 4. VEGETARIAN / JAIN QUERY
  const isVegQuery = 
    query.includes('veg') || 
    query.includes('vegetarian') || 
    query.includes('jain') || 
    query.includes('vegan') || 
    query.includes('paneer') || 
    query.includes('dal') ||
    query.includes('சைவம்') ||
    query.includes('வெஜ்') ||
    query.includes('शाकाहारी') ||
    query.includes('वेज') ||
    query.includes('శాకాహార') ||
    query.includes('végétarien') ||
    query.includes('نباتي') ||
    query.includes('채식');

  if (isVegQuery) {
    const vegItems = menuItems.filter(i => i.isVeg && i.isAvailable).slice(0, 4);

    let text = `🌿 **Pure Vegetarian & Sattvic Delights**\n\nAll our vegetarian dishes are cooked in a dedicated vegetarian cookware line using farm-fresh dairy and stone-ground spices. Here are our top vegetarian picks:`;
    if (lang === 'ta') {
      text = `🌿 **சுத்த சைவ உணவுகள் (Pure Vegetarian Specialties)**\n\nஎங்களின் அனைத்து சைவ உணவுகளும் பிரத்யேக சுத்தமான சமையல் பாத்திரங்களில், பண்ணை பசு நெய் மற்றும் புத்தம் புதிய மசாலாக்களுடன் சமைக்கப்படுகின்றன. உங்களுக்கான முதன்மை தேர்வுகள்:`;
    } else if (lang === 'hi') {
      text = `🌿 **शुद्ध शाकाहारी स्वादिष्ट व्यंजन**\n\nहमारे सभी शाकाहारी व्यंजन ताजे डेयरी उत्पादों और शुद्ध मसालों से अलग समर्पित रसोई में बनाए जाते हैं:`;
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      highlightItems: vegItems,
      suggestedQuestions: lang === 'ta'
        ? ['👑 சிறப்பு உணவுகள்', '⭐ அதிக ரேட்டிங் பெற்ற சைவ உணவுகள்', '🌶️ கார அளவை மாற்ற முடியுமா?']
        : ['👑 Show Signature Dishes', '⭐ What are the top rated veg items?', '🌶️ Can we customize spice level?'],
      timestamp
    };
  }

  // 5. MILD / KIDS FOOD QUERY
  const isSpiceQuery = 
    query.includes('mild') || 
    query.includes('kid') || 
    query.includes('children') || 
    query.includes('not spicy') || 
    query.includes('less spice') || 
    query.includes('sweet') || 
    query.includes('spicy') || 
    query.includes('hot') ||
    query.includes('காரம்') ||
    query.includes('காரமற்ற') ||
    query.includes('குழந்தை') ||
    query.includes('तीखा') ||
    query.includes('हल्का') ||
    query.includes('बच्च') ||
    query.includes('పిల్ల') ||
    query.includes('doux') ||
    query.includes('خفيف') ||
    query.includes('순한');

  if (isSpiceQuery) {
    const mildItems = menuItems.filter(i => !i.isSpicy && i.isAvailable).slice(0, 4);

    let text = `🌶️ **Spice Customization & Gentle Flavors**\n\nAt Royal Ember, every dish can be customized to your preferred heat: **Mild**, **Medium**, **Hot**, or **Extra Hot**!\n\nFor children and guests who prefer mild, creamy indulgence without intense chili heat, we recommend:`;
    if (lang === 'ta') {
      text = `🌶️ **காரத் தேர்வுகள் & குழந்தைகளுக்கான மென்மையான உணவுகள்**\n\nராயல் எம்பரில் ஒவ்வொரு உணவையும் உங்கள் விருப்பத்திற்கேற்ப **மிதமான (Mild)**, **நடுத்தர (Medium)**, அல்லது **அதிக காரத்துடன் (Hot)** சமைக்க முடியும்!\n\nகுழந்தைகள் மற்றும் காரம் விரும்பாத விருந்தினர்களுக்காக எங்கள் சிறப்பு பரிந்துரைகள்:`;
    } else if (lang === 'hi') {
      text = `🌶️ **तीखापन अनुकूलन और बच्चों के लिए हल्का भोजन**\n\nआप अपनी पसंद के अनुसार **हल्का (Mild)**, **मध्यम (Medium)** या **तीखा (Hot)** चुन सकते हैं। बच्चों के लिए हमारे पसंदीदा व्यंजन:`;
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      highlightItems: mildItems.length > 0 ? mildItems : menuItems.slice(0, 3),
      suggestedQuestions: lang === 'ta'
        ? ['👑 சிறப்பு உணவுகள் எவை?', '⭐ அதிக ரேட்டிங் உணவுகள்', '🕒 உணவக நேரம் என்ன?']
        : ['👑 Which foods are your Signatures?', '⭐ Top rated foods', '🕒 What are your shop timings?'],
      timestamp
    };
  }

  // 6. CALL WAITER QUERY
  const isWaiterQuery = 
    query.includes('waiter') || 
    query.includes('server') || 
    query.includes('call') || 
    query.includes('service') || 
    query.includes('water') || 
    query.includes('bill') || 
    query.includes('help') ||
    query.includes('வெயிட்டர்') ||
    query.includes('பணியாளர்') ||
    query.includes('தண்ணீர்') ||
    query.includes('பில்') ||
    query.includes('வवेटर') ||
    query.includes('पानी') ||
    query.includes('बिल') ||
    query.includes('వెయిటర్') ||
    query.includes('serveur') ||
    query.includes('نادل') ||
    query.includes('직원');

  if (isWaiterQuery) {
    let text = `🔔 **Dedicated Floor Attendant for Table ${tableNumber}**\n\nYour assigned floor attendant is **${assignedWaiterName}**. You can summon assistance immediately using the action button below:`;
    let label = `🔔 Call Waiter ${assignedWaiterName} to Table ${tableNumber}`;

    if (lang === 'ta') {
      text = `🔔 **மேஜை ${tableNumber}-க்கான பிரத்யேக சேவை பணியாளர்**\n\nஉங்கள் மேஜைக்கு ஒதுக்கப்பட்ட பணியாளர் **${assignedWaiterName}**. உடனடி உதவிக்கு கீழே உள்ள பொத்தானைத் தொடவும்:`;
      label = `🔔 பணியாளர் ${assignedWaiterName}-ஐ மேஜை ${tableNumber}-க்கு அழைக்கவும்`;
    } else if (lang === 'hi') {
      text = `🔔 **टेबल ${tableNumber} के लिए समर्पित वेटर**\n\nआपके टेबल अटेंडेंट **${assignedWaiterName}** हैं। सहायता के लिए नीचे दिए गए बटन पर टैप करें:`;
      label = `🔔 वेटर ${assignedWaiterName} को टेबल ${tableNumber} पर बुलाएं`;
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      action: {
        type: 'call_waiter',
        label
      },
      suggestedQuestions: lang === 'ta' 
        ? ['👑 சிறப்பு உணவுகள்', '⭐ அதிக ரேட்டிங் உணவுகள்', '🕒 உணவக நேரம் என்ன?']
        : ['👑 Which foods are signature?', '⭐ Which foods have highest rating?', '🕒 What are your shop timings?'],
      timestamp
    };
  }

  // 7. TRACK ORDER QUERY
  const isTrackQuery = 
    query.includes('track') || 
    query.includes('my order') || 
    query.includes('status') || 
    query.includes('food ready') || 
    query.includes('kitchen') || 
    query.includes('delay') ||
    query.includes('டிராக்') ||
    query.includes('ஆர்டர் நிலை') ||
    query.includes('சமையலறை') ||
    query.includes('ट्रैक') ||
    query.includes('ऑर्डर स्थिति') ||
    query.includes('ট্র্যাক') ||
    query.includes('traquer') ||
    query.includes('تتبع') ||
    query.includes('조리 현황');

  if (isTrackQuery) {
    if (activeOrder) {
      let text = `🍳 **Live Kitchen Status for Table ${tableNumber}**\n\n• **Order Number:** #${activeOrder.orderNumber}\n• **Status:** ${activeOrder.status}\n• **Estimated Prep Window:** ${activeOrder.estimatedPrepTime || 12} mins\n• **Attendant:** Waiter ${assignedWaiterName}\n\nClick below to open the Live Kitchen Radar tracker:`;
      let label = '📡 Open Live Kitchen Tracker';

      if (lang === 'ta') {
        text = `🍳 **மேஜை ${tableNumber}-ன் நேரடி சமையலறை நிலை**\n\n• **ஆர்டர் எண்:** #${activeOrder.orderNumber}\n• **நிலை:** ${activeOrder.status}\n• **தயாரிப்பு நேரம்:** ${activeOrder.estimatedPrepTime || 12} நிமிடங்கள்\n• **சேவை பணியாளர்:** ${assignedWaiterName}\n\nநேரடி சமையலறை நிலையை விரிவாகப் பார்க்க கீழே உள்ள பொத்தானைத் தொடவும்:`;
        label = '📡 நேரடி சமையலறை நிலையைப் பார்க்க';
      }

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text,
        action: {
          type: 'track_order',
          label
        },
        suggestedQuestions: lang === 'ta' ? ['👑 அடுத்து என்ன ஆர்டர் செய்யலாம்?', '🕒 உணவகம் எப்போது மூடப்படும்?'] : ['👑 What should I order next?', '🕒 What time does the restaurant close?'],
        timestamp
      };
    } else {
      let text = `📋 **No Active Orders in Kitchen**\n\nTable ${tableNumber} currently has no pending kitchen tickets. You can explore our menu, add items to your cart, and place your order directly through this screen!`;
      let label = '🛒 View Order / Cart';

      if (lang === 'ta') {
        text = `📋 **சமையலறையில் தீவிர ஆர்டர்கள் எதுவும் இல்லை**\n\nமேஜை ${tableNumber}-க்கு தற்போது நிலுவையில் உள்ள ஆர்டர்கள் இல்லை. நீங்கள் எங்கள் மெனுவைப் பார்த்து விரும்பிய உணவுகளை கார்ட்டில் சேர்த்து ஆர்டர் செய்யலாம்!`;
        label = '🛒 கார்ட் / ஆர்டரைப் பார்க்க';
      }

      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text,
        action: {
          type: 'open_cart',
          label
        },
        suggestedQuestions: lang === 'ta' ? ['👑 சிறப்பு உணவுகள் எவை?', '⭐ அதிக ரேட்டிங் உணவுகள்', '🕒 உணவக நேரம்'] : ['👑 Which foods are your Signatures?', '⭐ Top rated foods (4.8★+)', '🕒 What are your shop timings?'],
        timestamp
      };
    }
  }

  // 8. PAYMENT & BILLING QUERY
  const isPaymentQuery = 
    query.includes('pay') || 
    query.includes('payment') || 
    query.includes('upi') || 
    query.includes('card') || 
    query.includes('cash') || 
    query.includes('google pay') || 
    query.includes('phonepe') || 
    query.includes('split') ||
    query.includes('பணம்') ||
    query.includes('செலுத்து') ||
    query.includes('பில்') ||
    query.includes('भुगतान') ||
    query.includes('पैसे') ||
    query.includes('पेमेंट') ||
    query.includes('చెల్లింపు') ||
    query.includes('payer') ||
    query.includes('دفع') ||
    query.includes('결제');

  if (isPaymentQuery) {
    let text = `💳 **Accepted Payment Methods at Royal Ember**\n\n` +
      `• **UPI Direct:** Scan & pay via Google Pay, PhonePe, Paytm, or BHIM.\n` +
      `• **Cards:** Visa, Mastercard, RuPay, and American Express accepted.\n` +
      `• **Cash / Split Bill:** You can pay cash at reception or split bills with your party.\n` +
      `• **Digital Tax Invoicing:** Instant GST receipt sent via WhatsApp/SMS.`;

    if (lang === 'ta') {
      text = `💳 **ராயல் எம்பரில் ஏற்றுக்கொள்ளப்படும் கட்டண முறைகள்**\n\n` +
        `• **UPI நேரடி கட்டணம்:** Google Pay, PhonePe, Paytm அல்லது BHIM மூலம் ஸ்கேன் செய்து உடனடியாகச் செலுத்தலாம்.\n` +
        `• **கார்டுகள்:** Visa, Mastercard, RuPay மற்றும் American Express கார்டுகள் ஏற்கப்படும்.\n` +
        `• **பில் பகிர்வு:** நண்பர்களுடன் பில்லைப் பிரித்து தனித்தனியாகவும் செலுத்தலாம்.\n` +
        `• **டிஜிட்டல் ஜிஎஸ்டி ரசீது:** உடனடி ரசீது WhatsApp அல்லது SMS மூலம் உங்கள் தொலைபேசிக்கு அனுப்பப்படும்.`;
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text,
      suggestedQuestions: lang === 'ta' ? ['👑 சிறப்பு உணவுகள்', '🕒 உணவக நேரம்', '🔔 பில்லுக்கு வெயிட்டரை அழைக்க'] : ['👑 Which foods are signature?', '🕒 What are your shop timings?', '🔔 Call waiter for bill assistance'],
      timestamp
    };
  }

  // 9. DEFAULT / FALLBACK RESPONSE
  let fallbackText = `🤖 **Greetings from Kio!**\n\nI am your smart table companion at Royal Ember. I can guide you through our **Signature Delicacies**, check **Shop Opening & Closing Hours**, recommend **Vegetarian / Kids options**, or summon **Waiter ${assignedWaiterName}** to Table ${tableNumber}.\n\nPlease select one of the suggested topics below:`;

  if (lang === 'ta') {
    fallbackText = `🤖 **வணக்கம்! நான் கியோ (Kio)**\n\nமேஜை ${tableNumber}-ல் உள்ள உங்கள் AI வழிகாட்டி. எங்கள் **சிறப்பு உணவுகள்**, **உணவகம் இயங்கும் நேரம்**, **சைவ உணவுகள் / காரமற்ற தேர்வுகள்** அல்லது **பணியாளர் ${assignedWaiterName}**-ஐ உங்கள் மேஜைக்கு அழைக்க என்னிடம் கேட்கலாம்.\n\nகீழே உள்ள விருப்பங்களில் ஒன்றைத் தேர்வு செய்யவும்:`;
  } else if (lang === 'hi') {
    fallbackText = `🤖 **नमस्ते! मैं कियो (Kio) हूँ**\n\nरॉयल एम्बर में आपका स्मार्ट टेबल सहायक। आप मुझसे **सिग्नेचर व्यंजन**, **दुकान का समय**, **शाकाहारी व्यंजन** या **वेटर ${assignedWaiterName}** को बुलाने के लिए कह सकते हैं:`;
  } else if (lang === 'te') {
    fallbackText = `🤖 **నమస్కారం! నేను కియో (Kio)**\n\nటేబుల్ ${tableNumber} వద్ద మీ ఏఐ సహాయకుడిని. మా సిగ్नेచర్ వంటకాలు, రెస్టారెంట్ సమయాలు లేదా వెయిటర్‌ను పిలవడం గురించి నన్ను అడగవచ్చు:`;
  } else if (lang === 'es') {
    fallbackText = `🤖 **¡Saludos de Kio!**\n\nSoy su asistente de mesa en Royal Ember. Puedo informarle sobre **platos recomendados**, **horarios del restaurante**, opciones **vegetarianas** o llamar a su **mesero ${assignedWaiterName}**.`;
  } else if (lang === 'fr') {
    fallbackText = `🤖 **Bonjour de la part de Kio !**\n\nJe suis votre concierge IA à la Table ${tableNumber}. Je peux vous guider vers nos **plats signatures**, vous indiquer nos **horaires d'ouverture** ou appeler votre **serveur ${assignedWaiterName}**.`;
  } else if (lang === 'de') {
    fallbackText = `🤖 **Hallo von Kio!**\n\nIch bin Ihr digitaler Tischassistent an Tisch ${tableNumber}. Ich helfe Ihnen bei **Spezialitäten**, **Öffnungszeiten**, **vegetarischen Gerichten** oder rufe Ihren **Kellner ${assignedWaiterName}**.`;
  } else if (lang === 'ar') {
    fallbackText = `🤖 **أهلاً بكم من كيو (Kio)!**\n\nأنا مساعدكم الذكي في مطعم رويال إمبر للطاولة ${tableNumber}. يمكنني إرشادكم لأشهى **الأطباق المميزة**، **أوقات العمل**، أو استدعاء **النادل ${assignedWaiterName}**.`;
  } else if (lang === 'ko') {
    fallbackText = `🤖 **안녕하세요! 키오(Kio)입니다**\n\n테이블 ${tableNumber}번의 전담 AI 도우미입니다. **시그니처 메뉴**, **영업 시간**, **채식 메뉴** 추천이나 **담당 직원 ${assignedWaiterName}** 호출을 도와드릴 수 있습니다.`;
  } else if (lang === 'kn') {
    fallbackText = `🤖 **ನಮಸ್ಕಾರ! ನಾನು ಕಿಯೋ (Kio)**\n\nರಾಯಲ್ ಎಂಬರ್‌ನಲ್ಲಿ ಟೇಬಲ್ ${tableNumber} ನ ನಿಮ್ಮ ಎಐ ಸಹಾಯಕ. ನಮ್ಮ **ಸಿಗ್ನೇಚರ್ ಖಾದ್ಯಗಳು**, **ರೆಸ್ಟೋರೆಂಟ್ ಸಮಯ**, **ಸಸ್ಯಾಹಾರಿ ಆಯ್ಕೆಗಳು** ಅಥವಾ **ಪರಿಚಾರಕ ${assignedWaiterName}** ಅವರನ್ನು ಕರೆಯಲು ನನಗೆ ತಿಳಿಸಿ.`;
  } else if (lang === 'ml') {
    fallbackText = `🤖 **നമസ്കാരം! ഞാൻ കിയോ (Kio)**\n\nറോയൽ എംബറിൽ ടേബിൾ ${tableNumber}-ലെ നിങ്ങളുടെ എഐ സഹായി. ഞങ്ങളുടെ **പ്രത്യേക വിഭവങ്ങൾ**, **റെസ്റ്റോറന്റ് സമയം**, **വെജിറ്റേറിയൻ വിഭവങ്ങൾ** അല്ലെങ്കിൽ **ജീവനക്കാരൻ ${assignedWaiterName}**-നെ വിളിക്കാൻ എന്നോട് ചോദിക്കാം.`;
  }

  return {
    id: `ai-${Date.now()}`,
    sender: 'ai',
    text: fallbackText,
    isFallback: true,
    suggestedQuestions: getAvailableQuestionPrompts(lang).slice(0, 4),
    timestamp
  };
};
