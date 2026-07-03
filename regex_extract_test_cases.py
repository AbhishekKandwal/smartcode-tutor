import json
import re
from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Question

def run_regex_extraction():
    db: Session = SessionLocal()
    
    # We search for questions where test_cases contains the dummy string
    dummy_signature = '[{"input": "0\\n", "output": "0"}]'
    
    questions = db.query(Question).filter(Question.test_cases == dummy_signature).all()
    
    if not questions:
        print("No questions with dummy test cases found.")
        db.close()
        return

    print(f"Found {len(questions)} questions needing test case extraction.")

    success_count = 0
    
    # We look for "Input" or "Input:" followed by capture group, then "Output" or "Output:"
    pattern = re.compile(r'Input:?\s*(.*?)\nOutput:?\s*(.*?)(?=\nExplanation:?|\nExample|\nConstraints:?|\n\n|$)', re.IGNORECASE | re.DOTALL)

    for q in questions:
        matches = pattern.findall(q.description)
        if matches:
            test_cases = []
            for match in matches:
                raw_input = match[0].strip()
                raw_output = match[1].strip()
                
                # Clean up variable names (e.g. `s = "III"` -> `"III"`)
                clean_input = re.sub(r'\b[a-zA-Z_]+\s*=\s*', '', raw_input)
                clean_output = re.sub(r'\b[a-zA-Z_]+\s*=\s*', '', raw_output)
                
                # Strip bounding quotes if they exist
                if clean_input.startswith('"') and clean_input.endswith('"'):
                    clean_input = clean_input[1:-1]
                if clean_output.startswith('"') and clean_output.endswith('"'):
                    clean_output = clean_output[1:-1]
                
                test_cases.append({
                    "input": clean_input,
                    "output": clean_output
                })
            
            if len(test_cases) > 0:
                q.test_cases = json.dumps(test_cases)
                success_count += 1
        
    db.commit()
    print(f"\nExtraction complete. Successfully updated {success_count} questions using Regex offline.")
    db.close()

if __name__ == "__main__":
    run_regex_extraction()
