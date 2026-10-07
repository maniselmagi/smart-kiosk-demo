export type Language = 'en' | 'ta';

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
  }
};
