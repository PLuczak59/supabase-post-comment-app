# Posts & Commentaires (TP noté)

Application React + Supabase : articles et commentaires avec authentification, temps réel et statistiques.

## Prérequis Supabase

- **Tables** : `posts` (id, user_id, title, content, created_at), `comments` (id, post_id, user_id, content, created_at).
- **RLS** : lecture pour tous, écriture pour les utilisateurs authentifiés, suppression réservée aux admins (email en `@admin.mydomain.com`).
- **Realtime** : activer les tables pour la publication `supabase_realtime` :
  - Dashboard Supabase → Database → Publications → `supabase_realtime` → ajouter les tables `posts` et `comments`.
  - Ou en SQL :  
    `ALTER PUBLICATION supabase_realtime ADD TABLE posts, comments;`

## Développement

```bash
npm install
npm run dev
```

Variables d’environnement (fichier `.env` à la racine) :

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJ...
```

## Déploiement sur GitHub Pages (étape par étape)

### 1. Créer le dépôt sur GitHub

1. Va sur [github.com](https://github.com) et connecte-toi.
2. Clique sur **"New"** (ou le **+** en haut à droite → **New repository**).
3. Donne un nom au dépôt, par ex. **`supabase-post-comment-app`** (si tu choisis un autre nom, tu devras l’indiquer à l’étape 7).
4. Laisse le dépôt **Public**, ne coche pas "Add a README" (tu en as déjà un).
5. Clique sur **Create repository**.

---

### 2. Pousser ton code depuis ton PC

Ouvre un terminal à la racine du projet et exécute :

```bash
# Si le projet n’est pas encore un dépôt Git
git init

# Ajoute tout le projet
git add .
git commit -m "Initial commit - app posts & commentaires"

# Remplace TON_USERNAME et TON_REPO par ton compte GitHub et le nom du dépôt
git remote add origin https://github.com/TON_USERNAME/TON_REPO.git

# Envoie sur la branche main
git branch -M main
git push -u origin main
```

Exemple si ton compte est `dupont` et le dépôt `supabase-post-comment-app` :

```bash
git remote add origin https://github.com/dupont/supabase-post-comment-app.git
git push -u origin main
```

---

### 3. Ajouter les secrets (clés Supabase)

Sans ces secrets, le build ne pourra pas se connecter à Supabase en production.

1. Sur la page du dépôt GitHub, va dans **Settings** (onglet du dépôt).
2. Dans le menu de gauche : **Secrets and variables** → **Actions**.
3. Clique sur **"New repository secret"**.
4. Crée **deux** secrets, un par un :

   - **Name :** `VITE_SUPABASE_URL`  
     **Secret :** l’URL de ton projet Supabase (ex. `https://abcdefgh.supabase.co`).  
     Tu la trouves dans Supabase → **Project Settings** → **API** → **Project URL**.

   - **Name :** `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`  
     **Secret :** la clé publique (anon key).  
     Supabase → **Project Settings** → **API** → **Project API keys** → **anon public**.

---

### 4. Activer GitHub Pages

1. Toujours dans **Settings** du dépôt.
2. Menu de gauche : **Pages**.
3. Dans **"Build and deployment"**, section **Source** :
   - Choisis **"GitHub Actions"** (et non "Deploy from a branch").

Dès qu’un workflow aura tourné avec succès, l’URL du site apparaîtra en haut de cette page.

---

### 5. Lancer le déploiement

À chaque **push sur la branche `main`**, le workflow se lance automatiquement.

- Va dans l’onglet **Actions** du dépôt : tu dois voir le workflow **"Deploy on GitHub Pages"** (ou le nom défini dans le fichier).
- Clique dessus pour voir les jobs **build** puis **deploy**. Si tout est vert, le site est en ligne.

La première fois, attends 1 à 2 minutes après le push.

---

### 6. Récupérer l’URL du site

- Dans **Settings** → **Pages**, l’URL s’affiche en vert en haut après un déploiement réussi.
- Ou directement : **`https://<TON_USERNAME>.github.io/<NOM_DU_REPO>/`**

Exemple : `https://dupont.github.io/supabase-post-comment-app/`

---

### 7. Si le nom du dépôt est différent

Si ton dépôt ne s’appelle pas **`supabase-post-comment-app`**, il faut adapter la base de l’app :

1. Ouvre **`vite.config.js`** à la racine du projet.
2. Remplace `'/supabase-post-comment-app/'` par `'/NOM_DE_TON_REPO/'` (avec les slashs).
3. Commit et push :

   ```bash
   git add vite.config.js
   git commit -m "fix: base URL for GitHub Pages"
   git push
   ```

---

### En résumé

| Étape | Où | Quoi faire |
|-------|-----|------------|
| 1 | GitHub | Créer un nouveau dépôt (ex. `supabase-post-comment-app`) |
| 2 | Terminal | `git init`, `git add .`, `git commit`, `git remote add origin ...`, `git push -u origin main` |
| 3 | Repo → Settings → Secrets and variables → Actions | Ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` |
| 4 | Repo → Settings → Pages | Source = **GitHub Actions** |
| 5 | Repo → Actions | Vérifier que le workflow "Deploy on GitHub Pages" passe au vert |
| 6 | Settings → Pages ou l’URL | Ouvrir `https://<username>.github.io/<repo>/` |

Si le build échoue dans l’onglet Actions, ouvre le job **build** et regarde le message d’erreur (souvent un secret manquant ou mal nommé).
