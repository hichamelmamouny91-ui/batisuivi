-- =====================================================================
--  Base de donnees : Plateforme de gestion des projets
--  et de suivi des chantiers (bureau d'etudes de construction)
-- =====================================================================

DROP DATABASE IF EXISTS bati_suivi;
CREATE DATABASE bati_suivi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bati_suivi;

-- ---- Table : role ----
CREATE TABLE role (
  idRole   INT AUTO_INCREMENT PRIMARY KEY,
  libelle  VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ---- Table : utilisateur ----
CREATE TABLE utilisateur (
  idUser      INT AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(80)  NOT NULL,
  prenom      VARCHAR(80)  NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  motDePasse  VARCHAR(255) NOT NULL,
  idRole      INT NOT NULL,
  CONSTRAINT fk_user_role FOREIGN KEY (idRole)
      REFERENCES role(idRole) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---- Table : client ----
CREATE TABLE client (
  idClient   INT AUTO_INCREMENT PRIMARY KEY,
  nom        VARCHAR(120) NOT NULL,
  contact    VARCHAR(120),
  telephone  VARCHAR(30)
) ENGINE=InnoDB;

-- ---- Table : projet ----
CREATE TABLE projet (
  idProjet     INT AUTO_INCREMENT PRIMARY KEY,
  code         VARCHAR(20)  NOT NULL UNIQUE,
  nom          VARCHAR(150) NOT NULL,
  description  TEXT,
  dateDebut    DATE,
  dateFin      DATE,
  statut       ENUM('Planifie','En cours','Termine','Suspendu') DEFAULT 'Planifie',
  idClient     INT NOT NULL,
  idChef       INT NOT NULL,
  CONSTRAINT fk_projet_client FOREIGN KEY (idClient)
      REFERENCES client(idClient) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_projet_chef FOREIGN KEY (idChef)
      REFERENCES utilisateur(idUser) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---- Table : chantier ----
CREATE TABLE chantier (
  idChantier    INT AUTO_INCREMENT PRIMARY KEY,
  nom           VARCHAR(150) NOT NULL,
  localisation  VARCHAR(200),
  dateDebut     DATE,
  dateFin       DATE,
  avancement    INT DEFAULT 0,
  statut        ENUM('Planifie','En cours','Termine','Suspendu') DEFAULT 'Planifie',
  idProjet      INT NOT NULL,
  CONSTRAINT fk_chantier_projet FOREIGN KEY (idProjet)
      REFERENCES projet(idProjet) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---- Table : tache ----
CREATE TABLE tache (
  idTache       INT AUTO_INCREMENT PRIMARY KEY,
  titre         VARCHAR(150) NOT NULL,
  description   TEXT,
  dateEcheance  DATE,
  statut        ENUM('A faire','En cours','Termine') DEFAULT 'A faire',
  idChantier    INT NOT NULL,
  idUser        INT,
  CONSTRAINT fk_tache_chantier FOREIGN KEY (idChantier)
      REFERENCES chantier(idChantier) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_tache_user FOREIGN KEY (idUser)
      REFERENCES utilisateur(idUser) ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---- Table : rapport_avancement ----
CREATE TABLE rapport_avancement (
  idRapport     INT AUTO_INCREMENT PRIMARY KEY,
  dateRapport   DATE NOT NULL,
  pourcentage   INT  DEFAULT 0,
  description   TEXT,
  photo         VARCHAR(255),
  idChantier    INT NOT NULL,
  idUser        INT NOT NULL,
  CONSTRAINT fk_rapport_chantier FOREIGN KEY (idChantier)
      REFERENCES chantier(idChantier) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_rapport_user FOREIGN KEY (idUser)
      REFERENCES utilisateur(idUser) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---- Table : document ----
CREATE TABLE document (
  idDocument    INT AUTO_INCREMENT PRIMARY KEY,
  nom           VARCHAR(150) NOT NULL,
  type          VARCHAR(50),
  cheminFichier VARCHAR(255) NOT NULL,
  dateDepot     DATE,
  idProjet      INT NOT NULL,
  idUser        INT NOT NULL,
  CONSTRAINT fk_doc_projet FOREIGN KEY (idProjet)
      REFERENCES projet(idProjet) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_doc_user FOREIGN KEY (idUser)
      REFERENCES utilisateur(idUser) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =====================================================================
--  Donnees de base (jeu d'essai)
-- =====================================================================

INSERT INTO role (libelle) VALUES
  ('Administrateur'), ('Chef de projet'), ('Ingenieur'), ('Technicien');

-- Mots de passe en clair pour les tests ; l'application les remplace par
-- des versions hachees (bcrypt) via le script hashPasswords.js
INSERT INTO utilisateur (nom, prenom, email, motDePasse, idRole) VALUES
  ('Naciri', 'Youssef', 'admin@batisuivi.ma',     'admin123', 1),
  ('Alaoui', 'Salma',   'chef@batisuivi.ma',      'chef123',  2),
  ('Bennani','Leila',   'ingenieur@batisuivi.ma', 'ing123',   3),
  ('Tazi',   'Ahmed',   'technicien@batisuivi.ma','tech123',  4);

INSERT INTO client (nom, contact, telephone) VALUES
  ('SCI Manar', 'M. Karim', '0537000000'),
  ('Ministere de l''Equipement', 'Direction technique', '0537111111');

INSERT INTO projet (code, nom, description, dateDebut, dateFin, statut, idClient, idChef) VALUES
  ('PRJ-014', 'Residence Al Manar', 'Construction d''une residence R+4', '2026-03-12', '2026-09-30', 'En cours', 1, 2),
  ('PRJ-013', 'Pont Oued Bouregreg', 'Etude et suivi d''un ouvrage d''art', '2026-02-02', '2026-12-15', 'En cours', 2, 2);

INSERT INTO chantier (nom, localisation, dateDebut, avancement, statut, idProjet) VALUES
  ('Residence Al Manar - Gros oeuvre', 'Rabat', '2026-03-12', 65, 'En cours', 1),
  ('Pont Bouregreg - Fondations', 'Sale', '2026-02-10', 45, 'En cours', 2);

INSERT INTO tache (titre, dateEcheance, statut, idChantier, idUser) VALUES
  ('Coulage dalle 3e etage', '2026-06-18', 'En cours', 1, 4),
  ('Plan de coffrage 4e etage', '2026-06-24', 'A faire', 1, 3),
  ('Elevation murs niveau 2', '2026-06-07', 'Termine', 1, 4);

INSERT INTO rapport_avancement (dateRapport, pourcentage, description, idChantier, idUser) VALUES
  ('2026-06-14', 65, 'Coulage de la dalle du 3e etage termine.', 1, 4),
  ('2026-06-07', 50, 'Elevation des murs porteurs niveau 2.', 1, 4);