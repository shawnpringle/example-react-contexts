import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      editFile: 'Edit <1>{{file}}</1> and save to reload.',
      learnReact: 'Learn React'
    }
  },
  fr: {
    translation: {
      editFile: 'Éditer <1>{{file}}</1> et enregistrer pour recharger.',
      learnReact: 'Apprendre React'
    }
  },
  es: {
    translation: {
      editFile: 'Editar <1>{{file}}</1> y guarda para recargar.',
      learnReact: 'Aprende React'
    }
  },
  de: {
    translation: {
      editFile: 'Bearbeiten <1>{{file}}</1> und speichern zum Neuladen.',
      learnReact: 'Lerne React'
    }
  },
  zh: {
    translation: {
      editFile: '编辑 <1>{{file}}</1> 并保存以重新加载。',
      learnReact: '学习 React'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
