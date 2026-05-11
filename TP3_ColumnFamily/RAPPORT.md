# TP3 - Cassandra : SmartGrid DZ - IoT Électrique

## Objectifs
Modéliser un système IoT électrique à grande échelle avec Cassandra (column-family store).

## Exercices Réalisés

### Exercice 1 - Schéma Cassandra
**Fichier**: `ex1_schema.cql`

**Keyspace créé**:
```sql
CREATE KEYSPACE smartgrid
WITH replication = { 'class': 'SimpleStrategy', 'replication_factor': 1 };
```

**Tables créées**:

| Table | Clé de Partition | Colonnes de Clustering | Use Case |
|-------|-------------------|----------------------|----------|
| `mesures_par_capteur` | `(capteur_id, date_jour)` | `timestamp DESC` | Mesures d'un capteur sur une période |
| `alertes_par_wilaya` | `(wilaya, date_jour)` | `timestamp DESC, capteur_id ASC` | Alertes d'une wilaya par jour |
| `agregats_horaires` | `wilaya` | `date_heure DESC` | Dashboard consommation par wilaya |

### Exercice 2 - Ingestion IoT
**Fichier**: `ex2_ingestion.py`

**Fonctions implémentées**:
- `insert_single()` : Insertion avec prepared statement
- `insert_batch()` : UNLOGGED BATCH (max 50 items, bonne pratique Cassandra)
- `run_ingestion()` : Génère 10 000 capteurs sur 5 minutes, insertion par batches

**Débit attendu** : ~50 000 mesures/seconde (dépend du hardware)

---

## Choix de Modélisation et Justification

### Table `mesures_par_capteur`
**Partition Key** : `(capteur_id, date_jour)`

**Pourquoi le bucket par jour ?**
- Sans bucket : une partition = toutes les mesures d'un capteur → partition trop grosse (hot partition)
- Avec bucket `date_jour` : chaque jour est une partition séparée → taille raisonnable (~1440 lignes/jour pour un capteur)
- 10 000 capteurs × 365 jours = 3 650 000 partitions → bien distribuées sur le cluster

**Clustering** : `timestamp DESC` → lectures récentes en premier (séries temporelles)

### Table `alertes_par_wilaya`
**Partition Key** : `(wilaya, date_jour)`

**Pourquoi ?**
- Requête cible : "Alertes de la wilaya X le jour Y" → partition = wilaya+jour
- Évite de scanner toutes les alertes
- TTL 1 an pour archivage automatique

### Table `agregats_horaires`
**Partition Key** : `wilaya`

**Pourquoi ?**
- Dashboard par wilaya → une partition = une wilaya
- Faible volume (~24 lignes/jour/wilaya) → pas de hot partition
- Pré-agrégation pour éviter les calculs en temps réel
- TTL 5 ans pour historique long

---

## Design Pattern : Time-Series avec Bucketing

```
CAPTEUR : capteur_id=abc123
├─ Partition (abc123, 2024-01-15) → ~1440 mesures
├─ Partition (abc123, 2024-01-16) → ~1440 mesures
├─ Partition (abc123, 2024-01-17) → ~1440 mesures
```

**Avantages** :
- Pas de partition unbound (taille limitée par jour)
- Facile à purger (TTL par jour)
- Parallélisable sur le cluster

---

## Bonnes Pratiques Appliquées

| Pratique | Application |
|-----------|-------------|
| **UNLOGGED BATCH** | `insert_batch()` pour séries temporelles (même partition) |
| **Prepared Statements** | Réutilisation du plan d'exécution, injection SQL safe |
| **Batch ≤ 50 items** | Évite coordinator overload |
| **TTL natif** | Expiration automatique (90j/1an/5ans selon table) |
| **Bucket time** | `date_jour` évite partitions infinies |

---

## Résultats
Schéma Cassandra optimisé pour 10 000+ capteurs IoT avec ingestion par batches et séries temporelles bucketées par jour.
