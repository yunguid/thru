# Samsara Interview Prep

A structured learning environment for interview preparation, focusing on deep understanding rather than solution memorization.

## Repository Structure

```
.
├── string-parsing/          # String manipulation and parsing problems
├── arrays/                  # Array manipulation and algorithms
├── dynamic-programming/     # DP concepts and problems
├── system-design/          # System design questions and concepts
├── concurrency/            # Threading and concurrency problems
└── behavioral/             # Project deep-dives and behavioral prep
```

## Problem Template Structure

Each problem directory contains:
- `problem.md` - Problem description, constraints, examples
- `hints.md` - Progressive hints (look here before solutions)
- `approach.md` - Detailed problem-solving approach
- `solution.py` - Commented solution implementation
- `test_solution.py` - Test cases and edge cases

## How to Use This Repo

1. Read `problem.md` thoroughly
2. Attempt to solve without hints
3. If stuck, read hints progressively
4. Only check solution after multiple attempts
5. Run and expand test cases
6. Write your own explanation in `my_notes.md`

## Testing

Run tests for a specific problem:
```bash
python -m pytest path/to/problem/test_solution.py
``` 