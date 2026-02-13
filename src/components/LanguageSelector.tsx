import { Languages } from 'lucide-react';
import { Language } from '../App';

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const languages: { code: Language; name: string; nativeName: string; region?: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'ha', name: 'Hausa', nativeName: 'Hausa', region: '🇳🇬' },
    { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', region: '🇳🇬' },
    { code: 'ig', name: 'Igbo', nativeName: 'Igbo', region: '🇳🇬' },
    { code: 'pcm', name: 'Nigerian Pidgin', nativeName: 'Naija Pidgin', region: '🇳🇬' },
    { code: 'ff', name: 'Fulfulde', nativeName: 'Fulfulde', region: '🇳🇬' },
    { code: 'kr', name: 'Kanuri', nativeName: 'Kanuri', region: '🇳🇬' },
    { code: 'ibb', name: 'Ibibio', nativeName: 'Ibibio', region: '🇳🇬' },
    { code: 'tiv', name: 'Tiv', nativeName: 'Tiv', region: '🇳🇬' },
    { code: 'ijc', name: 'Ijaw', nativeName: 'Ịjọ', region: '🇳🇬' },
    { code: 'bin', name: 'Edo', nativeName: 'Ẹdo', region: '🇳🇬' }
  ];

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <Languages className="w-4 h-4" />
        Language
      </label>
      <select
        value={language}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        className="w-56 px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.region ? `${lang.region} ` : ''}{lang.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}
