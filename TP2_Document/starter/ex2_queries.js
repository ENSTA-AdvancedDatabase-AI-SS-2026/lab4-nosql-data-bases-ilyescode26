/**
 * TP2 - Exercice 2 : Requêtes de base MongoDB
 * Use Case : HealthCare DZ - Requêtes patients
 */

use("medical_db");

// ─── 2.1 : Patients diabétiques de plus de 50 ans à Alger ─────────────────────
print("=== 2.1 : Diabétiques > 50 ans à Alger ===");

const diabetiquesAlger = db.patients.find({
  "adresse.wilaya": "Alger",
  antecedents: "Diabète type 2",
  dateNaissance: { $lte: new Date(new Date().setFullYear(new Date().getFullYear() - 50)) }
}).toArray();

printjson(diabetiquesAlger.map(p => ({ nom: p.nom, prenom: p.prenom, age: Math.floor((new Date() - p.dateNaissance) / 31536000000) })));

// ─── 2.2 : Patients allergiques à la Pénicilline avec ≥3 consultations ─────────
print("\n=== 2.2 : Allergiques Pénicilline avec ≥3 consultations ===");

const allergiques = db.patients.find({
  allergies: "Pénicilline",
  $expr: { $gte: [{ $size: "$consultations" }, 3] }
}).toArray();

printjson(allergiques.map(p => ({ nom: p.nom, prenom: p.prenom, nbConsultations: p.consultations.length })));

// ─── 2.3 : Projection : Nom, prénom, et dernière consultation ───────────────────
print("\n=== 2.3 : Dernière consultation par patient ===");

const derniereConsultation = db.patients.find({}, {
  nom: 1,
  prenom: 1,
  "consultations": { $slice: -1 }
}).toArray();

printjson(derniereConsultation.map(p => ({
  nom: p.nom,
  prenom: p.prenom,
  derniereConsultation: p.consultations[0] || null
})));

// ─── 2.4 : Patients sans antécédents, tension systolique > 140 en dernière consult ─
print("\n=== 2.4 : Sans antécédents, tension > 140 ===");

const sansAntecedents = db.patients.find({
  antecedents: { $size: 0 }
}).toArray();

const tensionElevee = sansAntecedents.filter(p => {
  if (!p.consultations || p.consultations.length === 0) return false;
  const last = p.consultations[p.consultations.length - 1];
  return last.tension && last.tension.systolique > 140;
});

printjson(tensionElevee.map(p => ({
  nom: p.nom,
  prenom: p.prenom,
  derniereTension: p.consultations[p.consultations.length - 1].tension
})));

// ─── 2.5 : Recherche textuelle sur les diagnostics ───────────────────────────────
print("\n=== 2.5 : Recherche textuelle 'Hypertension' ===");

// Créer l'index texte si pas encore créé
db.patients.createIndex({ "consultations.diagnostic": "text" });

const rechercheTexte = db.patients.find(
  { $text: { $search: "Hypertension" } },
  { score: { $meta: "textScore" }, nom: 1, prenom: 1, "consultations.diagnostic": 1 }
).sort({ score: { $meta: "textScore" } }).toArray();

printjson(rechercheTexte.map(p => ({ nom: p.nom, prenom: p.prenom, score: p.score })));

print("\n✅ Exercice 2 terminé.");
