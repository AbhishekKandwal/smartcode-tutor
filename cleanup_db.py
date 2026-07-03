import sqlite3

def cleanup():
    conn = sqlite3.connect('smartcode.db')
    c = conn.cursor()
    dummy_str = '[{"input": "0\\n", "output": "0"}]'
    
    # First, get the count
    c.execute("SELECT COUNT(*) FROM questions WHERE test_cases = ?", (dummy_str,))
    count = c.fetchone()[0]
    
    if count > 0:
        c.execute("DELETE FROM questions WHERE test_cases = ?", (dummy_str,))
        conn.commit()
        print(f"Successfully deleted {count} SQL/Unparseable questions from the database.")
    else:
        print("No questions with dummy test cases found.")
        
    conn.close()

if __name__ == "__main__":
    cleanup()
