# TP1 - Redis KeyValue Store

## Objectifs
Implémenter des structures de données Redis pour une application e-commerce (ShopFast).

## Exercices Réalisés

### Exercice 1 - Structures de données Redis
**Fichier**: `ex1_structures.py`

**Fonctions implémentées**:
- `store_product()` - Stockage des produits (Hash)
- `get_product()` - Récupération des produits (Hash)
- `add_to_cart()` - Gestion du panier (Hash)
- `get_cart()` - Lecture du panier
- `record_view()` - Historique navigation (List)
- `get_history()` - Récupération historique
- `add_product_to_category()` - Catégorisation (Set)
- `get_products_in_categories()` - Intersection catégories

**Structures Redis utilisées**:
- **Hash**: `product:{id}`, `cart:{user_id}`
- **List**: `history:{user_id}`
- **Set**: `category:{name}`

### Exercice 3 - Pattern Cache-Aside
**Fichier**: `ex3_cache.py`

**Fonctions implémentées**:
- `get_product_cached()` - Cache avec TTL
- `invalidate_product_cache()` - Invalidation cache
- `benchmark_cache()` - Tests performance

**Pattern**: Cache-Aside avec HIT/MISS tracking et TTL de 600s.

### Exercice 4 - Leaderboard Ventes
**Fichier**: `ex4_leaderboard.py`

**Fonctions implémentées**:
- `record_sale()` - Enregistrement ventes
- `get_top_products()` - Top N produits
- `get_product_rank()` - Rang d'un produit
- `get_products_between_ranks()` - Produits entre rangs

**Structure Redis**: **Sorted Set** `leaderboard:sales`

## Comparaison de Performance (Hit vs Miss)

| Type | Temps Moyen |
|------|-------------|
| **Cache HIT** | ~1-5ms (Redis en mémoire) |
| **Cache MISS** | ~2000ms (requête DB simulée) |

**Gain de performance**: Le cache HIT est ~400x plus rapide que le MISS.

## Justification des Choix de Modélisation

| Fonctionnalité | Structure Redis | Justification |
|----------------|-----------------|---------------|
| Produits | Hash (`HSET`) | Champs nommés, facile à récupérer |
| Panier | Hash (`HINCRBY`) | Incrémentation rapide des quantités |
| Historique | List (`LPUSH`+`LTRIM`) | Garder les N derniers éléments facilement |
| Catégories | Set (`SADD`+`SINTER`) | Intersections et unions natifs |
| Classement | Sorted Set (`ZINCRBY`) | Classement automatique par score |
| Cache produits | String avec TTL (`SETEX`) | Expiration automatique pour fraîcheur |

## Questions de Réflexion

### 1. Que se passe-t-il si Redis redémarre ?
**Réponse**: Les données en mémoire RAM sont perdues par défaut. Solutions : persistance avec **RDB** (snapshots) ou **AOF** (log des commandes), ou replication Redis pour la haute disponibilité.

### 2. Comment gérer la cohérence cache/DB en cas d'accès concurrent ?
**Réponse**: Stratégies possibles :
- **Cache-Aside** : On invalide le cache à chaque mise à jour DB
- **Write-Through** : On écrit simultanément en cache et DB
- **TTL** : Le cache expire automatiquement après un temps défini
- Utiliser des verrous distribués (Redis `SETNX`) si nécessaire

### 3. Quand un TTL trop court est-il problématique ?
**Réponse**: Un TTL trop court cause le **thundering herd problem** (requeêtes simultanées vers la DB quand le cache expire). Cela augmente la charge DB et crée des latences. Solution : utiliser des TTL variables ou le pattern *probabilistic early expiration*.

## Résultats
Tous les exercices sont fonctionnels et démontrent l'utilisation efficace des structures de données Redis pour un cas d'usage e-commerce.
