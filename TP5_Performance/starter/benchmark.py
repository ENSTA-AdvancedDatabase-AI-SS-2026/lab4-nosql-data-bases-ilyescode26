"""
TP5 - Benchmark Comparatif NoSQL
Mesurer les performances de Redis, MongoDB, Cassandra, Neo4j
"""
import time
import statistics
import json
from typing import Callable, List, Tuple
import redis
from pymongo import MongoClient
from cassandra.cluster import Cluster
from neo4j import GraphDatabase

# ─── Utilitaires de mesure ────────────────────────────────────────────────────

def measure_latency(fn: Callable, iterations: int = 1000) -> dict:
    """
    Exécuter fn iterations fois et retourner les statistiques
    """
    latencies = []
    for _ in range(iterations):
        start = time.perf_counter()
        fn()
        latencies.append((time.perf_counter() - start) * 1000)  # en ms
    
    latencies.sort()
    return {
        "mean_ms": statistics.mean(latencies),
        "p50_ms": latencies[int(0.50 * len(latencies))],
        "p95_ms": latencies[int(0.95 * len(latencies))],
        "p99_ms": latencies[int(0.99 * len(latencies))],
        "max_ms": max(latencies),
        "throughput_rps": 1000 / statistics.mean(latencies)
    }


def print_results(name: str, results: dict):
    print(f"\n{'='*50}")
    print(f" {name}")
    print(f"{'='*50}")
    for k, v in results.items():
        print(f"  {k:20s}: {v:.2f}")


# ─── Ex1 : Benchmark Écriture ─────────────────────────────────────────────────

def benchmark_write_redis(n: int = 100_000):
    """Insérer n enregistrements dans Redis avec pipeline"""
    r = redis.Redis(host='localhost', port=6379)
    r.flushdb()

    start = time.time()
    pipe = r.pipeline()
    for i in range(n):
        pipe.hset(f"bench:{i}", mapping={"id": i, "data": f"value_{i}"})
    pipe.execute()
    elapsed = time.time() - start

    results = {
        "mean_ms": (elapsed / n) * 1000,
        "throughput_rps": n / elapsed
    }
    print_results(f"Redis HSET Pipeline ({n:,})", results)


def benchmark_write_mongodb(n: int = 100_000):
    """Insérer n documents dans MongoDB avec insert_many"""
    client = MongoClient("mongodb://admin:admin123@localhost:27017/")
    db = client["benchmark"]
    db.items.drop()

    docs = [{"_id": i, "data": f"value_{i}", "score": i % 100} for i in range(n)]

    start = time.time()
    db.items.insert_many(docs, ordered=False)
    elapsed = time.time() - start

    results = {
        "mean_ms": (elapsed / n) * 1000,
        "throughput_rps": n / elapsed
    }
    print_results(f"MongoDB insert_many ({n:,})", results)
    client.close()


def benchmark_write_cassandra(n: int = 100_000):
    """Insérer n rows dans Cassandra avec UNLOGGED BATCH"""
    cluster = Cluster(["localhost"])
    session = cluster.connect()

    session.execute("CREATE KEYSPACE IF NOT EXISTS benchmark WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1}")
    session.set_keyspace("benchmark")
    session.execute("DROP TABLE IF EXISTS items")
    session.execute("CREATE TABLE items (id INT PRIMARY KEY, data TEXT, score INT)")

    prepared = session.prepare("INSERT INTO items (id, data, score) VALUES (?, ?, ?)")

    start = time.time()
    from cassandra.query import BatchStatement, BatchType
    batch = BatchStatement(batch_type=BatchType.UNLOGGED)
    batch_size = 0
    for i in range(n):
        batch.add(prepared, (i, f"value_{i}", i % 100))
        batch_size += 1
        if batch_size >= 50:
            session.execute(batch)
            batch = BatchStatement(batch_type=BatchType.UNLOGGED)
            batch_size = 0
    if batch_size > 0:
        session.execute(batch)

    elapsed = time.time() - start
    results = {
        "mean_ms": (elapsed / n) * 1000,
        "throughput_rps": n / elapsed
    }
    print_results(f"Cassandra UNLOGGED BATCH ({n:,})", results)
    cluster.shutdown()


# ─── Ex2 : Benchmark Lecture ─────────────────────────────────────────────────

def benchmark_read_redis():
    """Point lookup, range (ZRANGE), pipeline multi-get"""
    r = redis.Redis(host='localhost', port=6379)
    r.zadd("bench:scores", {f"user_{i}": i for i in range(1000)})

    # Point lookup HGET
    def hget():
        r.hget("bench:50", "data")
    print_results("Redis HGET (point lookup)", measure_latency(hget, 1000))

    # Range ZRANGE
    def zrange():
        r.zrange("bench:scores", 0, 100)
    print_results("Redis ZRANGE (range)", measure_latency(zrange, 1000))

    # Pipeline multi-get
    def multi_get():
        pipe = r.pipeline()
        for i in range(10):
            pipe.hgetall(f"bench:{i}")
        pipe.execute()
    print_results("Redis Pipeline multi-get", measure_latency(multi_get, 1000))


def benchmark_read_mongodb():
    """find_one, find avec range, aggregate pipeline"""
    client = MongoClient("mongodb://admin:admin123@localhost:27017/")
    db = client["benchmark"]
    db.items.create_index("score")

    # Point lookup find_one
    def find_one():
        db.items.find_one({"_id": 50})
    print_results("MongoDB find_one (point)", measure_latency(find_one, 1000))

    # Range find
    def find_range():
        list(db.items.find({"score": {"$gte": 40, "$lte": 60}}).limit(100))
    print_results("MongoDB find range", measure_latency(find_range, 1000))

    # Aggregate
    def aggregate():
        list(db.items.aggregate([{"$group": {"_id": "$score", "count": {"$sum": 1}}}]))
    print_results("MongoDB aggregate", measure_latency(aggregate, 1000))

    client.close()


# ─── Ex3 : Charge concurrente ─────────────────────────────────────────────────

def benchmark_concurrent(db_fn: Callable, n_clients: int = 50, requests_per_client: int = 200):
    """Lancer n_clients threads simultanés, mesurer latences"""
    import threading

    latencies = []
    lock = threading.Lock()

    def worker():
        for _ in range(requests_per_client):
            start = time.perf_counter()
            db_fn()
            latency = (time.perf_counter() - start) * 1000
            with lock:
                latencies.append(latency)

    start = time.time()
    threads = [threading.Thread(target=worker) for _ in range(n_clients)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    elapsed = time.time() - start

    latencies.sort()
    results = {
        "mean_ms": statistics.mean(latencies),
        "p95_ms": latencies[int(0.95 * len(latencies))],
        "p99_ms": latencies[int(0.99 * len(latencies))],
        "max_ms": max(latencies),
        "throughput_rps": (n_clients * requests_per_client) / elapsed
    }
    print_results(f"Concurrent ({n_clients} clients × {requests_per_client} req)", results)


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("🚀 Benchmark NoSQL - Comparatif des 4 technologies")
    print("="*60)
    
    N = 10_000  # Réduire pour les tests, 100_000 pour la production
    
    print(f"\n📝 Benchmark Écriture ({N:,} enregistrements)")
    benchmark_write_redis(N)
    benchmark_write_mongodb(N)
    benchmark_write_cassandra(N)
    
    print(f"\n📖 Benchmark Lecture (1,000 requêtes)")
    benchmark_read_redis()
    benchmark_read_mongodb()
    
    print(f"\n⚡ Test Charge Concurrente (50 clients)")
    # benchmark_concurrent(...)
    
    print("\n✅ Benchmark terminé ! Consultez RAPPORT.md pour l'analyse.")
