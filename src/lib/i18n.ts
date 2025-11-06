import { useState } from 'react';
import { analytics } from './monitoring';

export type Language = 'fr' | 'en';

const LANGUAGE_KEY = 'gaiashield_language';

export const translations = {
  fr: {
    // Header
    appTitle: 'GaiaShield',
    appSubtitle: 'Assistant de résilience pour PME - Protégez votre entreprise avec l\'IA',
    appTagline: 'GEF2025 Hackathon - The AI-Powered Entrepreneur',
    
    // Tabs
    climateGuard: 'Climate Guard',
    businessShield: 'Business Shield',
    cyberProtect: 'CyberProtect',
    history: 'Historique',
    
    // Resilience Score
    globalResilienceScore: 'Score de Résilience Global',
    combinedEvaluation: 'Évaluation combinée des 3 modules',
    exportPDF: 'Export PDF',
    excellent: 'Excellent',
    average: 'Moyen',
    low: 'Faible',
    improving: 'En amélioration',
    stable: 'Stable',
    needsAttention: 'Nécessite attention',
    lastUpdate: 'Dernière mise à jour',
    overallScore: 'Score Global',
    progress: 'Progression',
    
    // Timeline
    alertHistory: 'Historique des Alertes',
    analysesPerformed: 'analyse effectuée',
    analysesPerformedPlural: 'analyses effectuées',
    noAnalysisYet: 'Aucune analyse effectuée pour le moment',
    pastAnalysesWillAppear: 'Les analyses passées apparaîtront ici',
    justNow: 'À l\'instant',
    minutesAgo: 'Il y a {count} min',
    hoursAgo: 'Il y a {count}h',
    daysAgo: 'Il y a {count}j',
    confidence: 'Confiance',
    
    // Task Form
    enterJSON: 'Entrez les données JSON',
    loadSample: 'Charger exemple',
    analyze: 'Analyser',
    analyzing: 'Analyse en cours...',
    uploadCSV: 'Importer CSV',
    
    // Result Card
    analysisResult: 'Résultat de l\'analyse',
    waitingForAnalysis: 'En attente d\'analyse...',
    submitDataToSee: 'Soumettez des données pour voir les résultats',
    findings: 'Constats',
    recommendations: 'Recommandations',
    actions: 'Actions',
    notes: 'Notes',
    
    // Risk Levels
    critical: 'Critique',
    high: 'Élevé',
    medium: 'Moyen',
    unknown: 'Inconnu',
    
    // Actions
    block: 'Bloquer',
    quarantine: 'Mettre en quarantaine',
    ignore: 'Ignorer',
    optimize: 'Optimiser',
    alert: 'Alerter',
    
    // Classifications
    safe: 'Sûr',
    suspicious: 'Suspect',
    malicious: 'Malveillant',
    
    // Common
    climate: 'Climate',
    business: 'Business',
    cyber: 'Cyber',
    score: 'Score',
    severity: 'Sévérité',
    action: 'Action',
    classification: 'Classification',
    recommendation: 'Recommandation',
    language: 'fr',
  },
  en: {
    // Header
    appTitle: 'GaiaShield',
    appSubtitle: 'SME Resilience Assistant - Protect Your Business with AI',
    appTagline: 'GEF2025 Hackathon - The AI-Powered Entrepreneur',
    
    // Tabs
    climateGuard: 'Climate Guard',
    businessShield: 'Business Shield',
    cyberProtect: 'CyberProtect',
    history: 'History',
    
    // Resilience Score
    globalResilienceScore: 'Global Resilience Score',
    combinedEvaluation: 'Combined evaluation of 3 modules',
    exportPDF: 'Export PDF',
    excellent: 'Excellent',
    average: 'Average',
    low: 'Low',
    improving: 'Improving',
    stable: 'Stable',
    needsAttention: 'Needs attention',
    lastUpdate: 'Last update',
    overallScore: 'Overall Score',
    progress: 'Progress',
    
    // Timeline
    alertHistory: 'Alert History',
    analysesPerformed: 'analysis performed',
    analysesPerformedPlural: 'analyses performed',
    noAnalysisYet: 'No analysis performed yet',
    pastAnalysesWillAppear: 'Past analyses will appear here',
    justNow: 'Just now',
    minutesAgo: '{count} min ago',
    hoursAgo: '{count}h ago',
    daysAgo: '{count}d ago',
    confidence: 'Confidence',
    
    // Task Form
    enterJSON: 'Enter JSON data',
    loadSample: 'Load sample',
    analyze: 'Analyze',
    analyzing: 'Analyzing...',
    uploadCSV: 'Upload CSV',
    
    // Result Card
    analysisResult: 'Analysis Result',
    waitingForAnalysis: 'Waiting for analysis...',
    submitDataToSee: 'Submit data to see results',
    findings: 'Findings',
    recommendations: 'Recommendations',
    actions: 'Actions',
    notes: 'Notes',
    
    // Risk Levels
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    unknown: 'Unknown',
    
    // Actions
    block: 'Block',
    quarantine: 'Quarantine',
    ignore: 'Ignore',
    optimize: 'Optimize',
    alert: 'Alert',
    
    // Classifications
    safe: 'Safe',
    suspicious: 'Suspicious',
    malicious: 'Malicious',
    
    // Common
    climate: 'Climate',
    business: 'Business',
    cyber: 'Cyber',
    score: 'Score',
    severity: 'Severity',
    action: 'Action',
    classification: 'Classification',
    recommendation: 'Recommendation',
    language: 'en',
  },
};

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_KEY);
    return (stored === 'en' || stored === 'fr') ? stored : 'fr';
  });

  const t = (key: keyof typeof translations.fr, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        text = text.replace(`{${param}}`, String(value));
      });
    }
    
    return text;
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
    analytics.trackLanguageChange(lang);
  };

  return { t, language, changeLanguage };
}
