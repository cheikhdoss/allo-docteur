# Allo Docteur - Guide de Déploiement

Ce projet est une application React construite avec Vite. Voici comment la déployer gratuitement sur GitHub Pages.

## Prérequis

1.  Avoir **Node.js** installé sur votre ordinateur.
2.  Avoir un compte **GitHub**.
3.  Avoir **Git** installé.

## Étape 1 : Préparation

Si vous venez de télécharger le code, ouvrez votre terminal dans le dossier du projet et installez les dépendances :

```bash
npm install
```

## Étape 2 : Configuration GitHub

1.  Allez sur [GitHub.com](https://github.com) et créez un **nouveau dépôt public** (New Repository).
    *   Nommez-le par exemple : `allo-docteur`
    *   Ne l'initialisez pas avec un README ou .gitignore pour l'instant.

2.  Dans votre code, ouvrez le fichier `vite.config.ts`.
3.  Vérifiez que la ligne `base: '/allo-docteur/'` correspond bien au nom de votre dépôt.
    *   Si votre dépôt s'appelle `mon-projet`, changez la ligne en `base: '/mon-projet/'`.

## Étape 3 : Initialisation Git

Dans votre terminal, exécutez les commandes suivantes une par une :

```bash
# Initialiser git
git init

# Ajouter les fichiers
git add .

# Faire le premier commit
git commit -m "Initial commit"

# Renommer la branche principale (recommandé)
git branch -M main

# Lier à votre dépôt GitHub (remplacez VOTRE_USER et VOTRE_REPO)
git remote add origin https://github.com/VOTRE_USER/allo-docteur.git
```

## Étape 4 : Déploiement

Une fois tout configuré, lancez simplement cette commande magique :

```bash
npm run deploy
```

Cette commande va :
1.  Construire l'application (`npm run build`).
2.  Créer une branche `gh-pages` sur GitHub.
3.  Mettre en ligne votre site.

## Étape 5 : Voir le site

1.  Allez sur la page de votre dépôt GitHub.
2.  Cliquez sur l'onglet **Settings** > **Pages**.
3.  Vous devriez voir un lien (cela peut prendre 1 à 2 minutes pour s'activer).
    *   Exemple : `https://votre-user.github.io/allo-docteur/`

---

## Notes pour le développement local

Pour travailler sur le site en local :

```bash
npm run dev
```

## API Key

N'oubliez pas que pour que l'IA (Gemini) fonctionne, vous devez configurer vos clés API. Sur GitHub Pages, il n'y a pas de fichier `.env` côté serveur. Pour une démo frontend simple sans backend, vous devrez peut-être coder la clé en dur (déconseillé pour la prod) ou utiliser un proxy.
