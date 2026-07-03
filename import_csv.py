import pandas as pd
import json
from backend.database import SessionLocal, engine
from backend.models import Base, Question

def run_import():
    db = SessionLocal()
    
    print("Reading CSV (leetcode_dataset - lc.csv)...")
    try:
        df = pd.read_csv("leetcode_dataset - lc.csv")
    except Exception as e:
        print(f"Failed to read CSV: {e}")
        return
        
    print(f"Total rows in CSV: {len(df)}")
    
    # Take the first 1000 questions (these are the classic 1-1000 ID questions)
    df = df.head(1000)
    
    imported_count = 0
    skipped_count = 0
    
    for index, row in df.iterrows():
        title = str(row['title'])
        if title == 'nan' or not title:
            continue
            
        # Check if already exists (e.g. from our previous Gemini import)
        existing = db.query(Question).filter(Question.title == title).first()
        if existing:
            skipped_count += 1
            continue
            
        difficulty = str(row['difficulty']).strip()
        if difficulty not in ["Easy", "Medium", "Hard"]:
            difficulty = "Medium"
            
        description = str(row['description'])
        if pd.isna(description) or description == 'nan':
            continue
            
        # URL friendly slug
        slug = "".join(c if c.isalnum() else "-" for c in title.lower())
        
        driver_code = f"# Problem: {title}\n# Read input from stdin, process it, and print to stdout.\nimport sys\n\ndef solve():\n    # TODO: Write your logic here\n    pass\n\nif __name__ == '__main__':\n    solve()\n"
        
        # DUMMY TEST CASE
        dummy_test = [{"input": "0\n", "output": "0"}]
        
        new_q = Question(
            title=title,
            slug=slug,
            difficulty=difficulty,
            description=description,
            question_type="standard",
            driver_code=driver_code,
            test_cases=json.dumps(dummy_test)
        )
        db.add(new_q)
        imported_count += 1
        
        if imported_count % 100 == 0:
            print(f"Imported {imported_count} questions...")
            db.commit()
            
    db.commit()
    db.close()
    print(f"Successfully imported {imported_count} new questions! (Skipped {skipped_count} existing)")

if __name__ == "__main__":
    run_import()
