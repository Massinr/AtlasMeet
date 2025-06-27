import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Translations
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.signIn': 'Sign In',
    'nav.updates': 'Updates',
    'nav.credits': 'Credits',
    
    // Hero Section
    'hero.title': 'AtlasMeet',
    'hero.subtitle': 'Where Learning Meets Opportunity',
    'hero.description': 'Connect teachers with students through seamless event management. Create, discover, and join educational events that inspire growth and learning.',
    'hero.teacherButton': "I'm a Teacher",
    'hero.studentButton': "I'm a Student",
    
    // Events
    'events.upcoming': 'Upcoming Events',
    'events.recentlyCompleted': 'Recently Completed Events',
    'events.viewAll': 'Join AtlasMeet to View All Events',
    'events.active': 'Active',
    'events.completed': 'Completed',
    'events.by': 'by',
    'events.registered': 'registered',
    'events.participants': 'participants',
    'events.virtual': 'Virtual Event',
    
    // Modals
    'modal.recentUpdates': 'Recent Updates',
    'modal.credits': 'Credits & Acknowledgments',
    'modal.close': 'Close',
    'modal.followUpdates': 'Follow for More Updates',
    'modal.visitProfile': 'Visit Instagram Profile',
    
    // Updates
    'updates.v1Released': 'AtlasMeet v1.0 Released!',
    'updates.v1Description': 'Complete event management platform with teacher-student matching, real-time notifications, and seamless event creation.',
    'updates.newFeatures': 'New Features Added',
    'updates.performance': 'Performance Improvements',
    'updates.performanceDescription': 'Enhanced loading speeds, better mobile responsiveness, and improved user experience across all devices.',
    'updates.languageSupport': 'Multi-language Support',
    'updates.languageDescription': 'Added support for English and French languages with easy language switching.',
    
    // Credits
    'credits.developer': 'Developer',
    'credits.developerDescription': 'Massine - Full-stack developer and creator of AtlasMeet',
    'credits.technologies': 'Technologies Used',
    'credits.design': 'Design Inspiration',
    'credits.designDescription': 'Modern glass morphism design with smooth animations and intuitive user experience.',
    'credits.connect': 'Connect',
    'credits.connectDescription': 'Follow the developer for updates, behind-the-scenes content, and more projects!',
    
    // Language
    'language.english': 'English',
    'language.french': 'Français',
    'language.switch': 'Switch Language',
  },
  fr: {
    // Navigation
    'nav.signIn': 'Se Connecter',
    'nav.updates': 'Mises à Jour',
    'nav.credits': 'Crédits',
    
    // Hero Section
    'hero.title': 'AtlasMeet',
    'hero.subtitle': 'Où l\'Apprentissage Rencontre l\'Opportunité',
    'hero.description': 'Connectez les enseignants avec les étudiants grâce à une gestion d\'événements transparente. Créez, découvrez et rejoignez des événements éducatifs qui inspirent la croissance et l\'apprentissage.',
    'hero.teacherButton': 'Je suis un Enseignant',
    'hero.studentButton': 'Je suis un Étudiant',
    
    // Events
    'events.upcoming': 'Événements à Venir',
    'events.recentlyCompleted': 'Événements Récemment Terminés',
    'events.viewAll': 'Rejoignez AtlasMeet pour Voir Tous les Événements',
    'events.active': 'Actif',
    'events.completed': 'Terminé',
    'events.by': 'par',
    'events.registered': 'inscrits',
    'events.participants': 'participants',
    'events.virtual': 'Événement Virtuel',
    
    // Modals
    'modal.recentUpdates': 'Mises à Jour Récentes',
    'modal.credits': 'Crédits et Remerciements',
    'modal.close': 'Fermer',
    'modal.followUpdates': 'Suivre pour Plus de Mises à Jour',
    'modal.visitProfile': 'Visiter le Profil Instagram',
    
    // Updates
    'updates.v1Released': 'AtlasMeet v1.0 Sorti !',
    'updates.v1Description': 'Plateforme complète de gestion d\'événements avec mise en relation enseignant-étudiant, notifications en temps réel et création d\'événements transparente.',
    'updates.newFeatures': 'Nouvelles Fonctionnalités Ajoutées',
    'updates.performance': 'Améliorations de Performance',
    'updates.performanceDescription': 'Vitesses de chargement améliorées, meilleure réactivité mobile et expérience utilisateur améliorée sur tous les appareils.',
    'updates.languageSupport': 'Support Multi-langues',
    'updates.languageDescription': 'Ajout du support pour les langues anglaise et française avec changement de langue facile.',
    
    // Credits
    'credits.developer': 'Développeur',
    'credits.developerDescription': 'Massine - Développeur full-stack et créateur d\'AtlasMeet',
    'credits.technologies': 'Technologies Utilisées',
    'credits.design': 'Inspiration de Design',
    'credits.designDescription': 'Design moderne en glassmorphisme avec des animations fluides et une expérience utilisateur intuitive.',
    'credits.connect': 'Se Connecter',
    'credits.connectDescription': 'Suivez le développeur pour les mises à jour, le contenu en coulisses et plus de projets !',
    
    // Language
    'language.english': 'English',
    'language.french': 'Français',
    'language.switch': 'Changer de Langue',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('atlasmeet_language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('atlasmeet_language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t,
    }}>
      {children}
    </LanguageContext.Provider>
  );
}; 