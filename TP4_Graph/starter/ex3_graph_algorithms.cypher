// TP4 - Exercice 3 : Algorithmes de Graphe avec GDS
// Prérequis : Plugin Graph Data Science installé (inclus dans docker-compose)

// ─── 3.1 : Plus court chemin ──────────────────────────────────────────────────
// "Comment Ahmed peut-il rencontrer Yasmina ?"
MATCH p = shortestPath(
  (a:Etudiant {prenom: "Ahmed"})-[:CONNAIT*..10]-(b:Etudiant {prenom: "Yasmina"})
)
RETURN [n IN nodes(p) | n.prenom + " (" + n.universite + ")"] AS chemin,
       length(p) AS nb_intermediaires;


// ─── 3.2 : Centralité de degré ────────────────────────────────────────────────
// Créer la projection du graphe en mémoire
CALL gds.graph.project(
  'reseau_social',
  'Etudiant',
  'CONNAIT'
);

// TODO: Calculer et afficher le top 10 des étudiants les plus connectés
CALL gds.degree.stream('reseau_social')
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).prenom AS etudiant,
       gds.util.asNode(nodeId).universite AS universite,
       score AS nb_connexions
ORDER BY score DESC
LIMIT 10;


// ─── 3.3 : Détection de communautés (Louvain) ────────────────────────────────
// TODO: Exécuter l'algorithme de Louvain et afficher les communautés
CALL gds.louvain.stream('reseau_social')
YIELD nodeId, communityId
WITH communityId, collect(gds.util.asNode(nodeId).prenom) AS membres
RETURN communityId,
       size(membres) AS taille,
       membres[0..5] AS exemple_membres
ORDER BY taille DESC;


// ─── 3.4 : Recommandation de contacts ────────────────────────────────────────
// "Qui Ahmed devrait-il connaître ?" 
// Critères : amis en commun + même cours + même filière

MATCH (moi:Etudiant {prenom: "Ahmed"})-[:CONNAIT]->(ami:Etudiant)
WITH moi, collect(ami) AS amis
MATCH (candidat:Etudiant)
WHERE candidat <> moi AND NOT (moi)-[:CONNAIT]->(candidat)
WITH moi, candidat, amis
MATCH (moi)-[:SUIT]->(mc:Cours)
WITH moi, candidat, amis, collect(mc) AS mesCours
MATCH (candidat)-[:SUIT]->(cc:Cours)
WITH moi, candidat, amis, mesCours, collect(cc) AS candidatCours
MATCH (candidat)-[:CONNAIT]->(amiCommun:Etudiant)
WHERE amiCommun IN amis
WITH candidat, mesCours, candidatCours, count(DISTINCT amiCommun) AS nbAmisCommuns
WITH candidat, nbAmisCommuns,
     size([c IN mesCours WHERE c IN candidatCours]) AS nbCoursCommuns,
     CASE WHEN candidat.filiere = moi.filiere THEN 1 ELSE 0 END AS memeFiliere
RETURN candidat.prenom + " " + candidat.nom AS suggestion,
       candidat.universite AS universite,
       nbAmisCommuns * 3 + nbCoursCommuns * 2 + memeFiliere AS score
ORDER BY score DESC
LIMIT 5;


// ─── 3.5 : Chemin de compétences ─────────────────────────────────────────────
// "Quels cours mènent à Machine Learning ?"
MATCH path = (debut:Cours)-[:REQUIERT*]->(but:Competence {nom: "Machine Learning"})
RETURN [n IN nodes(path) | 
  CASE WHEN n:Cours THEN n.intitule ELSE n.nom END
] AS parcours_apprentissage;


// Nettoyage
CALL gds.graph.drop('reseau_social');
