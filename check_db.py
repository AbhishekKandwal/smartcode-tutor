from backend.database import SessionLocal
from backend.models import Question

db = SessionLocal()
count = db.query(Question).count()
print(f"Total questions in database: {count}")

if count > 0:
    sample = db.query(Question).limit(5).all()
    print("\nSample questions:")
    for q in sample:
        print(f"  - {q.title} ({q.lc_difficulty})")
else:
    print("\nNo questions found! Run 'python ingest_leetcode.py' to populate database.")

db.close()
