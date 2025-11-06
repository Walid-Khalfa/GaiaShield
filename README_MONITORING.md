# 📊 GaiaShield Monitoring Guide

## Overview

GaiaShield intègre deux solutions de monitoring professionnelles :
- **Sentry** : Tracking d'erreurs et performance monitoring
- **PostHog** : Analytics utilisateur et product analytics

## 🔧 Configuration

### 1. Sentry Setup

#### Backend (Node.js)
```bash
# Variables d'environnement dans server/.env
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
```

#### Frontend (React)
```bash
# Variables d'environnement dans .env
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id
VITE_SENTRY_ENVIRONMENT=production
```

#### Obtenir votre DSN Sentry
1. Créer un compte sur [sentry.io](https://sentry.io)
2. Créer un nouveau projet (Node.js pour backend, React pour frontend)
3. Copier le DSN fourni
4. Ajouter les variables d'environnement

### 2. PostHog Setup

```bash
# Variables d'environnement dans .env
VITE_POSTHOG_KEY=phc_your_project_key
VITE_POSTHOG_HOST=https://app.posthog.com
```

#### Obtenir votre clé PostHog
1. Créer un compte sur [posthog.com](https://posthog.com)
2. Créer un nouveau projet
3. Copier la clé de projet (Project API Key)
4. Ajouter les variables d'environnement

## 📈 Fonctionnalités de Monitoring

### Sentry - Error Tracking

**Backend :**
- ✅ Capture automatique des erreurs non gérées
- ✅ Tracking des requêtes HTTP
- ✅ Performance monitoring avec traces
- ✅ Profiling des performances
- ✅ Sanitization des données sensibles (headers, cookies)
- ✅ Context enrichi avec timestamps

**Frontend :**
- ✅ Capture des erreurs React
- ✅ Browser tracing pour performance
- ✅ Session replay (10% des sessions, 100% des erreurs)
- ✅ Filtrage des erreurs non-critiques en dev
- ✅ Breadcrumbs pour contexte d'erreur

### PostHog - Analytics

**Événements trackés automatiquement :**
- 📊 `module_analysis` : Analyse de module (climate/business/cyber)
  - Module name
  - Duration (ms)
  - Success/failure
  - Timestamp

- 📄 `pdf_export` : Export de rapport PDF
  - Modules inclus
  - Timestamp

- 🌐 `language_change` : Changement de langue
  - Langue sélectionnée
  - Timestamp

- 🌙 `theme_change` : Changement de thème
  - Thème (dark/light)
  - Timestamp

- 📁 `csv_upload` : Upload de fichier CSV
  - Module
  - Nombre de lignes
  - Timestamp

**Fonctionnalités PostHog :**
- ✅ Autocapture des clics et interactions
- ✅ Pageview tracking
- ✅ Session recording
- ✅ Désactivé automatiquement en développement
- ✅ Masquage des champs sensibles (passwords)

## 🎯 Utilisation dans le Code

### Error Tracking

```typescript
import { errorTracking } from '@/lib/monitoring';

// Capturer une exception
try {
  await riskyOperation();
} catch (error) {
  errorTracking.captureException(error, {
    module: 'climate',
    userId: user.id,
  });
}

// Capturer un message
errorTracking.captureMessage('Operation completed with warnings', 'warning', {
  warnings: ['Missing optional field'],
});

// Ajouter un breadcrumb
errorTracking.addBreadcrumb('User clicked analyze button', 'user-action', {
  module: 'climate',
});

// Définir l'utilisateur
errorTracking.setUser({
  id: 'user-123',
  email: 'user@example.com',
  username: 'john_doe',
});
```

### Analytics Tracking

```typescript
import { analytics } from '@/lib/monitoring';

// Tracker une analyse
analytics.trackModuleAnalysis('climate', 2500, true);

// Tracker un export PDF
analytics.trackPDFExport(['climate', 'business', 'cyber']);

// Tracker un changement de langue
analytics.trackLanguageChange('en');

// Tracker un changement de thème
analytics.trackThemeChange('dark');

// Tracker un upload CSV
analytics.trackCSVUpload('business', 150);

// Identifier un utilisateur
analytics.identifyUser('user-123', {
  email: 'user@example.com',
  plan: 'premium',
});
```

## 📊 Dashboard de Monitoring

Un dashboard intégré est disponible dans l'application pour visualiser :
- Nombre total d'analyses
- Taux de succès
- Utilisateurs actifs
- Temps de réponse moyen
- Préférences utilisateur (thème, langue)
- Statut de configuration Sentry/PostHog

## 🚀 Déploiement

### Variables d'environnement Production

**Backend (.env) :**
```bash
SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_ENVIRONMENT=production
SENTRY_TRACES_SAMPLE_RATE=0.1
```

**Frontend (.env) :**
```bash
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_SENTRY_ENVIRONMENT=production
VITE_POSTHOG_KEY=phc_xxx
VITE_POSTHOG_HOST=https://app.posthog.com
```

### Build avec Source Maps

Les source maps sont automatiquement générées et uploadées vers Sentry lors du build :

```bash
# Build avec source maps
pnpm build

# Les source maps sont uploadées automatiquement si SENTRY_AUTH_TOKEN est configuré
```

### Configuration Sentry CLI (optionnel)

Pour l'upload automatique des source maps :

```bash
# Variables d'environnement additionnelles
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=your-project-slug
SENTRY_AUTH_TOKEN=your-auth-token
```

## 🔍 Debugging

### Vérifier la configuration

```typescript
// Dans la console du navigateur
console.log('Sentry DSN:', import.meta.env.VITE_SENTRY_DSN ? 'Configured' : 'Not configured');
console.log('PostHog Key:', import.meta.env.VITE_POSTHOG_KEY ? 'Configured' : 'Not configured');
```

### Tester Sentry

```typescript
import { errorTracking } from '@/lib/monitoring';

// Déclencher une erreur de test
errorTracking.captureMessage('Test error from GaiaShield', 'error');
```

### Tester PostHog

```typescript
import { analytics } from '@/lib/monitoring';

// Déclencher un événement de test
analytics.trackModuleAnalysis('test', 1000, true);
```

## 📝 Best Practices

1. **Ne jamais logger de données sensibles**
   - Les headers d'autorisation sont automatiquement filtrés
   - Éviter de logger des mots de passe, tokens, etc.

2. **Utiliser les breadcrumbs**
   - Ajouter du contexte avant les opérations critiques
   - Aide au debugging des erreurs

3. **Identifier les utilisateurs**
   - Permet de suivre les problèmes par utilisateur
   - Facilite le support client

4. **Monitorer les performances**
   - Tracker la durée des opérations importantes
   - Identifier les goulots d'étranglement

5. **Analyser les patterns d'utilisation**
   - Comprendre quels modules sont les plus utilisés
   - Optimiser l'UX basé sur les données réelles

## 🔒 Sécurité et Confidentialité

- ✅ Sanitization automatique des données sensibles
- ✅ Masquage des champs de mot de passe
- ✅ Pas de tracking en développement (PostHog)
- ✅ Conformité RGPD avec opt-out possible
- ✅ Session replay avec masquage intelligent

## 📚 Ressources

- [Documentation Sentry](https://docs.sentry.io/)
- [Documentation PostHog](https://posthog.com/docs)
- [Sentry React SDK](https://docs.sentry.io/platforms/javascript/guides/react/)
- [PostHog React Integration](https://posthog.com/docs/libraries/react)
