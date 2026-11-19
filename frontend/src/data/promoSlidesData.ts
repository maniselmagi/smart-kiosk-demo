// Comprehensive Multilingual Promo Slides Data for All 11 Languages & 3 Meal Times
import { Category } from '../types';

export interface PromoSlide {
  id: string;
  badge: string;
  badgeColor: string;
  title: string;
  highlightText: string;
  subtitle: string;
  discountPill: string;
  discountSubtext: string;
  ctaText: string;
  categoryTarget: Category;
  rating: string;
}

export type MealTimePeriod = 'morning' | 'lunch' | 'dinner';

export const PROMO_SLIDES_BY_LANG: Record<string, Record<MealTimePeriod, PromoSlide[]>> = {
  "en": {
    "morning": [
      {
        "id": "morning-offer",
        "badge": "🌅 SUNRISE SPECIAL • TODAY ONLY",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "Crispy Ghee Dosa & Degree Filter Coffee",
        "highlightText": "Good Food, Good Mood",
        "subtitle": "Golden slow-roasted dosa prepared with pure cow ghee & 3 stone-ground chutneys.",
        "discountPill": "Get 40% OFF",
        "discountSubtext": "Breakfast Special",
        "ctaText": "Order Breakfast",
        "categoryTarget": "Starters",
        "rating": "4.9 ★"
      },
      {
        "id": "morning-combo",
        "badge": "🥣 MORNING CHEF COMBO",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "Royal Breakfast Executive Combo Spread",
        "highlightText": "Chef Combo Deal",
        "subtitle": "Ghee Roast Dosa + 2 Medu Vadas + Kesari + Filter Coffee @ ₹199 (Save ₹70).",
        "discountPill": "Save ₹70",
        "discountSubtext": "Special ₹199",
        "ctaText": "Explore Combos",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "morning-signature",
        "badge": "👑 ROYAL EMBER SIGNATURE",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "Kumbakonam Degree Filter Coffee & Ghee Roast",
        "highlightText": "Signature Heritage",
        "subtitle": "Decoted chicory blend whipped with unadulterated milk in brass dabarah.",
        "discountPill": "Chef Signature",
        "discountSubtext": "Royal Heritage",
        "ctaText": "View Signatures",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "lunch": [
      {
        "id": "lunch-offer",
        "badge": "☀️ GRAND LUNCH FEAST",
        "badgeColor": "bg-orange-500 text-white font-black",
        "title": "Royal Grand Meals Thali — 12-Item Luxury Spread",
        "highlightText": "Good Food, Good Mood",
        "subtitle": "Traditional South & North Indian curries, artisanal naans, basmati rice & sweets.",
        "discountPill": "Get 40% OFF",
        "discountSubtext": "Grand Lunch Thali",
        "ctaText": "Order Lunch Feast",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "lunch-combo",
        "badge": "🥣 EXECUTIVE CHEF COMBO",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "Paneer Makhani & Garlic Naan Executive Combo",
        "highlightText": "Value Combo Deal",
        "subtitle": "Creamy Makhani + 2 Garlic Naans + Jeera Pulao + Mango Lassi @ ₹499 (Save ₹120).",
        "discountPill": "Save ₹120",
        "discountSubtext": "Special ₹499",
        "ctaText": "Explore Combos",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "lunch-signature",
        "badge": "👑 ROYAL EMBER SIGNATURE",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "Awadhi Slow-Dum Royal Handi Biryani",
        "highlightText": "Royal Signature",
        "subtitle": "Aged basmati slow-dum cooked in sealed clay handi with saffron ghee & burani raita.",
        "discountPill": "Chef Signature",
        "discountSubtext": "Piping Hot",
        "ctaText": "View Signatures",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "dinner": [
      {
        "id": "dinner-offer",
        "badge": "🌙 EVENING DINNER & LATE SIZZLER",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "Cast-Iron Sizzling Tandoor & Grill Platters",
        "highlightText": "Good Food, Good Mood",
        "subtitle": "Charcoal-grilled kebabs, malai tikkas & smoky delights served hot till 2:00 AM.",
        "discountPill": "Get 50% OFF",
        "discountSubtext": "Evening Sizzler",
        "ctaText": "Order Dinner Now",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-combo",
        "badge": "🥣 CHEF VALUE DINNER COMBO",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "Royal Makhani & Sizzling Brownie Feast Combo",
        "highlightText": "Dinner Combo",
        "subtitle": "Tandoori Sizzler + 2 Butter Naans + Dal Makhani + Sizzling Walnut Fudge Brownie @ ₹549.",
        "discountPill": "Save ₹130",
        "discountSubtext": "Complete Combo",
        "ctaText": "Explore Combos",
        "categoryTarget": "Combo",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-signature",
        "badge": "👑 ROYAL EMBER SIGNATURE",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "Signature Butter Chicken & Sizzling Brownie",
        "highlightText": "Royal Signature",
        "subtitle": "Silky satin makhani gravy infused with butter & kasuri methi + smoking hot brownie.",
        "discountPill": "Chef Signature",
        "discountSubtext": "Signature Feast",
        "ctaText": "View Signatures",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ]
  },
  "ta": {
    "morning": [
      {
        "id": "morning-offer",
        "badge": "🌅 காலை சிறப்பு • இன்று மட்டும்",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "மொறுமொறு நெய் தோசை & டிகிரி பில்டர் காபி",
        "highlightText": "சுவையான உணவு, நல்வாழ்வு",
        "subtitle": "சுத்தமான பசு நெய்யில் சுட்டெடுத்த மொறுமொறு தோசை & 3 வகை பாரம்பரிய சட்னி.",
        "discountPill": "40% தள்ளுபடி",
        "discountSubtext": "காலை சிறப்பு",
        "ctaText": "ஆர்டர் செய்க",
        "categoryTarget": "Starters",
        "rating": "4.9 ★"
      },
      {
        "id": "morning-combo",
        "badge": "🥣 காலை செஃப் காம்போ",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "ராயல் காலை உணவு எக்சிகியூட்டிவ் காம்போ",
        "highlightText": "செஃப் காம்போ ஆஃபர்",
        "subtitle": "நெய் ரோஸ்ட் தோசை + 2 மெது வடை + கேசரி + பில்டர் காபி @ ₹199 (ரூ. 70 சேமிப்பு).",
        "discountPill": "ரூ. 70 சேமிப்பு",
        "discountSubtext": "சிறப்பு ₹199",
        "ctaText": "காம்போக்களைப் பார்க்க",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "morning-signature",
        "badge": "👑 ராயல் எம்பர் சிக்னேச்சர்",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "கும்பகோணம் டிகிரி பில்டர் காபி & நெய் ரோஸ்ட்",
        "highlightText": "பாரம்பரிய சிக்னேச்சர்",
        "subtitle": "பித்தளை தபாராவில் ஆவி பறக்க சுடச்சுட வழங்கப்படும் பாரம்பரிய டிகிரி காபி.",
        "discountPill": "செஃப் சிக்னேச்சர்",
        "discountSubtext": "ராஜ பாரம்பரியம்",
        "ctaText": "சிக்னேச்சர் காண்க",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "lunch": [
      {
        "id": "lunch-offer",
        "badge": "☀️ மதிய உணவு ராஜ விருந்து",
        "badgeColor": "bg-orange-500 text-white font-black",
        "title": "ராயல் கிராண்ட் மீல்ஸ் தாலி — 12 வகை ராஜ விருந்து",
        "highlightText": "சுவையான உணவு, நல்வாழ்வு",
        "subtitle": "பாரம்பரிய தென்னிந்திய மற்றும் வட இந்திய கூட்டு, குழம்பு, பாயாசம் & சுவையான சாதம்.",
        "discountPill": "40% தள்ளுபடி",
        "discountSubtext": "மதிய சாப்பாடு தாலி",
        "ctaText": "சாப்பாடு ஆர்டர் செய்க",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "lunch-combo",
        "badge": "🥣 எக்சிகியூட்டிவ் செஃப் காம்போ",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "பன்னீர் மக்கனி & கார்லிக் நான் எக்சிகியூட்டிவ் காம்போ",
        "highlightText": "சிறந்த காம்போ சலுகை",
        "subtitle": "கிரீமி மக்கனி + 2 பூண்டு நான் + சீரக சாதம் + மாம்பழ லஸ்ஸி @ ₹499 (ரூ. 120 சேமிப்பு).",
        "discountPill": "ரூ. 120 சேமிப்பு",
        "discountSubtext": "சிறப்பு ₹499",
        "ctaText": "காம்போக்களைப் பார்க்க",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "lunch-signature",
        "badge": "👑 ராயல் எம்பர் சிக்னேச்சர்",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "அவதிய சுலோ-தம் ராயல் ஹண்டி பிரியாணி",
        "highlightText": "ராயல் சிக்னேச்சர்",
        "subtitle": "குங்குமப்பூ நெய் மற்றும் புரானி ரைத்தாவுடன் சீல் செய்யப்பட்ட மண் ஹண்டியில் சமைத்த பிரியாணி.",
        "discountPill": "செஃப் சிக்னேச்சர்",
        "discountSubtext": "சுடச்சுட பரிமாறல்",
        "ctaText": "சிக்னேச்சர் காண்க",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "dinner": [
      {
        "id": "dinner-offer",
        "badge": "🌙 இரவு உணவு & சிஸ்லிங் தந்தூரி விருந்து",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "வார்ப்பிரும்பு சிஸ்லிங் தந்தூரி & கிரில் பிளாட்டர்",
        "highlightText": "சுவையான உணவு, நல்வாழ்வு",
        "subtitle": "கரி அடுப்பில் சுடப்பட்ட கபாப்கள் மற்றும் மலாய் திக்கா நள்ளிரவு 2 மணி வரை சுடச்சுட.",
        "discountPill": "50% தள்ளுபடி",
        "discountSubtext": "இரவு சிஸ்லர்",
        "ctaText": "இரவு உணவு ஆர்டர் செய்க",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-combo",
        "badge": "🥣 செஃப் சிறப்பு இரவு உணவு காம்போ",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "ராயல் மக்கனி & சிஸ்லிங் பிரவுனி காம்போ",
        "highlightText": "இரவு விருந்து காம்போ",
        "subtitle": "தந்தூரி சிஸ்லர் + 2 வெண்ணெய் நான் + தால் மக்கனி + சிஸ்லிங் பிரவுனி @ ₹549 (ரூ. 130 சேமிப்பு).",
        "discountPill": "ரூ. 130 சேமிப்பு",
        "discountSubtext": "முழுமையான காம்போ",
        "ctaText": "காம்போக்களைப் பார்க்க",
        "categoryTarget": "Combo",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-signature",
        "badge": "👑 ராயல் எம்பர் சிக்னேச்சர்",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "சிக்னேச்சர் பட்டர் சிக்கன் & சிஸ்லிங் பிரவுனி",
        "highlightText": "ராயல் சிக்னேச்சர்",
        "subtitle": "வெண்ணெய் மற்றும் கசூரி மேத்தி மணக்கும் சாட்டின் மக்கனி கிரேவி & சுடச்சுட பிரவுனி.",
        "discountPill": "செஃப் சிக்னேச்சர்",
        "discountSubtext": "சிக்னேச்சர் விருந்து",
        "ctaText": "சிக்னேச்சர் காண்க",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ]
  },
  "hi": {
    "morning": [
      {
        "id": "morning-offer",
        "badge": "🌅 सुबह का खास ऑफर • केवल आज",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "कुरकुरा घी डोसा और डिग्री फिल्टर कॉफी",
        "highlightText": "स्वादिष्ट भोजन, उत्तम स्वास्थ्य",
        "subtitle": "शुद्ध देसी गाय के घी में बना कुरकुरा डोसा और 3 पारंपरिक ताज़ा चटनियां।",
        "discountPill": "40% की छूट",
        "discountSubtext": "नाश्ता स्पेशल",
        "ctaText": "नाश्ता ऑर्डर करें",
        "categoryTarget": "Starters",
        "rating": "4.9 ★"
      },
      {
        "id": "morning-combo",
        "badge": "🥣 मॉर्निंग शेफ कॉम्बो",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "रॉयल ब्रेकफास्ट एग्जीक्यूटिव कॉम्बो",
        "highlightText": "शेफ कॉम्बो डील",
        "subtitle": "घी रोस्ट डोसा + 2 मेदू वड़े + केसरी + फिल्टर कॉफी @ ₹199 (बचत ₹70)।",
        "discountPill": "₹70 की बचत",
        "discountSubtext": "स्पेशल ₹199",
        "ctaText": "कॉम्बो देखें",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "morning-signature",
        "badge": "👑 रॉयल एम्बर सिग्नेचर",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "कुंभकोणम डिग्री फिल्टर कॉफी व घी रोस्ट",
        "highlightText": "शाही परंपरा",
        "subtitle": "पीतल के दबारा में गरमा-गरम झागदार शुद्ध दूध वाली पारंपरिक फिल्टर कॉफी।",
        "discountPill": "शेफ सिग्नेचर",
        "discountSubtext": "शाही स्वाद",
        "ctaText": "सिग्नेचर देखें",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "lunch": [
      {
        "id": "lunch-offer",
        "badge": "☀️ दोपहर का शाही भोजन",
        "badgeColor": "bg-orange-500 text-white font-black",
        "title": "रॉयल ग्रैंड भोजन थाली — 12 व्यंजनों का शाही स्वाद",
        "highlightText": "स्वादिष्ट भोजन, उत्तम स्वास्थ्य",
        "subtitle": "पारंपरिक उत्तर व दक्षिण भारतीय करी, तंदूरी नान, बासमती चावल और स्वादिष्ट मिठाइयां।",
        "discountPill": "40% की छूट",
        "discountSubtext": "लंच थाली स्पेशल",
        "ctaText": "लंच ऑर्डर करें",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "lunch-combo",
        "badge": "🥣 एग्जीक्यूटिव शेफ कॉम्बो",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "पनीर मखनी और गार्लिक नान एग्जीक्यूटिव कॉम्बो",
        "highlightText": "शानदार कॉम्बो ऑफर",
        "subtitle": "क्रीमी मखनी + 2 गार्लिक नान + जीरा पुलाव + मैंगो लस्सी @ ₹499 (बचत ₹120)।",
        "discountPill": "₹120 की बचत",
        "discountSubtext": "स्पेशल ₹499",
        "ctaText": "कॉम्बो देखें",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "lunch-signature",
        "badge": "👑 रॉयल एम्बर सिग्नेचर",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "अवधी स्लो-दम रॉयल हांडी बिरयानी",
        "highlightText": "रॉयल सिग्नेचर",
        "subtitle": "केसर घी और बुरानी रायता के साथ सील बंद मिट्टी की हांडी में पकी बासमती बिरयानी।",
        "discountPill": "शेफ सिग्नेचर",
        "discountSubtext": "गरमा-गरम",
        "ctaText": "सिग्नेचर देखें",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "dinner": [
      {
        "id": "dinner-offer",
        "badge": "🌙 डिनर और सिज़लिंग तंदूर स्पेशल",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "कास्ट-आयरन सिज़लिंग तंदूर और ग्रिल प्लेटर",
        "highlightText": "स्वादिष्ट भोजन, उत्तम स्वास्थ्य",
        "subtitle": "कोयले पर भुने कबाब, मलाई टिक्का और धुआंधार लजीज व्यंजन रात 2 बजे तक उपलब्ध।",
        "discountPill": "50% की छूट",
        "discountSubtext": "इवनिंग सिज़लर",
        "ctaText": "डिनर ऑर्डर करें",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-combo",
        "badge": "🥣 शेफ फैमिली डिनर कॉम्बो",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "रॉयल मखनी व सिज़लिंग ब्राउनी फीस्ट कॉम्बो",
        "highlightText": "डिनर कॉम्बो",
        "subtitle": "तंदूरी सिज़लर + 2 बटर नान + दाल मखनी + सिज़लिंग वॉलनट फज ब्राउनी @ ₹549 (बचत ₹130)।",
        "discountPill": "₹130 की बचत",
        "discountSubtext": "संपूर्ण कॉम्बो",
        "ctaText": "कॉम्बो देखें",
        "categoryTarget": "Combo",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-signature",
        "badge": "👑 रॉयल एम्बर सिग्नेचर",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "सिग्नेचर बटर चिकन व सिज़लिंग ब्राउनी",
        "highlightText": "रॉयल सिग्नेचर",
        "subtitle": "मक्खन व कसूरी मेथी से भरपूर रेशमी मखनी ग्रेवी और गरमा-गरम धुआंधार ब्राउनी।",
        "discountPill": "शेफ सिग्नेचर",
        "discountSubtext": "शाही दावत",
        "ctaText": "सिग्नेचर देखें",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ]
  },
  "te": {
    "morning": [
      {
        "id": "morning-offer",
        "badge": "🌅 ఉదయపు ప్రత్యేక ఆఫర్ • ఈరోజు మాత్రమే",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "కరకరలాడే నెయ్యి దోశ & డిగ్రీ ఫిల్టర్ కాఫీ",
        "highlightText": "రుచికరమైన ఆహారం, ఆరోగ్యప్రదం",
        "subtitle": "స్వచ్ఛమైన ఆవు నెయ్యితో కాల్చిన కరకరలాడే దోశ & 3 రకాల సంప్రదాయ చట్నీలు.",
        "discountPill": "40% తగ్గింపు",
        "discountSubtext": "అల్పాహార ప్రత్యేకత",
        "ctaText": "ఆర్డర్ చేయండి",
        "categoryTarget": "Starters",
        "rating": "4.9 ★"
      },
      {
        "id": "morning-combo",
        "badge": "🥣 ఉదయపు చెఫ్ కాంబో",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "రాయల్ బ్రేక్‌ఫాస్ట్ ఎగ్జిక్యూటివ్ కాంబో",
        "highlightText": "చెఫ్ కాంబో ఆఫర్",
        "subtitle": "నెయ్యి రోస్ట్ దోశ + 2 మేదు వడలు + కేసరి + ఫిల్టర్ కాఫీ @ ₹199 (₹70 ఆదా).",
        "discountPill": "₹70 ఆదా",
        "discountSubtext": "ప్రత్యేకం ₹199",
        "ctaText": "కాంబోలను చూడండి",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "morning-signature",
        "badge": "👑 రాయల్ ఎంబర్ సిగ్నేచర్",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "కుంభకోణం డిగ్రీ ఫిల్టర్ కాఫీ & నెయ్యి రోస్ట్",
        "highlightText": "సాంప్రదాయ సిగ్నేచర్",
        "subtitle": "ఇత్తడి దబారాలో వేడివేడిగా అందించే స్వచ్ఛమైన పాల డిగ్రీ ఫిల్టర్ కాఫీ.",
        "discountPill": "చెఫ్ సిగ్నేచర్",
        "discountSubtext": "రాచరిక వైభవం",
        "ctaText": "సిగ్నేచర్ చూడండి",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "lunch": [
      {
        "id": "lunch-offer",
        "badge": "☀️ మధ్యాహ్న భోజన విందు",
        "badgeColor": "bg-orange-500 text-white font-black",
        "title": "రాయల్ గ్రాండ్ మీల్స్ థాలి — 12 వంటకాల రాజభోజనం",
        "highlightText": "రుచికరమైన ఆహారం, ఆనందం",
        "subtitle": "దక్షిణ, ఉత్తర భారత సాంప్రదాయ కూరలు, నాన్, బాస్మతి అన్నం & తీపి వంటకాలు.",
        "discountPill": "40% తగ్గింపు",
        "discountSubtext": "భోజన థాలి స్పెషల్",
        "ctaText": "భోజనం ఆర్డర్ చేయండి",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "lunch-combo",
        "badge": "🥣 ఎగ్జిక్యూటివ్ చెఫ్ కాంబో",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "పన్నీర్ మఖ్నీ & గార్లిక్ నాన్ ఎగ్జిక్యూటివ్ కాంబో",
        "highlightText": "విలువైన కాంబో డీల్",
        "subtitle": "క్రీమీ మఖ్నీ + 2 గార్లిక్ నాన్లు + జీరా పులావ్ + మ్యాంగో లస్సీ @ ₹499 (₹120 ఆదా).",
        "discountPill": "₹120 ఆదా",
        "discountSubtext": "ప్రత్యేకం ₹499",
        "ctaText": "కాంబోలను చూడండి",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "lunch-signature",
        "badge": "👑 రాయల్ ఎంబర్ సిగ్నేచర్",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "అవధీ స్లో-దమ్ రాయల్ హండీ బిర్యానీ",
        "highlightText": "రాయల్ సిగ్నేచర్",
        "subtitle": "కుంకుమపువ్వు నెయ్యి, బురానీ రైతాతో మట్టి పాత్రలో దమ్ చేసిన బాస్మతి బిర్యానీ.",
        "discountPill": "చెఫ్ సిగ్నేచర్",
        "discountSubtext": "వేడివేడి వంటకం",
        "ctaText": "సిగ్నేచర్ చూడండి",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "dinner": [
      {
        "id": "dinner-offer",
        "badge": "🌙 రాత్రి భోజనం & సిజ్లింగ్ తందూరి విందు",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "సిజ్లింగ్ తందూరి & గ్రిల్ ప్లాటర్స్",
        "highlightText": "ఘుమఘుమలాడే రాత్రి భోజనం",
        "subtitle": "బొగ్గులపై కాల్చిన కబాబ్‌లు, మలై టిక్కాలు రాత్రి 2:00 వరకు వేడిగా లభిస్తాయి.",
        "discountPill": "50% తగ్గింపు",
        "discountSubtext": "ఈవెనింగ్ సిజ్లర్",
        "ctaText": "రాత్రి భోజనం ఆర్డర్ చేయండి",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-combo",
        "badge": "🥣 చెఫ్ ఫ్యామిలీ డిన్నర్ కాంబో",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "రాయల్ మఖ్నీ & సిజ్లింగ్ బ్రౌనీ కాంబో",
        "highlightText": "డిన్నర్ కాంబో",
        "subtitle": "తందూరి సిజ్లర్ + 2 బటర్ నాన్లు + దాల్ మఖ్నీ + సిజ్లింగ్ బ్రౌనీ @ ₹549 (₹130 ఆదా).",
        "discountPill": "₹130 ఆదా",
        "discountSubtext": "పూర్తి కాంబో",
        "ctaText": "కాంబోలను చూడండి",
        "categoryTarget": "Combo",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-signature",
        "badge": "👑 రాయల్ ఎంబర్ సిగ్నేచర్",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "సిగ్నేచర్ బటర్ చికెన్ & సిజ్లింగ్ బ్రౌనీ",
        "highlightText": "రాయల్ సిగ్నేచర్",
        "subtitle": "వెన్న, కసూరీ మేథీతో చేసిన మఖ్నీ గ్రేవీ మరియు వేడివేడి స్మోకీ బ్రౌనీ.",
        "discountPill": "చెఫ్ సిగ్నేచర్",
        "discountSubtext": "రాచరిక విందు",
        "ctaText": "సిగ్నేచర్ చూడండి",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ]
  },
  "kn": {
    "morning": [
      {
        "id": "morning-offer",
        "badge": "🌅 ಮುಂಜಾನೆಯ ವಿಶೇಷ • ಇಂದು ಮಾತ್ರ",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "ಗರಿಗರಿಯಾದ ತುಪ್ಪದ ದೋಸೆ & ಡಿಗ್ರಿ ಫಿಲ್ಟರ್ ಕಾಫಿ",
        "highlightText": "ಉತ್ತಮ ಆಹಾರ, ಶುದ್ಧ ಆರೋಗ್ಯ",
        "subtitle": "ಶುದ್ಧ ಹಸುವಿನ ತುಪ್ಪದಲ್ಲಿ ಬೇಯಿಸಿದ ಗರಿಗರಿಯಾದ ದೋಸೆ & 3 ಬಗೆಯ ಸಾಂಪ್ರದಾಯಿಕ ಚಟ್ನಿಗಳು.",
        "discountPill": "40% ರಿಯಾಯಿತಿ",
        "discountSubtext": "ಉಪಾಹಾರ ವಿಶೇಷ",
        "ctaText": "ಉಪಾಹಾರ ಆರ್ಡರ್ ಮಾಡಿ",
        "categoryTarget": "Starters",
        "rating": "4.9 ★"
      },
      {
        "id": "morning-combo",
        "badge": "🥣 ಮುಂಜಾನೆಯ ಚೆಫ್ ಕಾಂಬೊ",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "ರಾಯಲ್ ಉಪಾಹಾರ ಎಕ್ಸಿಕ್ಯೂಟಿವ್ ಕಾಂಬೊ",
        "highlightText": "ಚೆಫ್ ಕಾಂಬೊ ಕೊಡುಗೆ",
        "subtitle": "ತುಪ್ಪದ ರೋಸ್ಟ್ ದೋಸೆ + 2 ಮೇದು ವಡೆ + ಕೇಸರಿಬಾತ್ + ಫಿಲ್ಟರ್ ಕಾಫಿ @ ₹199 (₹70 ಉಳಿತಾಯ).",
        "discountPill": "₹70 ಉಳಿತಾಯ",
        "discountSubtext": "ವಿಶೇಷ ₹199",
        "ctaText": "ಕಾಂಬೊಗಳನ್ನು ನೋಡಿ",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "morning-signature",
        "badge": "👑 ರಾಯಲ್ ಎಂಬರ್ ಸಿಗ್ನೇಚರ್",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "ಕುಂಭಕೋಣಂ ಡಿಗ್ರಿ ಫಿಲ್ಟರ್ ಕಾಫಿ & ತುಪ್ಪದ ದೋಸೆ",
        "highlightText": "ಪಾರಂಪರಿಕ ಸಿಗ್ನೇಚರ್",
        "subtitle": "ಹಿತ್ತಾಳೆಯ ಲೋಟದಲ್ಲಿ ಹಬೆಯಾಡುವ ಶುದ್ಧ ಹಾಲಿನ ಸಾಂಪ್ರದಾಯಿಕ ಡಿಗ್ರಿ ಫಿಲ್ಟರ್ ಕಾಫಿ.",
        "discountPill": "ಚೆಫ್ ಸಿಗ್ನೇಚರ್",
        "discountSubtext": "ರಾಜಮನೆತನದ ರುಚಿ",
        "ctaText": "ಸಿಗ್ನೇಚರ್ ನೋಡಿ",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "lunch": [
      {
        "id": "lunch-offer",
        "badge": "☀️ ಮಧ್ಯಾಹ್ನದ ರಾಜ ಭೋಜನ",
        "badgeColor": "bg-orange-500 text-white font-black",
        "title": "ರಾಯಲ್ ಗ್ರ್ಯಾಂಡ್ ಮೀಲ್ಸ್ ಥಾಲಿ — 12 ಭಕ್ಷ್ಯಗಳ ಭೋಜನ",
        "highlightText": "ಉತ್ತಮ ಆಹಾರ, ಶುದ್ಧ ತೃಪ್ತಿ",
        "subtitle": "ದಕ್ಷಿಣ ಹಾಗೂ ಉತ್ತರ ಭಾರತೀಯ ಸಾಂಪ್ರದಾಯಿಕ ಕರಿಗಳು, ನಾನ್, ಬಾಸ್ಮತಿ ಅನ್ನ & ಸಿಹಿ ತಿಂಡಿ.",
        "discountPill": "40% ರಿಯಾಯಿತಿ",
        "discountSubtext": "ಊಟದ ಥಾಲಿ ವಿಶೇಷ",
        "ctaText": "ಊಟ ಆರ್ಡರ್ ಮಾಡಿ",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "lunch-combo",
        "badge": "🥣 ಎಕ್ಸಿಕ್ಯೂಟಿವ್ ಚೆಫ್ ಕಾಂಬೊ",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "ಪನೀರ್ ಮಖನಿ & ಗಾರ್ಲಿಕ್ ನಾನ್ ಎಕ್ಸಿಕ್ಯೂಟಿವ್ ಕಾಂಬೊ",
        "highlightText": "ಮೌಲ್ಯಯುತ ಕಾಂಬೊ ಕೊಡುಗೆ",
        "subtitle": "ಕ್ರೀಮಿ ಮಖನಿ + 2 ಗಾರ್ಲಿಕ್ ನಾನ್ + ಜೀರಾ ಪುಲಾವ್ + ಮ್ಯಾಂಗೋ ಲಸ್ಸಿ @ ₹499 (₹120 ಉಳಿತಾಯ).",
        "discountPill": "₹120 ಉಳಿತಾಯ",
        "discountSubtext": "ವಿಶೇಷ ₹499",
        "ctaText": "ಕಾಂಬೊಗಳನ್ನು ನೋಡಿ",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "lunch-signature",
        "badge": "👑 ರಾಯಲ್ ಎಂಬರ್ ಸಿಗ್ನೇಚರ್",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "ಅವಧಿ ಸ್ಲೋ-ದಮ್ ರಾಯಲ್ ಹಂಡಿ ಬಿರಿಯಾನಿ",
        "highlightText": "ರಾಯಲ್ ಸಿಗ್ನೇಚರ್",
        "subtitle": "ಕೇಸರಿ ತುಪ್ಪ ಮತ್ತು ಬುರಾನಿ ರೈತಾದೊಂದಿಗೆ ಮಣ್ಣಿನ ಮಡಕೆಯಲ್ಲಿ ಬೇಯಿಸಿದ ಬಾಸ್ಮತಿ ಬಿರಿಯಾನಿ.",
        "discountPill": "ಚೆಫ್ ಸಿಗ್ನೇಚರ್",
        "discountSubtext": "ಬಿಸಿಬಿಸಿ ಸವಿಯೂಟ",
        "ctaText": "ಸಿಗ್ನೇಚರ್ ನೋಡಿ",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "dinner": [
      {
        "id": "dinner-offer",
        "badge": "🌙 ರಾತ್ರಿಯ ಭೋಜನ & ಸಿಜ್ಲಿಂಗ್ ತಂದೂರಿ ಸವಿಯೂಟ",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "ಕ್ಯಾಸ್ಟ್-ಐರನ್ ಸಿಜ್ಲಿಂಗ್ ತಂದೂರಿ & ಗ್ರಿಲ್ ಪ್ಲ್ಯಾಟರ್",
        "highlightText": "ಉತ್ತಮ ಆಹಾರ, ಶುದ್ಧ ಆನಂದ",
        "subtitle": "ಇದ್ದಲಿನ ಒಲೆಯಲ್ಲಿ ಸುಟ್ಟ ಕಬಾಬ್‌ಗಳು ಹಾಗೂ ಮಲೈ ಟಿಕ್ಕಾ ರಾತ್ರಿ 2:00 ವರೆಗೆ ಲಭ್ಯ.",
        "discountPill": "50% ರಿಯಾಯಿತಿ",
        "discountSubtext": "ಸಂಜೆಯ ಸಿಜ್ಲರ್",
        "ctaText": "ರಾತ್ರಿ ಊಟ ಆರ್ಡರ್ ಮಾಡಿ",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-combo",
        "badge": "🥣 ಚೆಫ್ ಫ್ಯಾಮಿಲಿ ಡಿನ್ನರ್ ಕಾಂಬೊ",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "ರಾಯಲ್ ಮಖನಿ & ಸಿಜ್ಲಿಂಗ್ ಬ್ರೌನಿ ಕಾಂಬೊ",
        "highlightText": "ಡಿನ್ನರ್ ಕಾಂಬೊ",
        "subtitle": "ತಂದೂರಿ ಸಿಜ್ಲರ್ + 2 ಬಟರ್ ನಾನ್ + ದಾಲ್ ಮಖನಿ + ಸಿಜ್ಲಿಂಗ್ ಬ್ರೌನಿ @ ₹549 (₹130 ಉಳಿತಾಯ).",
        "discountPill": "₹130 ಉಳಿತಾಯ",
        "discountSubtext": "ಸಂಪೂರ್ಣ ಕಾಂಬೊ",
        "ctaText": "ಕಾಂಬೊಗಳನ್ನು ನೋಡಿ",
        "categoryTarget": "Combo",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-signature",
        "badge": "👑 ರಾಯಲ್ ಎಂಬರ್ ಸಿಗ್ನೇಚರ್",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "ಸಿಗ್ನೇಚರ್ ಬಟರ್ ಚಿಕನ್ & ಸಿಜ್ಲಿಂಗ್ ಬ್ರೌನಿ",
        "highlightText": "ರಾಯಲ್ ಸಿಗ್ನೇಚರ್",
        "subtitle": "ಬೆಣ್ಣೆ ಹಾಗೂ ಕಸೂರಿ ಮೇಥಿಯ ಮಖನಿ ಗ್ರೇವಿ ಮತ್ತು ಘಮಘಮಿಸುವ ಹಾಟ್ ಬ್ರೌನಿ.",
        "discountPill": "ಚೆಫ್ ಸಿಗ್ನೇಚರ್",
        "discountSubtext": "ರಾಜಮನೆತನದ ಊಟ",
        "ctaText": "ಸಿಗ್ನೇಚರ್ ನೋಡಿ",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ]
  },
  "ml": {
    "morning": [
      {
        "id": "morning-offer",
        "badge": "🌅 പ്രഭാത സ്പെഷ്യൽ • ഇന്ന് മാത്രം",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "മൊരിഞ്ഞ നെയ്യ് ദോശ & ഡിഗ്രി ഫിൽട്ടർ കോഫി",
        "highlightText": "രുചികരമായ ഭക്ഷണം, ആനന്ദം",
        "subtitle": "ശുദ്ധമായ പശുവിൻ നെയ്യിൽ ചുട്ടെടുത്ത ദോശയും 3 തരം നാടൻ ചമ്മന്തികളും.",
        "discountPill": "40% കിഴിവ്",
        "discountSubtext": "പ്രഭാത സ്പെഷ്യൽ",
        "ctaText": "ഓർഡർ ചെയ്യുക",
        "categoryTarget": "Starters",
        "rating": "4.9 ★"
      },
      {
        "id": "morning-combo",
        "badge": "🥣 മോണിംഗ് ഷെഫ് കോംബോ",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "റോയൽ ബ്രേക്ക്ഫാസ്റ്റ് എക്സിക്യൂട്ടീവ് കോംബോ",
        "highlightText": "ഷെഫ് കോംബോ ഓഫർ",
        "subtitle": "നെയ്യ് റോസ്റ്റ് ദോശ + 2 ഉഴുന്നുവട + കേസരി + ഫിൽട്ടർ കോഫി @ ₹199 (₹70 ലാഭം).",
        "discountPill": "₹70 ലാഭം",
        "discountSubtext": "സ്പെഷ്യൽ ₹199",
        "ctaText": "കോംബോ കാണുക",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "morning-signature",
        "badge": "👑 റോയൽ എംബർ സിഗ്നേച്ചർ",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "കുംഭകോണം ഡിഗ്രി ഫിൽട്ടർ കോഫി & നെയ്യ് റോസ്റ്റ്",
        "highlightText": "പാരമ്പര്യ സിഗ്നേച്ചർ",
        "subtitle": "ഓട്ടുപാത്രത്തിൽ പതഞ്ഞുപൊങ്ങുന്ന ശുദ്ധമായ പാലിന്റെ സ്വാഭാവിക ഫിൽട്ടർ കോഫി.",
        "discountPill": "ഷെഫ് സിഗ്നേച്ചർ",
        "discountSubtext": "രാജകീയ തനിമ",
        "ctaText": "സിഗ്നേച്ചർ കാണുക",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "lunch": [
      {
        "id": "lunch-offer",
        "badge": "☀️ ഉച്ചഭക്ഷണ രാജകീയ വിരുന്ന്",
        "badgeColor": "bg-orange-500 text-white font-black",
        "title": "റോയൽ ഗ്രാൻഡ് മീൽസ് താലി — 12 വിഭവങ്ങളുടെ സദ്യ",
        "highlightText": "രുചികരമായ ഭക്ഷണം, സംതൃപ്തി",
        "subtitle": "പരമ്പരാഗത തെക്കൻ, വടക്കൻ ഇന്ത്യൻ കറികൾ, നാൻ, ബസ്മതി ചോറ് & പായസം.",
        "discountPill": "40% കിഴിവ്",
        "discountSubtext": "ഊണ് താലി സ്പെഷ്യൽ",
        "ctaText": "ഊണ് ഓർഡർ ചെയ്യുക",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "lunch-combo",
        "badge": "🥣 എക്സിക്യൂട്ടീവ് ഷെഫ് കോംബോ",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "പനീർ മഖാനി & ഗാർലിക് നാൻ എക്സിക്യൂട്ടീവ് കോംബോ",
        "highlightText": "മികച്ച കോംബോ ഓഫർ",
        "subtitle": "ക്രീമി മഖാനി + 2 ഗാർലിക് നാൻ + ജീരക ചോറ് + മാംഗോ ലസ്സി @ ₹499 (₹120 ലാഭം).",
        "discountPill": "₹120 ലാഭം",
        "discountSubtext": "സ്പെഷ്യൽ ₹499",
        "ctaText": "കോംബോ കാണുക",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "lunch-signature",
        "badge": "👑 റോയൽ എംബർ സിഗ്നേച്ചർ",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "അവധീ സ്ലോ-ദം റോയൽ ഹണ്ടി ബിരിയാണി",
        "highlightText": "റോയൽ സിഗ്നേച്ചർ",
        "subtitle": "കുങ്കുമപ്പൂ നെയ്യും ബുറാനി റായ്ത്തയും ചേർത്ത് മൺപാത്രത്തിൽ ദം ചെയ്ത ബിരിയാണി.",
        "discountPill": "ഷെഫ് സിഗ്നേച്ചർ",
        "discountSubtext": "ചൂടോടെ വിളമ്പുന്നു",
        "ctaText": "സിഗ്നേച്ചർ കാണുക",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "dinner": [
      {
        "id": "dinner-offer",
        "badge": "🌙 അത്താഴവും സിസ്‌ലിംഗ് തന്തൂരി വിരുന്നും",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "സിസ്‌ലിംഗ് തന്തൂരി & ഗ്രിൽ പ്ലാറ്റർ",
        "highlightText": "സ്വാദൂറും അത്താഴം",
        "subtitle": "കനലിൽ ചുട്ടെടുത്ത കബാബുകളും മലായ് ടിക്കയും രാത്രി 2:00 വരെ ലഭ്യമാണ്.",
        "discountPill": "50% കിഴിവ്",
        "discountSubtext": "ഈവനിംഗ് സിസ്‌ലർ",
        "ctaText": "അത്താഴം ഓർഡർ ചെയ്യുക",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-combo",
        "badge": "🥣 ഷെഫ് ഫാമിലി ഡിന്നർ കോംബോ",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "റോയൽ മഖാനി & സിസ്‌ലിംഗ് ബ്രൗണി കോംബോ",
        "highlightText": "ഡിന്നർ കോംബോ",
        "subtitle": "തന്തൂരി സിസ്‌ലർ + 2 ബട്ടർ നാൻ + ദാൽ മഖാനി + സിസ്‌ലിംഗ് ബ്രൗണി @ ₹549 (₹130 ലാഭം).",
        "discountPill": "₹130 ലാഭം",
        "discountSubtext": "പൂർണ്ണ കോംബോ",
        "ctaText": "കോംബോ കാണുക",
        "categoryTarget": "Combo",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-signature",
        "badge": "👑 റോയൽ എംബർ സിഗ്നേച്ചർ",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "സിഗ്നേച്ചർ ബട്ടർ ചിക്കൻ & സിസ്‌ലിംഗ് ബ്രൗണി",
        "highlightText": "റോയൽ സിഗ്നേച്ചർ",
        "subtitle": "വെണ്ണയും കസൂരി മേത്തിയും ചേർത്ത വെൽവെറ്റ് ഗ്രേവിയും ചൂടൻ ബ്രൗണിയും.",
        "discountPill": "ഷെഫ് സിഗ്നേച്ചർ",
        "discountSubtext": "രാജകീയ വിരുന്ന്",
        "ctaText": "സിഗ്നേച്ചർ കാണുക",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ]
  },
  "ar": {
    "morning": [
      {
        "id": "morning-offer",
        "badge": "🌅 عرض الإفطار الصباحي • اليوم فقط",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "دوسا السمن المقرمشة وقهوة الفلتر الفاخرة",
        "highlightText": "طعام لذيذ، مزاج رائع",
        "subtitle": "دوسا ذهبية محمصة بالسمن البقري الصافي مع 3 أنواع شاتني طازجة.",
        "discountPill": "خصم 40%",
        "discountSubtext": "عرض الإفطار",
        "ctaText": "اطلب الإفطار",
        "categoryTarget": "Starters",
        "rating": "4.9 ★"
      },
      {
        "id": "morning-combo",
        "badge": "🥣 كومبو الشيف الصباحي",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "وجبة الإفطار الملكية المتكاملة",
        "highlightText": "عرض التوفير للكومبو",
        "subtitle": "دوسا بالسمن + 2 ميدو فادا + حلوى كيساري + قهوة فلتر بسعر 199 روبية (وفر 70 روبية).",
        "discountPill": "وفر 70 روبية",
        "discountSubtext": "خاص 199 روبية",
        "ctaText": "استكشف الكومبو",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "morning-signature",
        "badge": "👑 طبق رويال إمبر المميز",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "قهوة كومباكونام بدرجة فلتر أصلية ودوسا مقرمشة",
        "highlightText": "تراث ملكي فاخر",
        "subtitle": "قهوة عطرية غنية مع حليب طازج غير مغشوش تُقدم في إناء نحاسي تقليدي.",
        "discountPill": "طبق الشيف الحصري",
        "discountSubtext": "تراث ملكي",
        "ctaText": "تصفح الأطباق المميزة",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "lunch": [
      {
        "id": "lunch-offer",
        "badge": "☀️ مأدبة الغداء الملكية",
        "badgeColor": "bg-orange-500 text-white font-black",
        "title": "صينية ثالي الوجبات الملكية الكبرى — 12 صنف فاخر",
        "highlightText": "طعام فاخر، بهجة تدوم",
        "subtitle": "أطباق كاري تقليدية من جنوب وشمال الهند مع خبز النان الحرفي وأرز البسمتي والحلويات.",
        "discountPill": "خصم 40%",
        "discountSubtext": "ثالي الغداء الفاخر",
        "ctaText": "اطلب الغداء الآن",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "lunch-combo",
        "badge": "🥣 كومبو الشيف التنفيذي",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "كومبو بانير مخاني وخبز نان بالثوم الفاخر",
        "highlightText": "عرض كومبو مميز",
        "subtitle": "بانير مخاني كريمي + 2 نان بالثوم + أرز كمون + مانجو لاسي بسعر 499 روبية (وفر 120 روبية).",
        "discountPill": "وفر 120 روبية",
        "discountSubtext": "خاص 499 روبية",
        "ctaText": "استكشف الكومبو",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "lunch-signature",
        "badge": "👑 طبق رويال إمبر المميز",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "برياني أوادهي الملكي المطهو في هاندي فخارية مقفلة",
        "highlightText": "توقيع ملكي",
        "subtitle": "أرز بسمتي معتق مطهو بالبخار البطيء مع سمن الزعفران ورايتا بوراني.",
        "discountPill": "طبق الشيف الحصري",
        "discountSubtext": "ساخن وطازج",
        "ctaText": "تصفح الأطباق المميزة",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "dinner": [
      {
        "id": "dinner-offer",
        "badge": "🌙 عشاء مسائي ومشويات تندوري ساخنة",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "أطباق تندوري وشواية صينية حديدية فوارة",
        "highlightText": "طعام لا يُنسى",
        "subtitle": "كباب مشوي على الفحم وتيكا كريمية ولذائذ مدخنة تقدم ساخنة حتى 2:00 صباحاً.",
        "discountPill": "خصم 50%",
        "discountSubtext": "مشويات المساء",
        "ctaText": "اطلب العشاء الآن",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-combo",
        "badge": "🥣 كومبو عشاء العائلة الفاخر",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "وليمة مخاني الملكية مع براوني الشوكولاتة الفوار",
        "highlightText": "كومبو العشاء",
        "subtitle": "مشويات تندوري + 2 نان بالزبدة + دال مخاني + براوني فادج ساخن بالجوز بسعر 549 روبية.",
        "discountPill": "وفر 130 روبية",
        "discountSubtext": "كومبو متكامل",
        "ctaText": "استكشف الكومبو",
        "categoryTarget": "Combo",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-signature",
        "badge": "👑 طبق رويال إمبر المميز",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "دجاج بالزبدة الفاخر وبراوني فوار ساخن",
        "highlightText": "توقيع ملكي",
        "subtitle": "مرق مخاني حريري غني بالزبدة والحلبة المجففة مع كعكة براوني مدخنة ساخنة.",
        "discountPill": "طبق الشيف الحصري",
        "discountSubtext": "وليمة ملكية",
        "ctaText": "تصفح الأطباق المميزة",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ]
  },
  "ko": {
    "morning": [
      {
        "id": "morning-offer",
        "badge": "🌅 아침 스페셜 • 오늘만 특가",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "바삭한 기 도사와 쿰바코남 드그리 필터 커피",
        "highlightText": "맛있는 음식, 행복한 하루",
        "subtitle": "순수 소 기(버터)로 바삭하게 구워낸 도사와 3가지 전통 처트니.",
        "discountPill": "40% 할인",
        "discountSubtext": "조식 특가",
        "ctaText": "아침 주문하기",
        "categoryTarget": "Starters",
        "rating": "4.9 ★"
      },
      {
        "id": "morning-combo",
        "badge": "🥣 모닝 셰프 콤보",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "로얄 브렉퍼스트 익스클루시브 콤보",
        "highlightText": "셰프 콤보 혜택",
        "subtitle": "기 로스트 도사 + 메두 바다 2개 + 케사리 + 필터 커피 @ ₹199 (₹70 절약).",
        "discountPill": "₹70 절약",
        "discountSubtext": "특가 ₹199",
        "ctaText": "콤보 둘러보기",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "morning-signature",
        "badge": "👑 로얄 엠버 시그니처",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "쿰바코남 디그리 필터 커피 & 기 로스트 도사",
        "highlightText": "전통 명품 시그니처",
        "subtitle": "황동 전통 용기에 거품을 낸 순수 우유와 진한 치커리 블렌드 커피.",
        "discountPill": "셰프 시그니처",
        "discountSubtext": "왕실 전통",
        "ctaText": "시그니처 보기",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "lunch": [
      {
        "id": "lunch-offer",
        "badge": "☀️ 그랜드 런치 특선",
        "badgeColor": "bg-orange-500 text-white font-black",
        "title": "로얄 그랜드 탈리 정식 — 12가지 고급 진수성찬",
        "highlightText": "정성 가득한 한 끼",
        "subtitle": "전통 남·북인도 커리, 화덕 난, 바스마티 라이스와 달콤한 디저트.",
        "discountPill": "40% 할인",
        "discountSubtext": "점심 탈리 특가",
        "ctaText": "점심 주문하기",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "lunch-combo",
        "badge": "🥣 이그제큐티브 셰프 콤보",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "파니르 마카니 & 갈릭 난 이그제큐티브 콤보",
        "highlightText": "가성비 콤보",
        "subtitle": "크리미 마카니 + 갈릭 난 2개 + 지라 풀라오 + 망고 라씨 @ ₹499 (₹120 절약).",
        "discountPill": "₹120 절약",
        "discountSubtext": "특가 ₹499",
        "ctaText": "콤보 둘러보기",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "lunch-signature",
        "badge": "👑 로얄 엠버 시그니처",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "아와디 슬로우 덤 로얄 한디 비리야니",
        "highlightText": "로얄 시그니처",
        "subtitle": "밀봉된 전통 옹기에서 사프란 기와 함께 뜸 들인 프리미엄 바스마티 비리야니.",
        "discountPill": "셰프 시그니처",
        "discountSubtext": "갓 조리된 온기",
        "ctaText": "시그니처 보기",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "dinner": [
      {
        "id": "dinner-offer",
        "badge": "🌙 이브닝 디너 & 지글지글 탄두리",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "무쇠 팬에 지글거리는 직화 탄두리 & 그릴 플래터",
        "highlightText": "최고의 저녁 만찬",
        "subtitle": "참숯 직화 케밥, 말라이 티카 등 훈제 바비큐 요리를 새벽 2시까지 제공.",
        "discountPill": "50% 할인",
        "discountSubtext": "저녁 그릴 특가",
        "ctaText": "저녁 주문하기",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-combo",
        "badge": "🥣 셰프 패밀리 디너 콤보",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "로얄 마카니 & 시즐링 브라우니 만찬 콤보",
        "highlightText": "디너 콤보",
        "subtitle": "탄두리 시즐러 + 버터 난 2개 + 달 마카니 + 뜨거운 호두 브라우니 @ ₹549.",
        "discountPill": "₹130 절약",
        "discountSubtext": "완벽한 만찬",
        "ctaText": "콤보 둘러보기",
        "categoryTarget": "Combo",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-signature",
        "badge": "👑 로얄 엠버 시그니처",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "시그니처 버터 치킨 & 핫 시즐링 브라우니",
        "highlightText": "로얄 시그니처",
        "subtitle": "카수리 메티와 고급 버터가 어우러진 비단결 마카니 그레이비와 브라우니.",
        "discountPill": "셰프 시그니처",
        "discountSubtext": "시그니처 만찬",
        "ctaText": "시그니처 보기",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ]
  },
  "es": {
    "morning": [
      {
        "id": "morning-offer",
        "badge": "🌅 ESPECIAL AMANECER • SOLO HOY",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "Crujiente Dosa de Ghee & Café Filtro Degree",
        "highlightText": "Buena comida, buen humor",
        "subtitle": "Dosa dorada asada lentamente con ghee puro de vaca y 3 chutneys artesanales.",
        "discountPill": "40% DE DESCUENTO",
        "discountSubtext": "Especial Desayuno",
        "ctaText": "Pedir Desayuno",
        "categoryTarget": "Starters",
        "rating": "4.9 ★"
      },
      {
        "id": "morning-combo",
        "badge": "🥣 COMBO CHEF MATUTINO",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "Combo Ejecutivo Desayuno Royal",
        "highlightText": "Oferta Combo Chef",
        "subtitle": "Ghee Roast Dosa + 2 Medu Vadas + Kesari + Café Filtro @ ₹199 (Ahorra ₹70).",
        "discountPill": "Ahorra ₹70",
        "discountSubtext": "Especial ₹199",
        "ctaText": "Ver Combos",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "morning-signature",
        "badge": "👑 ROYAL EMBER SIGNATURE",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "Café Filtro Kumbakonam & Ghee Roast",
        "highlightText": "Herencia Exclusiva",
        "subtitle": "Café tradicional con leche pura sin adulterar servido espumoso en dabarah de latón.",
        "discountPill": "Chef Signature",
        "discountSubtext": "Herencia Real",
        "ctaText": "Ver Especialidades",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "lunch": [
      {
        "id": "lunch-offer",
        "badge": "☀️ GRAN BANQUETE DE ALMUERZO",
        "badgeColor": "bg-orange-500 text-white font-black",
        "title": "Thali Royal Grand Meals — Festín de 12 Platos",
        "highlightText": "Sabor Incomparable",
        "subtitle": "Curris tradicionales del norte y sur de India, panes naan, arroz basmati y postres.",
        "discountPill": "40% DE DESCUENTO",
        "discountSubtext": "Thali Almuerzo",
        "ctaText": "Pedir Almuerzo",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "lunch-combo",
        "badge": "🥣 COMBO CHEF EJECUTIVO",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "Combo Paneer Makhani & Naan de Ajo",
        "highlightText": "Mejor Valor",
        "subtitle": "Makhani cremoso + 2 Naans de ajo + Jeera Pulao + Mango Lassi @ ₹499 (Ahorra ₹120).",
        "discountPill": "Ahorra ₹120",
        "discountSubtext": "Especial ₹499",
        "ctaText": "Ver Combos",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "lunch-signature",
        "badge": "👑 ROYAL EMBER SIGNATURE",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "Biryani Awadhi Royal Handi al Vapor Lento",
        "highlightText": "Sello Real",
        "subtitle": "Arroz basmati añejo cocinado a fuego lento en vasija de barro sellada con ghee de azafrán.",
        "discountPill": "Chef Signature",
        "discountSubtext": "Servido Caliente",
        "ctaText": "Ver Especialidades",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "dinner": [
      {
        "id": "dinner-offer",
        "badge": "🌙 CENA & TANDOORI A LA BRASA",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "Parrilladas Sizzling Tandoor en Hierro Fundido",
        "highlightText": "Sabor y Tradición",
        "subtitle": "Kebabs al carbón, tikkas malai y delicias ahumadas servidas calientes hasta las 2:00 AM.",
        "discountPill": "50% DE DESCUENTO",
        "discountSubtext": "Sizzler Nocturno",
        "ctaText": "Pedir Cena Ahora",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-combo",
        "badge": "🥣 COMBO CENA FAMILIAR",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "Combo Royal Makhani & Brownie Chisporroteante",
        "highlightText": "Combo Cena",
        "subtitle": "Tandoori Sizzler + 2 Naans de Mantequilla + Dal Makhani + Brownie Caliente @ ₹549.",
        "discountPill": "Ahorra ₹130",
        "discountSubtext": "Festín Completo",
        "ctaText": "Ver Combos",
        "categoryTarget": "Combo",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-signature",
        "badge": "👑 ROYAL EMBER SIGNATURE",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "Signature Butter Chicken & Brownie Caliente",
        "highlightText": "Sello Real",
        "subtitle": "Salsa makhani sedosa con mantequilla y kasuri methi + brownie de nuez humeante.",
        "discountPill": "Chef Signature",
        "discountSubtext": "Festín Signature",
        "ctaText": "Ver Especialidades",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ]
  },
  "fr": {
    "morning": [
      {
        "id": "morning-offer",
        "badge": "🌅 SPÉCIAL MATIN • AUJOURD'HUI SEULEMENT",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "Dosa Croustillante au Ghee & Café Filtre",
        "highlightText": "Saveur et Excellence",
        "subtitle": "Dosa dorée au ghee pur de vache servie avec 3 chutneys artisanaux.",
        "discountPill": "40% DE RÉDUCTION",
        "discountSubtext": "Spécial Matin",
        "ctaText": "Commander",
        "categoryTarget": "Starters",
        "rating": "4.9 ★"
      },
      {
        "id": "morning-combo",
        "badge": "🥣 COMBO CHEF DU MATIN",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "Menu Exécutif Petit-Déjeuner Royal",
        "highlightText": "Offre Combo Chef",
        "subtitle": "Ghee Roast Dosa + 2 Medu Vadas + Kesari + Café Filtre @ ₹199 (Économisez ₹70).",
        "discountPill": "Économisez ₹70",
        "discountSubtext": "Spécial ₹199",
        "ctaText": "Voir les Combos",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "morning-signature",
        "badge": "👑 SIGNATURE ROYAL EMBER",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "Café Filtre Kumbakonam & Ghee Roast",
        "highlightText": "Héritage Artisanal",
        "subtitle": "Café traditionnel au lait pur non adultéré servi dans son dabarah en laiton.",
        "discountPill": "Signature du Chef",
        "discountSubtext": "Tradition Royale",
        "ctaText": "Voir les Signatures",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "lunch": [
      {
        "id": "lunch-offer",
        "badge": "☀️ GRAND FESTIN DU DÉJEUNER",
        "badgeColor": "bg-orange-500 text-white font-black",
        "title": "Thali Royal Grand Meals — Festin de 12 Plats",
        "highlightText": "Cuisine Authentique",
        "subtitle": "Currys traditionnels indiens, naans au tandoor, riz basmati et desserts raffinés.",
        "discountPill": "40% DE RÉDUCTION",
        "discountSubtext": "Thali Déjeuner",
        "ctaText": "Commander le Festin",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "lunch-combo",
        "badge": "🥣 COMBO CHEF EXÉCUTIF",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "Combo Paneer Makhani & Naan à l'Ail",
        "highlightText": "Offre Exceptionnelle",
        "subtitle": "Makhani crémeux + 2 Naans à l'ail + Jeera Pulao + Mango Lassi @ ₹499 (Économisez ₹120).",
        "discountPill": "Économisez ₹120",
        "discountSubtext": "Spécial ₹499",
        "ctaText": "Voir les Combos",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "lunch-signature",
        "badge": "👑 SIGNATURE ROYAL EMBER",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "Biryani Awadhi Royal Handi à l'Étouffée",
        "highlightText": "Signature Royale",
        "subtitle": "Riz basmati affiné cuit à l'étouffée dans un pot en terre cuite au ghee safrané.",
        "discountPill": "Signature du Chef",
        "discountSubtext": "Chaud & Fumé",
        "ctaText": "Voir les Signatures",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "dinner": [
      {
        "id": "dinner-offer",
        "badge": "🌙 DÎNER DU SOIR & TANDOOR SIZZLING",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "Grillades Sizzling Tandoor en Fonte",
        "highlightText": "Saveur Exceptionnelle",
        "subtitle": "Kebabs grillés au charbon, tikkas malai et délices fumés servis jusqu'à 2h du matin.",
        "discountPill": "50% DE RÉDUCTION",
        "discountSubtext": "Sizzler du Soir",
        "ctaText": "Commander le Dîner",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-combo",
        "badge": "🥣 COMBO DÎNER FAMILIAL DU CHEF",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "Festin Royal Makhani & Brownie Sizzling",
        "highlightText": "Combo Dîner",
        "subtitle": "Sizzler Tandoori + 2 Naans au Beurre + Dal Makhani + Brownie Chaud @ ₹549.",
        "discountPill": "Économisez ₹130",
        "discountSubtext": "Festin Complet",
        "ctaText": "Voir les Combos",
        "categoryTarget": "Combo",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-signature",
        "badge": "👑 SIGNATURE ROYAL EMBER",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "Signature Butter Chicken & Brownie Chaud",
        "highlightText": "Signature Royale",
        "subtitle": "Sauce makhani soyeuse au beurre et fenugrec + brownie fondant fumant.",
        "discountPill": "Signature du Chef",
        "discountSubtext": "Festin Signature",
        "ctaText": "Voir les Signatures",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ]
  },
  "de": {
    "morning": [
      {
        "id": "morning-offer",
        "badge": "🌅 MORGEN-SPEZIAL • NUR HEUTE",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "Knuspriges Ghee-Dosa & Filterkaffee",
        "highlightText": "Köstlicher Geschmack",
        "subtitle": "Goldbraun in reinem Kuh-Ghee geröstetes Dosa mit 3 traditionellen Chutneys.",
        "discountPill": "40% RABATT",
        "discountSubtext": "Frühstücks-Spezial",
        "ctaText": "Frühstück bestellen",
        "categoryTarget": "Starters",
        "rating": "4.9 ★"
      },
      {
        "id": "morning-combo",
        "badge": "🥣 MORGENDLICHES CHEF-KOMBO",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "Royal Frühstücks-Executive-Kombo",
        "highlightText": "Chef-Kombo-Angebot",
        "subtitle": "Ghee Roast Dosa + 2 Medu Vadas + Kesari + Filterkaffee @ ₹199 (₹70 Ersparnis).",
        "discountPill": "₹70 sparen",
        "discountSubtext": "Spezial ₹199",
        "ctaText": "Kombos entdecken",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "morning-signature",
        "badge": "👑 ROYAL EMBER SIGNATURE",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "Kumbakonam Filterkaffee & Ghee Roast",
        "highlightText": "Traditionelles Erbe",
        "subtitle": "Dampfender Filterkaffee mit reiner Milch im traditionellen Messing-Dabarah serviert.",
        "discountPill": "Chef-Signatur",
        "discountSubtext": "Königliche Tradition",
        "ctaText": "Signaturen ansehen",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "lunch": [
      {
        "id": "lunch-offer",
        "badge": "☀️ KÖNIGLICHES MITTAGSBANKETT",
        "badgeColor": "bg-orange-500 text-white font-black",
        "title": "Royal Grand Meals Thali — 12-Gerichte-Festmahl",
        "highlightText": "Hervorragender Geschmack",
        "subtitle": "Traditionelle Currys aus Nord- und Südindien, Naan-Brote, Basmatireis und Desserts.",
        "discountPill": "40% RABATT",
        "discountSubtext": "Mittags-Thali",
        "ctaText": "Mittagessen bestellen",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "lunch-combo",
        "badge": "🥣 EXECUTIVE CHEF-KOMBO",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "Paneer Makhani & Knoblauch-Naan Kombo",
        "highlightText": "Top Spar-Angebot",
        "subtitle": "Cremiges Makhani + 2 Knoblauch-Naans + Jeera Pulao + Mango Lassi @ ₹499 (₹120 Ersparnis).",
        "discountPill": "₹120 sparen",
        "discountSubtext": "Spezial ₹499",
        "ctaText": "Kombos entdecken",
        "categoryTarget": "Combo",
        "rating": "4.8 ★"
      },
      {
        "id": "lunch-signature",
        "badge": "👑 ROYAL EMBER SIGNATURE",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "Awadhi Slow-Dum Royal Handi Biryani",
        "highlightText": "Königliche Signatur",
        "subtitle": "Gereifter Basmatireis im versiegelten Tontopf schonend gegart mit Safranghee & Raita.",
        "discountPill": "Chef-Signatur",
        "discountSubtext": "Ofenfrisch",
        "ctaText": "Signaturen ansehen",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ],
    "dinner": [
      {
        "id": "dinner-offer",
        "badge": "🌙 ABENDESSEN & SIZZLING TANDOORI",
        "badgeColor": "bg-amber-400 text-slate-950 font-black",
        "title": "Gusseiserne Sizzling Tandoor & Grillplatten",
        "highlightText": "Köstlicher Genuss",
        "subtitle": "Auf Holzkohle gegrillte Kebabs, Malai Tikkas und rauchige Grillspezialitäten bis 2 Uhr.",
        "discountPill": "50% RABATT",
        "discountSubtext": "Abend-Sizzler",
        "ctaText": "Abendessen bestellen",
        "categoryTarget": "Main Course",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-combo",
        "badge": "🥣 CHEF-FAMILIEN-DINNER-KOMBO",
        "badgeColor": "bg-emerald-500 text-white font-black",
        "title": "Royal Makhani & Heißer Brownie Schlemmer-Kombo",
        "highlightText": "Dinner-Kombo",
        "subtitle": "Tandoori Sizzler + 2 Butter Naans + Dal Makhani + Heißer Walnuss-Brownie @ ₹549.",
        "discountPill": "₹130 sparen",
        "discountSubtext": "Komplettes Menü",
        "ctaText": "Kombos entdecken",
        "categoryTarget": "Combo",
        "rating": "4.9 ★"
      },
      {
        "id": "dinner-signature",
        "badge": "👑 ROYAL EMBER SIGNATURE",
        "badgeColor": "bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black",
        "title": "Signature Butter Chicken & Heißer Brownie",
        "highlightText": "Königliche Signatur",
        "subtitle": "Seidige Makhani-Sauce mit feiner Butter und Bockshornklee + rauchig-heißer Brownie.",
        "discountPill": "Chef-Signatur",
        "discountSubtext": "Festmahl-Signatur",
        "ctaText": "Signaturen ansehen",
        "categoryTarget": "Signature",
        "rating": "5.0 ★"
      }
    ]
  }
};
