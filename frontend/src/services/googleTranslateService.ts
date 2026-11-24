/**
 * Google Translate Real-Time Dynamic Translation Service
 * 
 * Translates all content across all screens dynamically using Google Translate,
 * without relying on hardcoded dictionary files.
 */

class GoogleTranslateService {
  private currentLanguage: string = 'en';
  private isInitialized: boolean = false;
  private cache: Map<string, string> = new Map();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadCache();
    }
  }

  private loadCache() {
    try {
      const raw = localStorage.getItem('royal_ember_gt_cache');
      if (raw) {
        const parsed = JSON.parse(raw);
        Object.entries(parsed).forEach(([k, v]) => {
          this.cache.set(k, v as string);
        });
      }
    } catch {
      // safe fallback
    }
  }

  private saveCache() {
    try {
      const obj: Record<string, string> = {};
      this.cache.forEach((v, k) => {
        obj[k] = v;
      });
      localStorage.setItem('royal_ember_gt_cache', JSON.stringify(obj));
    } catch {
      // safe fallback
    }
  }

  /**
   * Initialize Google Translate script and React DOM protection
   */
  public init() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.isInitialized = true;

    // 1. React DOM Protection: Prevent React from crashing when Google Translate wraps DOM nodes in <font> tags
    if (typeof Node === 'function' && Node.prototype) {
      const proto = Node.prototype as any;
      const origRemove = proto.removeChild;
      proto.removeChild = function (child: any): any {
        if (child && child.parentNode !== this) {
          return child;
        }
        return origRemove.apply(this, arguments);
      };

      const origInsert = proto.insertBefore;
      proto.insertBefore = function (newNode: any, refNode: any): any {
        if (refNode && refNode.parentNode !== this) {
          return newNode;
        }
        return origInsert.apply(this, arguments);
      };
    }

    // 2. Register global callback for Google Translate Element Init
    (window as any).googleTranslateElementInit = () => {
      const google = (window as any).google;
      if (google && google.translate && google.translate.TranslateElement) {
        new google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'ar,de,en,es,fr,hi,kn,ko,ml,mr,ta,te',
            autoDisplay: false
          },
          'google_translate_element'
        );

        // Apply saved language once initialized
        const saved = localStorage.getItem('orderease_kiosk_language') || 'en';
        if (saved && saved !== 'en') {
          setTimeout(() => this.applyLanguage(saved), 300);
        }
      }
    };

    // 3. Inject Google Translate script if not already in document
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.head.appendChild(script);
    }
  }

  /**
   * Programmatically switch Google Translate language
   */
  public applyLanguage(targetLang: string) {
    if (typeof window === 'undefined') return;
    this.currentLanguage = targetLang;

    const hostname = window.location.hostname;
    const paths = ['/', '/kiosk', '/kiosk/', '/smart-kiosk-demo', '/smart-kiosk-demo/', window.location.pathname];
    const domains = [
      '',
      hostname,
      `.${hostname}`
    ];
    const parts = hostname.split('.');
    if (parts.length > 1) {
      domains.push(`.${parts.slice(-2).join('.')}`);
    }

    if (targetLang === 'en') {
      // 1. Completely clear all googtrans cookies across all domains and paths
      domains.forEach((d) => {
        paths.forEach((p) => {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${p};${d ? ` domain=${d};` : ''}`;
          document.cookie = `googtrans=; Max-Age=-99999999; path=${p};${d ? ` domain=${d};` : ''}`;
        });
      });

      // 2. Clear sessionStorage and localStorage for Google Translate
      try {
        sessionStorage.removeItem('googtrans');
        localStorage.removeItem('googtrans');
      } catch {}

      // 3. Remove Google Translate classes and attributes from html & body
      document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
      document.body.classList.remove('translated-ltr', 'translated-rtl');
      document.documentElement.removeAttribute('lang');
      document.documentElement.removeAttribute('dir');
      document.documentElement.setAttribute('lang', 'en');

      // 4. Reset Google Translate select element (.goog-te-combo)
      const triggerResetCombo = () => {
        const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
        if (combo) {
          combo.value = '';
          if (typeof (combo as any).onchange === 'function') {
            try { (combo as any).onchange(); } catch {}
          }
          combo.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
        return false;
      };

      // 5. Try clicking the "Show original" button inside the Google Translate iframe if open
      try {
        const iframes = document.querySelectorAll<HTMLIFrameElement>('.goog-te-banner-frame, iframe[class*="goog"]');
        iframes.forEach((iframe) => {
          try {
            const doc = iframe.contentDocument || iframe.contentWindow?.document;
            const btn = doc?.querySelector<HTMLElement>('.goog-te-button button, [id*="restore"]');
            if (btn) btn.click();
          } catch {}
        });
      } catch {}

      // 6. Strip any leftover <font> wrapper tags inserted into the DOM by Google Translate
      try {
        const fonts = document.querySelectorAll('font');
        fonts.forEach((font) => {
          const parent = font.parentNode;
          if (parent) {
            while (font.firstChild) {
              parent.insertBefore(font.firstChild, font);
            }
            parent.removeChild(font);
          }
        });
      } catch {}

      if (!triggerResetCombo()) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (triggerResetCombo() || attempts > 20) {
            clearInterval(interval);
          }
        }, 150);
      }

      return;
    }

    // For non-English target language:
    const cookieVal = `/en/${targetLang}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    if (hostname && hostname !== 'localhost') {
      document.cookie = `googtrans=${cookieVal}; domain=${hostname}; path=/;`;
      if (parts.length > 1) {
        document.cookie = `googtrans=${cookieVal}; domain=.${parts.slice(-2).join('.')}; path=/;`;
      }
    }

    // Trigger select element injected by Google Translate
    const triggerCombo = () => {
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        combo.value = targetLang;
        combo.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
      return false;
    };

    if (!triggerCombo()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (triggerCombo() || attempts > 25) {
          clearInterval(interval);
        }
      }, 150);
    }
  }

  /**
   * Force Google Translate to re-scan and translate freshly rendered React components
   */
  public refresh() {
    if (this.currentLanguage && this.currentLanguage !== 'en') {
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        combo.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  /**
   * Dynamic on-the-fly text translation (for AI Chat, Voice Chat TTS, and dynamic strings)
   * Uses real-time translation with persistent caching.
   */
  public async translateText(text: string, targetLang: string): Promise<string> {
    if (!text || !text.trim() || targetLang === 'en') {
      return text;
    }

    const cacheKey = `${targetLang}:${text.trim()}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // MyMemory Public Translation API for dynamic text nodes & chat
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.trim())}&langpair=en|${targetLang}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const translated = data?.responseData?.translatedText;
        if (translated && typeof translated === 'string' && !translated.startsWith('MYMEMORY WARNING')) {
          this.cache.set(cacheKey, translated);
          this.saveCache();
          return translated;
        }
      }
    } catch (e) {
      console.warn('[GoogleTranslateService] Dynamic translation error:', e);
    }

    return text;
  }

  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }
}

export const googleTranslateService = new GoogleTranslateService();
