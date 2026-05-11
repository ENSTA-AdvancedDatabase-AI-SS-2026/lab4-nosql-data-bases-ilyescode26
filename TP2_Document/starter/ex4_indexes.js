/**
 * TP2 - Exercice 4 : Index et Optimisation
 */

use("medical_db");

// ─── 4.1 : Créer les index appropriés ────────────────────────────────────────

// Index 1 : Recherche fréquente par wilaya + antécédents
// Justification: wilaya en premier car égalité, antécédents ensuite pour filtrer rapidement
db.patients.createIndex({ "adresse.wilaya": 1, antecedents: 1 });

// Index 2 : Recherche par date de consultation (pour les requêtes temporelles)
db.patients.createIndex({ "consultations.date": 1 });

// Index 3 : Texte sur diagnostics pour recherche full-text
// Justification: Recherche textuelle rapide sur les diagnostics
db.patients.createIndex({ "consultations.diagnostic": "text" });

// Index 4 : Analyses par patient (pour les $lookup et jointures)
db.analyses.createIndex({ patient_id: 1 });


// ─── 4.2 : Comparer avec explain() ────────────────────────────────────────────

// Requête de test
const requeteTest = {
  "adresse.wilaya": "Alger",
  antecedents: "Diabète type 2"
};

print("=== AVANT index ===");
const avant = db.patients.find(requeteTest).explain("executionStats");
print("totalDocsExamined:", avant.executionStats.totalDocsExamined);
print("nReturned:", avant.executionStats.nReturned);
print("executionTimeMillis:", avant.executionStats.executionTimeMillis);

print("\n=== APRÈS index ===");
const apres = db.patients.find(requeteTest).explain("executionStats");
print("totalDocsExamined:", apres.executionStats.totalDocsExamined);
print("nReturned:", apres.executionStats.nReturned);
print("executionTimeMillis:", apres.executionStats.executionTimeMillis);
print("\nIndex utilisé:", apres.executionStats.inputStage && apres.executionStats.inputStage.indexName || "COLLSCAN");

// ─── 4.4 : Index TTL pour archivage ───────────────────────────────────────────
// 5 ans = 5 * 365 * 24 * 3600 = 157680000 secondes
// Note: MongoDB supprime automatiquement les documents après expiration
db.analyses.createIndex(
  { date: 1 },
  { expireAfterSeconds: 157680000 }
);

print("\n✅ Index créés avec succès.");
print("Index patients:", db.patients.getIndexes().map(i => i.name).join(", "));
print("Index analyses:", db.analyses.getIndexes().map(i => i.name).join(", "));
