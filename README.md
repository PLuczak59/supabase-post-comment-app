# Posts & Commentaires

Application web de blog collaboratif : articles et commentaires en temps réel, authentification et tableau de bord. Idéal pour reprendre le projet, l’adapter ou le déployer.

**Stack :** React 19 · Vite 7 · Tailwind CSS 4 · Supabase (PostgreSQL, Auth, Realtime)

**Démo :** Un exemple du rendu est disponible via le lien suivant 
---

## Aperçu

- **Articles** — Liste, création (modal + bouton flottant), détail avec date et auteur
- **Commentaires** — Ajout sous chaque article, mise à jour en temps réel sans rechargement
- **Authentification** — Inscription, connexion, déconnexion (Supabase Auth)
- **Rôles** — Utilisateurs connectés peuvent publier ; les admins peuvent supprimer articles et commentaires
- **Statistiques** — Nombre de posts, moyenne de commentaires par article, moyenne de posts par utilisateur
- **UX** — Responsive, thème clair/sombre, toasts, squelettes de chargement, titres de page dynamiques

---

## Prérequis

- **Node.js** 18+ (recommandé : 20)
- Un compte [Supabase](https://supabase.com) (gratuit)

---

## Démarrer le projet

### 1. Cloner et installer

```bash
git clone https://github.com/<votre-compte>/supabase-post-comment-app.git
cd supabase-post-comment-app
npm install
```

### 2. Créer un projet Supabase

1. Sur [supabase.com](https://supabase.com), créez un nouveau projet.
2. Une fois le projet créé, allez dans **Project Settings → API** et notez :
   - **Project URL**
   - **anon public** (clé publique)

### 3. Créer les tables et la sécurité (RLS)

Dans l’éditeur SQL de votre projet Supabase, exécutez :

```sql
-- Table des articles
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des commentaires
CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activer RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Politiques : lecture pour tous
CREATE POLICY "posts_select" ON posts FOR SELECT USING (true);
CREATE POLICY "comments_select" ON comments FOR SELECT USING (true);

-- Politiques : écriture pour les utilisateurs connectés
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "comments_insert" ON comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Politiques : suppression réservée aux admins (adapter l’email à votre domaine)
CREATE POLICY "posts_delete_admin" ON posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND email LIKE '%@admin.mydomain.com'
    )
  );
CREATE POLICY "comments_delete_admin" ON comments FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND email LIKE '%@admin.mydomain.com'
    )
  );
```

Adaptez `@admin.mydomain.com` à l’email que vous utilisez pour les comptes administrateurs.

### 4. Activer Realtime

Dans Supabase : **Database → Replication**. Activez la réplication pour les tables `posts` et `comments` (elles doivent apparaître dans la publication `supabase_realtime`).

### 5. Variables d’environnement

À la racine du projet, créez un fichier `.env` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Remplacez par l’URL et la clé **anon public** de votre projet.

### 6. Lancer l’application

```bash
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173). Vous pouvez créer un compte (Authentication → sign up) et commencer à publier des articles.

---

## Scripts disponibles

| Commande           | Description                    |
|--------------------|--------------------------------|
| `npm run dev`      | Serveur de développement       |
| `npm run build`    | Build de production            |
| `npm run preview`  | Prévisualisation du build      |
| `npm run lint`     | Vérification ESLint            |


---

## Structure du projet

```
supabase-post-comment-app/
├── src/
│   ├── components/       # Composants réutilisables (Header, Modal, formulaires…)
│   ├── contexts/         # AuthContext, ToastContext
│   ├── pages/            # Home, Login, Register, PostDetail, Stats, Layout
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── utils/
│   └── supabase.js       # Client Supabase
├── .github/workflows/
│   └── deploy-pages.yml  # CI/CD GitHub Pages
├── vite.config.js
└── package.json
```

---

## Personnalisation

- **Admin** : dans le code, le rôle admin est déterminé par un email se terminant par `@admin.mydomain.com` (voir `AuthContext.jsx`). Changez ce suffixe pour l’adapter à votre domaine.
- **Footer / texte** : modifiez `src/components/AppFooter.jsx` pour le copyright et la ligne de description.
- **Titre du site** : le titre par défaut est « Posts & Commentaires » (dans `Layout.jsx` et `index.html`).

---

## Licence

Projet réaliser dans un cadre pédagogique.
