# 🛡️ GaiaShield MVP - Guide Utilisateur

## 📋 Table des matières

1. [Introduction](#introduction)
2. [Démarrage rapide](#démarrage-rapide)
3. [Modules d'analyse](#modules-danalyse)
4. [Fonctionnalités principales](#fonctionnalités-principales)
5. [Interface utilisateur](#interface-utilisateur)
6. [Interprétation des résultats](#interprétation-des-résultats)
7. [Conseils d'utilisation](#conseils-dutilisation)
8. [FAQ](#faq)

---

## 🎯 Introduction

**GaiaShield** est une plateforme d'analyse de résilience alimentée par l'IA qui vous aide à évaluer et améliorer la robustesse de votre organisation face à trois types de risques majeurs :

- 🌍 **Climate Guard** : Risques climatiques et environnementaux
- 💼 **Business Shield** : Risques opérationnels et financiers
- 🔒 **Cyber Protect** : Risques de cybersécurité

---

## 🚀 Démarrage rapide

### 1. Accéder à l'application

Ouvrez votre navigateur et accédez à l'URL de GaiaShield.

### 2. Choisir votre langue

Cliquez sur le sélecteur de langue (🌐) en haut à droite pour basculer entre :
- 🇫🇷 Français
- 🇬🇧 English

### 3. Sélectionner un module

Choisissez le module d'analyse correspondant à vos besoins :

```
┌─────────────────┬──────────────────┬─────────────────┐
│ Climate Guard   │ Business Shield  │ Cyber Protect   │
├─────────────────┼──────────────────┼─────────────────┤
│ Analyse climat  │ Analyse business │ Analyse cyber   │
│ et météo        │ et opérations    │ et sécurité     │
└─────────────────┴──────────────────┴─────────────────┘
```

### 4. Lancer une analyse

Remplissez le formulaire avec vos informations et cliquez sur **"Analyser"**.

---

## 🔍 Modules d'analyse

### 🌍 Climate Guard

**Objectif** : Évaluer la vulnérabilité de votre organisation aux risques climatiques.

**Informations requises** :
- **Localisation** : Ville ou région (ex: "Paris, France")
- **Secteur d'activité** : Type d'industrie (ex: "Agriculture", "Tourisme")
- **Contexte** : Détails spécifiques sur vos opérations

**Exemple d'utilisation** :
```
Localisation : Bordeaux, France
Secteur : Viticulture
Contexte : Vignoble de 50 hectares, production de vins AOC
```

**Résultats fournis** :
- Score de résilience climatique (0-100)
- Risques identifiés (canicules, sécheresses, inondations, etc.)
- Recommandations d'adaptation
- Données météorologiques en temps réel

---

### 💼 Business Shield

**Objectif** : Analyser la résilience opérationnelle et financière de votre entreprise.

**Informations requises** :
- **Description** : Présentation de votre activité
- **Données CSV** (optionnel) : Fichiers de données business

**Types de fichiers CSV supportés** :
- 📊 Ventes (`sales.csv`)
- 📦 Stock (`stock.csv`)
- 🤝 Fournisseurs (`suppliers.csv`)

**Format CSV attendu** :

**sales.csv** :
```csv
date,product,quantity,revenue
2024-01-01,Product A,100,5000
2024-01-02,Product B,50,3000
```

**stock.csv** :
```csv
product,quantity,reorder_point,supplier
Product A,500,100,Supplier X
Product B,200,50,Supplier Y
```

**suppliers.csv** :
```csv
name,country,risk_level,products
Supplier X,France,low,Product A
Supplier Y,China,medium,Product B
```

**Résultats fournis** :
- Score de résilience business (0-100)
- Analyse des vulnérabilités opérationnelles
- Recommandations stratégiques
- Insights basés sur vos données

---

### 🔒 Cyber Protect

**Objectif** : Évaluer votre posture de cybersécurité et identifier les failles.

**Informations requises** :
- **Infrastructure** : Description de votre système IT
- **Contexte** : Détails sur vos pratiques de sécurité

**Exemple d'utilisation** :
```
Infrastructure : 50 employés, réseau Windows, cloud AWS
Contexte : Pas de formation cybersécurité, antivirus basique
```

**Résultats fournis** :
- Score de sécurité cyber (0-100)
- Vulnérabilités identifiées
- Plan d'action priorisé
- Recommandations de conformité

---

## ✨ Fonctionnalités principales

### 📊 Score de résilience global

Le **tableau de bord principal** affiche votre score de résilience combiné basé sur toutes vos analyses :

```
┌─────────────────────────────────────┐
│  Score Global de Résilience         │
│                                     │
│         ⭐ 75/100                   │
│                                     │
│  🌍 Climate : 80                    │
│  💼 Business : 70                   │
│  🔒 Cyber : 75                      │
└─────────────────────────────────────┘
```

**Interprétation** :
- 🟢 **80-100** : Excellente résilience
- 🟡 **60-79** : Résilience correcte, améliorations possibles
- 🟠 **40-59** : Résilience faible, actions recommandées
- 🔴 **0-39** : Résilience critique, actions urgentes

---

### 📅 Timeline des alertes

Visualisez l'historique de toutes vos analyses dans une timeline interactive :

```
2024-01-15  🌍 Climate Guard
            Score: 80 | Risque: Canicule estivale
            
2024-01-10  💼 Business Shield
            Score: 70 | Risque: Dépendance fournisseur unique
            
2024-01-05  🔒 Cyber Protect
            Score: 75 | Risque: Mots de passe faibles
```

**Fonctionnalités** :
- Filtrage par module
- Tri chronologique
- Accès rapide aux détails

---

### 📄 Export PDF

Générez des rapports professionnels pour chaque analyse :

1. Cliquez sur **"Télécharger PDF"** sur une carte de résultat
2. Le rapport inclut :
   - Score et niveau de risque
   - Liste complète des risques
   - Recommandations détaillées
   - Timestamp de l'analyse

**Format du rapport** :
```
┌─────────────────────────────────────┐
│  GAIASHIELD ANALYSIS REPORT         │
│  Climate Guard Analysis             │
├─────────────────────────────────────┤
│  Score: 80/100                      │
│  Risk Level: Medium                 │
│                                     │
│  IDENTIFIED RISKS:                  │
│  • Canicule estivale                │
│  • Sécheresse printanière           │
│                                     │
│  RECOMMENDATIONS:                   │
│  • Installer système d'irrigation   │
│  • Diversifier les cultures         │
└─────────────────────────────────────┘
```

---

### 📈 Monitoring Dashboard

Accédez aux métriques de performance de la plateforme :

```
┌─────────────────────────────────────┐
│  📊 Monitoring Dashboard            │
├─────────────────────────────────────┤
│  Total Analyses: 42                 │
│  Success Rate: 95%                  │
│  Avg Response Time: 2.3s            │
│                                     │
│  Module Usage:                      │
│  🌍 Climate: 40%                    │
│  💼 Business: 35%                   │
│  🔒 Cyber: 25%                      │
└─────────────────────────────────────┘
```

---

### 🎨 Mode sombre

Basculez entre les thèmes clair et sombre pour un confort visuel optimal :

- ☀️ **Mode clair** : Interface lumineuse pour environnements bien éclairés
- 🌙 **Mode sombre** : Interface sombre pour réduire la fatigue oculaire

**Raccourci** : Cliquez sur l'icône soleil/lune en haut à droite

---

## 🎨 Interface utilisateur

### Navigation principale

```
┌─────────────────────────────────────────────────────────┐
│  🛡️ GaiaShield        [Climate] [Business] [Cyber]     │
│                                          🌐 FR  ☀️      │
└─────────────────────────────────────────────────────────┘
```

### Formulaire d'analyse

```
┌─────────────────────────────────────┐
│  🌍 Climate Guard Analysis          │
├─────────────────────────────────────┤
│  Location: [____________]           │
│  Industry: [____________]           │
│  Context:  [____________]           │
│            [____________]           │
│                                     │
│         [Analyser] 🔍               │
└─────────────────────────────────────┘
```

### Carte de résultat

```
┌─────────────────────────────────────┐
│  🌍 Climate Guard                   │
│  Score: 80/100  🟡 Medium Risk      │
├─────────────────────────────────────┤
│  📍 Bordeaux, France                │
│  🏭 Viticulture                     │
│                                     │
│  ⚠️ Risques identifiés:             │
│  • Canicule estivale                │
│  • Sécheresse printanière           │
│                                     │
│  💡 Recommandations:                │
│  • Installer irrigation goutte-à-   │
│    goutte                           │
│  • Planter cépages résistants       │
│                                     │
│  [Télécharger PDF] [Voir détails]   │
└─────────────────────────────────────┘
```

---

## 📊 Interprétation des résultats

### Scores de résilience

| Score | Niveau | Signification | Action |
|-------|--------|---------------|--------|
| 90-100 | 🟢 Excellent | Très haute résilience | Maintenir |
| 80-89 | 🟢 Très bon | Haute résilience | Optimiser |
| 70-79 | 🟡 Bon | Résilience correcte | Améliorer |
| 60-69 | 🟡 Moyen | Résilience moyenne | Renforcer |
| 50-59 | 🟠 Faible | Résilience limitée | Agir |
| 0-49 | 🔴 Critique | Résilience insuffisante | Urgent |

### Niveaux de risque

- 🔴 **Critical** : Action immédiate requise
- 🟠 **High** : Action prioritaire dans les 30 jours
- 🟡 **Medium** : Action recommandée dans les 90 jours
- 🟢 **Low** : Surveillance et amélioration continue

### Priorisation des recommandations

Les recommandations sont classées par ordre d'importance :

1. **🔴 Critique** : Impact majeur, mise en œuvre immédiate
2. **🟠 Important** : Impact significatif, planifier rapidement
3. **🟡 Recommandé** : Amélioration continue, planifier à moyen terme
4. **🟢 Optionnel** : Optimisation, planifier à long terme

---

## 💡 Conseils d'utilisation

### Pour des analyses Climate Guard efficaces

✅ **À faire** :
- Fournir une localisation précise (ville + pays)
- Décrire votre secteur d'activité en détail
- Mentionner les infrastructures critiques
- Indiquer les dépendances environnementales

❌ **À éviter** :
- Localisations vagues ("Europe", "Sud")
- Descriptions génériques
- Omettre le contexte opérationnel

**Exemple optimal** :
```
Location: Lyon, France
Industry: Data center
Context: 5000 serveurs, refroidissement par eau, 
alimentation électrique critique, backup diesel
```

---

### Pour des analyses Business Shield efficaces

✅ **À faire** :
- Uploader des fichiers CSV bien formatés
- Inclure au moins 3 mois de données
- Décrire votre chaîne d'approvisionnement
- Mentionner les dépendances critiques

❌ **À éviter** :
- Fichiers CSV mal formatés ou incomplets
- Données trop anciennes (>1 an)
- Descriptions trop vagues

**Exemple optimal** :
```
Description: E-commerce mode, 50K commandes/mois
CSV: sales.csv (6 mois), stock.csv, suppliers.csv
Context: 3 fournisseurs principaux (Asie 70%, Europe 30%)
```

---

### Pour des analyses Cyber Protect efficaces

✅ **À faire** :
- Lister tous les systèmes critiques
- Décrire vos pratiques de sécurité actuelles
- Mentionner les certifications existantes
- Indiquer les incidents passés

❌ **À éviter** :
- Descriptions trop techniques ou trop vagues
- Omettre les pratiques de sécurité
- Ne pas mentionner les données sensibles

**Exemple optimal** :
```
Infrastructure: 200 postes Windows 10, Office 365, 
AWS (EC2, S3, RDS), VPN Cisco
Context: Formation annuelle, MFA activé, antivirus 
Defender, pas de SOC, données clients RGPD
```

---

### Optimiser vos analyses

1. **Analyses régulières** : Lancez une analyse tous les 3 mois
2. **Suivi des recommandations** : Cochez les actions réalisées
3. **Comparaison temporelle** : Utilisez la timeline pour suivre l'évolution
4. **Approche holistique** : Analysez les 3 modules pour une vue complète

---

## ❓ FAQ

### Général

**Q: Combien de temps prend une analyse ?**  
R: Entre 10 et 30 secondes selon la complexité et les données fournies.

**Q: Mes données sont-elles sécurisées ?**  
R: Oui, toutes les analyses sont chiffrées et les données ne sont pas stockées après traitement.

**Q: Puis-je exporter mes résultats ?**  
R: Oui, chaque analyse peut être exportée en PDF professionnel.

**Q: L'application fonctionne-t-elle hors ligne ?**  
R: Non, une connexion internet est requise pour les analyses IA.

---

### Climate Guard

**Q: Quelles données météo sont utilisées ?**  
R: Données en temps réel via API OpenWeatherMap (température, humidité, vent, précipitations).

**Q: Les prévisions climatiques sont-elles fiables ?**  
R: Les analyses se basent sur des modèles scientifiques et des données historiques, mais restent des estimations.

**Q: Puis-je analyser plusieurs sites ?**  
R: Oui, lancez une analyse séparée pour chaque localisation.

---

### Business Shield

**Q: Quels formats CSV sont acceptés ?**  
R: UTF-8, séparateur virgule, avec en-têtes. Voir exemples dans `/public/samples/`.

**Q: Combien de lignes CSV maximum ?**  
R: Jusqu'à 10 000 lignes par fichier pour des performances optimales.

**Q: Puis-je analyser sans CSV ?**  
R: Oui, une description textuelle suffit, mais les CSV enrichissent l'analyse.

---

### Cyber Protect

**Q: L'analyse détecte-t-elle les vulnérabilités réelles ?**  
R: Non, c'est une évaluation basée sur les informations fournies, pas un pentest technique.

**Q: Dois-je partager mes mots de passe ?**  
R: Non, ne partagez jamais de credentials. Décrivez seulement vos pratiques.

**Q: Les recommandations sont-elles conformes RGPD ?**  
R: Oui, les recommandations incluent les bonnes pratiques de conformité.

---

### Technique

**Q: Pourquoi l'analyse échoue-t-elle ?**  
R: Vérifiez votre connexion internet, la validité des données CSV, et réessayez.

**Q: Puis-je utiliser GaiaShield sur mobile ?**  
R: Oui, l'interface est responsive et optimisée pour mobile/tablette.

**Q: Comment activer le monitoring ?**  
R: Configurez `VITE_SENTRY_DSN` et `VITE_POSTHOG_KEY` dans `.env` (optionnel).

---

## 📞 Support

Pour toute question ou problème :

1. Consultez cette documentation
2. Vérifiez les [README techniques](README.md)
3. Consultez les logs de monitoring (si activé)

---

## 🎓 Ressources complémentaires

- [README principal](README.md) - Documentation technique
- [README Monitoring](README_MONITORING.md) - Configuration Sentry/PostHog
- [README Performance](README_PERFORMANCE.md) - Optimisations appliquées
- [Exemples CSV](public/samples/) - Fichiers d'exemple pour Business Shield

---

**Version** : 1.0.0  
**Dernière mise à jour** : Janvier 2024  
**Licence** : MIT

---

*GaiaShield - Protégez votre organisation avec l'intelligence artificielle* 🛡️
