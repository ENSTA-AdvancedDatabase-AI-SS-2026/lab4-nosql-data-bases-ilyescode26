# TP2 - MongoDB : Plateforme de Gestion de Dossiers Médicaux

## Objectifs
Modéliser et requêter des dossiers médicaux complexes avec MongoDB pour le cas HealthCare DZ.

## Exercices Réalisés

### Exercice 1 - Modélisation et Insertion
**Fichier**: `ex1_modelisation.js`

**Fonctions réalisées**:
- Création collection `patients` avec validation `$jsonSchema`
- Insertion de **20 patients** avec données algériennes (noms, wilayas, pathologies)
- Insertion de **40 analyses** référencées via `patient_id`

### Exercice 2 - Requêtes de Base
**Fichier**: `ex2_queries.js`

**Requêtes implémentées**:
- Patients diabétiques > 50 ans à Alger
- Allergiques à la Pénicilline avec ≥3 consultations (`$expr` + `$size`)
- Projection dernière consultation (`$slice: -1`)
- Sans antécédents + tension systolique > 140 en dernière consultation
- Recherche textuelle sur diagnostics (`$text` + `$meta: "textScore"`)

### Exercice 3 - Agrégation Avancée
**Fichier**: `ex3_aggregation.js`

**Pipelines implémentées**:
- **3.1** Distribution diagnostics par wilaya (`$unwind` + `$group`)
- **3.2** Médicament le plus prescrit par spécialité (`$group` imbriqué)
- **3.3** Évolution mensuelle consultations sur 12 mois (`$year`/`$month`)
- **3.4** Patients à risque : calcul âge, nombre consultations, stats globales
- **3.5** Top 5 médecins avec taux de ré-consultation (`$addToSet`, `$size`)

### Exercice 4 - Index et Optimisation
**Fichier**: `ex4_indexes.js`

**Index créés**:
- Composé `adresse.wilaya` + `antecedents`
- `consultations.date` pour requêtes temporelles
- Texte `consultations.diagnostic` pour full-text
- `analyses.patient_id` pour `$lookup`
- **TTL** sur `analyses.date` (5 ans = 157 680 000 secondes)

### Exercice 5 - `$lookup` et Données Référencées
**Fichier**: `ex5_lookup.js`

**Jointures réalisées**:
- Dossier complet patient + analyses (`$lookup` from analyses)
- Patients avec glycémie > 1.26 g/L (`$lookup` + filtre)
- Taux d'analyses anormales par wilaya (`$lookup` + `$group` + ratio)

---

## Justification Embedding vs Referencing

| Collection | Choix | Justification |
|-----------|-------|---------------|
| **Consultations** | **Embedding** dans `patients` | Accès fréquent ensemble. Un patient est lu avec ses consultations 99% du temps. Évite les `$lookup` coûteux. |
| **Analyses** | **Referencing** (`patient_id`) | Volume important et indépendant. Les analyses ont leur propre cycle de vie (archivage TTL). Réduit la taille du document patient. |

---

## Comparaison Performance : Avant vs Après Index

| Métrique | Sans Index (COLLSCAN) | Avec Index | Gain |
|----------|----------------------|------------|------|
| `totalDocsExamined` | 20 | 3 | **-85%** |
| `nReturned` | 3 | 3 | = |
| `executionTimeMillis` | ~5 | ~1 | **-80%** |
| **Index utilisé** | Aucun | `adresse.wilaya_1_antecedents_1` | ✅ |

**Requête testée** : `{ "adresse.wilaya": "Alger", antecedents: "Diabète type 2" }`

---

## Requête la Plus Complexe : Top 5 Médecins avec Taux de Ré-Consultation

**Pipeline** (`ex3_aggregation.js` - 3.5) :

```javascript
db.patients.aggregate([
  // Étape 1 : Dérouler chaque consultation
  { $unwind: "$consultations" },

  // Étape 2 : Grouper par médecin
  // totalConsultations = nombre de lignes
  // patientsUniques = ensemble des _id patient (évite les doublons)
  { $group: { 
      _id: "$consultations.medecin.nom",
      totalConsultations: { $sum: 1 },
      patientsUniques: { $addToSet: "$_id" }
  }},

  // Étape 3 : Calculer le taux de ré-consultation
  // (total - uniques) / uniques * 100
  { $addFields: { 
      nbPatientsUniques: { $size: "$patientsUniques" },
      tauxReconsultation: { 
        $multiply: [
          { $divide: [
            { $subtract: ["$totalConsultations", { $size: "$patientsUniques" }] },
            { $size: "$patientsUniques" }
          ]},
          100
        ]
      }
  }},

  // Étape 4 : Trier et garder le top 5
  { $sort: { totalConsultations: -1 } },
  { $limit: 5 },

  // Étape 5 : Formater le résultat
  { $project: { 
      medecin: "$_id",
      totalConsultations: 1,
      patientsUniques: "$nbPatientsUniques",
      tauxReconsultation: { $round: ["$tauxReconsultation", 1] }
  }}
])
```

**Pourquoi c'est complexe** :
- Nécessite `$addToSet` pour détecter les patients uniques
- Calcul mathématique imbriqué (`$subtract` → `$divide` → `$multiply`)
- Round à 1 décimale pour lisibilité
- Mesure indirecte de la fidélité patient via le taux de ré-consultation

---

## Résultats
Tous les exercices sont fonctionnels et démontrent l'utilisation efficace de MongoDB pour un cas d'usage médical complexe avec données embarquées et référencées.
