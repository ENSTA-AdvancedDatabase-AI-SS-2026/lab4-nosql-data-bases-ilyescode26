/**
 * TP2 - Exercice 3 : Pipelines d'Agrégation
 * Use Case : Statistiques médicales HealthCare DZ
 */

use("medical_db");

// ─── 3.1 : Distribution des diagnostics par wilaya ────────────────────────────
print("=== 3.1 : Top diagnostics par wilaya ===");

const diagParWilaya = db.patients.aggregate([
  { $unwind: "$consultations" },
  { $group: { _id: { wilaya: "$adresse.wilaya", diagnostic: "$consultations.diagnostic" }, count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 20 }
]).toArray();

// printjson(diagParWilaya);

// ─── 3.2 : Médicament le plus prescrit par spécialité ─────────────────────────
print("\n=== 3.2 : Top médicaments par spécialité ===");

const medsParSpecialite = db.patients.aggregate([
  { $unwind: "$consultations" },
  { $unwind: "$consultations.medicaments" },
  { $group: { _id: { specialite: "$consultations.medecin.specialite", medicament: "$consultations.medicaments.nom" }, count: { $sum: 1 } } },
  { $sort: { "_id.specialite": 1, count: -1 } },
  { $group: { _id: "$_id.specialite", topMedicament: { $first: "$_id.medicament" }, count: { $first: "$count" } } }
]).toArray();

// ─── 3.3 : Évolution mensuelle des consultations ──────────────────────────────
print("\n=== 3.3 : Consultations par mois (12 derniers mois) ===");

const evolutionMensuelle = db.patients.aggregate([
  { $unwind: "$consultations" },
  { $match: {
    "consultations.date": {
      $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    }
  }},
  { $group: { _id: { annee: { $year: "$consultations.date" }, mois: { $month: "$consultations.date" } }, count: { $sum: 1 } } },
  { $sort: { "_id.annee": 1, "_id.mois": 1 } },
  { $project: { _id: 0, periode: { $concat: [{ $toString: "$_id.annee" }, "-", { $cond: { if: { $lt: ["$_id.mois", 10] }, then: { $concat: ["0", { $toString: "$_id.mois" }] }, else: { $toString: "$_id.mois" } } }] }, consultations: "$count" } }
]).toArray();

// ─── 3.4 : Patients à risque multiple ────────────────────────────────────────
print("\n=== 3.4 : Profil patients à risque élevé ===");

const patientsRisque = db.patients.aggregate([
  {
    $match: {
      antecedents: { $all: ["Diabète type 2", "HTA"] }
    }
  },
  { $addFields: { age: { $floor: { $divide: [{ $subtract: [new Date(), "$dateNaissance"] }, 31536000000] } } } },
  { $match: { age: { $gt: 60 } } },
  { $addFields: { nbConsultations: { $size: "$consultations" } } },
  { $group: { _id: null, totalPatients: { $sum: 1 }, ageMoyen: { $avg: "$age" }, consultationsMoyennes: { $avg: "$nbConsultations" } } }
]).toArray();

// ─── 3.5 : Rapport médecins ───────────────────────────────────────────────────
print("\n=== 3.5 : Top 5 médecins & taux de ré-consultation ===");

const rapportMedecins = db.patients.aggregate([
  { $unwind: "$consultations" },
  { $group: { _id: "$consultations.medecin.nom", totalConsultations: { $sum: 1 }, patientsUniques: { $addToSet: "$_id" } } },
  { $addFields: { nbPatientsUniques: { $size: "$patientsUniques" }, tauxReconsultation: { $multiply: [{ $divide: [{ $subtract: ["$totalConsultations", { $size: "$patientsUniques" }] }, { $size: "$patientsUniques" }] }, 100] } } },
  { $sort: { totalConsultations: -1 } },
  { $limit: 5 },
  { $project: { medecin: "$_id", totalConsultations: 1, patientsUniques: "$nbPatientsUniques", tauxReconsultation: { $round: ["$tauxReconsultation", 1] } } }
]).toArray();

printjson(rapportMedecins);
