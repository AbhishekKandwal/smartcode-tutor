import os
import json
import time
from dotenv import load_dotenv
import google.generativeai as genai
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Question

load_dotenv()

def extract_test_cases(batch_size=1000):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY not found in .env")
        return

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")

    db: Session = SessionLocal()
    
    # We search for questions where test_cases contains the dummy string
    dummy_signature = '[{"input": "0\\n", "output": "0"}]'
    
    questions = db.query(Question).filter(Question.test_cases == dummy_signature).limit(batch_size).all()
    
    if not questions:
        print("No questions with dummy test cases found.")
        db.close()
        return

    print(f"Found {len(questions)} questions needing test case extraction.")

    success_count = 0
    for i, q in enumerate(questions):
        print(f"\n[{i+1}/{len(questions)}] Processing ID {q.id}: {q.title}...")
        
        prompt = f"""
        You are a competitive programming judge. Extract or generate 3 realistic test cases for the following algorithmic problem.
        
        Title: {q.title}
        Description: {q.description}
        
        Return ONLY a valid JSON array of exactly 3 objects. 
        Each object must have exactly two string keys: "input" and "output".
        Make the input space-separated or newline-separated strings, ready to be read by standard input (stdin).
        Example format:
        [
            {{"input": "1 2 3", "output": "6"}},
            {{"input": "-1 0 1", "output": "0"}},
            {{"input": "10 20", "output": "30"}}
        ]
        """
        
        try:
            response = model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            raw_text = response.text.replace("```json", "").replace("```", "").strip()
            test_cases_json = json.loads(raw_text)
            
            # Validate format roughly
            if isinstance(test_cases_json, list) and len(test_cases_json) > 0 and "input" in test_cases_json[0]:
                q.test_cases = json.dumps(test_cases_json)
                db.commit()
                print(f"  -> Success! Extracted {len(test_cases_json)} test cases.")
                success_count += 1
            else:
                print(f"  -> Error: AI returned invalid JSON schema.")
        except Exception as e:
            print(f"  -> API/Parsing Error: {e}")
            db.rollback()

        # Respect Gemini Free Tier limits (15 requests per minute -> 4s gap)
        if i < len(questions) - 1:
            print("  -> Sleeping for 4.5 seconds to respect rate limits...")
            time.sleep(4.5)

    print(f"\nExtraction complete. Successfully updated {success_count}/{len(questions)} questions.")
    db.close()

if __name__ == "__main__":
    extract_test_cases(batch_size=5)
