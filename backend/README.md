# MobiBenin — Backend

API REST (Node.js + Express + TypeScript + Prisma + PostgreSQL) pour la plateforme
de covoiturage interurbain MobiBenin (Cotonou <-> Parakou, etc.), avec un accent
particulier sur la sécurité des données personnelles et financières.

## Démarrage

```bash
cp .env.example .env
# Génère des secrets forts avant de continuer (voir section "Secrets a generer")
docker compose up -d          # lance PostgreSQL
npm install
npm run prisma:generate
npm run prisma:migrate        # crée les tables
npm run seed                  # crée un admin, un conducteur vérifié et un passager de démo
npm run dev                   # http://localhost:4000
```

Comptes de démo (mot de passe `password123`) :
- Admin : `+22900000001`
- Conducteur vérifié : `+22997000001`
- Passager : `+22996000002`

> Remarque : cet environnement de développement n'a pas d'accès internet sortant
> vers le registre npm, donc `npm install` n'a pas pu être exécuté ici pour valider
> la compilation. Chaque fichier a été vérifié syntaxiquement
> (`node --experimental-strip-types --check`), mais il faudra lancer
> `npm install && npm run build` chez toi pour la vérification de types complète.

## Secrets à générer (ne jamais garder les valeurs par défaut)

```bash
openssl rand -hex 32      # -> JWT_ACCESS_SECRET, OTP_PEPPER, MOMO_WEBHOOK_SECRET
openssl rand -base64 32   # -> FIELD_ENCRYPTION_KEY (doit faire exactement 32 octets)
```

En environnement `NODE_ENV=production`, le serveur refuse de démarrer si ces
variables gardent leur valeur par défaut (`JWT_ACCESS_SECRET`, `MOMO_WEBHOOK_SECRET`,
`FIELD_ENCRYPTION_KEY`, `OTP_PEPPER`).

## Ce que couvre l'API (fonctionnel)

Voir la version précédente de ce document dans l'historique du projet : auth,
vérifications, trajets, réservations, portefeuille/paiement Mobile Money,
messagerie interne, avis, fidélité, récompenses conducteur, admin/support.

## Mesures de sécurité mises en place

- **Mots de passe** : hashés avec bcrypt (12 rounds), politique minimale de 8
  caractères avec au moins une lettre et un chiffre (`PASSWORD_MIN_LENGTH`).
- **Verrouillage de compte** : après `LOGIN_MAX_ATTEMPTS` échecs de connexion
  (5 par défaut), le compte est verrouillé `LOGIN_LOCKOUT_MINUTES` minutes.
  Message d'erreur générique en cas d'échec pour ne pas permettre l'énumération
  des numéros de téléphone inscrits.
- **OTP** : le code n'est jamais stocké en clair (hash SHA-256 + secret serveur
  "pepper"), limité en tentatives (`OTP_MAX_ATTEMPTS`), et la demande de code est
  soumise à un rate-limiting par IP (`RATE_LIMIT_OTP_*`).
- **Jetons** : le jeton d'accès est un JWT courte durée (15 min). Le jeton de
  rafraîchissement est un secret opaque, jamais stocké en clair (hash SHA-256
  en base), livré au client via un **cookie httpOnly** (inaccessible en
  JavaScript, donc protégé contre le vol par XSS) et **tourne à chaque
  utilisation** (rotation) : si un jeton déjà révoqué est réutilisé (signe de
  vol), toute la famille de sessions est immédiatement coupée.
- **Rate-limiting global** : toutes les routes sont soumises à une limite
  générale (`RATE_LIMIT_GENERAL_*`), en plus des limites spécifiques sur
  l'authentification.
- **En-têtes de sécurité HTTP** : `helmet` (anti-clickjacking, no-sniff, etc.),
  `X-Powered-By` désactivé.
- **Documents sensibles** (CNI, permis, casier judiciaire) : jamais stockés en
  base ni exposés par une URL publique. Ils passent par le module
  `modules/documents` (abstraction de stockage prête à être remplacée par S3 en
  production) et ne sont téléchargeables que par leur propriétaire ou un
  admin/support authentifié, via un endpoint qui vérifie les droits à chaque
  accès.
- **Chiffrement au repos** : le NPI (numéro personnel d'identification) est
  chiffré avec AES-256-GCM avant stockage (`FIELD_ENCRYPTION_KEY`), jamais en
  clair dans la base.
- **Webhook Mobile Money** : la signature HMAC-SHA256 (header
  `x-momo-signature`, calculée sur le corps brut) est vérifiée **dans tous les
  environnements**, y compris en développement — sans ça, n'importe qui
  pourrait déclencher de faux paiements. Utilise `npm run momo:sign
  <reference>` pour générer un appel de test correctement signé.
- **Journal d'audit** : les décisions de modération (validation/refus d'un
  dossier conducteur, changement de statut d'un ticket) sont enregistrées dans
  `AdminAuditLog` (qui a fait quoi, quand, sur quelle ressource).
- **Droit à l'effacement** : `DELETE /users/me` anonymise les données
  personnelles (nom, email, téléphone, documents) et révoque toutes les
  sessions actives, conformément à l'esprit de la réglementation béninoise sur
  la protection des données personnelles (Code du numérique / APDP).
- **Prisma (ORM paramétré)** : protège nativement contre les injections SQL.

## Limites connues / à faire avant une vraie mise en production

- Le stockage de documents en local (`DOCUMENTS_STORAGE_DIR`) convient au
  développement ; en production, remplacer `LocalDiskStorage` par un
  adaptateur S3/GCS/Azure Blob implémentant la même interface
  (`ObjectStorage` dans `modules/documents/storage.ts`).
- Le SMS et le Mobile Money sont simulés (mock) : brancher un vrai agrégateur
  SMS et les API MTN MoMo / Moov Money avant le lancement, en conservant la
  vérification de signature du côté webhook.
- Prévoir une déclaration/autorisation auprès de l'APDP (Autorité de
  Protection des Données Personnelles du Bénin) avant de traiter des données
  d'identité et des casiers judiciaires en production.
- Envisager un WAF/CDN (ex: Cloudflare) devant l'API en production, en plus du
  rate-limiting applicatif.

## Webhook Mobile Money (mock, signé)

```bash
npm run momo:sign MOCK-MTN-xxxx SUCCESS
# copie-colle la commande curl affichée
```
