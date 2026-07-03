import json
from backend.database import SessionLocal, engine
from backend.models import Base, Question

Question.__table__.drop(engine, checkfirst=True)
Base.metadata.create_all(bind=engine)

questions = []

# Category 1: Add N to a sequence of numbers (20 questions)
for n in range(1, 21):
    test_cases = [
        {"input": "1 2 3\n", "output": f"{1+n} {2+n} {3+n}"},
        {"input": "10 -5\n", "output": f"{10+n} {-5+n}"}
    ]
    questions.append({
        "title": f"Add {n} to Array",
        "slug": f"add-{n}-to-array",
        "difficulty": "Easy" if n <= 10 else "Medium",
        "description": f"Given a space-separated list of integers, add {n} to each integer and print them space-separated.",
        "test_cases": json.dumps(test_cases)
    })

# Category 2: Multiply sequence of numbers by N (20 questions)
for n in range(1, 21):
    test_cases = [
        {"input": "1 2 3\n", "output": f"{1*n} {2*n} {3*n}"},
        {"input": "10 -5\n", "output": f"{10*n} {-5*n}"}
    ]
    questions.append({
        "title": f"Multiply Array by {n}",
        "slug": f"multiply-array-by-{n}",
        "difficulty": "Easy" if n <= 10 else "Medium",
        "description": f"Given a space-separated list of integers, multiply each by {n} and print them space-separated.",
        "test_cases": json.dumps(test_cases)
    })

# Category 3: Power sequence of numbers by N (20 questions)
for n in range(1, 21):
    test_cases = [
        {"input": "2 3\n", "output": f"{2**n} {3**n}"},
        {"input": "1\n", "output": f"{1**n}"}
    ]
    questions.append({
        "title": f"Array Elements to the Power of {n}",
        "slug": f"array-power-{n}",
        "difficulty": "Hard",
        "description": f"Given a space-separated list of integers, raise each to the power of {n} and print them space-separated.",
        "test_cases": json.dumps(test_cases)
    })

# Category 4: Modulo sequence of numbers by N (20 questions)
for n in range(2, 22):
    test_cases = [
        {"input": "10 15 20\n", "output": f"{10%n} {15%n} {20%n}"},
        {"input": "100\n", "output": f"{100%n}"}
    ]
    questions.append({
        "title": f"Modulo Array by {n}",
        "slug": f"modulo-array-{n}",
        "difficulty": "Medium",
        "description": f"Given a space-separated list of integers, compute the modulo {n} of each and print them space-separated.",
        "test_cases": json.dumps(test_cases)
    })

# Category 5: Print string N times (20 questions)
for n in range(1, 21):
    test_cases = [
        {"input": "hello\n", "output": ("hello" * n)},
        {"input": "x\n", "output": ("x" * n)}
    ]
    questions.append({
        "title": f"Repeat String {n} Times",
        "slug": f"repeat-string-{n}",
        "difficulty": "Easy",
        "description": f"Given a string, print it {n} times consecutively without spaces.",
        "test_cases": json.dumps(test_cases)
    })

db = SessionLocal()
db.query(Question).delete()
db.commit()

for q in questions:
    db.add(Question(**q))
db.commit()
db.close()
print(f"Successfully inserted {len(questions)} questions with test cases!")
