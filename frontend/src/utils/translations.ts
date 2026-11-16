import type { MenuItem, ComboRecommendation, Category } from '../types';
import { INITIAL_MENU_ITEMS } from '../data/initialData';

export type Language = 'en' | 'ta' | 'hi' | 'te' | 'es' | 'ar' | 'fr' | 'de' | 'ko' | 'kn' | 'ml';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
  flag: string;
  short: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇦🇪', short: 'AR' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸', short: 'ES' },
  { code: 'fr', label: 'French', nativeLabel: 'Français', flag: '🇫🇷', short: 'FR' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', flag: '🇩🇪', short: 'DE' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳', short: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', flag: '🇮🇳', short: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', flag: '🇮🇳', short: 'తెలుగు' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어', flag: '🇰🇷', short: 'KO' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧', short: 'EN' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', flag: '🇮🇳', short: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം', flag: '🇮🇳', short: 'മലയാളം' },
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
  chooseLanguageHeader: string;
  selectLanguageHelpText: string;
  youSelected: string;
  allLanguages: string;
  searchPlaceholder: string;
  continueBtn: string;
  backBtn: string;
  tableAllocationTitle: string;
  tableAllocationSubtitle: string;
  guestInfoTitle: string;
  yourNameLabel: string;
  yourNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  howManyGuestsTitle: string;
  confirmedTableTitle: string;
  proceedToMenuBtn: string;
  stepTableAllocation: string;
  coupleDuo: string;
  standardFamily: string;
  largeGroup: string;
  celebrationFeast: string;
  royalBanquet: string;
  categoriesTitle: string;
  viewAllMenu: string;
  chefCombos: string;
  royalSignature: string;
  searchPlaceholderFull: string;
  topRatedFilter: string;
  fastPrepFilter: string;
  popularDishesTitle: string;
  popularDishesSubtitle: string;
  dishesCountLabel: string;
  diningAndBanquet: string;
  serverLabel: string;
  royalSignatureBadge: string;
  chefComboDealBadge: string;
  gamesAndNews: string;
  morningService: string;
  lunchService: string;
  dinnerService: string;
  exploreCombos: string;
  saveDiscountLabel: string;
  spicyLabel: string;
  aiChatLabel: string;
  clear: string;
  unavailable: string;
  resetFilters: string;
  noDishesFound: string;
  noDishesFoundDesc: string;
  yourDiningTray: string;
  servingSequence: string;
  servingSequenceSub: string;
  servingSequenceDesc: string;
  tapArrowsToReorder: string;
  arrange: string;
  done: string;
  addDishes: string;
  reviewOrderAndPay: string;
  selectedDishes: string;
  cookingForTable: string;
  scanUpiPrompt: string;
  upiScanHelp: string;
  instantAutoVerification: string;
  authorizingPayment: string;
  paymentConfirmed: string;
  kdsRoutedMsg: string;
  paid: string;
  totalSettled: string;
  receiveDigitalCopy: string;
  enterMobileOrEmail: string;
  onFloor: string;
  liveKitchenProgress: string;
  ticket: string;
  tickets: string;
  activeTickets: string;
  kitchenSyncActive: string;
  dishesServedMsg: string;
  cookingFresh: string;
  finishingTouches: string;
  kitchenCompletion: string;
  boredWaiting: string;
  playGamesLounge: string;
  assignedAttendant: string;
  dedicatedToTable: string;
  orderTimeline: string;
  activeStep: string;
  completed: string;
  dishesInOrder: string;
  closeTracker: string;
  standardPrice: string;
  addOns: string;
  standard: string;
  free: string;
  unitPrice: string;
  unit: string;
  kcalPerServing: string;
  allergens: string;
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
    chooseLanguageHeader: "Choose the language",
    selectLanguageHelpText: "Select your preferred language below This helps us serve you better.",
    youSelected: "You Selected",
    allLanguages: "All Languages",
    searchPlaceholder: "Search",
    continueBtn: "Continue",
    backBtn: "Back",
    tableAllocationTitle: "Guest Details & Smart Table Allocation",
    tableAllocationSubtitle: "Tell us how many guests are dining so our concierge allocates the most suitable dining table and dedicated section attendant for your family.",
    guestInfoTitle: "1. Guest / Family Information (Optional)",
    yourNameLabel: "Your Name / Family Name",
    yourNamePlaceholder: "e.g. Mani S. / Rajesh Kumar",
    phoneLabel: "Mobile / WhatsApp (For Digital Bill)",
    phonePlaceholder: "e.g. 98765 43210",
    howManyGuestsTitle: "2. How Many Guests Are Dining Today?",
    confirmedTableTitle: "Confirmed Table Allocation",
    proceedToMenuBtn: "Proceed to Digital Menu",
    stepTableAllocation: "Step 2 of 2: Table Allocation",
    coupleDuo: "1-2 Duo",
    standardFamily: "3-4 Family",
    largeGroup: "5-6 Large",
    celebrationFeast: "7-8 Feast",
    royalBanquet: "10+ Royal",
    categoriesTitle: "Categories",
    viewAllMenu: "View All Menu",
    chefCombos: "Chef Combos",
    royalSignature: "Signature",
    searchPlaceholderFull: "Search for delicious dishes, curries, tandoors, biryanis...",
    topRatedFilter: "Over 4.5 ⭐",
    fastPrepFilter: "Fast Prep (<15m)",
    popularDishesTitle: "Popular Dishes",
    popularDishesSubtitle: "Freshly prepared artisanal meals served straight to Table",
    dishesCountLabel: "Dishes",
    diningAndBanquet: "Dining & Banquet",
    serverLabel: "Server",
    royalSignatureBadge: "★ Royal Signature",
    chefComboDealBadge: "🍱 Chef Combo Deal",
    gamesAndNews: "Games & News",
    morningService: "Sunrise Breakfast Service",
    lunchService: "Grand Afternoon Lunch Service",
    dinnerService: "Royal Evening Dinner Service",
    exploreCombos: "Explore Combos",
    saveDiscountLabel: "Save",
    spicyLabel: "Spicy",
    aiChatLabel: "AI Chat",
    clear: "Clear",
    unavailable: "Unavailable",
    resetFilters: "Reset All Filters",
    noDishesFound: "No dishes found",
    noDishesFoundDesc: "Try adjusting your search query, dietary filter, or choose another category.",
    yourDiningTray: "Your Dining Tray",
    servingSequence: "Serving Sequence",
    servingSequenceSub: "1st, 2nd, 3rd...",
    servingSequenceDesc: "Decide which course arrives first to your table.",
    tapArrowsToReorder: "Tap arrows to re-order course priority!",
    arrange: "Arrange",
    done: "Done",
    addDishes: "+ Add Dishes",
    reviewOrderAndPay: "Review Order & Pay",
    selectedDishes: "Selected Artisanal Dishes",
    cookingForTable: "Cooking for Table",
    scanUpiPrompt: "Scan with PhonePe, GPay, Paytm or CRED",
    upiScanHelp: "Amount & Table is pre-encoded. Point your camera or UPI scanner to complete settlement.",
    instantAutoVerification: "Instant Auto-Verification",
    authorizingPayment: "Authorizing Payment...",
    paymentConfirmed: "Payment Confirmed",
    kdsRoutedMsg: "Order routed to Kitchen Display System (KDS). Fresh preparation begins shortly!",
    paid: "Paid",
    totalSettled: "Total Settled",
    receiveDigitalCopy: "Receive Digital Copy (SMS / WhatsApp / Email)",
    enterMobileOrEmail: "Enter mobile number or email...",
    onFloor: "On Floor",
    liveKitchenProgress: "Live Kitchen Progress →",
    ticket: "Ticket",
    tickets: "Tickets",
    activeTickets: "Active Tickets",
    kitchenSyncActive: "Real-Time Kitchen Sync Active",
    dishesServedMsg: "Dishes Served at Your Table!",
    cookingFresh: "Artisanal Dishes Being Cooked Fresh",
    finishingTouches: "Finishing Touches on the Fire Line",
    kitchenCompletion: "Kitchen Completion",
    boredWaiting: "Bored waiting? Play Ludo, Sudoku or Read Live News!",
    playGamesLounge: "Play Games Lounge",
    assignedAttendant: "Assigned Floor Attendant",
    dedicatedToTable: "Dedicated to Table",
    orderTimeline: "Order Preparation Timeline",
    activeStep: "Active Step",
    completed: "Completed ✓",
    dishesInOrder: "Dishes in Order",
    closeTracker: "Close Tracker",
    standardPrice: "Standard Price",
    addOns: "add-ons",
    standard: "Standard",
    free: "Free",
    unitPrice: "Unit Price",
    unit: "Unit",
    kcalPerServing: "kcal per serving",
    allergens: "Allergens",
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
    chooseLanguageHeader: "மொழியைத் தேர்ந்தெடுக்கவும்",
    selectLanguageHelpText: "கீழே உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும். இது உங்களுக்கு சிறந்த சேவை அளிக்க உதவும்.",
    youSelected: "நீங்கள் தேர்ந்தெடுத்தது",
    allLanguages: "அனைத்து மொழிகள்",
    searchPlaceholder: "தேடு...",
    continueBtn: "தொடரவும்",
    backBtn: "பின்செல்க",
    tableAllocationTitle: "விருந்தினர் விவரங்கள் & ஸ்மார்ட் மேஜை ஒதுக்கீடு",
    tableAllocationSubtitle: "உங்கள் குடும்பத்திற்கு மிகவும் பொருத்தமான மேஜை மற்றும் உணவுப் பணியாளரை ஒதுக்க விருந்தினர்களின் எண்ணிக்கையைத் தெரிவிக்கவும்.",
    guestInfoTitle: "1. விருந்தினர் / குடும்ப விவரங்கள் (விருப்பத்தேர்வு)",
    yourNameLabel: "உங்கள் பெயர் / குடும்பப் பெயர்",
    yourNamePlaceholder: "எ.கா. மணி எஸ். / ராஜேஷ் குமார்",
    phoneLabel: "கைபேசி எண் (டிஜிட்டல் பில் பெற)",
    phonePlaceholder: "எ.கா. 98765 43210",
    howManyGuestsTitle: "2. இன்று எத்தனை விருந்தினர்கள் உணவருந்துகிறீர்கள்?",
    confirmedTableTitle: "உறுதிசெய்யப்பட்ட மேஜை ஒதுக்கீடு",
    proceedToMenuBtn: "டிஜிட்டல் மெனுவிற்குச் செல்லவும்",
    stepTableAllocation: "படி 2 / 2: மேஜை ஒதுக்கீடு",
    coupleDuo: "1-2 ஜோடி",
    standardFamily: "3-4 குடும்பம்",
    largeGroup: "5-6 பெரிய குழு",
    celebrationFeast: "7-8 விருந்து",
    royalBanquet: "10+ ராயல் குழு",
    categoriesTitle: "உணவு வகைகள்",
    viewAllMenu: "முழு மெனு காண்க",
    chefCombos: "காம்போ ஆஃபர்",
    royalSignature: "சிறப்பு உணவுகள்",
    searchPlaceholderFull: "சுவையான உணவுகள், பிரியாணி, தோசைகளைத் தேடுங்கள்...",
    topRatedFilter: "சிறந்த மதிப்பீடு (4.5+) ⭐",
    fastPrepFilter: "விரைவு உணவு (<15 நிமி)",
    popularDishesTitle: "பிரபலமான உணவுகள்",
    popularDishesSubtitle: "உங்கள் மேஜைக்கு சுடச்சுட பரிமாறப்படும் பிரத்யேக உணவுகள் - மேஜை",
    dishesCountLabel: "உணவுகள்",
    diningAndBanquet: "டைனிங் & பாங்க்வெட்",
    serverLabel: "பணியாளர்",
    royalSignatureBadge: "★ ராயல் சிக்னேச்சர்",
    chefComboDealBadge: "🍱 செஃப் காம்போ ஆஃபர்",
    gamesAndNews: "விளையாட்டு & செய்திகள்",
    morningService: "காலை உணவு பிரத்யேக சேவை",
    lunchService: "மதிய உணவு ராஜ விருந்து சேவை",
    dinnerService: "இரவு உணவு ராஜ சேவை",
    exploreCombos: "காம்போக்களைப் பார்க்க",
    saveDiscountLabel: "சேமிப்பு",
    spicyLabel: "காரமானது",
    aiChatLabel: "AI சாட்",
    clear: "அழிக்க",
    unavailable: "கிடைக்கவில்லை",
    resetFilters: "வடிப்பான்களை மீட்டமைக்க",
    noDishesFound: "உணவுகள் எதுவும் கிடைக்கவில்லை",
    noDishesFoundDesc: "உங்கள் தேடல், உணவு வகை அல்லது வேறு பிரிவைத் தேர்ந்தெடுத்து முயற்சிக்கவும்.",
    yourDiningTray: "உங்கள் உணவுப் பட்டியல்",
    servingSequence: "பரிமாறும் வரிசை",
    servingSequenceSub: "1வது, 2வது, 3வது...",
    servingSequenceDesc: "உங்கள் மேஜைக்கு எந்த உணவு முதலில் வர வேண்டும் என்பதை வரிசைப்படுத்தவும்.",
    tapArrowsToReorder: "வரிசையை மாற்ற அம்புக்குறிகளைத் தட்டவும்!",
    arrange: "வரிசைப்படுத்து",
    done: "முடிந்தது",
    addDishes: "+ மேலும் சேர்க்க",
    reviewOrderAndPay: "ஆர்டரை சரிபார்த்து செலுத்த",
    selectedDishes: "தேர்ந்தெடுக்கப்பட்ட உணவுகள்",
    cookingForTable: "சமைக்கப்படும் மேஜை",
    scanUpiPrompt: "PhonePe, GPay, Paytm அல்லது CRED மூலம் ஸ்கேன் செய்க",
    upiScanHelp: "தொகை மற்றும் மேஜை எண் இணைக்கப்பட்டுள்ளது. கேமரா அல்லது யுபிஐ மூலம் ஸ்கேன் செய்து செலுத்தவும்.",
    instantAutoVerification: "உடனடி தானியங்கி சரிபார்ப்பு",
    authorizingPayment: "பணம் சரிபார்க்கப்படுகிறது...",
    paymentConfirmed: "பணம் உறுதிசெய்யப்பட்டது",
    kdsRoutedMsg: "ஆர்டர் சமையலறைக்கு (KDS) அனுப்பப்பட்டது. தயாரிப்பு விரைவில் தொடங்குகிறது!",
    paid: "செலுத்தப்பட்டது",
    totalSettled: "செலுத்தப்பட்ட மொத்த தொகை",
    receiveDigitalCopy: "டிஜிட்டல் ரசீது பெற (SMS / WhatsApp / மின்னஞ்சல்)",
    enterMobileOrEmail: "கைபேசி எண் அல்லது மின்னஞ்சலை உள்ளிடவும்...",
    onFloor: "சேவையில்",
    liveKitchenProgress: "சமையலறை நேரலை முன்னேற்றம் →",
    ticket: "டிக்கெட்",
    tickets: "டிக்கெட்டுகள்",
    activeTickets: "செயலில் உள்ள டிக்கெட்டுகள்",
    kitchenSyncActive: "சமையலறை நேரலை இணைப்பு செயலில் உள்ளது",
    dishesServedMsg: "உணவுகள் உங்கள் மேஜைக்கு பரிமாறப்பட்டது!",
    cookingFresh: "உணவுகள் சுடச்சுட சமைக்கப்படுகின்றன",
    finishingTouches: "சமையலறையில் இறுதி அலங்கரிப்பு நடக்கிறது",
    kitchenCompletion: "சமையலறை தயாரிப்பு நிறைவு",
    boredWaiting: "காத்திருக்கும் நேரத்தில் லுடோ, சுடோகு விளையாடலாம் அல்லது செய்திகளை வாசிக்கலாம்!",
    playGamesLounge: "விளையாட்டு லவுஞ்ச்",
    assignedAttendant: "நியமிக்கப்பட்ட உணவுப் பணியாளர்",
    dedicatedToTable: "மேஜை சேவைக்கு - மேஜை",
    orderTimeline: "தயாரிப்பு நேரலை காலவரிசை",
    activeStep: "நடப்பு நிலை",
    completed: "முடிந்தது ✓",
    dishesInOrder: "இந்த ஆர்டரில் உள்ள உணவுகள்",
    closeTracker: "டிராக்கரை மூடுக",
    standardPrice: "வழக்கமான விலை",
    addOns: "கூடுதல் விருப்பங்கள்",
    standard: "வழக்கமானது",
    free: "இலவசம்",
    unitPrice: "ஒரு உணவின் விலை",
    unit: "உணவு",
    kcalPerServing: "கலோரி / ஒருவருக்கு",
    allergens: "ஒவ்வாமை பொருட்கள்",
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
    chooseLanguageHeader: "भाषा चुनें",
    selectLanguageHelpText: "नीचे अपनी पसंदीदा भाषा चुनें। इससे हमें आपकी बेहतर सेवा करने में मदद मिलती है।",
    youSelected: "आपने चुना",
    allLanguages: "सभी भाषाएँ",
    searchPlaceholder: "खोजें...",
    continueBtn: "आगे बढ़ें",
    backBtn: "पीछे जाएं",
    tableAllocationTitle: "अतिथि विवरण एवं स्मार्ट टेबल आवंटन",
    tableAllocationSubtitle: "कृपया बताएं कि कितने अतिथि भोजन कर रहे हैं ताकि हम आपके परिवार के लिए सबसे उपयुक्त टेबल आवंटित कर सकें।",
    guestInfoTitle: "1. अतिथि / परिवार विवरण (वैकल्पिक)",
    yourNameLabel: "आपका नाम / परिवार का नाम",
    yourNamePlaceholder: "उदा. राजेश कुमार / मनी एस.",
    phoneLabel: "मोबाइल नंबर (डिजिटल बिल के लिए)",
    phonePlaceholder: "उदा. 98765 43210",
    howManyGuestsTitle: "2. आज कितने अतिथि भोजन कर रहे हैं?",
    confirmedTableTitle: "पुष्ट टेबल आवंटन",
    proceedToMenuBtn: "डिजिटल मेनू पर जाएं",
    stepTableAllocation: "चरण 2 / 2: टेबल आवंटन",
    coupleDuo: "1-2 युगल",
    standardFamily: "3-4 परिवार",
    largeGroup: "5-6 बड़ा समूह",
    celebrationFeast: "7-8 दावत",
    royalBanquet: "10+ शाही समूह",
    categoriesTitle: "व्यंजन श्रेणियाँ",
    viewAllMenu: "पूरा मेन्यू देखें",
    chefCombos: "शेफ कॉम्बो",
    royalSignature: "शाही विशेषताएं",
    searchPlaceholderFull: "स्वादिष्ट व्यंजन, करी, तंदूर, बिरयानी खोजें...",
    topRatedFilter: "टॉप रेटेड (4.5+) ⭐",
    fastPrepFilter: "त्वरित तैयारी (<15 मिनट)",
    popularDishesTitle: "लोकप्रिय व्यंजन",
    popularDishesSubtitle: "सीधे आपकी टेबल पर ताज़ा परोसे जाने वाले स्वादिष्ट व्यंजन - टेबल",
    dishesCountLabel: "व्यंजन",
    diningAndBanquet: "डाइनिंग और बैंक्वेट",
    serverLabel: "अटेंडेंट",
    royalSignatureBadge: "★ शाही विशेषता",
    chefComboDealBadge: "🍱 शेफ कॉम्बो डील",
    gamesAndNews: "खेल और समाचार",
    morningService: "सुबह का ताज़ा नाश्ता सेवा",
    lunchService: "शाही दोपहर का भोजन सेवा",
    dinnerService: "शाही रात्रिभोज सेवा",
    exploreCombos: "कॉम्बो देखें",
    saveDiscountLabel: "बचत",
    spicyLabel: "तीखा",
    aiChatLabel: "AI चैट",
    clear: "हटाएं",
    unavailable: "अनुपलब्ध",
    resetFilters: "फ़िल्टर रीसेट करें",
    noDishesFound: "कोई व्यंजन नहीं मिला",
    noDishesFoundDesc: "अपनी खोज, आहार फ़िल्टर समायोजित करें या कोई अन्य श्रेणी चुनें।",
    yourDiningTray: "आपकी भोजन ट्रे",
    servingSequence: "परोसने का क्रम",
    servingSequenceSub: "पहला, दूसरा, तीसरा...",
    servingSequenceDesc: "तय करें कि आपकी टेबल पर कौन सा व्यंजन पहले आए।",
    tapArrowsToReorder: "क्रम बदलने के लिए तीरों पर टैप करें!",
    arrange: "व्यवस्थित करें",
    done: "पूर्ण",
    addDishes: "+ व्यंजन जोड़ें",
    reviewOrderAndPay: "ऑर्डर समीक्षा और भुगतान",
    selectedDishes: "चयनित स्वादिष्ट व्यंजन",
    cookingForTable: "टेबल के लिए तैयार हो रहा है",
    scanUpiPrompt: "PhonePe, GPay, Paytm या CRED से स्कैन करें",
    upiScanHelp: "राशि और टेबल नंबर पहले से दर्ज है। भुगतान पूरा करने के लिए स्कैन करें।",
    instantAutoVerification: "त्वरित स्वचालित सत्यापन",
    authorizingPayment: "भुगतान प्रमाणित हो रहा है...",
    paymentConfirmed: "भुगतान की पुष्टि हुई",
    kdsRoutedMsg: "ऑर्डर किचन डिस्प्ले सिस्टम (KDS) को भेजा गया। तैयारी जल्द शुरू होगी!",
    paid: "भुगतान किया गया",
    totalSettled: "कुल भुगतान",
    receiveDigitalCopy: "डिजिटल रसीद प्राप्त करें (SMS / WhatsApp / ईमेल)",
    enterMobileOrEmail: "मोबाइल नंबर या ईमेल दर्ज करें...",
    onFloor: "ड्यूटी पर",
    liveKitchenProgress: "किचन लाइव प्रगति →",
    ticket: "टिकट",
    tickets: "टिकटें",
    activeTickets: "सक्रिय टिकट",
    kitchenSyncActive: "रीयल-टाइम किचन सिंक सक्रिय",
    dishesServedMsg: "व्यंजन आपकी टेबल पर परोसे गए!",
    cookingFresh: "व्यंजन ताज़ा बनाए जा रहे हैं",
    finishingTouches: "किचन में अंतिम फिनिशिंग जारी है",
    kitchenCompletion: "किचन तैयारी प्रगति",
    boredWaiting: "इंतजार में बोर हो रहे हैं? लूडो, सुडोकू खेलें या लाइव समाचार पढ़ें!",
    playGamesLounge: "गेम्स लाउंज",
    assignedAttendant: "नियुक्त फ्लोर अटेंडेंट",
    dedicatedToTable: "समर्पित टेबल - टेबल",
    orderTimeline: "ऑर्डर तैयारी समयरेखा",
    activeStep: "सक्रिय चरण",
    completed: "पूर्ण ✓",
    dishesInOrder: "ऑर्डर में व्यंजन",
    closeTracker: "ट्रैकर बंद करें",
    standardPrice: "मानक मूल्य",
    addOns: "ऐड-ऑन",
    standard: "मानक",
    free: "निःशुल्क",
    unitPrice: "प्रति इकाई मूल्य",
    unit: "इकाई",
    kcalPerServing: "किलो कैलोरी / सर्विंग",
    allergens: "एलर्जी कारक",
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
    chooseLanguageHeader: "భాషను ఎంచుకోండి",
    selectLanguageHelpText: "దయచేసి మీ ప్రాధాన్య భాషను క్రింద ఎంచుకోండి. ఇది మీకు మరింత మెరుగైన సేవలను అందించడానికి సహాయపడుతుంది.",
    youSelected: "మీరు ఎంచుకున్నది",
    allLanguages: "అన్ని భాషలు",
    searchPlaceholder: "శోధించండి...",
    continueBtn: "కొనసాగించండి",
    backBtn: "వెనుకకు",
    tableAllocationTitle: "అతిథి వివరాలు & స్మార్ట్ టేబుల్ కేటాయింపు",
    tableAllocationSubtitle: "మీ కుటుంబానికి అత్యంత అనుకూలమైన టేబుల్‌ను కేటాయించడానికి దయచేసి ఎంతమంది అతిథులు భోజనం చేస్తున్నారో తెలపండి.",
    guestInfoTitle: "1. అతిథి / కుటుంబ వివరాలు (ఐచ్ఛికం)",
    yourNameLabel: "మీ పేరు / కుటుంబ పేరు",
    yourNamePlaceholder: "ఉదా. రాజేష్ కుమార్ / మణి ఎస్.",
    phoneLabel: "మొబైల్ నంబర్ (డిజిటల్ బిల్లు కోసం)",
    phonePlaceholder: "ఉదా. 98765 43210",
    howManyGuestsTitle: "2. ఈరోజు ఎంతమంది భోజనం చేస్తున్నారు?",
    confirmedTableTitle: "కేటాయించిన టేబుల్",
    proceedToMenuBtn: "డిజిటల్ మెనూకి వెళ్లండి",
    stepTableAllocation: "దశ 2 / 2: టేబుల్ కేటాయింపు",
    coupleDuo: "1-2 జంట",
    standardFamily: "3-4 కుటుంబం",
    largeGroup: "5-6 బృందం",
    celebrationFeast: "7-8 విందు",
    royalBanquet: "10+ రాయల్ గ్రూప్",
    categoriesTitle: "వంటకాల వర్గాలు",
    viewAllMenu: "మొత్తం మెనూ చూడండి",
    chefCombos: "చెఫ్ కాంబోలు",
    royalSignature: "రాయల్ సిగ్నేచర్",
    searchPlaceholderFull: "రుచికరమైన వంటకాలు, బిర్యానీలు, దోశలను శోధించండి...",
    topRatedFilter: "టాప్ రేటెడ్ (4.5+) ⭐",
    fastPrepFilter: "త్వరిత తయారీ (<15 నిమి)",
    popularDishesTitle: "ప్రసిద్ధ వంటకాలు",
    popularDishesSubtitle: "మీ టేబుల్ వద్దకు వేడిగా అందించే రుచికరమైన వంటకాలు - టేబుల్",
    dishesCountLabel: "వంటకాలు",
    diningAndBanquet: "డైనింగ్ & బాంక్వెట్",
    serverLabel: "సర్వర్",
    royalSignatureBadge: "★ రాయల్ సిగ్నేచర్",
    chefComboDealBadge: "🍱 చెఫ్ కాంబో డీల్",
    gamesAndNews: "ఆటలు & వార్తలు",
    morningService: "ఉదయపు అల్పాహార సేవ",
    lunchService: "మధ్యాహ్న భోజన విందు సేవ",
    dinnerService: "రాయల్ డిన్నర్ సేవ",
    exploreCombos: "కాంబోలను చూడండి",
    saveDiscountLabel: "ఆదా",
    spicyLabel: "కారమైనది",
    aiChatLabel: "AI చాట్",
    clear: "తొలగించు",
    unavailable: "అందుబాటులో లేదు",
    resetFilters: "ఫిల్టర్‌లను రీసెట్ చేయండి",
    noDishesFound: "ఏ వంటకాలు కనుగొనబడలేదు",
    noDishesFoundDesc: "మీ శోధనను లేదా వర్గాన్ని సర్దుబాటు చేసి మళ్లీ ప్రయత్నించండి.",
    yourDiningTray: "మీ భోజన ట్రే",
    servingSequence: "వడ్డించే క్రమం",
    servingSequenceSub: "1వ, 2వ, 3వ...",
    servingSequenceDesc: "మీ టేబుల్‌కి ఏ వంటకం మొదట రావాలో నిర్ణయించండి.",
    tapArrowsToReorder: "క్రమాన్ని మార్చడానికి బాణాలను నొక్కండి!",
    arrange: "క్రమబద్ధీకరించు",
    done: "పూర్తయింది",
    addDishes: "+ వంటకాలను జోడించండి",
    reviewOrderAndPay: "ఆర్డర్‌ను సమీక్షించి చెల్లించండి",
    selectedDishes: "ఎంచుకున్న ప్రత్యేక వంటకాలు",
    cookingForTable: "టేబుల్ కోసం వంట",
    scanUpiPrompt: "PhonePe, GPay, Paytm లేదా CREDతో స్కాన్ చేయండి",
    upiScanHelp: "మొత్తం మరియు టేబుల్ ముందే నమోదు చేయబడ్డాయి. చెల్లించడానికి స్కాన్ చేయండి.",
    instantAutoVerification: "తక్షణ స్వయంచాలక ధృవీకరణ",
    authorizingPayment: "చెల్లింపు ధృవీకరించబడుతోంది...",
    paymentConfirmed: "చెల్లింపు నిర్ధారించబడింది",
    kdsRoutedMsg: "ఆర్డర్ కిచెన్ డిస్‌ప్లే సిస్టమ్ (KDS)కి పంపబడింది. తయారీ త్వరలో ప్రారంభమవుతుంది!",
    paid: "చెల్లించబడింది",
    totalSettled: "మొత్తం పరిష్కరించబడింది",
    receiveDigitalCopy: "డిజితల్ రసీదు పొందండి (SMS / WhatsApp / ఇమెయిల్)",
    enterMobileOrEmail: "మొబైల్ నంబర్ లేదా ఇమెయిల్‌ను నమోదు చేయండి...",
    onFloor: "విధిలో",
    liveKitchenProgress: "లైవ్ కిచెన్ పురోగతి →",
    ticket: "టికెట్",
    tickets: "టికెట్లు",
    activeTickets: "క్రియాశీల టిక్కెట్లు",
    kitchenSyncActive: "రియల్-టైమ్ కిచెన్ సమకాలీకరణ సక్రియంగా ఉంది",
    dishesServedMsg: "మీ టేబుల్‌కి వంటకాలు వడ్డించబడ్డాయి!",
    cookingFresh: "వంటకాలు తాజాగా వండబడుతున్నాయి",
    finishingTouches: "కిచెన్‌లో తుది మెరుగులు దిద్దుతున్నారు",
    kitchenCompletion: "కిచెన్ పూర్తయిన శాతం",
    boredWaiting: "వేచి చూస్తూ బోర్ కొడుతుందా? లూడో, సుడోకు ఆడండి లేదా వార్తలు చదవండి!",
    playGamesLounge: "గేమ్స్ లాంజ్",
    assignedAttendant: "కేటాయించిన ఫ్లోర్ అటెండెంట్",
    dedicatedToTable: "ప్రత్యేక టేబుల్ - టేబుల్",
    orderTimeline: "ఆర్డర్ తయారీ కాలక్రమం",
    activeStep: "ప్రస్తుత దశ",
    completed: "పూర్తయింది ✓",
    dishesInOrder: "ఆర్డర్‌లోని వంటకాలు",
    closeTracker: "ట్రాకర్‌ను మూసివేయి",
    standardPrice: "సాధారణ ధర",
    addOns: "యాడ్-ఆన్లు",
    standard: "సాధారణం",
    free: "ఉచితం",
    unitPrice: "ఒక్కో యూనిట్ ధర",
    unit: "యూనిట్",
    kcalPerServing: "కిలో కేలరీలు / ప్లేట్",
    allergens: "అలెర్జీ కారకాలు",
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
    chooseLanguageHeader: "Elija el idioma",
    selectLanguageHelpText: "Seleccione su idioma preferido a continuación. Esto nos ayuda a servirle mejor.",
    youSelected: "Ha seleccionado",
    allLanguages: "Todos los idiomas",
    searchPlaceholder: "Buscar...",
    continueBtn: "Continuar",
    backBtn: "Volver",
    tableAllocationTitle: "Detalles de Invitados y Asignación de Mesa",
    tableAllocationSubtitle: "Indíquenos cuántos comensales nos acompañan para asignar la mesa más adecuada y su anfitrión de servicio.",
    guestInfoTitle: "1. Información de Invitados / Familia (Opcional)",
    yourNameLabel: "Su Nombre / Familia",
    yourNamePlaceholder: "Ej. Carlos Gómez",
    phoneLabel: "Móvil / WhatsApp (Para Factura Digital)",
    phonePlaceholder: "Ej. 98765 43210",
    howManyGuestsTitle: "2. ¿Cuántos Comensales nos Acompañan?",
    confirmedTableTitle: "Mesa Asignada Confirmada",
    proceedToMenuBtn: "Proceder al Menú Digital",
    stepTableAllocation: "Paso 2 de 2: Asignación de Mesa",
    coupleDuo: "1-2 Pareja",
    standardFamily: "3-4 Familia",
    largeGroup: "5-6 Grupo Grande",
    celebrationFeast: "7-8 Banquete",
    royalBanquet: "10+ Real",
    categoriesTitle: "Categorías",
    viewAllMenu: "Ver Todo el Menú",
    chefCombos: "Combos del Chef",
    royalSignature: "Especialidades",
    searchPlaceholderFull: "Buscar platos deliciosos, curris, biryanis...",
    topRatedFilter: "Más de 4.5 ⭐",
    fastPrepFilter: "Preparación Rápida (<15m)",
    popularDishesTitle: "Platos Populares",
    popularDishesSubtitle: "Comidas artesanales recién preparadas servidas en la Mesa",
    dishesCountLabel: "Platos",
    diningAndBanquet: "Comedor y Banquetes",
    serverLabel: "Mesero",
    royalSignatureBadge: "★ Especialidad Real",
    chefComboDealBadge: "🍱 Oferta Combo Chef",
    gamesAndNews: "Juegos y Noticias",
    morningService: "Servicio de Desayuno Matutino",
    lunchService: "Gran Almuerzo Festivo",
    dinnerService: "Cena Real Nocturna",
    exploreCombos: "Explorar Combos",
    saveDiscountLabel: "Ahorra",
    spicyLabel: "Picante",
    aiChatLabel: "Chat IA",
    clear: "Borrar",
    unavailable: "No disponible",
    resetFilters: "Restablecer filtros",
    noDishesFound: "No se encontraron platos",
    noDishesFoundDesc: "Intente ajustar su búsqueda, filtro dietético o elija otra categoría.",
    yourDiningTray: "Su Bandeja de Comida",
    servingSequence: "Secuencia de Servicio",
    servingSequenceSub: "1º, 2º, 3º...",
    servingSequenceDesc: "Decida qué plato llega primero a su mesa.",
    tapArrowsToReorder: "¡Toque las flechas para reorganizar el orden!",
    arrange: "Organizar",
    done: "Listo",
    addDishes: "+ Agregar Platos",
    reviewOrderAndPay: "Revisar Pedido y Pagar",
    selectedDishes: "Platos Seleccionados",
    cookingForTable: "Cocinando para la Mesa",
    scanUpiPrompt: "Escanee con PhonePe, GPay, Paytm o CRED",
    upiScanHelp: "Monto y mesa preconfigurados. Apunte su cámara o escáner UPI para pagar.",
    instantAutoVerification: "Verificación Automática Instantánea",
    authorizingPayment: "Autorizando Pago...",
    paymentConfirmed: "Pago Confirmado",
    kdsRoutedMsg: "¡Pedido enviado a cocina (KDS). La preparación comenzará en breve!",
    paid: "Pagado",
    totalSettled: "Total Liquidado",
    receiveDigitalCopy: "Recibir Copia Digital (SMS / WhatsApp / Correo)",
    enterMobileOrEmail: "Ingrese número móvil o correo...",
    onFloor: "En Servicio",
    liveKitchenProgress: "Progreso en Vivo de Cocina →",
    ticket: "Boleto",
    tickets: "Boletos",
    activeTickets: "Boletos Activos",
    kitchenSyncActive: "Sincronización en Tiempo Real de Cocina",
    dishesServedMsg: "¡Platos Servidos en su Mesa!",
    cookingFresh: "Platos Artesanales Preparándose Frescos",
    finishingTouches: "Últimos Toques en la Línea de Fuego",
    kitchenCompletion: "Completado en Cocina",
    boredWaiting: "¿Aburrido esperando? ¡Juegue Ludo, Sudoku o lea noticias!",
    playGamesLounge: "Salón de Juegos",
    assignedAttendant: "Mesero de Piso Asignado",
    dedicatedToTable: "Dedicado a la Mesa",
    orderTimeline: "Cronología de Preparación del Pedido",
    activeStep: "Paso Activo",
    completed: "Completado ✓",
    dishesInOrder: "Platos en el Pedido",
    closeTracker: "Cerrar Rastreador",
    standardPrice: "Precio Estándar",
    addOns: "adicionales",
    standard: "Estándar",
    free: "Gratis",
    unitPrice: "Precio Unitario",
    unit: "Plato",
    kcalPerServing: "kcal por porción",
    allergens: "Alérgenos",
  },
  ar: {} as TranslationDictionary,
  fr: {} as TranslationDictionary,
  de: {} as TranslationDictionary,
  ko: {} as TranslationDictionary,
  kn: {} as TranslationDictionary,
  ml: {} as TranslationDictionary,
};

translations.ar = {
  ...translations.en,
  welcomeTo: "مرحبا بكم في",
  startOrdering: "ابدأ الطلب",
  selectLanguage: "اختر لغتك",
  continueInLanguage: "متابعة",
  chooseLanguageHeader: "اختر اللغة",
  selectLanguageHelpText: "حدد لغتك المفضلة أدناه. يساعدنا هذا في خدمتك بشكل أفضل.",
  youSelected: "لقد اخترت",
  allLanguages: "جميع اللغات",
  searchPlaceholder: "بحث...",
  continueBtn: "متابعة",
  backBtn: "رجوع",
  tableAllocationTitle: "تفاصيل الضيوف وتخصيص الطاولة الذكي",
  tableAllocationSubtitle: "أخبرنا بعدد الضيوف لتخصيص أنسب طاولة وموظف خدمة لعائلتك.",
  guestInfoTitle: "1. معلومات الضيوف / العائلة (اختياري)",
  yourNameLabel: "اسمك / اسم العائلة",
  yourNamePlaceholder: "مثال: محمد أحمد",
  phoneLabel: "رقم الجوال (للفاتورة الإلكترونية)",
  phonePlaceholder: "مثال: 0501234567",
  howManyGuestsTitle: "2. كم عدد الضيوف اليوم؟",
  confirmedTableTitle: "الطاولة المخصصة المؤكدة",
  proceedToMenuBtn: "الانتقال إلى القائمة الرقمية",
  stepTableAllocation: "الخطوة 2 من 2: تخصيص الطاولة",
  coupleDuo: "1-2 ثنائي",
  standardFamily: "3-4 عائلة",
  largeGroup: "5-6 مجموعة كبيرة",
  celebrationFeast: "7-8 وليمة",
  royalBanquet: "10+ ملكي",
};

translations.kn = {
  ...translations.en,
  welcomeTo: "ಸ್ವಾಗತ",
  startOrdering: "ಆರ್ಡರ್ ಪ್ರಾರಂಭಿಸಿ",
  selectLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  continueInLanguage: "ಮುಂದುವರಿಸಿ",
  chooseLanguageHeader: "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
  selectLanguageHelpText: "ಕೆಳಗೆ ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಇದು ನಿಮಗೆ ಉತ್ತಮ ಸೇವೆ ನೀಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
  youSelected: "ನೀವು ಆಯ್ಕೆ ಮಾಡಿದ್ದು",
  allLanguages: "ಎಲ್ಲಾ ಭಾಷೆಗಳು",
  searchPlaceholder: "ಹುಡುಕಿ...",
  continueBtn: "ಮುಂದುವರಿಸಿ",
  backBtn: "ಹಿಂದಕ್ಕೆ",
  tableAllocationTitle: "ಅತಿಥಿ ವಿವರಗಳು ಮತ್ತು ಸ್ಮಾರ್ಟ್ ಟೇಬಲ್ ಹಂಚಿಕೆ",
  tableAllocationSubtitle: "ನಿಮ್ಮ ಕುಟುಂಬಕ್ಕೆ ಅತ್ಯಂತ ಸೂಕ್ತವಾದ ಊಟದ ಟೇಬಲ್ ಅನ್ನು ನಿಯೋಜಿಸಲು ಎಷ್ಟು ಜನರು ಊಟ ಮಾಡುತ್ತಿದ್ದಾರೆಂದು ತಿಳಿಸಿ.",
  guestInfoTitle: "1. ಅತಿಥಿ / ಕುಟುಂಬದ ಮಾಹಿತಿ (ಐಚ್ಛಿಕ)",
  yourNameLabel: "ನಿಮ್ಮ ಹೆಸರು / ಕುಟುಂಬದ ಹೆಸರು",
  yourNamePlaceholder: "ಉದಾ. ರಾಜೇಶ್ ಕುಮಾರ್",
  phoneLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಡಿಜಿಟಲ್ ಬಿಲ್ ಗಾಗಿ)",
  phonePlaceholder: "ಉದಾ. 98765 43210",
  howManyGuestsTitle: "2. ಇಂದು ಎಷ್ಟು ಅತಿಥಿಗಳು ಊಟ ಮಾಡುತ್ತಿದ್ದಾರೆ?",
  confirmedTableTitle: "ಖಚಿತಪಡಿಸಿದ ಟೇಬಲ್ ಹಂಚಿಕೆ",
  proceedToMenuBtn: "ಡಿಜಿಟಲ್ ಮೆನುಗೆ ಮುಂದುವರಿಯಿರಿ",
  stepTableAllocation: "ಹಂತ 2 / 2: ಟೇಬಲ್ ಹಂಚಿಕೆ",
  coupleDuo: "1-2 ಜೋಡಿ",
  standardFamily: "3-4 ಕುಟುಂಬ",
  largeGroup: "5-6 ಗುಂಪು",
  celebrationFeast: "7-8 ಔತಣಕೂಟ",
  royalBanquet: "10+ ರಾಜಮನೆತನ",
};

translations.ml = {
  ...translations.en,
  welcomeTo: "സ്വാഗതം",
  startOrdering: "ഓർഡർ ആരംഭിക്കുക",
  selectLanguage: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
  continueInLanguage: "തുടരുക",
  chooseLanguageHeader: "ഭാഷ തിരഞ്ഞെടുക്കുക",
  selectLanguageHelpText: "താഴെ നിങ്ങളുടെ ഇഷ്ടപ്പെട്ട ഭാഷ തിരഞ്ഞെടുക്കുക. ഇത് നിങ്ങളെ മികച്ച രീതിയിൽ സേവിക്കാൻ സഹായിക്കും.",
  youSelected: "നിങ്ങൾ തിരഞ്ഞെടുത്തത്",
  allLanguages: "എല്ലാ ഭാഷകളും",
  searchPlaceholder: "തിരയുക...",
  continueBtn: "തുടരുക",
  backBtn: "തിരികെ",
  tableAllocationTitle: "അതിഥി വിവരങ്ങളും സ്മാർട്ട് ടേബിൾ അലോക്കേഷനും",
  tableAllocationSubtitle: "നിങ്ങളുടെ കുടുംബത്തിന് അനുയോജ്യമായ ടേബിൾ നൽകുന്നതിനായി എത്ര പേർ ഉണ്ടെന്ന് അറിയിക്കുക.",
  guestInfoTitle: "1. അതിഥി വിവരങ്ങൾ (ഓപ്ഷണൽ)",
  yourNameLabel: "നിങ്ങളുടെ പേര് / കുടുംബപ്പേര്",
  yourNamePlaceholder: "ഉദാ. രാജേഷ് കുമാർ",
  phoneLabel: "മൊബൈൽ നമ്പർ (ഡിജിറ്റൽ ബില്ലിനായി)",
  phonePlaceholder: "ഉദാ. 98765 43210",
  howManyGuestsTitle: "2. ഇന്ന് എത്ര പേർ ഭക്ഷണം കഴിക്കുന്നു?",
  confirmedTableTitle: "സ്ഥിരീകരിച്ച ടേബിൾ",
  proceedToMenuBtn: "ഡിജിറ്റൽ മെനുവിലേക്ക് പോകുക",
  stepTableAllocation: "ഘട്ടം 2 / 2: ടേബിൾ അലോക്കേഷൻ",
  coupleDuo: "1-2 ജോഡി",
  standardFamily: "3-4 കുടുംബം",
  largeGroup: "5-6 വലിയ സംഘം",
  celebrationFeast: "7-8 വിരുന്ന്",
  royalBanquet: "10+ റോയൽ ഗ്രൂപ്പ്",
};

translations.fr = {
  ...translations.en,
  welcomeTo: "Bienvenue à",
  startOrdering: "Commander",
  selectLanguage: "Choisissez votre langue",
  continueInLanguage: "Continuer",
  chooseLanguageHeader: "Choisissez la langue",
  selectLanguageHelpText: "Sélectionnez votre langue préférée ci-dessous pour nous aider à mieux vous servir.",
  youSelected: "Vous avez sélectionné",
  allLanguages: "Toutes les langues",
  searchPlaceholder: "Rechercher...",
  continueBtn: "Continuer",
  backBtn: "Retour",
  tableAllocationTitle: "Détails des invités & Attribution de table",
  tableAllocationSubtitle: "Indiquez le nombre de convives pour nous permettre de vous attribuer la table idéale.",
  proceedToMenuBtn: "Accéder au menu digital",
  stepTableAllocation: "Étape 2 sur 2 : Attribution de table",
};

translations.de = {
  ...translations.en,
  welcomeTo: "Willkommen bei",
  startOrdering: "Bestellen",
  selectLanguage: "Wählen Sie Ihre Sprache",
  continueInLanguage: "Weiter",
  chooseLanguageHeader: "Wählen Sie die Sprache",
  selectLanguageHelpText: "Wählen Sie unten Ihre bevorzugte Sprache für das beste Bestellerlebnis.",
  youSelected: "Ausgewählt",
  allLanguages: "Alle Sprachen",
  searchPlaceholder: "Suchen...",
  continueBtn: "Weiter",
  backBtn: "Zurück",
  tableAllocationTitle: "Gästedetails & Tischzuweisung",
  tableAllocationSubtitle: "Bitte geben Sie die Gästeanzahl an, damit wir Ihnen den passenden Tisch zuweisen können.",
  proceedToMenuBtn: "Weiter zur digitalen Speisekarte",
  stepTableAllocation: "Schritt 2 von 2: Tischzuweisung",
};

translations.ko = {
  ...translations.en,
  welcomeTo: "환영합니다",
  startOrdering: "주문하기",
  selectLanguage: "언어를 선택하세요",
  continueInLanguage: "계속하기",
  chooseLanguageHeader: "언어를 선택하세요",
  selectLanguageHelpText: "더 나은 주문 서비스를 위해 원하시는 언어를 선택해 주세요.",
  youSelected: "선택된 언어",
  allLanguages: "모든 언어",
  searchPlaceholder: "검색...",
  continueBtn: "계속하기",
  backBtn: "뒤로",
  tableAllocationTitle: "고객 정보 및 스마트 테이블 배정",
  tableAllocationSubtitle: "최적의 좌석과 서비스를 제공해 드릴 수 있도록 인원수를 알려주세요.",
  proceedToMenuBtn: "디지털 메뉴로 이동",
  stepTableAllocation: "2단계 중 2단계: 테이블 배정",
};


export function getLocalizedItemName(item: MenuItem, lang: Language): string {
  if (lang === 'ta' && item.nameTamil) return item.nameTamil;
  if (lang === 'hi' && item.nameHindi) return item.nameHindi;
  if (lang === 'te' && item.nameTelugu) return item.nameTelugu;
  if (lang === 'kn' && (item.nameTelugu || item.nameHindi)) return item.nameTelugu || item.nameHindi || item.name;
  if (lang === 'ml' && (item.nameTamil || item.nameHindi)) return item.nameTamil || item.nameHindi || item.name;
  if (lang === 'es' && item.nameSpanish) return item.nameSpanish;
  return item.name;
}

export function getLocalizedItemDescription(item: MenuItem, lang: Language): string {
  if (lang === 'ta' && item.descriptionTamil) return item.descriptionTamil;
  if (lang === 'hi' && item.descriptionHindi) return item.descriptionHindi;
  if (lang === 'te' && item.descriptionTelugu) return item.descriptionTelugu;
  if (lang === 'kn' && (item.descriptionTelugu || item.descriptionHindi)) return item.descriptionTelugu || item.descriptionHindi || item.description;
  if (lang === 'ml' && (item.descriptionTamil || item.descriptionHindi)) return item.descriptionTamil || item.descriptionHindi || item.description;
  if (lang === 'es' && item.descriptionSpanish) return item.descriptionSpanish;
  return item.description;
}

export function getLocalizedComboTitle(combo: ComboRecommendation, lang: Language): string {
  if (lang === 'ta' && combo.titleTamil) return combo.titleTamil;
  if (lang === 'hi' && combo.titleHindi) return combo.titleHindi;
  if (lang === 'te' && combo.titleTelugu) return combo.titleTelugu;
  if (lang === 'kn' && (combo.titleTelugu || combo.titleHindi)) return combo.titleTelugu || combo.titleHindi || combo.title;
  if (lang === 'ml' && (combo.titleTamil || combo.titleHindi)) return combo.titleTamil || combo.titleHindi || combo.title;
  if (lang === 'es' && combo.titleSpanish) return combo.titleSpanish;
  return combo.title;
}

export function getLocalizedCartItemName(
  item: { name: string; nameTamil?: string; nameHindi?: string; nameTelugu?: string; nameSpanish?: string; menuItemId?: string },
  lang: Language
): string {
  if (lang === 'ta' && item.nameTamil) return item.nameTamil;
  if (lang === 'hi' && item.nameHindi) return item.nameHindi;
  if (lang === 'te' && item.nameTelugu) return item.nameTelugu;
  if (lang === 'es' && item.nameSpanish) return item.nameSpanish;

  if (item.menuItemId || item.name) {
    const found = INITIAL_MENU_ITEMS.find(
      (m) => m.id === item.menuItemId || m.name.toLowerCase() === (item.name || '').toLowerCase()
    );
    if (found) {
      if (lang === 'ta' && found.nameTamil) return found.nameTamil;
      if (lang === 'hi' && found.nameHindi) return found.nameHindi;
      if (lang === 'te' && found.nameTelugu) return found.nameTelugu;
      if (lang === 'es' && found.nameSpanish) return found.nameSpanish;
    }
  }

  return item.name;
}

export function getLocalizedSpiceLabel(spiceLevel: string, t: TranslationDictionary): string {
  const normalized = (spiceLevel || '').toLowerCase();
  if (normalized.includes('mild')) return t.mild;
  if (normalized.includes('medium')) return t.medium;
  if (normalized.includes('extra')) return t.extraHot;
  if (normalized.includes('hot')) return t.hot;
  return spiceLevel;
}

export function getLocalizedCategory(category: Category | string, t: TranslationDictionary): string {
  switch (category) {
    case 'Starters': return t.starters;
    case 'Main Course': return t.mainCourse;
    case 'Breads & Rice': return t.breadsRice;
    case 'Beverages': return t.beverages;
    case 'Desserts': return t.desserts;
    case 'Combo': return t.chefCombos;
    case 'Signature': return t.royalSignature;
    case 'All': return t.allCategories;
    default: return category;
  }
}

export function getLocalizedCustomizationOption(option: string, lang: Language): string {
  if (!option) return '';
  if (lang === 'en') return option;

  const clean = option.replace(/\s*\(\+?₹?\s*\d+\)/g, '').trim();

  const tamilMap: Record<string, string> = {
    'Extra Gunpowder': 'கூடுதல் பொடி',
    'Double Vada': 'இரண்டு வடை',
    'Less Ghee': 'குறைந்த நெய்',
    'Extra Ghee': 'கூடுதல் நெய்',
    'Extra Sambar Bowl': 'கூடுதல் சாம்பார் கிண்ணம்',
    'Ghee Roast': 'நெய் ரோஸ்ட்',
    'Gunpowder / Podi': 'பொடி / இட்லி பொடி',
    'Less Potato': 'குறைந்த உருளைக்கிழங்கு',
    'Extra Gravy': 'கூடுதல் கிரேவி',
    'Boneless Only': 'எலும்பில்லாதது மட்டும்',
    'Mild Cream': 'மிதமான கிரீம்',
    'Butter Drizzle': 'வெண்ணெய் தூவல்',
    'Extra Mint Chutney': 'கூடுதல் புதினா சட்னி',
    'Extra Crispy Edges': 'மொறுமொறு விளிம்புகள்',
    'Lemon Squeeze': 'எலுமிச்சை சாறு',
    'Less Salt': 'குறைந்த உப்பு',
    'Extra Mirchi Ka Salan': 'கூடுதல் மிர்ச்சி சால்னா',
    'Double Raita': 'இரட்டை ராய்தா',
    'Fried Onions Add-on': 'வறுத்த வெங்காயம்',
    'Oat Milk Sub': 'ஓட்ஸ் பால்',
    'Extra Shot Espresso': 'கூடுதல் எஸ்பிரெஸ்ஸோ',
    'Less Sugar': 'குறைந்த சர்க்கரை',
    'Ice Cream Scoop': 'ஐஸ்கிரீம் ஸ்கூப்',
    'Extra Garlic': 'கூடுதல் பூண்டு',
    'Crispy Toasted': 'மொறுமொறு டோஸ்ட்',
    'No Butter': 'வெண்ணெய் வேண்டாம்',
    'Extra Raita': 'கூடுதல் ராய்தா',
    'Extra Chicken Piece': 'கூடுதல் கோழித் துண்டு',
    'Spicy Salan': 'காரமான சால்னா',
    'Extra Pepper Kick': 'கூடுதல் மிளகு',
    'Schezwan Toss': 'செஸ்வான் டாஸ்',
    'Dry / Semi Gravy': 'டிரை / செமி கிரேவி',
    'No Nuts Garnish': 'நட்ஸ் வேண்டாம்',
    'Low Sugar': 'குறைந்த சர்க்கரை',
    'Cardamom Boost': 'ஏலக்காய் சுவை',
    'Extra Warm Jamun': 'கூடுதல் சூடான ஜாமூன்',
    'Double Ice Cream': 'இரட்டை ஐஸ்கிரீம்',
    'Silver Leaf': 'வெள்ளி இலை',
    'Free Delay Apology': 'இலவச தாமத அன்பளிப்பு',
    'Chef Special Treat': 'செஃப் சிறப்பு உணவு'
  };

  const hindiMap: Record<string, string> = {
    'Extra Gunpowder': 'अतिरिक्त पोड़ी',
    'Double Vada': 'डबल वड़ा',
    'Less Ghee': 'कम घी',
    'Extra Ghee': 'अतिरिक्त घी',
    'Extra Sambar Bowl': 'अतिरिक्त सांभर कटोरी',
    'Ghee Roast': 'घी रोस्ट',
    'Gunpowder / Podi': 'पोड़ी मसाला',
    'Less Potato': 'कम आलू',
    'Extra Gravy': 'अतिरिक्त ग्रेवी',
    'Boneless Only': 'केवल बोनलेस',
    'Mild Cream': 'हल्की मलाई',
    'Butter Drizzle': 'मक्खन का तड़का',
    'Extra Mint Chutney': 'अतिरिक्त पुदीना चटनी',
    'Extra Crispy Edges': 'ज्यादा क्रिस्पी',
    'Lemon Squeeze': 'नींबू का रस',
    'Less Salt': 'कम नमक',
    'Extra Mirchi Ka Salan': 'अतिरिक्त सालन',
    'Double Raita': 'डबल रायता',
    'Fried Onions Add-on': 'तले हुए प्याज',
    'Oat Milk Sub': 'ओट मिल्क',
    'Extra Shot Espresso': 'एक्स्ट्रा शॉट एस्प्रेसो',
    'Less Sugar': 'कम चीनी',
    'Ice Cream Scoop': 'आइसक्रीम स्कूप',
    'Extra Garlic': 'अतिरिक्त लहसुन',
    'Crispy Toasted': 'क्रिस्पी टोस्ट',
    'No Butter': 'बिना मक्खन',
    'Extra Raita': 'अतिरिक्त रायता',
    'Extra Chicken Piece': 'अतिरिक्त चिकन पीस',
    'Spicy Salan': 'तीखा सालन',
    'Extra Pepper Kick': 'काली मिर्च',
    'Schezwan Toss': 'शेजवान टॉस',
    'Dry / Semi Gravy': 'ड्राई / सेमी ग्रेवी',
    'No Nuts Garnish': 'बिना मेवे',
    'Low Sugar': 'कम मीठा',
    'Cardamom Boost': 'इलायची स्वाद',
    'Extra Warm Jamun': 'गरमा-गरम जामुन',
    'Double Ice Cream': 'डबल आइसक्रीम',
    'Silver Leaf': 'चांदी का वर्क',
    'Free Delay Apology': 'निःशुल्क देरी उपहार',
    'Chef Special Treat': 'शेफ स्पेशल ट्रीट'
  };

  const teMap: Record<string, string> = {
    'Extra Gunpowder': 'అదనపు కారప్పొడి',
    'Double Vada': 'డబుల్ వడ',
    'Less Ghee': 'తక్కువ నెయ్యి',
    'Extra Ghee': 'అదనపు నెయ్యి',
    'Extra Sambar Bowl': 'అదనపు సాంబార్',
    'Ghee Roast': 'నెయ్యి రోస్ట్',
    'Gunpowder / Podi': 'కారప్పొడి',
    'Less Potato': 'తక్కువ బంగాళాదుంప',
    'Extra Gravy': 'అదనపు గ్రేవీ',
    'Boneless Only': 'బోన్‌లెస్ మాత్రమే',
    'Double Raita': 'డబుల్ రైతా',
    'Extra Raita': 'అదనపు రైతా',
    'Less Sugar': 'తక్కువ పంచదార',
    'No Butter': 'వెన్న లేకుండా'
  };

  if (lang === 'ta' && tamilMap[clean]) return tamilMap[clean];
  if (lang === 'hi' && hindiMap[clean]) return hindiMap[clean];
  if (lang === 'te' && teMap[clean]) return teMap[clean];

  return clean;
}
