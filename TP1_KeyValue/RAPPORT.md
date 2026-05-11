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

## Résultats
Tous les exercices sont fonctionnels et démontrent l'utilisation efficace des structures de données Redis pour un cas d'usage e-commerce.
