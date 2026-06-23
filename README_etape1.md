# BâtiSuivi — Étape 1 : lancer l'infrastructure

Objectif : faire démarrer la base de données, le stockage de fichiers et le
serveur d'authentification, tous ensemble, grâce à Docker.

---

## 1. Logiciels à installer (une seule fois)

Installe ces 4 outils sur ta machine (versions gratuites) :

1. **Docker Desktop** — https://www.docker.com/products/docker-desktop/
   (Sur Windows, accepte l'option WSL 2 si elle est proposée.)
2. **Node.js (version LTS)** — https://nodejs.org/
3. **Visual Studio Code** — https://code.visualstudio.com/
4. **Git** — https://git-scm.com/

Pour vérifier que tout est installé, ouvre un terminal et tape :

    docker --version
    node --version
    git --version

Chaque commande doit afficher un numéro de version.

---

## 2. Préparer le dossier du projet

1. Crée un dossier nommé **batisuivi**.
2. Place dedans ces trois fichiers (fournis) :
   - `docker-compose.yml`
   - `.env`
   - `bati_suivi.sql`   (le script de base de données généré précédemment)

---

## 3. Démarrer l'infrastructure

Ouvre un terminal **dans le dossier batisuivi**, puis tape :

    docker compose up -d

La première fois, Docker télécharge les images (quelques minutes selon ta
connexion). Quand c'est fini, tape :

    docker compose ps

Tu dois voir 4 services en cours d'exécution (mysql, adminer, minio, keycloak).

---

## 4. Vérifier que tout fonctionne

Ouvre ces adresses dans ton navigateur :

| Service          | Adresse                  | Identifiants                    |
|------------------|--------------------------|---------------------------------|
| Base de données  | http://localhost:8080    | Serveur : `mysql` · Utilisateur : `root` · Mot de passe : `root` · Base : `bati_suivi` |
| Stockage MinIO   | http://localhost:9001    | `minioadmin` / `minioadmin123`  |
| Keycloak (auth)  | http://localhost:8085    | `admin` / `admin`               |

Dans Adminer (8080), tu dois voir tes 8 tables (role, utilisateur, projet,
chantier, tache, rapport_avancement, document) déjà créées avec les données
de test. Si c'est le cas, **l'étape 1 est réussie.**

---

## Commandes utiles

- Tout arrêter :            `docker compose down`
- Tout relancer :           `docker compose up -d`
- Voir les journaux :       `docker compose logs -f`
- Repartir de zéro (efface les données) : `docker compose down -v`

---

Quand les 3 adresses s'ouvrent correctement, préviens-moi : on passera à
l'étape 2 (le premier service back-end Node.js connecté à MySQL).
