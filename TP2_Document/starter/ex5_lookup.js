/**
 * TP2 - Exercice 5 : $lookup et Données Référencées
 * Use Case : HealthCare DZ - Jointures patients/analyses
 */

use("medical_db");

// ─── 5.1 : Joindre patients et analyses pour récupérer le dossier complet ──────
print("=== 5.1 : Dossier complet patient avec analyses ===");

const dossierComplet = db.patients.aggregate([
  { $match: { cin: "198001012300" } },
  {
    $lookup: {
      from: "analyses",
      localField: "_id",
      foreignField: "patient_id",
      as: "analyses_patient"
    }
  },
  {
    $project: {
      nom: 1,
      prenom: 1,
      cin: 1,
      nbConsultations: { $size: "$consultations" },
      nbAnalyses: { $size: "$analyses_patient" },
      analyses: "$analyses_patient"
    }
  }
]).toArray();

printjson(dossierComplet);

// ─── 5.2 : Patients dont la glycémie dépasse 1.26 g/L ──────────────────────────
print("\n=== 5.2 : Patients avec glycémie > 1.26 g/L ===");

const hyperglycemie = db.analyses.aggregate([
  { $match: { type: "Glycémie", "resultats.valeur": { $gt: 1.26 } } },
  {
    $lookup: {
      from: "patients",
      localField: "patient_id",
      foreignField: "_id",
      as: "patient"
    }
  },
  { $unwind: "$patient" },
  {
    $project: {
      nom: "$patient.nom",
      prenom: "$patient.prenom",
      wilaya: "$patient.adresse.wilaya",
      glycemie: "$resultats.valeur",
      dateAnalyse: "$date"
    }
  }
]).toArray();

printjson(hyperglycemie);

// ─── 5.3 : Statistiques croisées : taux d'analyses anormales par wilaya ───────
print("\n=== 5.3 : Taux d'analyses anormales par wilaya ===");

const tauxAnormales = db.analyses.aggregate([
  {
    $lookup: {
      from: "patients",
      localField: "patient_id",
      foreignField: "_id",
      as: "patient"
    }
  },
  { $unwind: "$patient" },
  {
    $group: {
      _id: "$patient.adresse.wilaya",
      totalAnalyses: { $sum: 1 },
      anormales: {
        $sum: { $cond: [{ $eq: ["$resultats.normale", false] }, 1, 0] }
      }
    }
  },
  {
    $addFields: {
      tauxAnormal: {
        $round: [{ $multiply: [{ $divide: ["$anormales", "$totalAnalyses"] }, 100] }, 1]
      }
    }
  },
  { $sort: { tauxAnormal: -1 } }
]).toArray();

printjson(tauxAnormales);

print("\n✅ Exercice 5 terminé.");
