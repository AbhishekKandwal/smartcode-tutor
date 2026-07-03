import json
from backend.database import SessionLocal, engine
from backend.models import Base, Question, UserSubmission

# Drop tables to apply schema changes completely
UserSubmission.__table__.drop(engine, checkfirst=True)
Question.__table__.drop(engine, checkfirst=True)
Base.metadata.create_all(bind=engine)

questions = []

# 100 Standard IO questions
for n in range(1, 21):
    questions.append({
        "title": f"Add {n} to Array",
        "slug": f"add-{n}-to-array",
        "difficulty": "Easy" if n <= 10 else "Medium",
        "description": f"Given a space-separated list of integers, add {n} to each integer and print them space-separated.",
        "test_cases": json.dumps([{"input": "1 2 3\n", "output": f"{1+n} {2+n} {3+n}"}, {"input": "10 -5\n", "output": f"{10+n} {-5+n}"}]),
        "question_type": "standard",
        "driver_code": ""
    })
    questions.append({
        "title": f"Multiply Array by {n}",
        "slug": f"multiply-array-{n}",
        "difficulty": "Easy" if n <= 10 else "Medium",
        "description": f"Given a space-separated list of integers, multiply each by {n} and print them space-separated.",
        "test_cases": json.dumps([{"input": "1 2 3\n", "output": f"{1*n} {2*n} {3*n}"}]),
        "question_type": "standard",
        "driver_code": ""
    })
    questions.append({
        "title": f"Array Power {n}",
        "slug": f"array-power-{n}",
        "difficulty": "Hard",
        "description": f"Given a space-separated list of integers, raise each to the power of {n} and print.",
        "test_cases": json.dumps([{"input": "2 3\n", "output": f"{2**n} {3**n}"}]),
        "question_type": "standard",
        "driver_code": ""
    })
    questions.append({
        "title": f"Modulo Array by {n+1}",
        "slug": f"modulo-array-{n+1}",
        "difficulty": "Medium",
        "description": f"Given a space-separated list of integers, compute modulo {n+1} of each and print.",
        "test_cases": json.dumps([{"input": "10 15\n", "output": f"{10%(n+1)} {15%(n+1)}"}]),
        "question_type": "standard",
        "driver_code": ""
    })
    questions.append({
        "title": f"Repeat String {n} Times",
        "slug": f"repeat-string-{n}",
        "difficulty": "Easy",
        "description": f"Given a string, print it {n} times consecutively.",
        "test_cases": json.dumps([{"input": "hi\n", "output": "hi"*n}]),
        "question_type": "standard",
        "driver_code": ""
    })

tree_driver_code = """import sys
import json
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def deserialize_tree(data):
    if not data: return None
    it = iter(data)
    root = TreeNode(next(it))
    queue = deque([root])
    while queue:
        node = queue.popleft()
        val_left = next(it, None)
        if val_left is not None:
            node.left = TreeNode(val_left)
            queue.append(node.left)
        val_right = next(it, None)
        if val_right is not None:
            node.right = TreeNode(val_right)
            queue.append(node.right)
    return root

{USER_CODE}

if __name__ == '__main__':
    input_list = json.loads(sys.stdin.read())
    root = deserialize_tree(input_list)
    sol = Solution()
    res = sol.solve(root)
    print(json.dumps(res) if isinstance(res, (list, dict)) else res)
"""

# Generate 50 Tree problems
for n in range(1, 51):
    test_cases = [
        {"input": "[1, 2, 3]", "output": f"{1+2+3+n}"},
        {"input": "[10, null, 20]", "output": f"{10+20+n}"}
    ]
    questions.append({
        "title": f"Tree Sum Plus {n}",
        "slug": f"tree-sum-plus-{n}",
        "difficulty": "Medium" if n <= 25 else "Hard",
        "description": f"Given the root of a binary tree, calculate the sum of all node values and add {n}. Return the final sum.\n\nYou should implement:\n```python\nclass Solution:\n    def solve(self, root: 'TreeNode') -> int:\n        pass\n```",
        "test_cases": json.dumps(test_cases),
        "question_type": "binary_tree",
        "driver_code": tree_driver_code
    })

db = SessionLocal()
for q in questions:
    db.add(Question(**q))
db.commit()
db.close()
print(f"Successfully inserted {len(questions)} advanced questions!")
