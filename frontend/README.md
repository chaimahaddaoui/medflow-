# MedFlow – Application de gestion de rendez‑vous médicaux
## Description

MedFlow est une application web fullstack destinée à la gestion des rendez‑vous médicaux et des dossiers patients pour une clinique ou un groupe de cliniques.

## Technologies utilisées

- **Next.js** (React + API Routes)
- **TypeScript**
- **PostgreSQL** + **Prisma**
- **bcryptjs** pour le hashing des mots de passe
- **pdfkit** pour la génération des PDF d’ordonnances
- **nodemailer** pour l’envoi d’emails
- **Tailwind CSS** pour le style



## Installation


### 1. Cloner le dépôt
git clone <https://github.com/chaimahaddaoui/medflow-.git>
cd medflow/frontend

### 2. Installer les dépendances
npm install

### 3. Configurer les variables d’environnement

Créer un fichier `.env` dans `frontend` 

DATABASE_URL="postgresql://user:password@localhost:5432/medflow"
SMTP_USER="ton_email@gmail.com"
SMTP_PASS="mot_de_passe_ou_app_password"
APP_URL="http://localhost:3000"

--> Adapter `user`, `password`, `host`, `port`, `dbname` selon ta base PostgreSQL.

### 4. Initialiser la base de données
npx prisma migrate dev --name init
npx prisma generate

###  Visualiser les données :
npx prisma studio

### 5. Lancer l’application
npm run dev

--> Application disponible sur :  
`http://localhost:3000`


## Structure principale

### Backend (API Next.js)

- `pages/api/auth/register.ts`  
  Inscription patient avec :
  - vérification de l’unicité de l’email,
  - hashing du mot de passe (`bcrypt.hash`),
  - association à une clinique (`clinicId`).

- `pages/api/auth/login.ts`  
  Connexion :
  - vérification email + mot de passe (`bcrypt.compare`),
  - création de session / cookie (selon implémentation).

- `pages/api/auth/logout.ts`  
  Déconnexion.

- `pages/api/patient/dashboard.ts`  
  Retourne les données du **dashboard patient** pour un `patientId` donné :
  - `stats` : `upcomingCount`, `confirmedCount`, `prescriptionsCount`, `clinicsCount`,
  - `upcomingAppointments`,
  - `lastPrescriptions`.

- `pages/api/patients/prescriptions/index.ts`  
  Liste des ordonnances d’un patient (JSON).

- `pages/api/patients/prescriptions/[id].ts`  
  Détail d’une ordonnance (JSON) avec le médecin.

- `pages/api/patients/prescriptions/[id]/pdf.ts`  
  Génération **PDF** d’une ordonnance :
  - récupère l’ordonnance + docteur + patient via Prisma,
  - génère un PDF avec `pdfkit`,
  - renvoie le PDF en téléchargement.

### Frontend (pages Next.js)

- `pages/login.tsx`  
  Formulaire de connexion (email + mot de passe).

- `pages/register.tsx`  
  Formulaire d’inscription patient :
  - champs personnels,
  - `<select>` pour choisir une clinique (via `/api/clinics` si implémenté),
  - envoi à `/api/auth/register`.

- `pages/patient/index.tsx`  
  Dashboard patient :
  - `useEffect` → `fetch("/api/patient/dashboard?patientId=...")`,
  - affichage des stats et des prochains rendez‑vous.

- `pages/patient/prescriptions/index.tsx`  
  Liste des ordonnances du patient (avec lien vers le détail).

- `pages/patient/prescriptions/[id].tsx`  
  Détail d’une ordonnance + bouton **“Télécharger en PDF



## Exemple de modèle Prisma 
model Clinic {

id Int @id @default(autoincrement())

nom String

adresse String

telephone String

email String

doctors Doctor[]

patients Patient[]

}

## Sécurité

- Mots de passe **hashés** avec `bcryptjs` avant enregistrement.
- Authentification par email + mot de passe via API Next.js.
- Filtrage des données par `patientId` pour les dashboards et ordonnances.

## Comptes de test (exemple)

À adapter à ta base de données :

| Rôle           | Email              | Mot de passe |
|----------------|--------------------|--------------|
| Patient test   | ali@gmail.com      | patient123   |
| Réceptionniste | reception@test.com | reception    |
|  medecin       |  medecin@medecincom| medecin
| admin         |chaimahadaoui11@gmail.com|chaimaadmin |
