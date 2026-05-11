// TP4 - Exercice 1 : Création du graphe UniConnect DZ
// Effacer la base pour partir propre
MATCH (n) DETACH DELETE n;

// ─── 1.1 : Contraintes d'unicité ─────────────────────────────────────────────
CREATE CONSTRAINT etudiant_id IF NOT EXISTS FOR (e:Etudiant) REQUIRE e.id IS UNIQUE;
CREATE CONSTRAINT cours_code IF NOT EXISTS FOR (c:Cours) REQUIRE c.code IS UNIQUE;
CREATE CONSTRAINT competence_nom IF NOT EXISTS FOR (c:Competence) REQUIRE c.nom IS UNIQUE;

// ─── 1.2 : Créer les compétences ──────────────────────────────────────────────
UNWIND [
  {nom: "Python", categorie: "Programmation"},
  {nom: "Java", categorie: "Programmation"},
  {nom: "SQL", categorie: "Bases de Données"},
  {nom: "NoSQL", categorie: "Bases de Données"},
  {nom: "Machine Learning", categorie: "IA"},
  {nom: "Deep Learning", categorie: "IA"},
  {nom: "React", categorie: "Web"},
  {nom: "Docker", categorie: "DevOps"},
  {nom: "Linux", categorie: "Systèmes"},
  {nom: "Réseaux", categorie: "Infrastructure"}
] AS comp
MERGE (:Competence {nom: comp.nom, categorie: comp.categorie});

// ─── 1.3 : Créer les cours ────────────────────────────────────────────────────
UNWIND [
  {code: "INFO401", intitule: "Bases de Données Avancées", credits: 6, dept: "Informatique"},
  {code: "INFO402", intitule: "Intelligence Artificielle", credits: 6, dept: "Informatique"},
  {code: "INFO403", intitule: "Développement Web", credits: 4, dept: "Informatique"},
  {code: "INFO404", intitule: "Systèmes Distribués", credits: 5, dept: "Informatique"},
  {code: "INFO405", intitule: "Cloud Computing", credits: 4, dept: "Informatique"}
] AS cours
MERGE (:Cours {code: cours.code, intitule: cours.intitule, 
               credits: cours.credits, departement: cours.dept});

// ─── 1.4 : Créer les étudiants ────────────────────────────────────────────────
UNWIND [
  {id: "E001", prenom: "Ahmed", nom: "Bensalem", universite: "USTHB", filiere: "Informatique", annee: 3, ville: "Alger"},
  {id: "E002", prenom: "Fatima", nom: "Ouali", universite: "USTHB", filiere: "Informatique", annee: 3, ville: "Alger"},
  {id: "E003", prenom: "Karim", nom: "Zerrouki", universite: "USTHB", filiere: "GL", annee: 2, ville: "Alger"},
  {id: "E004", prenom: "Aicha", nom: "Amara", universite: "USTHB", filiere: "Mathématiques", annee: 3, ville: "Alger"},
  {id: "E005", prenom: "Sofiane", nom: "Boumediene", universite: "USTHB", filiere: "Electronique", annee: 1, ville: "Alger"},
  {id: "E006", prenom: "Nadia", nom: "Hamidi", universite: "USTHB", filiere: "Telecoms", annee: 4, ville: "Alger"},
  {id: "E007", prenom: "Rachid", nom: "Cherifi", universite: "USTHB", filiere: "Informatique", annee: 3, ville: "Alger"},
  {id: "E008", prenom: "Yasmine", nom: "Lounis", universite: "USTHB", filiere: "GL", annee: 2, ville: "Alger"},
  {id: "E009", prenom: "Mohamed", nom: "Saidi", universite: "USTHB", filiere: "Informatique", annee: 3, ville: "Alger"},
  {id: "E010", prenom: "Samira", nom: "Belkacem", universite: "USTHB", filiere: "Mathématiques", annee: 2, ville: "Alger"},
  {id: "E011", prenom: "Lamine", nom: "Kaci", universite: "UMBB", filiere: "Informatique", annee: 3, ville: "Boumerdes"},
  {id: "E012", prenom: "Ines", nom: "Djebbar", universite: "UMBB", filiere: "GL", annee: 1, ville: "Boumerdes"},
  {id: "E013", prenom: "Dalila", nom: "Zerrouki", universite: "UMBB", filiere: "Electronique", annee: 4, ville: "Boumerdes"},
  {id: "E014", prenom: "Tarek", nom: "Hamidi", universite: "UMBB", filiere: "Telecoms", annee: 2, ville: "Boumerdes"},
  {id: "E015", prenom: "Latifa", nom: "Mekhloufi", universite: "UMBB", filiere: "Informatique", annee: 3, ville: "Boumerdes"},
  {id: "E016", prenom: "Mehdi", nom: "Boussouf", universite: "UMBB", filiere: "GL", annee: 2, ville: "Boumerdes"},
  {id: "E017", prenom: "Fatiha", nom: "Amara", universite: "UMBB", filiere: "Mathématiques", annee: 3, ville: "Boumerdes"},
  {id: "E018", prenom: "Khaled", nom: "Boudiaf", universite: "UMBB", filiere: "Informatique", annee: 1, ville: "Boumerdes"},
  {id: "E019", prenom: "Sabrina", nom: "Mokrani", universite: "UMBB", filiere: "Electronique", annee: 4, ville: "Boumerdes"},
  {id: "E020", prenom: "Amine", nom: "Khelifi", universite: "UMBB", filiere: "Telecoms", annee: 2, ville: "Boumerdes"},
  {id: "E021", prenom: "Hocine", nom: "Boualem", universite: "USTO", filiere: "Informatique", annee: 3, ville: "Oran"},
  {id: "E022", prenom: "Nawel", nom: "Touati", universite: "USTO", filiere: "GL", annee: 2, ville: "Oran"},
  {id: "E023", prenom: "Meriem", nom: "Boualem", universite: "USTO", filiere: "Mathématiques", annee: 1, ville: "Oran"},
  {id: "E024", prenom: "Omar", nom: "Ziani", universite: "USTO", filiere: "Electronique", annee: 4, ville: "Oran"},
  {id: "E025", prenom: "Lamia", nom: "Bensalem", universite: "USTO", filiere: "Telecoms", annee: 3, ville: "Oran"},
  {id: "E026", prenom: "Sami", nom: "Hamidi", universite: "USTO", filiere: "Informatique", annee: 2, ville: "Oran"},
  {id: "E027", prenom: "Rania", nom: "Cherifi", universite: "USTO", filiere: "GL", annee: 1, ville: "Oran"},
  {id: "E028", prenom: "Youcef", nom: "Mekhloufi", universite: "USTO", filiere: "Mathématiques", annee: 3, ville: "Oran"},
  {id: "E029", prenom: "Sarah", nom: "Djebbar", universite: "USTO", filiere: "Electronique", annee: 4, ville: "Oran"},
  {id: "E030", prenom: "Malik", nom: "Boussouf", universite: "USTO", filiere: "Telecoms", annee: 2, ville: "Oran"},
  {id: "E031", prenom: "Asma", nom: "Hamidi", universite: "UMC", filiere: "Informatique", annee: 3, ville: "Constantine"},
  {id: "E032", prenom: "Hamza", nom: "Kaci", universite: "UMC", filiere: "GL", annee: 2, ville: "Constantine"},
  {id: "E033", prenom: "Lina", nom: "Zerrouki", universite: "UMC", filiere: "Mathématiques", annee: 1, ville: "Constantine"},
  {id: "E034", prenom: "Walid", nom: "Bensalem", universite: "UMC", filiere: "Electronique", annee: 4, ville: "Constantine"},
  {id: "E035", prenom: "Nesrine", nom: "Ouali", universite: "UMC", filiere: "Telecoms", annee: 3, ville: "Constantine"},
  {id: "E036", prenom: "Faycal", nom: "Amara", universite: "UMC", filiere: "Informatique", annee: 2, ville: "Constantine"},
  {id: "E037", prenom: "Imene", nom: "Boudiaf", universite: "UMC", filiere: "GL", annee: 1, ville: "Constantine"},
  {id: "E038", prenom: "Reda", nom: "Mokrani", universite: "UMC", filiere: "Mathématiques", annee: 3, ville: "Constantine"},
  {id: "E039", prenom: "Yousra", nom: "Touati", universite: "UMC", filiere: "Electronique", annee: 4, ville: "Constantine"},
  {id: "E040", prenom: "Kamel", nom: "Khelifi", universite: "UMC", filiere: "Telecoms", annee: 2, ville: "Constantine"},
  {id: "E041", prenom: "Sonia", nom: "Djebbar", universite: "UBMA", filiere: "Informatique", annee: 3, ville: "Bejaia"},
  {id: "E042", prenom: "Adel", nom: "Hamidi", universite: "UBMA", filiere: "GL", annee: 2, ville: "Bejaia"},
  {id: "E043", prenom: "Djamila", nom: "Cherifi", universite: "UBMA", filiere: "Mathématiques", annee: 1, ville: "Bejaia"},
  {id: "E044", prenom: "Farid", nom: "Boualem", universite: "UBMA", filiere: "Electronique", annee: 4, ville: "Bejaia"},
  {id: "E045", prenom: "Amel", nom: "Zerrouki", universite: "UBMA", filiere: "Telecoms", annee: 3, ville: "Bejaia"},
  {id: "E046", prenom: "Bilal", nom: "Mekhloufi", universite: "UBMA", filiere: "Informatique", annee: 2, ville: "Bejaia"},
  {id: "E047", prenom: "Zohra", nom: "Bensalem", universite: "UBMA", filiere: "GL", annee: 1, ville: "Bejaia"},
  {id: "E048", prenom: "Nabil", nom: "Ouali", universite: "UBMA", filiere: "Mathématiques", annee: 3, ville: "Bejaia"},
  {id: "E049", prenom: "Hanane", nom: "Boudiaf", universite: "UBMA", filiere: "Electronique", annee: 4, ville: "Bejaia"},
  {id: "E050", prenom: "Said", nom: "Mokrani", universite: "UBMA", filiere: "Telecoms", annee: 2, ville: "Bejaia"}
] AS data
MERGE (e:Etudiant {id: data.id})
SET e += data;

// ─── 1.5 : Relations CONNAIT (simple : chaîne par université + liens inter-univ) ──
// Liens au sein de chaque université (chaîne simple)
MATCH (e1:Etudiant), (e2:Etudiant)
WHERE e1.universite = e2.universite AND e1.id < e2.id
  AND (e1.id ENDS WITH "1" OR e1.id ENDS WITH "6")
MERGE (e1)-[:CONNAIT {depuis: 2022 + toInteger(right(e1.id, 1)) % 3}]->(e2);

// Liens inter-universités pour rendre le graphe connexe
MATCH (a:Etudiant {id: "E001"}), (b:Etudiant {id: "E011"}) MERGE (a)-[:CONNAIT {depuis: 2023}]->(b);
MATCH (a:Etudiant {id: "E011"}), (b:Etudiant {id: "E021"}) MERGE (a)-[:CONNAIT {depuis: 2023}]->(b);
MATCH (a:Etudiant {id: "E021"}), (b:Etudiant {id: "E031"}) MERGE (a)-[:CONNAIT {depuis: 2023}]->(b);
MATCH (a:Etudiant {id: "E031"}), (b:Etudiant {id: "E041"}) MERGE (a)-[:CONNAIT {depuis: 2023}]->(b);
MATCH (a:Etudiant {id: "E001"}), (b:Etudiant {id: "E021"}) MERGE (a)-[:CONNAIT {depuis: 2022}]->(b);

// ─── 1.6 : Relations SUIT (chaque étudiant suit 2-3 cours aléatoires) ─────────
MATCH (e:Etudiant)
WITH e, ["INFO401", "INFO402", "INFO403", "INFO404", "INFO405"] AS codes
WITH e, codes[toInteger(right(e.id, 2)) % 5] AS c1,
         codes[(toInteger(right(e.id, 2)) + 1) % 5] AS c2,
         codes[(toInteger(right(e.id, 2)) + 2) % 5] AS c3
MATCH (cours1:Cours {code: c1}), (cours2:Cours {code: c2})
MERGE (e)-[:SUIT {note: 10 + (toInteger(right(e.id, 2)) % 8), annee: 2024}]->(cours1)
MERGE (e)-[:SUIT {note: 10 + ((toInteger(right(e.id, 2)) + 3) % 8), annee: 2024}]->(cours2);

// ─── 1.7 : Relations MAITRISE (2 compétences par étudiant) ────────────────────
MATCH (e:Etudiant)
WITH e, ["Python", "SQL", "NoSQL", "Machine Learning", "Deep Learning", "React", "Docker", "Linux", "Java", "Réseaux"] AS comps
WITH e, comps[toInteger(right(e.id, 2)) % 10] AS comp1,
         comps[(toInteger(right(e.id, 2)) + 3) % 10] AS comp2
MATCH (c1:Competence {nom: comp1}), (c2:Competence {nom: comp2})
MERGE (e)-[:MAITRISE {niveau: CASE WHEN toInteger(right(e.id, 2)) % 3 = 0 THEN "Avancé" WHEN toInteger(right(e.id, 2)) % 3 = 1 THEN "Intermédiaire" ELSE "Débutant" END, depuis: 2022 + (toInteger(right(e.id, 2)) % 3)}]->(c1)
MERGE (e)-[:MAITRISE {niveau: CASE WHEN toInteger(right(e.id, 2)) % 2 = 0 THEN "Intermédiaire" ELSE "Débutant" END, depuis: 2023}]->(c2);

// Vérification
MATCH (n) RETURN labels(n)[0] AS type, count(n) AS total ORDER BY total DESC;
MATCH ()-[r]->() RETURN type(r) AS relation, count(r) AS total ORDER BY total DESC;
