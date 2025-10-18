import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { useLanguage } from "./contexts/languageContext";
import { useTheme } from "./contexts/themeContext";
import { useTranslation, Trans } from "react-i18next";
import { Helmet } from 'react-helmet';
import i18n from "./i18n";
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

function App() {
  const providedLanguages = ["en", "es", "fr", "de", "zh"];
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language).catch(() => {});
    }
  }, [language]);

  const advanceToNextLanguage = () => {
    const currentIndex = providedLanguages.indexOf(language);
    const nextIndex = (currentIndex + 1) % providedLanguages.length;
    setLanguage(providedLanguages[nextIndex]);
  };

  return (
    <div className="App">
      <Helmet>
	<link rel="stylesheet" href="/themes/${theme}.css" />
      </Helmet>
      <header className="App-header">
        <Image src={logo} className="App-logo" alt="logo" />
        <Button onClick={advanceToNextLanguage}>{language}</Button>
        <div style={{ marginTop: 12 }}>
          <span style={{ marginRight: 8 }}>Theme:</span>
          {["light", "dark", "solarized"].map((th) => (
            <Button
              id={th + 'Button'}
              key={th}
              name={th}
              onClick={() => setTheme(th)}
              style={{
                fontWeight: theme === th ? "700" : "400",
                marginRight: 6,
              }}
            >
              {th}
            </Button>
          ))}
        </div>
        <p>
          <Trans
            i18nKey="editFile"
            values={{ file: "src/App.tsx" }}
            components={[<code key="1" />]}
          />
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"          
          id="learnReactLink"
        >
          {t("learnReact")}
        </a>
      </header>
    </div>
  );
}

export default App;
