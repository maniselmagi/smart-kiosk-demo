import { getAssignedWaiter, WaiterInfo } from './waiterAssignment';

export interface TableAllocationResult {
  tableNumber: number;
  capacity: number;
  category: string;
  zoneLabel: string;
  zoneDescription: string;
  suitableFor: string;
  waiter: WaiterInfo;
  features: string[];
  ambienceBadge: string;
  familyIcon: string;
}

/**
 * Base Table Allocation Engine
 */
export const allocateTableForGuests = (personCount: number): TableAllocationResult => {
  const count = Math.max(1, personCount);

  if (count <= 2) {
    return {
      tableNumber: 3,
      capacity: 2,
      category: '2-Seater Intimate Window Table',
      zoneLabel: 'Zone T(1-5)',
      zoneDescription: 'Ground Floor • Quiet Garden Window Corner',
      suitableFor: 'Perfect fit for solo diners or cozy couple dining',
      waiter: getAssignedWaiter(3),
      features: ['Scenic Garden View', 'Warm Ambient Lighting', 'Compact Duo Setup', 'Express Course Pacing'],
      ambienceBadge: 'Cozy & Quiet Duo Table',
      familyIcon: '👥'
    };
  } else if (count <= 4) {
    return {
      tableNumber: 8,
      capacity: 4,
      category: '4-Seater Cushioned Family Booth',
      zoneLabel: 'Zone T(6-10)',
      zoneDescription: 'Pavilion Wing • Comfortable High-Back Booth',
      suitableFor: 'Ideal for standard families of 3 to 4 with kids',
      waiter: getAssignedWaiter(8),
      features: ['Plush Velvet Cushions', 'Child High-Chair Friendly', 'Spacious Dish Tabletop', 'Semi-Private Enclosure'],
      ambienceBadge: 'Comfortable Family Booth',
      familyIcon: '👨‍👩‍👧‍👦'
    };
  } else if (count <= 6) {
    return {
      tableNumber: 12,
      capacity: 6,
      category: '6-Seater Family Banquet Table',
      zoneLabel: 'Zone T(11-15)',
      zoneDescription: 'Main Dining Atrium • Central Amber Pavilion',
      suitableFor: 'Spacious allocation for larger families and friend gatherings',
      waiter: getAssignedWaiter(12),
      features: ['Solid Teakwood Banquet Table', 'Center Turntable Ready', 'Dedicated Fast Kitchen Runner', 'Wide Armchairs'],
      ambienceBadge: 'Central Family Banquet',
      familyIcon: '👨‍👩‍👧‍👦👨‍👧'
    };
  } else {
    return {
      tableNumber: 18,
      capacity: 10,
      category: '10-Seater Grand Royal Imperial Banquet',
      zoneLabel: 'Zone T(16-20)',
      zoneDescription: 'First Floor Mezzanine • Royal Maharaja Pavilion',
      suitableFor: `Royal celebration feast table for grand families of ${count}+ guests`,
      waiter: getAssignedWaiter(18),
      features: ['360° Rotating Lazy Susan', 'Dedicated Section Captain Service', 'VIP Banquet Ambience', 'Multi-Course Platter Layout'],
      ambienceBadge: 'Grand Royal Banquet',
      familyIcon: '👑👨‍👩‍👦‍👦🎉'
    };
  }
};

/**
 * Localized Table Allocation for Multilingual Kiosk
 */
export const getLocalizedTableAllocation = (personCount: number, lang: string = 'en'): TableAllocationResult => {
  const base = allocateTableForGuests(personCount);
  const count = Math.max(1, personCount);

  if (lang === 'ta') {
    if (count <= 2) {
      return {
        ...base,
        category: '2 இருக்கை சாளர மேஜை (தோட்டக் காட்சி)',
        ambienceBadge: 'அமைதியான ஜோடி மேஜை',
        zoneDescription: 'தரைத் தளம் • அமைதியான தோட்ட சாளரப் பகுதி',
        suitableFor: 'தனிநபர் அல்லது ஜோடிகளுக்கான அமைதியான மேஜை',
        features: ['அழகிய தோட்டக் காட்சி', 'மிதமான விளக்கு வெளிச்சம்', 'ஜோடி உணவருந்தல்', 'விரைவான பரிமாறல்']
      };
    } else if (count <= 4) {
      return {
        ...base,
        category: '4 இருக்கை மெத்தை வசதி குடும்ப மேஜை',
        ambienceBadge: 'வசதியான குடும்ப மேஜை',
        zoneDescription: 'பவிலியன் பிரிவு • சொகுசு ஹை-பேக் இருக்கை',
        suitableFor: 'குழந்தைகளுடன் வரும் 3 முதல் 4 நபர்கள் கொண்ட குடும்பத்திற்கு ஏற்றது',
        features: ['மென்மையான வெல்வெட் மெத்தைகள்', 'குழந்தைகளுக்கான பிரத்யேக நாற்காலி', 'அகலமான உணவுக் கிண்ண மேசை', 'தனியுரிமை அமைப்பு']
      };
    } else if (count <= 6) {
      return {
        ...base,
        category: '6 இருக்கை குடும்ப விருந்து மேஜை',
        ambienceBadge: 'மையக் குடும்ப விருந்து மேஜை',
        zoneDescription: 'மைய உணவருந்தும் அரங்கம் • ஆம்பர் மண்டபம்',
        suitableFor: 'பெரிய குடும்பங்கள் மற்றும் நண்பர்கள் கூட்டத்திற்கு உகந்தது',
        features: ['தேக்கு மர விருந்து மேஜை', 'மைய சுழலும் தட்டு வசதி', 'பிரத்யேக சமையலறை ஓட்டப்பணியாளர்', 'அகலமான கவச நாற்காலிகள்']
      };
    } else {
      return {
        ...base,
        category: '10+ இருக்கை பிரம்மாண்ட ராயல் ராஜபோஜன மேஜை',
        ambienceBadge: 'பிரம்மாண்ட ராயல் பாங்க்வெட்',
        zoneDescription: 'முதல் தளம் • ராயல் மகாராஜா மண்டபம்',
        suitableFor: 'பிரம்மாண்ட விழாக்கள் மற்றும் பெரிய குடும்ப கொண்டாட்டங்களுக்கு ஏற்றது',
        features: ['360° சுழலும் லேசி சூசன் மேஜை', 'பிரத்யேக பிரிவு கேப்டன் சேவை', 'விஐபி ராஜபோஜன சூழல்', 'பல வகை உணவு தட்டு வடிவமைப்பு']
      };
    }
  }

  if (lang === 'hi') {
    if (count <= 2) {
      return {
        ...base,
        category: '2-सीटर शांत खिड़की वाली टेबल (गार्डन व्यू)',
        ambienceBadge: 'शांत युगल टेबल',
        zoneDescription: 'भूतल • शांत गार्डन विंडो कॉर्नर',
        suitableFor: 'एकल या युगल भोजन के लिए उपयुक्त',
        features: ['मनोरम गार्डन दृश्य', 'हल्की सुनहरी रोशनी', 'आरामदायक युगल व्यवस्था', 'त्वरित सेवा']
      };
    } else if (count <= 4) {
      return {
        ...base,
        category: '4-सीटर गद्देदार फैमिली बूथ',
        ambienceBadge: 'आरामदायक फैमिली बूथ',
        zoneDescription: 'पैवेलियन विंग • कम्फर्टेबल हाई-बैक बूथ',
        suitableFor: 'बच्चों वाले 3 से 4 सदस्यों के सामान्य परिवार के लिए सर्वोत्तम',
        features: ['आलीशान मखमली गद्दे', 'बच्चों की कुर्सी अनुकूल', 'विशाल टेबलटॉप', 'अर्ध-निजी स्थान']
      };
    } else if (count <= 6) {
      return {
        ...base,
        category: '6-सीटर फैमिली बैंक्वेट टेबल',
        ambienceBadge: 'सेंट्रल फैमिली बैंक्वेट',
        zoneDescription: 'मुख्य डाइनिंग हॉल • सेंट्रल एम्बर पैवेलियन',
        suitableFor: 'बड़े परिवारों और दोस्तों के समूह हेतु सर्वोत्तम',
        features: ['सागौन की लकड़ी की टेबल', 'घूमने वाली थाली तैयार', 'समर्पित किचन रनर', 'चौड़ी कुर्सियां']
      };
    } else {
      return {
        ...base,
        category: '10+ सीटर ग्रांड रॉयल शाही बैंक्वेट',
        ambienceBadge: 'भव्य शाही बैंक्वेट',
        zoneDescription: 'प्रथम तल • रॉयल महाराजा पैवेलियन',
        suitableFor: 'शाही उत्सव और भव्य परिवारों के लिए विशेष',
        features: ['360° घूमने वाली लेज़ी सुसान', 'समर्पित सेक्शन कैप्टन सेवा', 'वीआईपी माहौल', 'मल्टी-कोर्स व्यवस्था']
      };
    }
  }

  if (lang === 'te') {
    if (count <= 2) {
      return {
        ...base,
        category: '2-సీట్ల విండో టేబుల్ (గార్డెన్ వ్యూ)',
        ambienceBadge: 'ప్రశాంతమైన జంట టేబుల్',
        zoneDescription: 'గ్రౌండ్ ఫ్లోర్ • గార్డెన్ విండో కార్నర్',
        suitableFor: 'ఒంటరి లేదా జంటలకు అనుకూలమైనది',
        features: ['గార్డెన్ దృశ్యం', 'ఆహ్లాదకరమైన లైటింగ్', 'కాంపాక్ట్ సెటప్', 'వేగవంతమైన సర్వీస్']
      };
    } else if (count <= 4) {
      return {
        ...base,
        category: '4-సీట్ల సౌకర్యవంతమైన ఫ్యామిలీ బూత్',
        ambienceBadge: 'ఫ్యామిలీ బూత్',
        zoneDescription: 'పెవిలియన్ వింగ్ • హై-బ్యాక్ బూత్',
        suitableFor: '3-4 సభ్యుల సాధారణ కుటుంబానికి అనుకూలం',
        features: ['వెల్వెట్ కుషన్స్', 'పిల్లల కుర్చీ సదుపాయం', 'విశాలమైన టేబుల్', 'సెమీ-ప్రైవేట్ విభాగం']
      };
    } else if (count <= 6) {
      return {
        ...base,
        category: '6-సీట్ల ఫ్యామిలీ బాంక్వెట్ టేబుల్',
        ambienceBadge: 'సెంట్రల్ ఫ్యామిలీ బాంక్వెట్',
        zoneDescription: 'మెయిన్ డైనింగ్ ఆట్రియం • సెంట్రల్ అంబర్ పెవిలియన్',
        suitableFor: 'పెద్ద కుటుంబాలు మరియు స్నేహితుల సమూహాలకు తగినది',
        features: ['టేకువుడ్ బాంక్వెట్ టేబుల్', 'టర్న్‌టేబుల్ సదుపాయం', 'కిచెన్ రన్నర్ సేవలు', 'విశాలమైన కుర్చీలు']
      };
    } else {
      return {
        ...base,
        category: '10+ సీట్ల గ్రాండ్ రాయల్ ఇంపీరియల్ బాంక్వెట్',
        ambienceBadge: 'గ్రాండ్ రాయల్ బాంక్వెట్',
        zoneDescription: 'మొదటి అంతస్తు • రాయల్ మహారాజా పెవిలియన్',
        suitableFor: 'రాయల్ వేడుకలు మరియు గ్రాండ్ కుటుంబాల కొరకు',
        features: ['360° రొటేటింగ్ లేజీ సుసాన్', 'సెక్షన్ కెప్టెన్ సేవలు', 'వీఐపీ వాతావరణం', 'మల్టీ-కోర్స్ లేఅవుట్']
      };
    }
  }

  if (lang === 'es') {
    if (count <= 2) {
      return {
        ...base,
        category: 'Mesa de 2 Asientos Junto a la Ventana (Vista al Jardín)',
        ambienceBadge: 'Mesa Acogedora para Parejas',
        zoneDescription: 'Planta Baja • Rincón Tranquilo con Vista al Jardín',
        suitableFor: 'Perfecto para solitarios o parejas',
        features: ['Vista al Jardín', 'Iluminación Cálida', 'Montaje Compacto', 'Servicio Rápido']
      };
    } else if (count <= 4) {
      return {
        ...base,
        category: 'Cabina Familiar Acolchada de 4 Asientos',
        ambienceBadge: 'Cabina Familiar Confortable',
        zoneDescription: 'Ala del Pabellón • Cabina de Respaldo Alto',
        suitableFor: 'Ideal para familias estándar de 3 a 4 personas con niños',
        features: ['Cojines de Terciopelo', 'Apto para Silla de Bebé', 'Mesa Amplia', 'Espacio Semi-Privado']
      };
    } else if (count <= 6) {
      return {
        ...base,
        category: 'Mesa de Banquete Familiar de 6 Asientos',
        ambienceBadge: 'Banquete Familiar Central',
        zoneDescription: 'Atrio Principal • Pabellón Central Ámbar',
        suitableFor: 'Espacioso para familias numerosas y grupos de amigos',
        features: ['Mesa de Teca Maciza', 'Plato Giratorio Listo', 'Camarero Rápido Dedicado', 'Sillones Amplios']
      };
    } else {
      return {
        ...base,
        category: 'Gran Banquete Imperial Real para 10+ Asientos',
        ambienceBadge: 'Gran Banquete Real',
        zoneDescription: 'Primer Piso • Pabellón Real Maharaja',
        suitableFor: 'Mesa de fiesta de celebración real para grandes familias',
        features: ['Lazy Susan Giratorio 360°', 'Servicio de Capitán Dedicado', 'Ambiente VIP', 'Disposición de Múltiples Platos']
      };
    }
  }

  return base;
};
