import React from 'react';
import { Globe } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import '../styles/LanguageSelector.css';

// list of languages we support
const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ja', name: '日本語' }
];

const LanguageSelector = () => {
    const { language, setLanguage } = useGlobalContext();

    return (
        <div className="language-selector">
            <Globe size={18} className="lang-icon" />
            {/* dropdown for picking language */}
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="lang-dropdown"
            >
                {/* creating options from the list */}
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;
