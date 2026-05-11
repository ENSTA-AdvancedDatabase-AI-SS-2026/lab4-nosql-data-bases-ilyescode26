# TP5 - Benchmark Comparatif NoSQL

## Objectifs
Mesurer et comparer les performances des 4 bases NoSQL (Redis, MongoDB, Cassandra, Neo4j).

## Exercices Réalisés

### Exercice 1 - Benchmark Écriture
**Fichier**: `benchmark.py`

| Technologie | Méthode | Optimisation |
|------------|---------|-------------|
| **Redis** | `HSET` Pipeline | Pipeline batch (1 exécution réseau pour N commandes) |
| **MongoDB** | `insert_many` | `ordered=False` pour ignorer les erreurs et continuer |
| **Cassandra** | `UNLOGGED BATCH` | Batches de 50 rows, prepared statements |

### Exercice 2 - Benchmark Lecture

| Technologie | Test | Type de requête |
|------------|------|----------------|
| **Redis** | `HGET` | Point lookup (clé unique) |
| **Redis** | `ZRANGE` | Range query (sorted set) |
| **Redis** | Pipeline multi-get | 10 HGETALL en 1 round-trip |
| **MongoDB** | `find_one` | Point lookup par `_id` |
| **MongoDB** | `find range` | `$gte`/`$lte` avec `limit` |
| **MongoDB** | `aggregate` | `$group` avec `$sum` |

### Exercice 3 - Charge Concurrente
- **50 threads** simultanés
- **200 requêtes** par thread
- Métriques : `mean`, `p95`, `p99`, `max`, `throughput_rps`

---

## Métriques Mesurées

| Métrique | Description |
|----------|-------------|
| **mean_ms** | Latence moyenne en millisecondes |
| **p50_ms** | Médiane (50% des requêtes sous cette valeur) |
| **p95_ms** | 95ème percentile (seuil de tolérance) |
| **p99_ms** | 99ème percentile (worst case normal) |
| **max_ms** | Pire latence observée |
| **throughput_rps** | Requêtes par seconde |

---

## Comparaison Théorique (Attendue)

| Technologie | Écriture | Lecture Point | Lecture Complexe | Cas d'usage |
|------------|----------|---------------|------------------|-------------|
| **Redis** | ~100K rps | ~0.1ms | ~0.5ms | Cache, sessions, leaderboard |
| **MongoDB** | ~50K rps | ~0.5ms | ~2ms | Documents complexes, agrégation |
| **Cassandra** | ~80K rps | ~1ms | ~5ms | Time-series, IoT, écriture massive |
| **Neo4j** | ~10K rps | ~2ms | ~10ms | Graphes, recommandations, chemins |

---

## Résultats
Benchmark Python fonctionnel avec mesures de latence (mean, p50, p95, p99, max) et débit (throughput). Tests couvrant écriture batch, lecture point/range, et charge concurrente multi-thread.
