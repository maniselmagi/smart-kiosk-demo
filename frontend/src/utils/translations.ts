import type { MenuItem, ComboRecommendation } from '../types';

export type Language = 'en' | 'ta' | 'hi' | 'te' | 'es';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
  short: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧', short: 'EN' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳', short: 'தமிழ்' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', flag: '🇮🇳', short: 'हिंदी' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳', short: 'తెలుగు' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸', short: 'ES' },
];

export interface TranslationDictionary {
  welcomeTo: string;
  smartKiosk: string;
  table: string;
  startOrdering: string;
  welcomeSubtitle: string;
  searchMenu: string;
  allCategories: string;
  starters: string;
  mainCourse: string;
  breadsRice: string;
  beverages: string;
  desserts: string;
  add: string;
  added: string;
  prepTime: string;
  min: string;
  orderedToday: string;
  spiceLevel: string;
  mild: string;
  medium: string;
  hot: string;
  extraHot: string;
  customization: string;
  specialInstructions: string;
  specialInstructionsPlaceholder: string;
  addToCart: string;
  cart: string;
  yourCart: string;
  emptyCart: string;
  emptyCartSubtitle: string;
  exploreMenu: string;
  subtotal: string;
  taxGst: string;
  tip: string;
  total: string;
  proceedToCheckout: string;
  continueOrdering: string;
  checkout: string;
  confirmOrder: string;
  orderConfirmation: string;
  orderNumber: string;
  estimatedWait: string;
  statusReceived: string;
  statusConfirmed: string;
  statusPreparing: string;
  statusReady: string;
  statusServed: string;
  orderProgress: string;
  callWaiter: string;
  staffNotified: string;
  staffHelpPrompt: string;
  needAssistance: string;
  needWater: string;
  needBill: string;
  other: string;
  cancel: string;
  payNow: string;
  paymentMethod: string;
  upi: string;
  card: string;
  wallet: string;
  splitBill: string;
  splitEqually: string;
  splitByItems: string;
  guests: string;
  perPerson: string;
  noTip: string;
  customTip: string;
  paymentSuccessful: string;
  viewReceipt: string;
  sendReceipt: string;
  receiptSentSuccess: string;
  phoneNumberOrEmail: string;
  send: string;
  feedbackTitle: string;
  feedbackSubtitle: string;
  feedbackCommentPlaceholder: string;
  submitFeedback: string;
  feedbackThankYou: string;
  accessibilityMode: string;
  recommendedForYou: string;
  saveDiscount: string;
  addCombo: string;
  soldOut: string;
  available: string;
  veg: string;
  nonVeg: string;
  kitchenDisplay: string;
  managementDashboard: string;
  customerKiosk: string;
  demoModeBanner: string;
  selectLanguage: string;
  chooseLanguagePrompt: string;
  continueInLanguage: string;
  selectLanguageTitle: string;
  morningBreakfast: string;
  lunchAfternoon: string;
  dinnerEvening: string;
  morningHours: string;
  lunchHours: string;
  dinnerHours: string;
  autoTimeBadge: string;
  switchMealDemo: string;
  onlyServedIn: string;
  changeLanguage: string;
  allDay: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    welcomeTo: "Welcome to",
    smartKiosk: "Smart Table-Side Kiosk",
    table: "Table",
    startOrdering: "Start Ordering",
    welcomeSubtitle: "Browse our chef's curated menu, customize dishes, and order instantly from your table.",
    searchMenu: "Search dishes or drinks...",
    allCategories: "All Items",
    starters: "Starters",
    mainCourse: "Main Course",
    breadsRice: "Breads & Rice",
    beverages: "Beverages",
    desserts: "Desserts",
    add: "Add",
    added: "Added",
    prepTime: "Prep",
    min: "min",
    orderedToday: "Ordered today",
    spiceLevel: "Spice Level",
    mild: "Mild",
    medium: "Medium",
    hot: "Hot",
    extraHot: "Extra Hot",
    customization: "Customization & Add-ons",
    specialInstructions: "Special Instructions",
    specialInstructionsPlaceholder: "E.g. Less oil, extra lime, no coriander...",
    addToCart: "Add to Cart",
    cart: "Cart",
    yourCart: "Your Order Cart",
    emptyCart: "Your cart is currently empty",
    emptyCartSubtitle: "Select appetizing dishes from the menu to build your feast.",
    exploreMenu: "Browse Menu",
    subtotal: "Subtotal",
    taxGst: "Taxes & GST (5%)",
    tip: "Tip",
    total: "Total Amount",
    proceedToCheckout: "Proceed to Checkout",
    continueOrdering: "Add More Dishes",
    checkout: "Review & Pay",
    confirmOrder: "Confirm & Send to Kitchen",
    orderConfirmation: "Order Received!",
    orderNumber: "Order",
    estimatedWait: "Estimated Cooking Time",
    statusReceived: "Order Received",
    statusConfirmed: "Kitchen Confirmed",
    statusPreparing: "Chef Preparing",
    statusReady: "Ready to Serve",
    statusServed: "Served at Table",
    orderProgress: "Live Kitchen Progress",
    callWaiter: "Call Waiter",
    staffNotified: "Table service notified! A staff member is on the way.",
    staffHelpPrompt: "How can our staff assist you at Table",
    needAssistance: "Need Assistance",
    needWater: "Need Fresh Water",
    needBill: "Need Printed Bill",
    other: "Other Request",
    cancel: "Cancel",
    payNow: "Pay Now",
    paymentMethod: "Payment Method",
    upi: "UPI (GPay / PhonePe / QR)",
    card: "Credit / Debit Card",
    wallet: "Digital Wallet",
    splitBill: "Split Bill Option",
    splitEqually: "Split Equally",
    splitByItems: "Split by Items",
    guests: "Guests",
    perPerson: "Per Person",
    noTip: "No Tip",
    customTip: "Custom",
    paymentSuccessful: "Payment Successful",
    viewReceipt: "View Receipt",
    sendReceipt: "Send Digital Receipt",
    receiptSentSuccess: "Receipt dispatched successfully via SMS / Email!",
    phoneNumberOrEmail: "Enter Phone number or Email",
    send: "Send",
    feedbackTitle: "How was your dining experience?",
    feedbackSubtitle: "Your feedback helps our chefs and service team deliver excellence.",
    feedbackCommentPlaceholder: "Tell us about the flavor, service, or kiosk experience...",
    submitFeedback: "Submit Feedback",
    feedbackThankYou: "Thank you for your valuable feedback!",
    accessibilityMode: "Accessibility Mode (Large Text & Contrast)",
    recommendedForYou: "Recommended Pairing",
    saveDiscount: "Save",
    addCombo: "Add Combo",
    soldOut: "Sold Out",
    available: "Available",
    veg: "Pure Veg",
    nonVeg: "Non-Veg",
    kitchenDisplay: "Kitchen Display (KDS)",
    managementDashboard: "Manager Dashboard",
    customerKiosk: "Customer Kiosk",
    demoModeBanner: "Interactive Demo Prototype — Click between Kiosk, Kitchen & Dashboard anytime",
    selectLanguage: "Select Your Language",
    chooseLanguagePrompt: "Please choose your preferred language to begin ordering",
    continueInLanguage: "Continue",
    selectLanguageTitle: "Choose Language / மொழியைத் தேர்ந்தெடுக்கவும்",
    morningBreakfast: "Morning (Breakfast)",
    lunchAfternoon: "Lunch Menu",
    dinnerEvening: "Dinner Menu",
    morningHours: "6:00 AM - 12:00 PM",
    lunchHours: "12:00 PM - 5:30 PM",
    dinnerHours: "5:30 PM - 2:00 AM",
    autoTimeBadge: "Active Now",
    switchMealDemo: "Switch Meal Time (Demo)",
    onlyServedIn: "Served during",
    changeLanguage: "Change Language",
    allDay: "All Day",
  },
  ta: {
    welcomeTo: "வணக்கம்",
    smartKiosk: "ஸ்மார்ட் டேபிள் கியோஸ்க்",
    table: "மேஜை",
    startOrdering: "ஆர்டர் செய்யத் தொடங்குங்கள்",
    welcomeSubtitle: "சுவையான உணவுகளைப் பார்த்து, உங்கள் விருப்பத்திற்கேற்ப மாற்றி, உடனே ஆர்டர் செய்யுங்கள்.",
    searchMenu: "உணவுகளைத் தேடுங்கள்...",
    allCategories: "அனைத்தும்",
    starters: "ஸ்டார்ட்டர்ஸ்",
    mainCourse: "முக்கிய உணவு",
    breadsRice: "ரொட்டி & சாதம்",
    beverages: "பானங்கள்",
    desserts: "இனிப்புகள்",
    add: "சேர்",
    added: "சேர்க்கப்பட்டது",
    prepTime: "நேரம்",
    min: "நிமி",
    orderedToday: "இன்று ஆர்டர்",
    spiceLevel: "கார அளவு",
    mild: "குறைந்த காரம்",
    medium: "நடுத்தர காரம்",
    hot: "காரமானது",
    extraHot: "அதிக காரம்",
    customization: "கூடுதல் விருப்பங்கள்",
    specialInstructions: "சிறப்புக் குறிப்புகள்",
    specialInstructionsPlaceholder: "எ.கா. குறைந்த எண்ணெய், அதிக எலுமிச்சை...",
    addToCart: "கூடையில் சேர்க்கவும்",
    cart: "கூடை",
    yourCart: "உங்கள் உணவுப் பட்டியல்",
    emptyCart: "உங்கள் கூடை காலியாக உள்ளது",
    emptyCartSubtitle: "மெனுவிலிருந்து சுவையான உணவுகளைத் தேர்ந்தெடுக்கவும்.",
    exploreMenu: "மெனுவைப் பார்க்கவும்",
    subtotal: "கூடுதல் தொகை",
    taxGst: "வரி & ஜி.எஸ்.டி (5%)",
    tip: "டிப்",
    total: "மொத்த தொகை",
    proceedToCheckout: "செக் அவுட் செய்ய",
    continueOrdering: "மேலும் சேர்க்க",
    checkout: "பரிசீலித்து செலுத்த",
    confirmOrder: "சமையலறைக்கு அனுப்பவும்",
    orderConfirmation: "ஆர்டர் பெறப்பட்டது!",
    orderNumber: "ஆர்டர் எண்",
    estimatedWait: "மதிப்பிடப்பட்ட தயாரிப்பு நேரம்",
    statusReceived: "ஆர்டர் பெறப்பட்டது",
    statusConfirmed: "உறுதிசெய்யப்பட்டது",
    statusPreparing: "தயாராகிறது",
    statusReady: "பரிமாறத் தயார்",
    statusServed: "பரிமாறப்பட்டது",
    orderProgress: "சமையலறை நேரலை முன்னேற்றம்",
    callWaiter: "பணியாளரை அழைக்கவும்",
    staffNotified: "பணியாளருக்குத் தெரிவிக்கப்பட்டது! விரைவில் வருவார்.",
    staffHelpPrompt: "மேஜை எண்ணிற்கு என்ன உதவி தேவை",
    needAssistance: "உதவி தேவை",
    needWater: "குடிநீர் தேவை",
    needBill: "ரசீது தேவை",
    other: "மற்ற உதவிகள்",
    cancel: "ரத்து செய்",
    payNow: "பணம் செலுத்துக",
    paymentMethod: "பணம் செலுத்தும் முறை",
    upi: "யுபிஐ (GPay / PhonePe / QR)",
    card: "டெபிட் / கிரெடிட் கார்டு",
    wallet: "டிஜிட்டல் வாலட்",
    splitBill: "பில் பிரிக்கும் முறை",
    splitEqually: "சமமாக பிரிக்கவும்",
    splitByItems: "உணவு வாரியாக",
    guests: "நபர்கள்",
    perPerson: "ஒருவருக்கு",
    noTip: "டிப் வேண்டாம்",
    customTip: "விருப்பத் தொகை",
    paymentSuccessful: "பணம் வெற்றிகரமாக செலுத்தப்பட்டது",
    viewReceipt: "ரசீதைப் பார்",
    sendReceipt: "டிஜிட்டல் ரசீது அனுப்புக",
    receiptSentSuccess: "ரசீது எஸ்.எம்.எஸ் / மின்னஞ்சலில் அனுப்பப்பட்டது!",
    phoneNumberOrEmail: "தொலைபேசி எண் அல்லது மின்னஞ்சல்",
    send: "அனுப்பு",
    feedbackTitle: "உங்கள் உணவு அனுபவம் எப்படி இருந்தது?",
    feedbackSubtitle: "உங்கள் கருத்து எங்கள் சேவைத் தரத்தை உயர்த்த உதவும்.",
    feedbackCommentPlaceholder: "சுவை மற்றும் சேவை பற்றி உங்கள் கருத்தைப் பகிரவும்...",
    submitFeedback: "கருத்தை அனுப்புக",
    feedbackThankYou: "உங்கள் கருத்திற்கு மிக்க நன்றி!",
    accessibilityMode: "எளிதாக வாசிக்கும் முறை (Accessibility)",
    recommendedForYou: "சிறந்த பரிந்துரை",
    saveDiscount: "சேமிப்பு",
    addCombo: "காம்போ சேர்க்க",
    soldOut: "தீர்ந்துவிட்டது",
    available: "உள்ளது",
    veg: "சைவம்",
    nonVeg: "அசைவம்",
    kitchenDisplay: "சமையலறை திரை (KDS)",
    managementDashboard: "மேலாளர் டாஷ்போர்டு",
    customerKiosk: "வாடிக்கையாளர் கியோஸ்க்",
    demoModeBanner: "நேரலை டெமோ — கியோஸ்க், சமையலறை மற்றும் டாஷ்போர்டை எப்போது வேண்டுமானாலும் பார்க்கலாம்",
    selectLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    chooseLanguagePrompt: "ஆர்டர் செய்ய தொடங்குவதற்கு உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்",
    continueInLanguage: "தொடரவும்",
    selectLanguageTitle: "மொழியினைத் தேர்வு செய்க",
    morningBreakfast: "காலை உணவு (Breakfast)",
    lunchAfternoon: "மதிய உணவு (Lunch)",
    dinnerEvening: "இரவு உணவு (Dinner)",
    morningHours: "காலை 6:00 - மதியம் 12:00",
    lunchHours: "மதியம் 12:00 - மாலை 5:30",
    dinnerHours: "மாலை 5:30 - இரவு 2:00",
    autoTimeBadge: "தற்போது கிடைக்கும் உணவு",
    switchMealDemo: "உணவு நேரத்தை மாற்றுக (Demo)",
    onlyServedIn: "வழங்கப்படும் நேரம்",
    changeLanguage: "மொழியை மாற்றுக",
    allDay: "முழு நாளும்",
  },
  hi: {
    welcomeTo: "स्वागत है",
    smartKiosk: "स्मार्ट टेबल-साइड कियोस्क",
    table: "टेबल",
    startOrdering: "ऑर्डर करना शुरू करें",
    welcomeSubtitle: "हमारे शेफ का विशेष मेनू देखें, अपनी पसंद अनुसार बदलाव करें, और टेबल से तुरंत ऑर्डर करें।",
    searchMenu: "व्यंजन या पेय खोजें...",
    allCategories: "सभी व्यंजन",
    starters: "स्टार्टर्स",
    mainCourse: "मेन कोर्स",
    breadsRice: "रोटी और चावल",
    beverages: "पेय पदार्थ",
    desserts: "मिठाइयाँ",
    add: "जोड़ें",
    added: "जोड़ा गया",
    prepTime: "समय",
    min: "मिनट",
    orderedToday: "आज ऑर्डर किया",
    spiceLevel: "तीखापन",
    mild: "कम तीखा",
    medium: "मध्यम",
    hot: "तीखा",
    extraHot: "बहुत तीखा",
    customization: "अनुकूलन और टॉपिंग",
    specialInstructions: "विशेष निर्देश",
    specialInstructionsPlaceholder: "उदा. कम तेल, अतिरिक्त नींबू, बिना धनिया...",
    addToCart: "कार्ट में जोड़ें",
    cart: "कार्ट",
    yourCart: "आपकी कार्ट",
    emptyCart: "आपकी कार्ट खाली है",
    emptyCartSubtitle: "स्वादिष्ट व्यंजन चुनने के लिए मेनू देखें।",
    exploreMenu: "मेनू ब्राउज़ करें",
    subtotal: "उप-योग",
    taxGst: "कर और जीएसटी (5%)",
    tip: "टिप",
    total: "कुल राशि",
    proceedToCheckout: "चेकआउट करें",
    continueOrdering: "और जोड़ें",
    checkout: "समीक्षा और भुगतान",
    confirmOrder: "ऑर्डर किचन को भेजें",
    orderConfirmation: "ऑर्डर प्राप्त हुआ!",
    orderNumber: "ऑर्डर संख्या",
    estimatedWait: "अनुमानित तैयारी समय",
    statusReceived: "ऑर्डर प्राप्त हुआ",
    statusConfirmed: "किचन में स्वीकृत",
    statusPreparing: "शेफ तैयार कर रहे हैं",
    statusReady: "परोसने के लिए तैयार",
    statusServed: "टेबल पर परोसा गया",
    orderProgress: "लाइव किचन प्रगति",
    callWaiter: "वेटर बुलाएँ",
    staffNotified: "स्टाफ को सूचित कर दिया गया है! कोई जल्द आ रहा है।",
    staffHelpPrompt: "टेबल पर हम आपकी क्या सहायता कर सकते हैं?",
    needAssistance: "सहायता चाहिए",
    needWater: "पानी चाहिए",
    needBill: "बिल चाहिए",
    other: "अन्य अनुरोध",
    cancel: "रद्द करें",
    payNow: "भुगतान करें",
    paymentMethod: "भुगतान विधि",
    upi: "यूपीआई (GPay / PhonePe / QR)",
    card: "क्रेडिट / डेबिट कार्ड",
    wallet: "डिजिटल वॉलेट",
    splitBill: "बिल विभाजित करें",
    splitEqually: "समान रूप से बांटें",
    splitByItems: "व्यंजनों के अनुसार",
    guests: "अतिथि",
    perPerson: "प्रति व्यक्ति",
    noTip: "कोई टिप नहीं",
    customTip: "कस्टम टिप",
    paymentSuccessful: "भुगतान सफल रहा!",
    viewReceipt: "रसीद देखें",
    sendReceipt: "डिजिटल रसीद भेजें",
    receiptSentSuccess: "रसीद एसएमएस / ईमेल द्वारा भेज दी गई है!",
    phoneNumberOrEmail: "फोन नंबर या ईमेल दर्ज करें",
    send: "भेजें",
    feedbackTitle: "आपका भोजन अनुभव कैसा रहा?",
    feedbackSubtitle: "आपकी प्रतिक्रिया हमारे शेफ और सेवा को बेहतर बनाने में मदद करती है।",
    feedbackCommentPlaceholder: "स्वाद, सेवा या कियोस्क अनुभव के बारे में बताएं...",
    submitFeedback: "फीडबैक सबमिट करें",
    feedbackThankYou: "आपकी मूल्यवान प्रतिक्रिया के लिए धन्यवाद!",
    accessibilityMode: "एक्सेसिबिलिटी मोड (बड़ा टेक्स्ट और कंट्रास्ट)",
    recommendedForYou: "शेफ की सिफारिश",
    saveDiscount: "बचत",
    addCombo: "कॉम्बो जोड़ें",
    soldOut: "समाप्त",
    available: "उपलब्ध",
    veg: "शुद्ध शाकाहारी",
    nonVeg: "माँसाहारी",
    kitchenDisplay: "रसोई प्रदर्शन (KDS)",
    managementDashboard: "प्रबंधक डैशबोर्ड",
    customerKiosk: "ग्राहक कियोस्क",
    demoModeBanner: "इंटरएक्टिव डेमो प्रोटोटाइप — कियोस्क, किचन और डैशबोर्ड के बीच कभी भी स्विच करें",
    selectLanguage: "अपनी भाषा चुनें",
    chooseLanguagePrompt: "ऑर्डर शुरू करने के लिए कृपया अपनी पसंदीदा भाषा चुनें",
    continueInLanguage: "आगे बढ़ें",
    selectLanguageTitle: "भाषा का चयन करें",
    morningBreakfast: "सुबह का नाश्ता (Breakfast)",
    lunchAfternoon: "दोपहर का भोजन (Lunch)",
    dinnerEvening: "रात का खाना (Dinner)",
    morningHours: "सुबह 6:00 - दोपहर 12:00",
    lunchHours: "दोपहर 12:00 - शाम 5:30",
    dinnerHours: "शाम 5:30 - देर रात 2:00",
    autoTimeBadge: "वर्तमान में सक्रिय मेनू",
    switchMealDemo: "भोजन का समय बदलें (Demo)",
    onlyServedIn: "परोसने का समय",
    changeLanguage: "भाषा बदलें",
    allDay: "पूरे दिन",
  },
  te: {
    welcomeTo: "స్వాగతం",
    smartKiosk: "స్మార్ట్ టేబుల్-సైడ్ కియోస్క్",
    table: "టేబుల్",
    startOrdering: "ఆర్డర్ చేయడం ప్రారంభించండి",
    welcomeSubtitle: "మా చెఫ్ ప్రత్యేక మెనూని బ్రౌజ్ చేయండి, మీ అభిరుచికి అనుగుణంగా మార్చుకోండి మరియు వెంటనే ఆర్డర్ చేయండి.",
    searchMenu: "వంటకాలు లేదా పానీయాల కోసం శోధించండి...",
    allCategories: "అన్ని వంటకాలు",
    starters: "స్టార్టర్స్",
    mainCourse: "మెయిన్ కోర్స్",
    breadsRice: "రొట్టెలు & రైస్",
    beverages: "పానీయాలు",
    desserts: "మిఠాయిలు",
    add: "జోడించు",
    added: "జోడించబడింది",
    prepTime: "సమయం",
    min: "నిమి",
    orderedToday: "ఈరోజు ఆర్డర్",
    spiceLevel: "కారం స్థాయి",
    mild: "తక్కువ కారం",
    medium: "మధ్యస్థం",
    hot: "కారం",
    extraHot: "చాలా కారం",
    customization: "అదనపు ఎంపికలు",
    specialInstructions: "ప్రత్యేక సూచనలు",
    specialInstructionsPlaceholder: "ఉదా. తక్కువ నూనె, అదనపు నిమ్మకాయ...",
    addToCart: "కార్ట్‌కు జోడించు",
    cart: "కార్ట్",
    yourCart: "మీ ఆర్డర్ కార్ట్",
    emptyCart: "మీ కార్ట్ ఖాళీగా ఉంది",
    emptyCartSubtitle: "రుచికరమైన వంటకాలను ఎంచుకోవడానికి మెనూని చూడండి.",
    exploreMenu: "మెనూని చూడండి",
    subtotal: "ఉపమొత్తం",
    taxGst: "పన్నులు & జీఎస్టీ (5%)",
    tip: "టిప్",
    total: "మొత్తం సొమ్ము",
    proceedToCheckout: "చెక్‌అవుట్‌కు వెళ్లండి",
    continueOrdering: "మరిన్ని జోడించండి",
    checkout: "సమీక్షించి చెల్లించండి",
    confirmOrder: "కిచెన్‌కు పంపండి",
    orderConfirmation: "ఆర్డర్ స్వీకరించబడింది!",
    orderNumber: "ఆర్డర్ సంఖ్య",
    estimatedWait: "అంచనా సమయం",
    statusReceived: "ఆర్డర్ అందింది",
    statusConfirmed: "కిచెన్ ఆమోదించింది",
    statusPreparing: "చెఫ్ సిద్ధం చేస్తున్నారు",
    statusReady: "వడ్డించడానికి సిద్ధం",
    statusServed: "టేబుల్ వద్ద వడ్డించబడింది",
    orderProgress: "లైవ్ కిచెన్ పురోగతి",
    callWaiter: "వెయిటర్‌ను పిలవండి",
    staffNotified: "సిబ్బందికి సమాచారం అందింది! త్వరలో వస్తారు.",
    staffHelpPrompt: "టేబుల్ వద్ద మీకు ఎలాంటి సహాయం కావాలి?",
    needAssistance: "సహాయం కావాలి",
    needWater: "మంచినీరు కావాలి",
    needBill: "బిల్లు కావాలి",
    other: "ఇతర అభ్యర్థన",
    cancel: "రద్దు చేయి",
    payNow: "చెల్లించండి",
    paymentMethod: "చెల్లింపు పద్ధతి",
    upi: "యూపీఐ (GPay / PhonePe / QR)",
    card: "క్రెడిట్ / డెబిట్ కార్డు",
    wallet: "డిజిటల్ వాలెట్",
    splitBill: "బిల్లు విభజన",
    splitEqually: "సమంగా పంచుకోండి",
    splitByItems: "వస్తువుల వారీగా",
    guests: "అతిథులు",
    perPerson: "ఒక్కొక్కరికి",
    noTip: "టిప్ వద్దు",
    customTip: "ఇష్టమైన మొత్తం",
    paymentSuccessful: "చెల్లింపు పూర్తయింది!",
    viewReceipt: "రసీదు చూడండి",
    sendReceipt: "డిజిటల్ రసీదు పంపండి",
    receiptSentSuccess: "రసీదు ఎస్ఎమ్ఎస్ / ఈమెయిల్ ద్వారా పంపబడింది!",
    phoneNumberOrEmail: "ఫోన్ నంబర్ లేదా ఈమెయిల్ నమోదు చేయండి",
    send: "పంపు",
    feedbackTitle: "మీ భోజన అనుభవం ఎలా ఉంది?",
    feedbackSubtitle: "మీ అభిప్రాయం మా సేవలను మరింత మెరుగుపరచడానికి సహాయపడుతుంది.",
    feedbackCommentPlaceholder: "రుచి మరియు సేవల గురించి మీ అభిప్రాయాన్ని చెప్పండి...",
    submitFeedback: "అభిప్రాయాన్ని సమర్పించండి",
    feedbackThankYou: "మీ విలువైన అభిప్రాయానికి ధన్యవాదాలు!",
    accessibilityMode: "యాక్సెసిబిలిటీ మోడ్ (పెద్ద అక్షరాలు & కాంట్రాస్ట్)",
    recommendedForYou: "ప్రత్యేక కాంబో",
    saveDiscount: "ఆదా",
    addCombo: "కాంబో జోడించు",
    soldOut: "అయిపోయింది",
    available: "లభ్యమవుతుంది",
    veg: "స్వచ్ఛమైన శాకాహారం",
    nonVeg: "మాంసాహారం",
    kitchenDisplay: "కిచెన్ డిస్ప్లే (KDS)",
    managementDashboard: "మేనేజర్ డ్యాష్‌బోర్డ్",
    customerKiosk: "కస్టమర్ కియోస్క్",
    demoModeBanner: "ఇంటరాక్టివ్ డెమో ప్రోటోటైప్ — కియోస్క్, కిచెన్ మరియు డ్యాష్‌బోర్డ్ మధ్య ఎప్పుడైనా మారవచ్చు",
    selectLanguage: "మీ భాషను ఎంచుకోండి",
    chooseLanguagePrompt: "ఆర్డరింగ్ ప్రారంభించడానికి దయచేసి మీ భాషను ఎంచుకోండి",
    continueInLanguage: "కొనసాగించండి",
    selectLanguageTitle: "భాషను ఎంచుకోండి",
    morningBreakfast: "ఉదయం అల్పాహారం (Breakfast)",
    lunchAfternoon: "మధ్యాహ్న భोజనం (Lunch)",
    dinnerEvening: "రాత్రి భోజనం (Dinner)",
    morningHours: "ఉదయం 6:00 - మధ్యాహ్నం 12:00",
    lunchHours: "మధ్యాహ్నం 12:00 - సాయంత్రం 5:30",
    dinnerHours: "సాయంత్రం 5:30 - రాత్రి 2:00",
    autoTimeBadge: "ప్రస్తుత సమయ మెనూ",
    switchMealDemo: "భోజన సమయం మార్చండి (Demo)",
    onlyServedIn: "వడ్డించే సమయం",
    changeLanguage: "భాష మార్చండి",
    allDay: "రోజంతా",
  },
  es: {
    welcomeTo: "Bienvenido a",
    smartKiosk: "Quiosco Inteligente de Mesa",
    table: "Mesa",
    startOrdering: "Comenzar a Ordenar",
    welcomeSubtitle: "Explore el menú exclusivo del chef, personalice platillos y ordene al instante desde su mesa.",
    searchMenu: "Buscar platillos o bebidas...",
    allCategories: "Todos los Platillos",
    starters: "Entradas",
    mainCourse: "Platos Fuertes",
    breadsRice: "Panes y Arroces",
    beverages: "Bebidas",
    desserts: "Postres",
    add: "Agregar",
    added: "Agregado",
    prepTime: "Tiempo",
    min: "min",
    orderedToday: "Ordenado hoy",
    spiceLevel: "Nivel de Picante",
    mild: "Suave",
    medium: "Medio",
    hot: "Picante",
    extraHot: "Muy Picante",
    customization: "Personalización y Extras",
    specialInstructions: "Instrucciones Especiales",
    specialInstructionsPlaceholder: "Ej. Menos aceite, limón extra, sin cilantro...",
    addToCart: "Agregar al Carrito",
    cart: "Carrito",
    yourCart: "Tu Carrito de Pedido",
    emptyCart: "Tu carrito está vacío",
    emptyCartSubtitle: "Seleccione platillos deliciosos para armar su orden.",
    exploreMenu: "Explorar Menú",
    subtotal: "Subtotal",
    taxGst: "Impuestos y GST (5%)",
    tip: "Propina",
    total: "Total a Pagar",
    proceedToCheckout: "Proceder al Pago",
    continueOrdering: "Agregar Más Platillos",
    checkout: "Revisar y Pagar",
    confirmOrder: "Confirmar y Enviar a Cocina",
    orderConfirmation: "¡Orden Recibida!",
    orderNumber: "Orden #",
    estimatedWait: "Tiempo Estimado de Cocción",
    statusReceived: "Orden Recibida",
    statusConfirmed: "Cocina Confirmada",
    statusPreparing: "Chef Preparando",
    statusReady: "Listo para Servir",
    statusServed: "Servido en la Mesa",
    orderProgress: "Progreso de Cocina en Vivo",
    callWaiter: "Llamar Mesero",
    staffNotified: "¡Servicio notificado! Un mesero viene en camino.",
    staffHelpPrompt: "¿En qué podemos asistirle en la Mesa?",
    needAssistance: "Necesito Asistencia",
    needWater: "Necesito Agua Fresca",
    needBill: "Necesito la Cuenta Impresa",
    other: "Otra Solicitud",
    cancel: "Cancelar",
    payNow: "Pagar Ahora",
    paymentMethod: "Método de Pago",
    upi: "UPI / Código QR",
    card: "Tarjeta de Crédito / Débito",
    wallet: "Billetera Digital",
    splitBill: "Dividir la Cuenta",
    splitEqually: "Dividir en Partes Iguales",
    splitByItems: "Dividir por Platillos",
    guests: "Comensales",
    perPerson: "Por Persona",
    noTip: "Sin Propina",
    customTip: "Personalizado",
    paymentSuccessful: "¡Pago Exitoso!",
    viewReceipt: "Ver Recibo",
    sendReceipt: "Enviar Recibo Digital",
    receiptSentSuccess: "¡Recibo enviado con éxito por SMS / Correo!",
    phoneNumberOrEmail: "Número de teléfono o correo",
    send: "Enviar",
    feedbackTitle: "¿Cómo fue su experiencia gastronómica?",
    feedbackSubtitle: "Sus comentarios nos ayudan a seguir ofreciendo excelencia.",
    feedbackCommentPlaceholder: "Cuéntenos sobre el sabor, el servicio o el quiosco...",
    submitFeedback: "Enviar Opinión",
    feedbackThankYou: "¡Muchas gracias por su valiosa opinión!",
    accessibilityMode: "Modo de Accesibilidad (Texto Grande y Contraste)",
    recommendedForYou: "Recomendación del Chef",
    saveDiscount: "Ahorra",
    addCombo: "Agregar Combo",
    soldOut: "Agotado",
    available: "Disponible",
    veg: "Vegetariano",
    nonVeg: "No Vegetariano",
    kitchenDisplay: "Pantalla de Cocina (KDS)",
    managementDashboard: "Panel de Gerencia",
    customerKiosk: "Quiosco de Cliente",
    demoModeBanner: "Prototipo Demo Interactivo — Alterne entre Quiosco, Cocina y Gerencia",
    selectLanguage: "Seleccione su idioma",
    chooseLanguagePrompt: "Por favor elija su idioma preferido para comenzar a ordenar",
    continueInLanguage: "Continuar",
    selectLanguageTitle: "Elegir Idioma / Select Language",
    morningBreakfast: "Desayuno (Mañana)",
    lunchAfternoon: "Menú de Almuerzo",
    dinnerEvening: "Menú de Cena",
    morningHours: "6:00 AM - 12:00 PM",
    lunchHours: "12:00 PM - 5:30 PM",
    dinnerHours: "5:30 PM - 2:00 AM",
    autoTimeBadge: "Menú Activo Ahora",
    switchMealDemo: "Cambiar Horario de Comida (Demo)",
    onlyServedIn: "Servido durante",
    changeLanguage: "Cambiar Idioma",
    allDay: "Todo el día",
  }
};

export function getLocalizedItemName(item: MenuItem, lang: Language): string {
  if (lang === 'ta' && item.nameTamil) return item.nameTamil;
  if (lang === 'hi' && item.nameHindi) return item.nameHindi;
  if (lang === 'te' && item.nameTelugu) return item.nameTelugu;
  if (lang === 'es' && item.nameSpanish) return item.nameSpanish;
  return item.name;
}

export function getLocalizedItemDescription(item: MenuItem, lang: Language): string {
  if (lang === 'ta' && item.descriptionTamil) return item.descriptionTamil;
  if (lang === 'hi' && item.descriptionHindi) return item.descriptionHindi;
  if (lang === 'te' && item.descriptionTelugu) return item.descriptionTelugu;
  if (lang === 'es' && item.descriptionSpanish) return item.descriptionSpanish;
  return item.description;
}

export function getLocalizedComboTitle(combo: ComboRecommendation, lang: Language): string {
  if (lang === 'ta' && combo.titleTamil) return combo.titleTamil;
  if (lang === 'hi' && combo.titleHindi) return combo.titleHindi;
  if (lang === 'te' && combo.titleTelugu) return combo.titleTelugu;
  if (lang === 'es' && combo.titleSpanish) return combo.titleSpanish;
  return combo.title;
}
