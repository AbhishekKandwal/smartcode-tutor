import os
import json
import time
import google.generativeai as genai
from backend.database import SessionLocal
from backend.models import Question
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in .env")
    exit(1)

genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-2.5-flash")

famous_questions = [
    "Two Sum",
    "Palindrome Number",
    "Climbing Stairs",
    "Maximum Subarray",
    "Valid Parentheses",
    "Single Number",
    "Missing Number",
    "Move Zeroes",
    "Reverse String",
    "Fizz Buzz",
    "Power of Two",
    "Plus One",
    "Length of Last Word",
    "Majority Element",
    "Contains Duplicate"
]

db = SessionLocal()

print("Starting Bulk LeetCode AI Extractor...")
for title in famous_questions:
    print(f"Importing '{title}'...")
    prompt = f"""
    You are an AI that extracts algorithms/LeetCode problems and converts them into a specific JSON schema.
    The user has provided this problem title or URL: '{title}'
    
    If it is a known problem, recall the details.
    Return ONLY a valid JSON object with the following keys, no markdown blocks, no extra text:
    - "title": A clean string title
    - "slug": A URL-friendly slug
    - "difficulty": "Easy", "Medium", or "Hard"
    - "description": A string with the problem description, including example inputs/outputs.
    - "test_cases": A list of exactly 3 objects, each with "input" and "output" string fields. The input should be space-separated or newline-separated values suitable for Python's input() reading. NEVER use brackets [] or commas for arrays. If the input is an array, format it as space-separated integers.
    """
    
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        data = json.loads(response.text)
        
        # Check if already exists
        existing = db.query(Question).filter(Question.title == data["title"]).first()
        if existing:
            print(f" -> Skipped '{title}': Already exists in database.")
            continue
            
        driver_code = f"# Problem: {data['title']}\n# Read input from stdin, process it, and print to stdout.\nimport sys\n\ndef solve():\n    # TODO: Write your logic here\n    pass\n\nif __name__ == '__main__':\n    solve()\n"
        
        new_q = Question(
            title=data["title"],
            slug=data["slug"],
            difficulty=data["difficulty"],
            description=data["description"],
            question_type="standard",
            driver_code=driver_code,
            test_cases=json.dumps(data["test_cases"])
        )
        db.add(new_q)
        db.commit()
        print(f" -> Successfully imported '{title}'!")
    except Exception as e:
        print(f" -> Failed to import '{title}': {e}")
    
    time.sleep(3) # Avoid rate limit

db.close()
print("Bulk import completed! Refresh your browser to see the new questions.")
