export const codingProblems = [
  {
    id: 'cp-1',
    title: 'Sort Numbers by Absolute Value',
    topic: 'sorting arrays',
    difficulty: 'easy',
    prompt:
      'Write Python code that sorts nums = [7, -2, -9, 4, 0, 5] by absolute value ascending and stores the result in result.',
    starterCode: `nums = [7, -2, -9, 4, 0, 5]\n# your code here\nresult = None`,
    expectedLabel: '[-2, 0, 4, 5, 7, -9]',
    validate: (execution) =>
      Array.isArray(execution.result) &&
      JSON.stringify(execution.result) === JSON.stringify([-2, 0, 4, 5, 7, -9]),
    solution: `nums = [7, -2, -9, 4, 0, 5]\nresult = sorted(nums, key=abs)`,
  },
  {
    id: 'cp-2',
    title: 'Custom Tuple Sort',
    topic: 'sorting arrays',
    difficulty: 'medium',
    prompt:
      'Sort pairs = [("A",3),("B",1),("C",3),("D",2)] by second value descending, then label ascending. Save in result.',
    starterCode: `pairs = [("A",3),("B",1),("C",3),("D",2)]\n# your code here\nresult = None`,
    expectedLabel: '[("A",3), ("C",3), ("D",2), ("B",1)]',
    validate: (execution) =>
      Array.isArray(execution.result) &&
      JSON.stringify(execution.result) === JSON.stringify([['A', 3], ['C', 3], ['D', 2], ['B', 1]]),
    solution: `pairs = [("A",3),("B",1),("C",3),("D",2)]\nresult = sorted(pairs, key=lambda x: (-x[1], x[0]))`,
  },
  {
    id: 'cp-3',
    title: 'Regex Extract Tickers',
    topic: 'regex',
    difficulty: 'easy',
    prompt:
      'From text = "Trades: AAPL, TSLA, msft, GOOG1, NVDA" extract only uppercase tickers of 2-5 letters using regex. Store list in result.',
    starterCode: `import re\ntext = "Trades: AAPL, TSLA, msft, GOOG1, NVDA"\n# your code here\nresult = None`,
    expectedLabel: '["AAPL", "TSLA", "NVDA"]',
    validate: (execution) =>
      Array.isArray(execution.result) &&
      JSON.stringify(execution.result) === JSON.stringify(['AAPL', 'TSLA', 'NVDA']),
    solution: `import re\ntext = "Trades: AAPL, TSLA, msft, GOOG1, NVDA"\nresult = re.findall(r"\\b[A-Z]{2,5}\\b", text)`,
  },
  {
    id: 'cp-4',
    title: 'Regex Parse Probabilities',
    topic: 'regex',
    difficulty: 'medium',
    prompt:
      'Extract decimal numbers from line = "p=0.25 q=0.4 stop=1" as floats and store in result.',
    starterCode: `import re\nline = "p=0.25 q=0.4 stop=1"\n# your code here\nresult = None`,
    expectedLabel: '[0.25, 0.4, 1.0]',
    validate: (execution) => {
      if (!Array.isArray(execution.result) || execution.result.length !== 3) {
        return false
      }
      const expected = [0.25, 0.4, 1]
      return execution.result.every(
        (value, index) => Math.abs(Number(value) - expected[index]) < 1e-9,
      )
    },
    solution: `import re\nline = "p=0.25 q=0.4 stop=1"\nresult = [float(x) for x in re.findall(r"\\d*\\.?\\d+", line)]`,
  },
  {
    id: 'cp-5',
    title: 'Pandas Mean Return',
    topic: 'pandas',
    difficulty: 'easy',
    prompt:
      'Create a DataFrame with returns [0.01, -0.02, 0.03, 0.00], compute mean return, assign to result.',
    starterCode: `import pandas as pd\nreturns = [0.01, -0.02, 0.03, 0.00]\n# your code here\nresult = None`,
    expectedLabel: '0.005',
    validate: (execution) => Math.abs(Number(execution.result) - 0.005) < 1e-10,
    solution: `import pandas as pd\nreturns = [0.01, -0.02, 0.03, 0.00]\ndf = pd.DataFrame({"ret": returns})\nresult = float(df["ret"].mean())`,
  },
  {
    id: 'cp-6',
    title: 'Pandas Filter and Count',
    topic: 'pandas',
    difficulty: 'medium',
    prompt:
      'Given returns = [-0.01, 0.03, 0.07, -0.02, 0.05], count how many are strictly positive and store integer in result.',
    starterCode: `import pandas as pd\nreturns = [-0.01, 0.03, 0.07, -0.02, 0.05]\n# your code here\nresult = None`,
    expectedLabel: '3',
    validate: (execution) => Number(execution.result) === 3,
    solution: `import pandas as pd\nreturns = [-0.01, 0.03, 0.07, -0.02, 0.05]\ndf = pd.DataFrame({"ret": returns})\nresult = int((df["ret"] > 0).sum())`,
  },
  {
    id: 'cp-7',
    title: 'Sort Dictionary Items',
    topic: 'sorting arrays',
    difficulty: 'medium',
    prompt:
      'Sort d = {"alpha":2,"beta":5,"gamma":1} by value descending and store list of tuples in result.',
    starterCode: `d = {"alpha":2,"beta":5,"gamma":1}\n# your code here\nresult = None`,
    expectedLabel: '[("beta",5), ("alpha",2), ("gamma",1)]',
    validate: (execution) =>
      Array.isArray(execution.result) &&
      JSON.stringify(execution.result) === JSON.stringify([['beta', 5], ['alpha', 2], ['gamma', 1]]),
    solution: `d = {"alpha":2,"beta":5,"gamma":1}\nresult = sorted(d.items(), key=lambda item: item[1], reverse=True)`,
  },
  {
    id: 'cp-8',
    title: 'Regex Validate Dates',
    topic: 'regex',
    difficulty: 'hard',
    prompt:
      'From rows = ["2025-01-10", "10-01-2025", "2024-12-31"] keep only YYYY-MM-DD format dates in result.',
    starterCode: `import re\nrows = ["2025-01-10", "10-01-2025", "2024-12-31"]\n# your code here\nresult = None`,
    expectedLabel: '["2025-01-10", "2024-12-31"]',
    validate: (execution) =>
      Array.isArray(execution.result) &&
      JSON.stringify(execution.result) === JSON.stringify(['2025-01-10', '2024-12-31']),
    solution: `import re\nrows = ["2025-01-10", "10-01-2025", "2024-12-31"]\npat = re.compile(r"^\\d{4}-\\d{2}-\\d{2}$")\nresult = [row for row in rows if pat.match(row)]`,
  },
]
