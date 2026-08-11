# MobiBenin — Projet complet (frontend + backend)

Reprise complète du projet `covoit_build_front` à partir du cahier des charges MobiBenin
(covoiturage interurbain au Bénin, Cotonou ↔ Parakou).

## Structure

- `frontend/` — Application React + TypeScript + Vite + Tailwind v4, corrigée et reconnectée à une vraie API.
- `backend/` — API Node.js + Express + TypeScript + Prisma + PostgreSQL (nouvelle, ajoutée selon ta demande).

## Ce qui a été corrigé côté frontend (bugs du projet initial)

- Le rôle `"PASSENGER_DRIVER"` était utilisé dans `router.tsx` mais absent du type `Role` /
  `AuthContext` → l'application ne compilait pas (`tsc -b` échouait, ~77 erreurs). Le modèle de
  rôles a été revu : les rôles atomiques `PASSENGER`/`DRIVER` sont stockés, et l'API dérive le
  rôle composé `PASSENGER_DRIVER` pour les comptes mixtes.
- Import cassé : `router.tsx` importait `./pages/support/InternalFaq` alors que le fichier
  s'appelle `InternalFAQ.tsx` (sensible à la casse en production sur Linux).
- Incohérence de modèle `Trip` : certaines pages lisaient `trip.date/time/seats/price` alors que
  le type définissait `dateTime/seatsLeft/priceXof` → corrigé avec un modèle `Trip` unique aligné
  sur l'API.
- 51 pages générées sur 86 n'étaient jamais reliées au routeur (mortes) : toutes ont été
  raccordées à des routes cohérentes.
- Pages dupliquées/concurrentes unifiées (ex. `UpcomingBookings` vs `MyBookingsUpcoming`,
  `passenger/Verifications` vs `profile/Verifications`, `Users` vs `UsersList`, `Stats` vs
  `GlobalStats`) pour éviter les incohérences de données.
- Pages "À propos", "Comment ça marche", "Aide", "Confiance & sécurité", "Mentions légales"
  contenaient exactement le même texte générique copié-collé → remplacées par du vrai contenu
  spécifique à chacune.
- Toute la logique métier reposait sur `localStorage` (mock) sans backend réel : remplacée par de
  vrais appels à l'API ci-dessous (authentification, trajets, réservations, paiement, messagerie,
  avis, fidélité, récompenses conducteur, administration).
- Charte graphique : palette professionnelle inspirée du drapeau du Bénin (vert = actions
  principales / succès, jaune = accent / en attente, rouge = alerte / refus), appliquée de façon
  cohérente (boutons, badges de statut, tableaux de bord).

## Ce qui a été ajouté (backend)

Voir `backend/README.md` pour le détail : authentification par OTP SMS (mock) + JWT, vérification
d'identité (NPI/CNI passager, permis/NIP/casier judiciaire conducteur avec rappels automatiques),
trajets, réservations, portefeuille et paiement Mobile Money (MTN/Moov, simulé), messagerie interne,
avis, programme de fidélité, les 4 leviers de récompense conducteur du document produit, et des
routes d'administration/support.

## Sécurité (deuxième passe, sur demande)

Une passe dédiée a durci le backend : mots de passe avec politique minimale (8
caractères, lettre + chiffre) et verrouillage de compte après échecs répétés,
codes OTP hashés (jamais en clair) avec limite de tentatives, rate-limiting sur
les routes sensibles, jetons de rafraîchissement opaques stockés hashés côté
serveur avec rotation et détection de réutilisation (livrés via cookie
httpOnly, jamais lisibles en JavaScript), documents sensibles (CNI, permis,
casier judiciaire) stockés hors base de données avec accès restreint au
propriétaire/admin, NPI chiffré au repos (AES-256-GCM), vérification
obligatoire de signature HMAC sur le webhook Mobile Money, en-têtes de
sécurité HTTP (helmet), et un journal d'audit des actions de modération. Le
détail complet est dans `backend/README.md` (section "Mesures de sécurité").

Côté frontend, le jeton d'accès n'est plus stocké dans `localStorage` (risque
XSS) mais gardé en mémoire JavaScript, avec un rafraîchissement silencieux au
démarrage de l'app via le cookie httpOnly. Les champs "URL de document" ont été
remplacés par de vrais téléversements de fichiers vers le backend, envoyés une
fois le compte créé et authentifié (impossible d'envoyer un fichier avant que
le compte n'existe).

**Important** : `CORS_ORIGIN` côté backend doit correspondre exactement à
l'origine du frontend (le cookie httpOnly ne peut pas être envoyé en
cross-origin avec une valeur générique/wildcard).

## Vérifications effectuées dans cet environnement

- `tsc -b --noEmit` sur le frontend : **0 erreur** (contre 77 avant correction).
- `eslint` sur le frontend : **0 erreur**.
- Chaque fichier backend validé syntaxiquement (`node --experimental-strip-types --check`).

## Limite connue de cet environnement de travail

Cet environnement sandboxé n'a pas d'accès sortant au registre npm : il n'a pas été possible d'y
exécuter `npm install` pour le backend, ni `vite build` complet pour le frontend (le binaire natif
Rollup manquant pour cette architecture Linux). Le `node_modules` du frontend fourni dans le zip
original a été réutilisé pour faire tourner `tsc`/`eslint` avec succès, mais le build final devra
être vérifié sur ta machine avec :

```bash
cd frontend && npm install && npm run build
cd ../backend && npm install && npm run build
```

## Démarrage rapide

```bash
# Backend
cd backend
cp .env.example .env
docker compose up -d
npm install
npm run prisma:generate && npm run prisma:migrate && npm run seed
npm run dev        # http://localhost:4000

# Frontend (dans un autre terminal)
cd frontend
npm install
echo "VITE_API_URL=http://localhost:4000" > .env
npm run dev         # http://localhost:5173
```
