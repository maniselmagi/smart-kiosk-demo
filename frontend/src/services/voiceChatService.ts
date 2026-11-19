// Voice Chat Service for Kio AI with Multi-Language Speech Recognition (STT) and Speech Synthesis (TTS)

export interface VoiceLangConfig {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  listeningText: string;
  speakingPrompt: string;
  tapToStop: string;
  speakToKio: string;
  unsupportedText: string;
  micDeniedText: string;
  speechHeardText: string;
  voiceSamplePrompts: string[];
}

export const VOICE_LANG_MAP: Record<string, VoiceLangConfig> = {
  en: {
    code: 'en-IN',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    listeningText: 'Listening in English... Speak your question now',
    speakingPrompt: 'Speak now (e.g. "What are your signature dishes?", "Call waiter")',
    tapToStop: 'Send Voice Query',
    speakToKio: 'Voice Chat (Speak to Kio)',
    unsupportedText: 'Voice recognition is not supported in this browser. Please use text typing.',
    micDeniedText: 'Microphone permission denied. Please allow microphone access in your browser or app settings.',
    speechHeardText: 'Heard:',
    voiceSamplePrompts: [
      'Show Signature dishes',
      'Call the waiter',
      'What are top rated items?',
      'Any mild food for kids?',
      'What are your opening hours?'
    ]
  },
  ta: {
    code: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    listeningText: 'தமிழில் கேட்கிறது... இப்போது உங்கள் கேள்வியைப் பேசுங்கள்',
    speakingPrompt: 'இப்போது பேசுங்கள் (எ.கா. "சிறப்பு உணவுகள் என்ன?", "வெயிட்டரை அழைக்க")',
    tapToStop: 'குரல் கேள்வியை அனுப்பவும்',
    speakToKio: 'குரல் வழி உரையாடல் (கியோவிடம் பேசவும்)',
    unsupportedText: 'இந்த உலாவியில் குரல் அறிதல் ஆதரிக்கப்படவில்லை. கீழே உள்ள குரல் தேர்வுகளைப் பயன்படுத்தலாம்.',
    micDeniedText: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. தயவுசெய்து அமைப்புகளில் மைக்ரோஃபோனை அனுமதிக்கவும்.',
    speechHeardText: 'கேட்டது:',
    voiceSamplePrompts: [
      'சிறப்பு உணவுகள் என்ன?',
      'வெயிட்டரை அழைக்கவும்',
      'அதிக ரேட்டிங் பெற்றவை எவை?',
      'குழந்தைகளுக்கான காரமற்ற உணவுகள்?',
      'உணவக நேரம் என்ன?'
    ]
  },
  hi: {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    listeningText: 'हिन्दी में सुन रहा हूँ... अब अपना सवाल बोलें',
    speakingPrompt: 'अब बोलें (उदा. "सिग्नेचर डिश कौन सी हैं?", "वेटर को बुलाओ")',
    tapToStop: 'वॉयस सवाल भेजें',
    speakToKio: 'वॉयस चैट (कियो से बात करें)',
    unsupportedText: 'इस ब्राउज़र में वॉयस पहचान समर्थित नहीं है। नीचे दिए गए विकल्पों पर टैप करें।',
    micDeniedText: 'माइक्रोफ़ोन की अनुमति अस्वीकृत। कृपया सेटिंग्स में माइक्रोफ़ोन की अनुमति दें।',
    speechHeardText: 'सुना गया:',
    voiceSamplePrompts: [
      'सिग्नेचर डिश कौन सी हैं?',
      'वेटर को बुलाओ',
      'टॉप रेटेड खाना दिखाओ',
      'बच्चों के लिए कम तीखा क्या है?',
      'खुलने का समय क्या है?'
    ]
  },
  te: {
    code: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    listeningText: 'తెలుగులో వింటోంది... ఇప్పుడు మీ ప్రశ్న మాట్లాడండి',
    speakingPrompt: 'ఇప్పుడు మాట్లాడండి (ఉదా. "సిగ్నేచర్ వంటకాలు ఏమిటి?", "సర్వర్‌ను పిలవండి")',
    tapToStop: 'వాయిస్ ప్రశ్న పంపండి',
    speakToKio: 'వాయిస్ చాట్ (కియోతో మాట్లాడండి)',
    unsupportedText: 'ఈ బ్రౌజర్‌లో వాయిస్ గుర్తింపు మద్దతు లేదు. క్రింది ప్రశ్నలను ఎంచుకోండి.',
    micDeniedText: 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి అనుమతించండి.',
    speechHeardText: 'విన్నది:',
    voiceSamplePrompts: [
      'సిగ్నేచర్ వంటకాలు ఏమిటి?',
      'సర్వర్‌ను పిలవండి',
      'టాప్ రేటెడ్ ఆహారాలు?',
      'పిల్లల కోసం తక్కువ కారం ఏముంది?',
      'రెస్టారెంట్ సమయాలు ఏమిటి?'
    ]
  },
  kn: {
    code: 'kn-IN',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    listeningText: 'ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ... ಈಗ ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಮಾತನಾಡಿ',
    speakingPrompt: 'ಈಗ ಮಾತನಾಡಿ (ಉದಾ. "ವಿಶೇಷ ಖಾದ್ಯಗಳು ಯಾವುವು?", "ವೈಟರ್ ಕರೆಯಿರಿ")',
    tapToStop: 'ಧ್ವನಿ ಪ್ರಶ್ನೆ ಕಳುಹಿಸಿ',
    speakToKio: 'ಧ್ವನಿ ಸಂಭಾಷಣೆ (ಕಿಯೋ ಜೊತೆ ಮಾತನಾಡಿ)',
    unsupportedText: 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ.',
    micDeniedText: 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ.',
    speechHeardText: 'ಕೇಳಿಸಿದ್ದು:',
    voiceSamplePrompts: [
      'ವಿಶೇಷ ಭಕ್ಷ್ಯಗಳು ಯಾವುವು?',
      'ವೈಟರ್ ಕರೆಯಿರಿ',
      'ಟಾಪ್ ರೇಟೆಡ್ ಊಟ ಯಾವುದು?',
      'ಮಕ್ಕಳಿಗೆ ಕಡಿಮೆ ಖಾರದ ಊಟ?',
      'ತೆರೆಯುವ ಸಮಯವೇನು?'
    ]
  },
  ml: {
    code: 'ml-IN',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    listeningText: 'മലയാളത്തിൽ ശ്രദ്ധിക്കുന്നു... ഇപ്പോൾ നിങ്ങളുടെ ചോദ്യം സംസാരിക്കൂ',
    speakingPrompt: 'ഇപ്പോൾ സംസാരിക്കൂ (ഉദാ. "പ്രത്യേക വിഭവങ്ങൾ ഏതാണ്?", "വെയിറ്ററെ വിളിക്കുക")',
    tapToStop: 'വോയ്‌സ് ചോദ്യം അയയ്ക്കുക',
    speakToKio: 'വോയ്‌സ് ചാറ്റ് (കിയോയോട് സംസാരിക്കൂ)',
    unsupportedText: 'ഈ ബ്രൗസറിൽ വോയ്‌സ് തിരിച്ചറിയൽ ലഭ്യമല്ല.',
    micDeniedText: 'മൈക്രോഫോൺ അനുമതി നിരസിച്ചു.',
    speechHeardText: 'കേട്ടത്:',
    voiceSamplePrompts: [
      'പ്രത്യേക വിഭവങ്ങൾ ഏതാണ്?',
      'വെയിറ്ററെ വിളിക്കുക',
      'ടോപ്പ് റേറ്റഡ് ഭക്ഷണം ഏതാണ്?',
      'കുട്ടികൾക്ക് അനുയോജ്യമായ വിഭവങ്ങൾ?',
      'തുറക്കുന്ന സമയം എപ്പോഴാണ്?'
    ]
  },
  mr: {
    code: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    listeningText: 'मराठीमध्ये ऐकत आहे... आता आपला प्रश्न बोला',
    speakingPrompt: 'आता बोला (उदा. "खास पदार्थ कोणते आहेत?", "वेटरला बोलवा")',
    tapToStop: 'व्हॉइस प्रश्न पाठवा',
    speakToKio: 'व्हॉइस चॅट (किओशी बोला)',
    unsupportedText: 'या ब्राउझरमध्ये व्हॉइस ओळख समर्थित नाही.',
    micDeniedText: 'मायक्रोफोन परवानगी नाकारली.',
    speechHeardText: 'ऐकले:',
    voiceSamplePrompts: [
      'खास पदार्थ कोणते आहेत?',
      'वेटरला बोलवा',
      'टॉप रेटेड जेवण दाखवा',
      'मुलांसाठी कमी तिखट काय आहे?',
      'रेस्टॉरंट वेळ काय आहे?'
    ]
  },
  es: {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    listeningText: 'Escuchando en español... Hable ahora',
    speakingPrompt: 'Hable ahora (ej. "¿Cuáles son los platos estrella?", "Llamar camarero")',
    tapToStop: 'Enviar consulta de voz',
    speakToKio: 'Chat de Voz (Habla con Kio)',
    unsupportedText: 'Reconocimiento de voz no compatible en este navegador.',
    micDeniedText: 'Permiso de micrófono denegado.',
    speechHeardText: 'Escuchado:',
    voiceSamplePrompts: [
      '¿Cuáles son los platos estrella?',
      'Llamar al camarero',
      'Comida mejor valorada',
      '¿Opciones para niños?',
      '¿Horario del restaurante?'
    ]
  },
  fr: {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    listeningText: 'Écoute en français... Posez votre question maintenant',
    speakingPrompt: 'Parlez maintenant (ex. "Quels sont vos plats signatures ?", "Appeler serveur")',
    tapToStop: 'Envoyer la question vocale',
    speakToKio: 'Chat Vocal (Parler à Kio)',
    unsupportedText: 'Reconnaissance vocale non prise en charge sur ce navigateur.',
    micDeniedText: 'Autorisation du microphone refusée.',
    speechHeardText: 'Entendu :',
    voiceSamplePrompts: [
      'Quels sont vos plats signatures ?',
      'Appeler le serveur',
      'Plats les mieux notés',
      'Options douces pour enfants',
      'Horaires d’ouverture ?'
    ]
  },
  ar: {
    code: 'ar-SA',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    listeningText: 'جارٍ الاستماع بالعربية... تكلّم بسؤالك الآن',
    speakingPrompt: 'تكلّم الآن (مثال: "ما هي الأطباق الخاصة؟", "نداء المضيف")',
    tapToStop: 'إرسال السؤال الصوتي',
    speakToKio: 'المحادثة الصوتية (تحدث مع كيو)',
    unsupportedText: 'التعرف على الصوت غير مدعوم في هذا المتصفح.',
    micDeniedText: 'تم رفض إذن الميكروفون.',
    speechHeardText: 'تم سماع:',
    voiceSamplePrompts: [
      'ما هي الأطباق الخاصة؟',
      'نداء المضيف للخدمة',
      'الأطباق الأعلى تقييماً',
      'وجبات خفيفة للأطفال',
      'ما هي مواعيد العمل؟'
    ]
  },
  ko: {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    listeningText: '한국어로 듣고 있습니다... 질문을 말씀해 주세요',
    speakingPrompt: '지금 말씀해 주세요 (예: "시그니처 메뉴가 뭐예요?", "직원 호출")',
    tapToStop: '음성 질문 전송',
    speakToKio: '음성 대화 (키오에게 말하기)',
    unsupportedText: '이 브라우저에서는 음성 인식이 지원되지 않습니다.',
    micDeniedText: '마이크 권한이 거부되었습니다.',
    speechHeardText: '인식된 내용:',
    voiceSamplePrompts: [
      '시그니처 메뉴가 뭐예요?',
      '직원 호출해 주세요',
      '최고 인기 메뉴 추천해줘',
      '아이용 순한 음식 있어요?',
      '영업시간 알려주세요'
    ]
  },
};

export const getVoiceConfig = (lang: string = 'en'): VoiceLangConfig => {
  return VOICE_LANG_MAP[lang] || VOICE_LANG_MAP['en'];
};

// Check if Web Speech Recognition is available
export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
  );
};

// Explicitly request microphone access from browser / WebView
export const requestMicPermission = async (): Promise<boolean> => {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return false;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Keep tracks alive briefly or release
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (err) {
    console.warn('Microphone permission request failed:', err);
    return false;
  }
};

// Interface for Browser Speech Recognition
export interface IBrowserSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

// Factory to create a speech recognition instance
export const createSpeechRecognition = (lang: string = 'en'): IBrowserSpeechRecognition | null => {
  if (typeof window === 'undefined') return null;

  const SpeechConstructor = (
    (window as unknown as { SpeechRecognition?: new () => IBrowserSpeechRecognition }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: new () => IBrowserSpeechRecognition }).webkitSpeechRecognition
  );

  if (!SpeechConstructor) return null;

  try {
    const recognition = new SpeechConstructor();
    const config = getVoiceConfig(lang);
    recognition.lang = config.code;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    return recognition;
  } catch (err) {
    console.error('Failed to create SpeechRecognition instance:', err);
    return null;
  }
};

// Text-to-Speech (TTS) synthesizer
export const speakWithVoice = (text: string, lang: string = 'en') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();

    // Strip markdown formatting, special symbols, and emojis for clean, natural speech
    const cleanText = text
      .replace(/[*#_`~]/g, '')
      .replace(/₹/g, 'Rupees ')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetCode = getVoiceConfig(lang).code;
    utterance.lang = targetCode;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(
      v => v.lang === targetCode || v.lang.replace('_', '-').startsWith(targetCode.slice(0, 2))
    );
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis warning:', err);
  }
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
