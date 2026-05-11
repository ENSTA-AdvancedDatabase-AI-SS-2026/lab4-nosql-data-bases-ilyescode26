/**
 * TP2 - Exercice 1 : Modélisation MongoDB
 * Use Case : HealthCare DZ - Dossiers Médicaux
 */

// Se connecter à la base médicale
use("medical_db");

// ─── 1.1 : Créer la collection avec validation ────────────────────────────────
db.createCollection("patients", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["cin", "nom", "prenom", "dateNaissance", "sexe"],
      properties: {
        cin: { bsonType: "string", description: "CIN obligatoire" },
        nom: { bsonType: "string", description: "Nom obligatoire" },
        prenom: { bsonType: "string", description: "Prénom obligatoire" },
        dateNaissance: { bsonType: "date", description: "Date de naissance obligatoire" },
        sexe: { enum: ["M", "F"], description: "Sexe: M ou F" },
        adresse: {
          bsonType: "object",
          properties: {
            wilaya: { bsonType: "string" },
            commune: { bsonType: "string" }
          }
        },
        groupeSanguin: { bsonType: "string" },
        antecedents: { bsonType: "array", items: { bsonType: "string" } },
        allergies: { bsonType: "array", items: { bsonType: "string" } },
        consultations: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              id: { bsonType: "binData" },
              date: { bsonType: "date" },
              medecin: { bsonType: "object" },
              diagnostic: { bsonType: "string" },
              tension: { bsonType: "object" },
              medicaments: { bsonType: "array" },
              notes: { bsonType: "string" }
            }
          }
        }
      }
    }
  }
});

// ─── 1.2 : Insérer des patients avec données algériennes ──────────────────────
// TODO: Insérer au moins 20 patients avec :
// - Prénoms et noms algériens variés
// - Wilayas différentes (Alger, Oran, Constantine, Annaba, Blida...)
// - Pathologies courantes (Diabète, HTA, Asthme, etc.)
// - Au moins 2-5 consultations par patient
// - Dates réalistes sur les 2 dernières années

const patients = [
  {
    cin: "198001012300",
    nom: "Bensalem",
    prenom: "Ahmed",
    dateNaissance: new Date("1980-01-01"),
    sexe: "M",
    adresse: { wilaya: "Alger", commune: "Bab Ezzouar" },
    groupeSanguin: "O+",
    antecedents: ["Diabète type 2", "HTA"],
    allergies: ["Pénicilline"],
    consultations: [
      { id: UUID(), date: new Date("2024-01-15"), medecin: { nom: "Dr. Mansouri", specialite: "Cardiologie" }, diagnostic: "Hypertension artérielle", tension: { systolique: 145, diastolique: 92 }, medicaments: [{ nom: "Amlodipine", dosage: "5mg", duree: "30 jours" }], notes: "Surveillance tensionnelle" },
      { id: UUID(), date: new Date("2024-03-10"), medecin: { nom: "Dr. Mansouri", specialite: "Cardiologie" }, diagnostic: "Contrôle HTA", tension: { systolique: 130, diastolique: 85 }, medicaments: [{ nom: "Amlodipine", dosage: "5mg", duree: "30 jours" }], notes: "Tension stable" },
      { id: UUID(), date: new Date("2024-06-20"), medecin: { nom: "Dr. Kaci", specialite: "Endocrinologie" }, diagnostic: "Contrôle diabète", tension: { systolique: 132, diastolique: 84 }, medicaments: [{ nom: "Metformine", dosage: "500mg", duree: "60 jours" }], notes: "HbA1c: 7.2%" }
    ]
  },
  {
    cin: "196503152200",
    nom: "Merad",
    prenom: "Fatima",
    dateNaissance: new Date("1965-03-15"),
    sexe: "F",
    adresse: { wilaya: "Oran", commune: "Es Senia" },
    groupeSanguin: "A+",
    antecedents: ["Asthme", "HTA"],
    allergies: [],
    consultations: [
      { id: UUID(), date: new Date("2024-02-05"), medecin: { nom: "Dr. Benali", specialite: "Pneumologie" }, diagnostic: "Crise d'asthme", tension: { systolique: 140, diastolique: 90 }, medicaments: [{ nom: "Salbutamol", dosage: "100mcg", duree: "15 jours" }], notes: "Éviter poussière" },
      { id: UUID(), date: new Date("2024-05-12"), medecin: { nom: "Dr. Benali", specialite: "Pneumologie" }, diagnostic: "Suivi asthme", tension: { systolique: 135, diastolique: 88 }, medicaments: [{ nom: "Budesonide", dosage: "200mcg", duree: "30 jours" }], notes: "Amélioration" },
      { id: UUID(), date: new Date("2024-08-18"), medecin: { nom: "Dr. Benali", specialite: "Pneumologie" }, diagnostic: "Contrôle asthme", tension: { systolique: 128, diastolique: 82 }, medicaments: [{ nom: "Budesonide", dosage: "200mcg", duree: "30 jours" }], notes: "Stable" }
    ]
  },
  {
    cin: "199207204500",
    nom: "Zerrouki",
    prenom: "Karim",
    dateNaissance: new Date("1992-07-20"),
    sexe: "M",
    adresse: { wilaya: "Constantine", commune: "El Khroub" },
    groupeSanguin: "B+",
    antecedents: [],
    allergies: ["Ibuprofène"],
    consultations: [
      { id: UUID(), date: new Date("2024-01-22"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Grippe saisonnière", tension: { systolique: 120, diastolique: 80 }, medicaments: [{ nom: "Paracétamol", dosage: "500mg", duree: "5 jours" }], notes: "Repos recommandé" },
      { id: UUID(), date: new Date("2024-09-14"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Lombalgie", tension: { systolique: 122, diastolique: 78 }, medicaments: [{ nom: "Myorelaxant", dosage: "150mg", duree: "10 jours" }], notes: "Kinésithérapie" }
    ]
  },
  {
    cin: "195810083100",
    nom: "Amara",
    prenom: "Aicha",
    dateNaissance: new Date("1958-10-08"),
    sexe: "F",
    adresse: { wilaya: "Annaba", commune: "El Bouni" },
    groupeSanguin: "O-",
    antecedents: ["Diabète type 2", "HTA", "Hypercholestérolémie"],
    allergies: ["Pénicilline"],
    consultations: [
      { id: UUID(), date: new Date("2024-01-10"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "HTA sévère", tension: { systolique: 160, diastolique: 100 }, medicaments: [{ nom: "Amlodipine", dosage: "10mg", duree: "30 jours" }, { nom: "Atorvastatine", dosage: "20mg", duree: "30 jours" }], notes: "Urgence tensionnelle" },
      { id: UUID(), date: new Date("2024-02-15"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "Contrôle HTA", tension: { systolique: 140, diastolique: 90 }, medicaments: [{ nom: "Amlodipine", dosage: "10mg", duree: "30 jours" }], notes: "Amélioration" },
      { id: UUID(), date: new Date("2024-04-20"), medecin: { nom: "Dr. Kaci", specialite: "Endocrinologie" }, diagnostic: "Contrôle diabète", tension: { systolique: 138, diastolique: 88 }, medicaments: [{ nom: "Metformine", dosage: "1000mg", duree: "30 jours" }], notes: "Régime strict" },
      { id: UUID(), date: new Date("2024-07-10"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "Contrôle cardiaque", tension: { systolique: 135, diastolique: 85 }, medicaments: [{ nom: "Amlodipine", dosage: "5mg", duree: "30 jours" }], notes: "Tension acceptable" }
    ]
  },
  {
    cin: "198912254400",
    nom: "Boumediene",
    prenom: "Sofiane",
    dateNaissance: new Date("1989-12-25"),
    sexe: "M",
    adresse: { wilaya: "Blida", commune: "Boufarik" },
    groupeSanguin: "AB+",
    antecedents: ["Asthme"],
    allergies: [],
    consultations: [
      { id: UUID(), date: new Date("2024-03-05"), medecin: { nom: "Dr. Benali", specialite: "Pneumologie" }, diagnostic: "Asthme allergique", tension: { systolique: 118, diastolique: 76 }, medicaments: [{ nom: "Salbutamol", dosage: "100mcg", duree: "30 jours" }], notes: "Test allergie" },
      { id: UUID(), date: new Date("2024-06-18"), medecin: { nom: "Dr. Benali", specialite: "Pneumologie" }, diagnostic: "Suivi asthme", tension: { systolique: 120, diastolique: 78 }, medicaments: [{ nom: "Montelukast", dosage: "10mg", duree: "30 jours" }], notes: "Allergie aux acariens" }
    ]
  },
  {
    cin: "197404101200",
    nom: "Hamidi",
    prenom: "Nadia",
    dateNaissance: new Date("1974-04-10"),
    sexe: "F",
    adresse: { wilaya: "Setif", commune: "Ain El Kebira" },
    groupeSanguin: "A-",
    antecedents: ["Hypothyroïdie"],
    allergies: ["Latex"],
    consultations: [
      { id: UUID(), date: new Date("2024-01-30"), medecin: { nom: "Dr. Mansouri", specialite: "Endocrinologie" }, diagnostic: "Hypothyroïdie", tension: { systolique: 125, diastolique: 80 }, medicaments: [{ nom: "Lévothyroxine", dosage: "75mcg", duree: "90 jours" }], notes: "TSH à contrôler" },
      { id: UUID(), date: new Date("2024-04-25"), medecin: { nom: "Dr. Mansouri", specialite: "Endocrinologie" }, diagnostic: "Contrôle thyroïde", tension: { systolique: 122, diastolique: 78 }, medicaments: [{ nom: "Lévothyroxine", dosage: "75mcg", duree: "90 jours" }], notes: "TSH normale" }
    ]
  },
  {
    cin: "196801203300",
    nom: "Cherifi",
    prenom: "Rachid",
    dateNaissance: new Date("1968-01-20"),
    sexe: "M",
    adresse: { wilaya: "Tlemcen", commune: "Chetouane" },
    groupeSanguin: "O+",
    antecedents: ["Diabète type 2", "HTA", "Insuffisance rénale"],
    allergies: [],
    consultations: [
      { id: UUID(), date: new Date("2024-02-12"), medecin: { nom: "Dr. Ziani", specialite: "Néphrologie" }, diagnostic: "Insuffisance rénale stade 3", tension: { systolique: 150, diastolique: 95 }, medicaments: [{ nom: "Ramipril", dosage: "5mg", duree: "30 jours" }], notes: "Protéinurie élevée" },
      { id: UUID(), date: new Date("2024-05-08"), medecin: { nom: "Dr. Kaci", specialite: "Endocrinologie" }, diagnostic: "Contrôle diabète", tension: { systolique: 145, diastolique: 90 }, medicaments: [{ nom: "Metformine", dosage: "850mg", duree: "30 jours" }], notes: "HbA1c: 8.1%" },
      { id: UUID(), date: new Date("2024-08-15"), medecin: { nom: "Dr. Ziani", specialite: "Néphrologie" }, diagnostic: "Suivi rénal", tension: { systolique: 148, diastolique: 92 }, medicaments: [{ nom: "Ramipril", dosage: "10mg", duree: "30 jours" }], notes: "Créatinine: 180 µmol/L" }
    ]
  },
  {
    cin: "199505304500",
    nom: "Lounis",
    prenom: "Yasmine",
    dateNaissance: new Date("1995-05-30"),
    sexe: "F",
    adresse: { wilaya: "Alger", commune: "Hydra" },
    groupeSanguin: "B+",
    antecedents: [],
    allergies: ["Pénicilline"],
    consultations: [
      { id: UUID(), date: new Date("2024-03-20"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Angine", tension: { systolique: 115, diastolique: 75 }, medicaments: [{ nom: "Azithromycine", dosage: "250mg", duree: "5 jours" }], notes: "Strepto test négatif" },
      { id: UUID(), date: new Date("2024-10-05"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Sinusite", tension: { systolique: 118, diastolique: 76 }, medicaments: [{ nom: "Amoxicilline", dosage: "1g", duree: "7 jours" }], notes: "Allergie à vérifier" }
    ]
  },
  {
    cin: "195202182100",
    nom: "Saidi",
    prenom: "Mohamed",
    dateNaissance: new Date("1952-02-18"),
    sexe: "M",
    adresse: { wilaya: "Oran", commune: "Mers El Kébir" },
    groupeSanguin: "O+",
    antecedents: ["Diabète type 2", "HTA", "BPCO"],
    allergies: [],
    consultations: [
      { id: UUID(), date: new Date("2024-01-05"), medecin: { nom: "Dr. Benali", specialite: "Pneumologie" }, diagnostic: "Exacerbation BPCO", tension: { systolique: 155, diastolique: 95 }, medicaments: [{ nom: "Salbutamol", dosage: "100mcg", duree: "15 jours" }, { nom: "Prednisone", dosage: "20mg", duree: "10 jours" }], notes: "Oxygénothérapie" },
      { id: UUID(), date: new Date("2024-03-22"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "HTA compliquée", tension: { systolique: 165, diastolique: 105 }, medicaments: [{ nom: "Amlodipine", dosage: "10mg", duree: "30 jours" }], notes: "Cible < 140/90" },
      { id: UUID(), date: new Date("2024-06-10"), medecin: { nom: "Dr. Benali", specialite: "Pneumologie" }, diagnostic: "Suivi BPCO", tension: { systolique: 150, diastolique: 92 }, medicaments: [{ nom: "Tiotropium", dosage: "18mcg", duree: "30 jours" }], notes: "Débit expiratoire bas" },
      { id: UUID(), date: new Date("2024-09-28"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "Contrôle cardiaque", tension: { systolique: 142, diastolique: 88 }, medicaments: [{ nom: "Amlodipine", dosage: "5mg", duree: "30 jours" }], notes: "FC: 78 bpm" }
    ]
  },
  {
    cin: "198303154400",
    nom: "Belkacem",
    prenom: "Samira",
    dateNaissance: new Date("1983-03-15"),
    sexe: "F",
    adresse: { wilaya: "Constantine", commune: "Didouche Mourad" },
    groupeSanguin: "A+",
    antecedents: ["HTA", "Anémie"],
    allergies: [],
    consultations: [
      { id: UUID(), date: new Date("2024-02-14"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Anémie ferriprive", tension: { systolique: 130, diastolique: 85 }, medicaments: [{ nom: "Fer", dosage: "200mg", duree: "60 jours" }], notes: "Ferritine: 8 ng/mL" },
      { id: UUID(), date: new Date("2024-05-20"), medecin: { nom: "Dr. Mansouri", specialite: "Cardiologie" }, diagnostic: "HTA légère", tension: { systolique: 138, diastolique: 88 }, medicaments: [{ nom: "Captopril", dosage: "25mg", duree: "30 jours" }], notes: "Surveillance" },
      { id: UUID(), date: new Date("2024-08-12"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Contrôle anémie", tension: { systolique: 128, diastolique: 82 }, medicaments: [{ nom: "Fer", dosage: "200mg", duree: "30 jours" }], notes: "Hémoglobine: 11.5 g/dL" }
    ]
  },
  {
    cin: "197708223300",
    nom: "Kaci",
    prenom: "Lamine",
    dateNaissance: new Date("1977-08-22"),
    sexe: "M",
    adresse: { wilaya: "Blida", commune: "Oued El Alleug" },
    groupeSanguin: "O+",
    antecedents: ["Diabète type 2"],
    allergies: [],
    consultations: [
      { id: UUID(), date: new Date("2024-01-18"), medecin: { nom: "Dr. Kaci", specialite: "Endocrinologie" }, diagnostic: "Diabète déséquilibré", tension: { systolique: 140, diastolique: 90 }, medicaments: [{ nom: "Metformine", dosage: "1000mg", duree: "60 jours" }], notes: "HbA1c: 9.2%" },
      { id: UUID(), date: new Date("2024-04-22"), medecin: { nom: "Dr. Kaci", specialite: "Endocrinologie" }, diagnostic: "Contrôle diabète", tension: { systolique: 135, diastolique: 85 }, medicaments: [{ nom: "Metformine", dosage: "850mg", duree: "60 jours" }], notes: "Régime observé" }
    ]
  },
  {
    cin: "199901104500",
    nom: "Djebbar",
    prenom: "Ines",
    dateNaissance: new Date("1999-01-10"),
    sexe: "F",
    adresse: { wilaya: "Annaba", commune: "Sidi Amar" },
    groupeSanguin: "AB+",
    antecedents: [],
    allergies: ["Latex", "Pénicilline"],
    consultations: [
      { id: UUID(), date: new Date("2024-02-28"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Entorse cheville", tension: { systolique: 110, diastolique: 70 }, medicaments: [{ nom: "Paracétamol", dosage: "500mg", duree: "3 jours" }], notes: "Repos et glace" },
      { id: UUID(), date: new Date("2024-07-15"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Gastro-entérite", tension: { systolique: 115, diastolique: 72 }, medicaments: [{ nom: "Smecta", dosage: "3g", duree: "5 jours" }], notes: "Réhydratation" }
    ]
  },
  {
    cin: "194506183100",
    nom: "Zerrouki",
    prenom: "Dalila",
    dateNaissance: new Date("1945-06-18"),
    sexe: "F",
    adresse: { wilaya: "Setif", commune: "Ain Arnat" },
    groupeSanguin: "O-",
    antecedents: ["Diabète type 2", "HTA", "Ostéoporose"],
    allergies: ["Pénicilline"],
    consultations: [
      { id: UUID(), date: new Date("2024-01-08"), medecin: { nom: "Dr. Mansouri", specialite: "Gériatrie" }, diagnostic: "Polyarthralgie", tension: { systolique: 150, diastolique: 90 }, medicaments: [{ nom: "Paracétamol", dosage: "1g", duree: "15 jours" }], notes: "Radio hanche" },
      { id: UUID(), date: new Date("2024-03-15"), medecin: { nom: "Dr. Kaci", specialite: "Endocrinologie" }, diagnostic: "Contrôle diabète", tension: { systolique: 148, diastolique: 88 }, medicaments: [{ nom: "Metformine", dosage: "500mg", duree: "30 jours" }], notes: "HbA1c: 7.8%" },
      { id: UUID(), date: new Date("2024-06-22"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "Contrôle HTA", tension: { systolique: 140, diastolique: 85 }, medicaments: [{ nom: "Amlodipine", dosage: "5mg", duree: "30 jours" }], notes: "Tension limite" },
      { id: UUID(), date: new Date("2024-09-10"), medecin: { nom: "Dr. Mansouri", specialite: "Gériatrie" }, diagnostic: "Fracture col fémoral", tension: { systolique: 145, diastolique: 88 }, medicaments: [{ nom: "Paracétamol", dosage: "1g", duree: "10 jours" }], notes: "Chirurgie proposée" }
    ]
  },
  {
    cin: "198805204400",
    nom: "Hamidi",
    prenom: "Tarek",
    dateNaissance: new Date("1988-05-20"),
    sexe: "M",
    adresse: { wilaya: "Tlemcen", commune: "Nedroma" },
    groupeSanguin: "B+",
    antecedents: ["Asthme"],
    allergies: [],
    consultations: [
      { id: UUID(), date: new Date("2024-04-05"), medecin: { nom: "Dr. Benali", specialite: "Pneumologie" }, diagnostic: "Asthme persistant modéré", tension: { systolique: 125, diastolique: 80 }, medicaments: [{ nom: "Budesonide", dosage: "200mcg", duree: "60 jours" }], notes: "VEMS: 78%" },
      { id: UUID(), date: new Date("2024-09-18"), medecin: { nom: "Dr. Benali", specialite: "Pneumologie" }, diagnostic: "Suivi asthme", tension: { systolique: 120, diastolique: 78 }, medicaments: [{ nom: "Budesonide", dosage: "200mcg", duree: "60 jours" }], notes: "Bon contrôle" }
    ]
  },
  {
    cin: "196210123300",
    nom: "Mekhloufi",
    prenom: "Latifa",
    dateNaissance: new Date("1962-10-12"),
    sexe: "F",
    adresse: { wilaya: "Alger", commune: "Kouba" },
    groupeSanguin: "A+",
    antecedents: ["HTA", "Hypercholestérolémie"],
    allergies: [],
    consultations: [
      { id: UUID(), date: new Date("2024-02-20"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "HTA non contrôlée", tension: { systolique: 155, diastolique: 98 }, medicaments: [{ nom: "Amlodipine", dosage: "10mg", duree: "30 jours" }, { nom: "Atorvastatine", dosage: "40mg", duree: "30 jours" }], notes: "Cholestérol: 2.8 g/L" },
      { id: UUID(), date: new Date("2024-05-15"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "Contrôle HTA", tension: { systolique: 140, diastolique: 88 }, medicaments: [{ nom: "Amlodipine", dosage: "5mg", duree: "30 jours" }], notes: "LDL: 1.6 g/L" },
      { id: UUID(), date: new Date("2024-08-25"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "Contrôle cardiaque", tension: { systolique: 138, diastolique: 86 }, medicaments: [{ nom: "Amlodipine", dosage: "5mg", duree: "30 jours" }], notes: "Stable" }
    ]
  },
  {
    cin: "199310054500",
    nom: "Boussouf",
    prenom: "Mehdi",
    dateNaissance: new Date("1993-10-05"),
    sexe: "M",
    adresse: { wilaya: "Oran", commune: "Bir El Djir" },
    groupeSanguin: "O+",
    antecedents: [],
    allergies: ["Pénicilline"],
    consultations: [
      { id: UUID(), date: new Date("2024-01-25"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Conjonctivite", tension: { systolique: 120, diastolique: 78 }, medicaments: [{ nom: "Collyre antibiotique", dosage: "gouttes", duree: "7 jours" }], notes: "Hygiène des mains" },
      { id: UUID(), date: new Date("2024-06-30"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Pharyngite", tension: { systolique: 122, diastolique: 80 }, medicaments: [{ nom: "Paracétamol", dosage: "500mg", duree: "5 jours" }], notes: "Repos vocal" }
    ]
  },
  {
    cin: "195905203100",
    nom: "Amara",
    prenom: "Fatiha",
    dateNaissance: new Date("1959-05-20"),
    sexe: "F",
    adresse: { wilaya: "Constantine", commune: "Beni Hamidane" },
    groupeSanguin: "B+",
    antecedents: ["Diabète type 2", "HTA"],
    allergies: [],
    consultations: [
      { id: UUID(), date: new Date("2024-03-08"), medecin: { nom: "Dr. Kaci", specialite: "Endocrinologie" }, diagnostic: "Contrôle diabète", tension: { systolique: 145, diastolique: 92 }, medicaments: [{ nom: "Metformine", dosage: "1000mg", duree: "30 jours" }], notes: "HbA1c: 7.5%" },
      { id: UUID(), date: new Date("2024-06-12"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "HTA modérée", tension: { systolique: 148, diastolique: 94 }, medicaments: [{ nom: "Amlodipine", dosage: "5mg", duree: "30 jours" }], notes: "Surveillance" },
      { id: UUID(), date: new Date("2024-09-20"), medecin: { nom: "Dr. Kaci", specialite: "Endocrinologie" }, diagnostic: "Contrôle diabète", tension: { systolique: 142, diastolique: 88 }, medicaments: [{ nom: "Metformine", dosage: "850mg", duree: "60 jours" }], notes: "Équilibré" }
    ]
  },
  {
    cin: "198410154400",
    nom: "Boudiaf",
    prenom: "Khaled",
    dateNaissance: new Date("1984-10-15"),
    sexe: "M",
    adresse: { wilaya: "Annaba", commune: "Berrahal" },
    groupeSanguin: "A-",
    antecedents: ["Asthme", "Allergies saisonnières"],
    allergies: ["Pollen", "Acariens"],
    consultations: [
      { id: UUID(), date: new Date("2024-04-10"), medecin: { nom: "Dr. Benali", specialite: "Pneumologie" }, diagnostic: "Asthme allergique", tension: { systolique: 128, diastolique: 82 }, medicaments: [{ nom: "Montelukast", dosage: "10mg", duree: "30 jours" }], notes: "Pollen élevé" },
      { id: UUID(), date: new Date("2024-08-22"), medecin: { nom: "Dr. Benali", specialite: "Pneumologie" }, diagnostic: "Suivi asthme", tension: { systolique: 125, diastolique: 80 }, medicaments: [{ nom: "Budesonide", dosage: "200mcg", duree: "60 jours" }], notes: "Naso-fibroscopie OK" }
    ]
  },
  {
    cin: "197103083300",
    nom: "Mokrani",
    prenom: "Sabrina",
    dateNaissance: new Date("1971-03-08"),
    sexe: "F",
    adresse: { wilaya: "Blida", commune: "Chrea" },
    groupeSanguin: "O+",
    antecedents: ["Hypothyroïdie", "HTA"],
    allergies: [],
    consultations: [
      { id: UUID(), date: new Date("2024-01-15"), medecin: { nom: "Dr. Mansouri", specialite: "Endocrinologie" }, diagnostic: "Hypothyroïdie", tension: { systolique: 142, diastolique: 88 }, medicaments: [{ nom: "Lévothyroxine", dosage: "100mcg", duree: "90 jours" }], notes: "TSH: 8.5 mIU/L" },
      { id: UUID(), date: new Date("2024-04-18"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "HTA légère", tension: { systolique: 140, diastolique: 90 }, medicaments: [{ nom: "Captopril", dosage: "25mg", duree: "30 jours" }], notes: "Surveillance tensionnelle" },
      { id: UUID(), date: new Date("2024-07-22"), medecin: { nom: "Dr. Mansouri", specialite: "Endocrinologie" }, diagnostic: "Contrôle thyroïde", tension: { systolique: 135, diastolique: 85 }, medicaments: [{ nom: "Lévothyroxine", dosage: "100mcg", duree: "90 jours" }], notes: "TSH normale" }
    ]
  },
  {
    cin: "200002254500",
    nom: "Khelifi",
    prenom: "Amine",
    dateNaissance: new Date("2000-02-25"),
    sexe: "M",
    adresse: { wilaya: "Alger", commune: "Bab El Oued" },
    groupeSanguin: "O+",
    antecedents: [],
    allergies: [],
    consultations: [
      { id: UUID(), date: new Date("2024-03-12"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Acné sévère", tension: { systolique: 115, diastolique: 75 }, medicaments: [{ nom: "Doxycycline", dosage: "100mg", duree: "30 jours" }], notes: "Dermatologie si échec" }
    ]
  },
  {
    cin: "196804203300",
    nom: "Boualem",
    prenom: "Hocine",
    dateNaissance: new Date("1968-04-20"),
    sexe: "M",
    adresse: { wilaya: "Oran", commune: "Gdyel" },
    groupeSanguin: "AB+",
    antecedents: ["Diabète type 2", "HTA", "Hypercholestérolémie"],
    allergies: ["Pénicilline"],
    consultations: [
      { id: UUID(), date: new Date("2024-02-08"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "HTA et dyslipidémie", tension: { systolique: 158, diastolique: 100 }, medicaments: [{ nom: "Amlodipine", dosage: "10mg", duree: "30 jours" }, { nom: "Atorvastatine", dosage: "40mg", duree: "30 jours" }], notes: "LDL: 2.2 g/L" },
      { id: UUID(), date: new Date("2024-05-25"), medecin: { nom: "Dr. Kaci", specialite: "Endocrinologie" }, diagnostic: "Contrôle diabète", tension: { systolique: 148, diastolique: 92 }, medicaments: [{ nom: "Metformine", dosage: "1000mg", duree: "60 jours" }], notes: "HbA1c: 7.8%" },
      { id: UUID(), date: new Date("2024-08-18"), medecin: { nom: "Dr. Ziani", specialite: "Cardiologie" }, diagnostic: "Contrôle cardiaque", tension: { systolique: 140, diastolique: 88 }, medicaments: [{ nom: "Amlodipine", dosage: "5mg", duree: "30 jours" }], notes: "LDL: 1.4 g/L" }
    ]
  },
  {
    cin: "199408104400",
    nom: "Touati",
    prenom: "Nawel",
    dateNaissance: new Date("1994-08-10"),
    sexe: "F",
    adresse: { wilaya: "Setif", commune: "Ain Oulmene" },
    groupeSanguin: "A+",
    antecedents: [],
    allergies: ["Latex"],
    consultations: [
      { id: UUID(), date: new Date("2024-01-20"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Tonsillite", tension: { systolique: 118, diastolique: 76 }, medicaments: [{ nom: "Amoxicilline", dosage: "1g", duree: "7 jours" }], notes: "Strepto test positif" },
      { id: UUID(), date: new Date("2024-05-10"), medecin: { nom: "Dr. Hamidi", specialite: "Généraliste" }, diagnostic: "Migraine", tension: { systolique: 120, diastolique: 78 }, medicaments: [{ nom: "Sumatriptan", dosage: "50mg", duree: "6 doses" }], notes: "Déclenchée par stress" }
    ]
  }
];

db.patients.insertMany(patients);

// ─── 1.3 : Collection analyses (référencée) ───────────────────────────────────
const patientsIds = db.patients.find({}, { _id: 1 }).toArray().map(p => p._id);

const analyses = [
  { patient_id: patientsIds[0], date: new Date("2024-01-10"), type: "Glycémie", resultats: { valeur: 1.45, unite: "g/L", normale: false }, laboratoire: "Labo Central Alger", valide: true },
  { patient_id: patientsIds[0], date: new Date("2024-01-10"), type: "Lipidogramme", resultats: { ldl: 1.8, hdl: 0.45, triglycerides: 2.1 }, laboratoire: "Labo Central Alger", valide: true },
  { patient_id: patientsIds[0], date: new Date("2024-03-05"), type: "ECG", resultats: { rythme: "sinusal", fréquence: 72 }, laboratoire: "CardioLab Alger", valide: true },
  { patient_id: patientsIds[1], date: new Date("2024-02-01"), type: "NFS", resultats: { hb: 12.5, leucocytes: 8000, plaquettes: 250000 }, laboratoire: "Labo Oran", valide: true },
  { patient_id: patientsIds[1], date: new Date("2024-05-10"), type: "Créatinine", resultats: { valeur: 90, unite: "µmol/L" }, laboratoire: "Labo Oran", valide: true },
  { patient_id: patientsIds[2], date: new Date("2024-01-20"), type: "Glycémie", resultats: { valeur: 0.92, unite: "g/L", normale: true }, laboratoire: "Labo Constantine", valide: true },
  { patient_id: patientsIds[2], date: new Date("2024-09-01"), type: "NFS", resultats: { hb: 14.2, leucocytes: 7500, plaquettes: 280000 }, laboratoire: "Labo Constantine", valide: true },
  { patient_id: patientsIds[3], date: new Date("2024-01-05"), type: "Glycémie", resultats: { valeur: 2.1, unite: "g/L", normale: false }, laboratoire: "Labo Annaba", valide: true },
  { patient_id: patientsIds[3], date: new Date("2024-01-05"), type: "Lipidogramme", resultats: { ldl: 2.4, hdl: 0.38, triglycerides: 2.8 }, laboratoire: "Labo Annaba", valide: true },
  { patient_id: patientsIds[3], date: new Date("2024-07-01"), type: "Créatinine", resultats: { valeur: 180, unite: "µmol/L", normale: false }, laboratoire: "Labo Annaba", valide: true },
  { patient_id: patientsIds[4], date: new Date("2024-03-01"), type: "NFS", resultats: { hb: 13.8, leucocytes: 7000, plaquettes: 260000 }, laboratoire: "Labo Blida", valide: true },
  { patient_id: patientsIds[5], date: new Date("2024-01-25"), type: "TSH", resultats: { valeur: 9.5, unite: "mIU/L", normale: false }, laboratoire: "Labo Setif", valide: true },
  { patient_id: patientsIds[5], date: new Date("2024-04-20"), type: "TSH", resultats: { valeur: 3.2, unite: "mIU/L", normale: true }, laboratoire: "Labo Setif", valide: true },
  { patient_id: patientsIds[6], date: new Date("2024-02-10"), type: "Glycémie", resultats: { valeur: 1.85, unite: "g/L", normale: false }, laboratoire: "Labo Tlemcen", valide: true },
  { patient_id: patientsIds[6], date: new Date("2024-05-05"), type: "Créatinine", resultats: { valeur: 190, unite: "µmol/L", normale: false }, laboratoire: "Labo Tlemcen", valide: true },
  { patient_id: patientsIds[7], date: new Date("2024-03-15"), type: "NFS", resultats: { hb: 12.8, leucocytes: 8200, plaquettes: 245000 }, laboratoire: "Labo Central Alger", valide: true },
  { patient_id: patientsIds[8], date: new Date("2024-01-02"), type: "ECG", resultats: { rythme: "sinusal", fréquence: 68 }, laboratoire: "CardioLab Oran", valide: true },
  { patient_id: patientsIds[8], date: new Date("2024-03-20"), type: "Glycémie", resultats: { valeur: 2.3, unite: "g/L", normale: false }, laboratoire: "Labo Oran", valide: true },
  { patient_id: patientsIds[8], date: new Date("2024-06-05"), type: "Lipidogramme", resultats: { ldl: 2.1, hdl: 0.35, triglycerides: 3.0 }, laboratoire: "Labo Oran", valide: true },
  { patient_id: patientsIds[9], date: new Date("2024-02-15"), type: "NFS", resultats: { hb: 10.2, leucocytes: 7800, plaquettes: 300000 }, laboratoire: "Labo Constantine", valide: true },
  { patient_id: patientsIds[9], date: new Date("2024-05-20"), type: "Glycémie", resultats: { valeur: 1.1, unite: "g/L", normale: true }, laboratoire: "Labo Constantine", valide: true },
  { patient_id: patientsIds[10], date: new Date("2024-01-20"), type: "Glycémie", resultats: { valeur: 1.95, unite: "g/L", normale: false }, laboratoire: "Labo Blida", valide: true },
  { patient_id: patientsIds[10], date: new Date("2024-04-25"), type: "HbA1c", resultats: { valeur: 8.2, unite: "%", normale: false }, laboratoire: "Labo Blida", valide: true },
  { patient_id: patientsIds[11], date: new Date("2024-02-25"), type: "NFS", resultats: { hb: 13.5, leucocytes: 7200, plaquettes: 270000 }, laboratoire: "Labo Annaba", valide: true },
  { patient_id: patientsIds[12], date: new Date("2024-01-10"), type: "Densitométrie", resultats: { t_score_col_fémoral: -2.8, osteoporose: true }, laboratoire: "Labo Setif", valide: true },
  { patient_id: patientsIds[12], date: new Date("2024-03-15"), type: "Glycémie", resultats: { valeur: 1.7, unite: "g/L", normale: false }, laboratoire: "Labo Setif", valide: true },
  { patient_id: patientsIds[13], date: new Date("2024-04-01"), type: "ECG", resultats: { rythme: "sinusal", fréquence: 75 }, laboratoire: "CardioLab Tlemcen", valide: true },
  { patient_id: patientsIds[14], date: new Date("2024-02-22"), type: "Lipidogramme", resultats: { ldl: 3.2, hdl: 0.42, triglycerides: 2.5 }, laboratoire: "Labo Central Alger", valide: true },
  { patient_id: patientsIds[14], date: new Date("2024-05-15"), type: "Glycémie", resultats: { valeur: 1.15, unite: "g/L", normale: true }, laboratoire: "Labo Central Alger", valide: true },
  { patient_id: patientsIds[15], date: new Date("2024-03-08"), type: "HbA1c", resultats: { valeur: 7.5, unite: "%", normale: false }, laboratoire: "Labo Constantine", valide: true },
  { patient_id: patientsIds[15], date: new Date("2024-06-12"), type: "ECG", resultats: { rythme: "sinusal", fréquence: 82 }, laboratoire: "CardioLab Constantine", valide: true },
  { patient_id: patientsIds[16], date: new Date("2024-04-05"), type: "NFS", resultats: { hb: 13.2, leucocytes: 7800, plaquettes: 255000 }, laboratoire: "Labo Annaba", valide: true },
  { patient_id: patientsIds[17], date: new Date("2024-01-15"), type: "TSH", resultats: { valeur: 8.5, unite: "mIU/L", normale: false }, laboratoire: "Labo Blida", valide: true },
  { patient_id: patientsIds[17], date: new Date("2024-04-18"), type: "Glycémie", resultats: { valeur: 1.05, unite: "g/L", normale: true }, laboratoire: "Labo Blida", valide: true },
  { patient_id: patientsIds[17], date: new Date("2024-07-22"), type: "TSH", resultats: { valeur: 2.8, unite: "mIU/L", normale: true }, laboratoire: "Labo Blida", valide: true },
  { patient_id: patientsIds[18], date: new Date("2024-03-12"), type: "NFS", resultats: { hb: 15.0, leucocytes: 7000, plaquettes: 280000 }, laboratoire: "Labo Central Alger", valide: true },
  { patient_id: patientsIds[19], date: new Date("2024-02-10"), type: "Lipidogramme", resultats: { ldl: 2.2, hdl: 0.48, triglycerides: 2.0 }, laboratoire: "Labo Oran", valide: true },
  { patient_id: patientsIds[19], date: new Date("2024-05-25"), type: "HbA1c", resultats: { valeur: 7.8, unite: "%", normale: false }, laboratoire: "Labo Oran", valide: true },
  { patient_id: patientsIds[19], date: new Date("2024-08-18"), type: "Glycémie", resultats: { valeur: 1.35, unite: "g/L", normale: false }, laboratoire: "Labo Oran", valide: true }
];

db.analyses.insertMany(analyses);

// db.analyses.insertMany(analyses);

print("✅ Modélisation terminée. Patients insérés:", db.patients.countDocuments());
print("✅ Analyses insérées:", db.analyses.countDocuments());
