import { Languages } from 'lucide-react';
import { Language } from '../App';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Espanol' },
    { code: 'fr', name: 'French', nativeName: 'Francais' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese', nativeName: 'Chinese' },
    { code: 'ar', name: 'Arabic', nativeName: 'Arabic' },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yoruba' },
    { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
    { code: 'pcm', name: 'Nigerian Pidgin', nativeName: 'Naija Pidgin' },
    { code: 'ff', name: 'Fulfulde', nativeName: 'Fulfulde' },
    { code: 'kr', name: 'Kanuri', nativeName: 'Kanuri' },
    { code: 'ibb', name: 'Ibibio', nativeName: 'Ibibio' },
    { code: 'tiv', name: 'Tiv', nativeName: 'Tiv' },
    { code: 'ijc', name: 'Ijaw', nativeName: 'Ijaw' },
    { code: 'bin', name: 'Edo', nativeName: 'Edo' }
  ];

  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/95 px-3 py-2 text-sm shadow-sm">
      <Languages className="h-4 w-4 text-[#116db8]" />
      <select
        aria-label="Language"
        value={language}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="max-w-[130px] cursor-pointer appearance-none bg-transparent pr-2 font-semibold text-[#0f4f84] outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}
