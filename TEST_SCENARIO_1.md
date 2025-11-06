# 🌍 Test Scénario 1 - Climate Guard

## 📝 Guide Pas à Pas

### Étape 1 : Accéder à l'application
1. Ouvrez votre navigateur
2. Allez sur : `https://preview-6f77a53a-66e7-4d12-9cd0-5e5bac199eb3.codenut.dev`
3. Attendez que la page se charge complètement

---

### Étape 2 : Sélectionner Climate Guard
1. Sur la page d'accueil, vous verrez 3 boutons de modules
2. Cliquez sur le bouton **"Climate Guard"** (🌍)
3. Le formulaire d'analyse climatique s'affiche

---

### Étape 3 : Remplir le formulaire

**Copiez-collez exactement ces valeurs** :

#### Champ "Location" (Localisation)
```
Paris, France
```

#### Champ "Industry" (Secteur)
```
Agriculture
```

#### Champ "Context" (Contexte)
```
Ferme de 100 hectares, cultures céréalières, irrigation par aspersion
```

---

### Étape 4 : Lancer l'analyse
1. Vérifiez que tous les champs sont remplis
2. Cliquez sur le bouton **"Analyser"** (ou "Analyze" en anglais)
3. Un indicateur de chargement apparaît
4. Attendez 10-30 secondes

---

### Étape 5 : Vérifier les résultats

Une carte de résultat devrait apparaître avec :

#### ✅ Éléments à vérifier :

**1. En-tête de la carte**
- [ ] Icône 🌍 "Climate Guard"
- [ ] Score affiché (ex: "75/100")
- [ ] Badge de niveau de risque coloré :
  - 🟢 Low (vert)
  - 🟡 Medium (jaune)
  - 🟠 High (orange)
  - 🔴 Critical (rouge)

**2. Informations contextuelles**
- [ ] 📍 Location : "Paris, France"
- [ ] 🏭 Industry : "Agriculture"
- [ ] 📝 Context affiché

**3. Section "Risques identifiés"**
- [ ] Liste de risques climatiques (ex: canicule, sécheresse, gel, etc.)
- [ ] Chaque risque a une description
- [ ] Au moins 3-5 risques listés

**4. Section "Recommandations"**
- [ ] Liste de recommandations concrètes
- [ ] Actions spécifiques pour l'agriculture
- [ ] Au moins 3-5 recommandations

**5. Données météo (si affichées)**
- [ ] Température actuelle
- [ ] Humidité
- [ ] Conditions météo

**6. Boutons d'action**
- [ ] Bouton "Télécharger PDF" (📄)
- [ ] Bouton "Voir détails" ou similaire

---

### Étape 6 : Tester l'export PDF
1. Cliquez sur **"Télécharger PDF"**
2. Un fichier PDF devrait se télécharger
3. Ouvrez le PDF et vérifiez :
   - [ ] En-tête "GAIASHIELD ANALYSIS REPORT"
   - [ ] "Climate Guard Analysis"
   - [ ] Score et niveau de risque
   - [ ] Liste des risques
   - [ ] Liste des recommandations
   - [ ] Date et heure de l'analyse

---

### Étape 7 : Vérifier le Score Global
1. Faites défiler vers le haut de la page
2. Cherchez une carte **"Score Global de Résilience"**
3. Vérifiez :
   - [ ] Score global affiché
   - [ ] Score Climate Guard visible (celui que vous venez d'obtenir)
   - [ ] Graphique ou indicateur visuel

---

### Étape 8 : Vérifier la Timeline
1. Faites défiler vers le bas
2. Cherchez la section **"Timeline des Alertes"** ou **"Alert Timeline"**
3. Vérifiez :
   - [ ] Votre analyse Climate Guard apparaît
   - [ ] Date et heure correctes
   - [ ] Score affiché
   - [ ] Risque principal mentionné

---

## 🐛 Que faire en cas de problème ?

### Problème 1 : L'analyse ne se lance pas
**Solutions** :
- Vérifiez que tous les champs sont remplis
- Ouvrez la console (F12) et regardez les erreurs
- Vérifiez votre connexion internet
- Rafraîchissez la page et réessayez

### Problème 2 : Erreur "API Key not configured"
**Cause** : La clé API Gemini n'est pas configurée dans le backend
**Solution** : Vérifiez que `GEMINI_API_KEY` est définie dans `server/.env`

### Problème 3 : L'analyse prend trop de temps (>60s)
**Solutions** :
- Attendez encore 30 secondes
- Si timeout, vérifiez les logs backend
- Réessayez avec un contexte plus court

### Problème 4 : Résultats incohérents
**Exemples** :
- Score = 0 ou 100 systématiquement
- Pas de risques identifiés
- Recommandations génériques

**Solution** : Vérifiez que l'API Gemini répond correctement

### Problème 5 : PDF ne se télécharge pas
**Solutions** :
- Vérifiez les paramètres de téléchargement du navigateur
- Essayez avec un autre navigateur
- Vérifiez la console pour erreurs JavaScript

---

## 📊 Résultats Attendus

### Exemple de résultat typique pour ce scénario :

**Score** : 60-75/100  
**Niveau** : Medium Risk (🟡)

**Risques identifiés** :
- Canicules estivales (juin-août)
- Sécheresses printanières
- Gel tardif (avril-mai)
- Précipitations irrégulières
- Stress hydrique des cultures

**Recommandations** :
- Installer système d'irrigation goutte-à-goutte
- Diversifier les cultures (variétés résistantes)
- Mettre en place système de récupération d'eau
- Planter haies brise-vent
- Surveiller prévisions météo quotidiennement
- Souscrire assurance récolte climatique

---

## 📸 Captures d'écran à prendre

Pour documenter vos tests, prenez des captures d'écran de :

1. **Formulaire rempli** (avant de cliquer "Analyser")
2. **Carte de résultat complète**
3. **Section risques**
4. **Section recommandations**
5. **Score global** (en haut de page)
6. **Timeline** (en bas de page)
7. **PDF téléchargé** (ouvert)
8. **Console navigateur** (F12 → Console) pour voir les logs

---

## ✅ Checklist Finale

Cochez au fur et à mesure :

- [ ] Formulaire rempli correctement
- [ ] Analyse lancée avec succès
- [ ] Résultat affiché en < 30 secondes
- [ ] Score entre 0-100 affiché
- [ ] Niveau de risque cohérent
- [ ] Au moins 3 risques identifiés
- [ ] Au moins 3 recommandations
- [ ] Données météo affichées (si applicable)
- [ ] PDF téléchargé avec succès
- [ ] PDF contient toutes les informations
- [ ] Score global mis à jour
- [ ] Timeline affiche la nouvelle analyse
- [ ] Pas d'erreurs console critiques
- [ ] Interface responsive (testez sur mobile si possible)

---

## 🎯 Prochaines Étapes

Une fois ce scénario validé :

1. **Testez le Scénario 2** : Climate Guard avec secteur Tourisme
2. **Testez Business Shield** : Avec et sans CSV
3. **Testez Cyber Protect** : Deux niveaux de maturité
4. **Testez les fonctionnalités UI** : Langue, thème, etc.

---

## 📞 Besoin d'aide ?

Si vous rencontrez un problème :

1. Notez le message d'erreur exact
2. Prenez une capture d'écran
3. Ouvrez la console (F12) et copiez les erreurs
4. Décrivez ce que vous avez fait étape par étape
5. Partagez ces informations pour diagnostic

---

**Bonne chance avec vos tests ! 🚀**
