# TP4 - Neo4j : Réseau Social Étudiant UniConnect DZ

## Objectifs
Modéliser un réseau social étudiant avec Neo4j et explorer les algorithmes de graphe.

## Exercices Réalisés

### Exercice 1 - Création du Graphe
**Fichier**: `ex1_create_graph.cypher`

**Données créées**:
- **50 étudiants** avec noms algériens répartis sur 5 universités (USTHB, UMBB, USTO, UMC, UBMA)
- **5 cours** (Bases de Données Avancées, IA, Dev Web, Systèmes Distribués, Cloud)
- **10 compétences** (Python, SQL, NoSQL, ML, DL, React, Docker, Linux, Java, Réseaux)

**Relations** (générées de manière simple et automatique) :

| Relation | Type | Méthode |
|-----------|------|---------|
| **CONNAIT** | Social | Chaîne par université (IDs finissant par 1 ou 6) + liens inter-universités |
| **SUIT** | Académique | 2 cours par étudiant via calcul sur ID (modulo) |
| **MAITRISE** | Compétences | 2 compétences par étudiant avec niveaux variés (Avancé/Intermédiaire/Débutant) |

**Pourquoi cette approche simple ?**
Au lieu de 150+ lignes de `MATCH MERGE` manuelles, on utilise des requêtes Cypher avec `modulo` sur l'ID étudiant pour distribuer automatiquement cours et compétences. Le graphe reste connexe grâce aux 5 liens inter-universités.

### Exercice 3 - Algorithmes de Graphe (GDS)
**Fichier**: `ex3_graph_algorithms.cypher`

**Algorithmes implémentés**:

| Algorithme | Objectif | Résultat |
|-----------|----------|----------|
| **shortestPath** | Plus court chemin Ahmed → Yasmina | Chemin avec intermédiaires |
| **degree centrality** | Top 10 étudiants les plus connectés | Nombre de connexions par étudiant |
| **Louvain** | Détection de communautés | Groupes d'étudiants liés (par université/filière) |
| **Recommandation** | Suggérer des contacts à Ahmed | Score = amis_communs×3 + cours_communs×2 + même_filière×1 |
| **Path compétences** | Quels cours mènent à ML ? | Parcours d'apprentissage via `[:REQUIERT*]` |

---

## Requête de Recommandation Expliquée

```cypher
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
       nbAmisCommuns * 3 + nbCoursCommuns * 2 + memeFiliere AS score
ORDER BY score DESC LIMIT 5;
```

**Étapes**:
1. Collecter les amis d'Ahmed
2. Trouver les candidats non-connectés
3. Compter amis en commun × 3
4. Compter cours en commun × 2
5. Bonus +1 si même filière
6. Trier par score décroissant

---

## Résultats
Graphe social de 50 étudiants avec relations CONNAIT, SUIT et MAITRISE. Algorithmes GDS exécutables pour centralité, communautés et recommandations.
