const makeProblems = (topic, templates) => {
  const difficulties = ['easy', 'easy', 'medium', 'medium', 'hard']
  const problems = []

  for (let i = 0; i < 50; i += 1) {
    const template = templates[i % templates.length]
    problems.push({
      id: `${topic}-${i + 1}`,
      topic,
      title: `${template.title} #${i + 1}`,
      difficulty: difficulties[i % difficulties.length],
      prompt: template.prompt,
      starterCode: template.starterCode,
      expectedLabel: template.expectedLabel,
      validatorCode: template.validatorCode,
      solution: template.solution,
    })
  }

  return problems
}

const sortingTemplates = [
  {
    title: 'Sort Numbers by Absolute Value',
    prompt:
      'Sort nums = [7, -2, -9, 4, 0, 5] by absolute value ascending and assign to result.',
    starterCode: `nums = [7, -2, -9, 4, 0, 5]\n# your code here\nresult = None`,
    expectedLabel: '[0, -2, 4, 5, 7, -9]',
    solution: `nums = [7, -2, -9, 4, 0, 5]\nresult = sorted(nums, key=abs)`,
    validatorCode: `__passed = result == [0, -2, 4, 5, 7, -9]\n__details = f"Expected [0, -2, 4, 5, 7, -9], got {result}"`,
  },
  {
    title: 'Sort Quant Trades by PnL then Risk',
    prompt:
      'Sort trades = [("t1",12,3),("t2",12,1),("t3",8,2)] by pnl descending then risk ascending.',
    starterCode: `trades = [("t1",12,3),("t2",12,1),("t3",8,2)]\n# your code here\nresult = None`,
    expectedLabel: '[("t2",12,1), ("t1",12,3), ("t3",8,2)]',
    solution: `trades = [("t1",12,3),("t2",12,1),("t3",8,2)]\nresult = sorted(trades, key=lambda x: (-x[1], x[2]))`,
    validatorCode: `__passed = result == [('t2',12,1), ('t1',12,3), ('t3',8,2)]\n__details = f"Expected [('t2',12,1), ('t1',12,3), ('t3',8,2)], got {result}"`,
  },
  {
    title: 'Sort Quotes by Spread',
    prompt:
      'Sort quotes = [(100.0,100.2),(99.9,100.4),(100.5,100.55)] by spread (ask-bid) ascending.',
    starterCode: `quotes = [(100.0,100.2),(99.9,100.4),(100.5,100.55)]\n# your code here\nresult = None`,
    expectedLabel: '[(100.5,100.55), (100.0,100.2), (99.9,100.4)]',
    solution: `quotes = [(100.0,100.2),(99.9,100.4),(100.5,100.55)]\nresult = sorted(quotes, key=lambda q: q[1]-q[0])`,
    validatorCode: `__passed = result == [(100.5,100.55), (100.0,100.2), (99.9,100.4)]\n__details = f"Expected [(100.5,100.55), (100.0,100.2), (99.9,100.4)], got {result}"`,
  },
  {
    title: 'Sort by Distance to Target',
    prompt: 'Sort prices = [99.4, 101.1, 100.2, 98.9] by distance to target=100.',
    starterCode: `prices = [99.4, 101.1, 100.2, 98.9]\ntarget = 100\n# your code here\nresult = None`,
    expectedLabel: '[100.2, 99.4, 101.1, 98.9]',
    solution: `prices = [99.4, 101.1, 100.2, 98.9]\ntarget = 100\nresult = sorted(prices, key=lambda x: abs(x-target))`,
    validatorCode: `__passed = result == [100.2, 99.4, 101.1, 98.9]\n__details = f"Expected [100.2, 99.4, 101.1, 98.9], got {result}"`,
  },
  {
    title: 'Sort Dict by Value',
    prompt: 'Sort d = {"alpha":2,"beta":5,"gamma":1} by value descending.',
    starterCode: `d = {"alpha":2,"beta":5,"gamma":1}\n# your code here\nresult = None`,
    expectedLabel: '[("beta",5), ("alpha",2), ("gamma",1)]',
    solution: `d = {"alpha":2,"beta":5,"gamma":1}\nresult = sorted(d.items(), key=lambda kv: kv[1], reverse=True)`,
    validatorCode: `__passed = result == [('beta',5), ('alpha',2), ('gamma',1)]\n__details = f"Expected [('beta',5), ('alpha',2), ('gamma',1)], got {result}"`,
  },
]

const regexTemplates = [
  {
    title: 'Extract Uppercase Tickers',
    prompt: 'From text="AAPL, TSLA, msft, GOOG1, NVDA" extract uppercase tickers (2-5 chars).',
    starterCode: `import re\ntext = "AAPL, TSLA, msft, GOOG1, NVDA"\n# your code here\nresult = None`,
    expectedLabel: '["AAPL", "TSLA", "NVDA"]',
    solution: `import re\ntext = "AAPL, TSLA, msft, GOOG1, NVDA"\nresult = re.findall(r"\\b[A-Z]{2,5}\\b", text)`,
    validatorCode: `__passed = result == ['AAPL','TSLA','NVDA']\n__details = f"Expected ['AAPL','TSLA','NVDA'], got {result}"`,
  },
  {
    title: 'Extract OCC Option Symbols',
    prompt:
      'From s="AAPL250621C00200000 TSLA250621P00150000 bad" extract valid OCC-like symbols.',
    starterCode: `import re\ns = "AAPL250621C00200000 TSLA250621P00150000 bad"\n# your code here\nresult = None`,
    expectedLabel: '["AAPL250621C00200000", "TSLA250621P00150000"]',
    solution: `import re\ns = "AAPL250621C00200000 TSLA250621P00150000 bad"\nresult = re.findall(r"\\b[A-Z]{1,6}\\d{6}[CP]\\d{8}\\b", s)`,
    validatorCode: `__passed = result == ['AAPL250621C00200000','TSLA250621P00150000']\n__details = f"Expected ['AAPL250621C00200000','TSLA250621P00150000'], got {result}"`,
  },
  {
    title: 'Extract key=value Pairs',
    prompt: 'From s="p=0.2 q=0.4 n=20" extract tuples (key,value).',
    starterCode: `import re\ns = "p=0.2 q=0.4 n=20"\n# your code here\nresult = None`,
    expectedLabel: '[("p","0.2"), ("q","0.4"), ("n","20")]',
    solution: `import re\ns = "p=0.2 q=0.4 n=20"\nresult = re.findall(r"([A-Za-z]+)=([0-9]*\\.?[0-9]+)", s)`,
    validatorCode: `__passed = result == [('p','0.2'),('q','0.4'),('n','20')]\n__details = f"Expected [('p','0.2'),('q','0.4'),('n','20')], got {result}"`,
  },
  {
    title: 'Extract Fraction Tokens',
    prompt: 'From s="1/6 3/8 a/b 10/2" extract valid numeric fractions.',
    starterCode: `import re\ns = "1/6 3/8 a/b 10/2"\n# your code here\nresult = None`,
    expectedLabel: '["1/6", "3/8", "10/2"]',
    solution: `import re\ns = "1/6 3/8 a/b 10/2"\nresult = re.findall(r"\\b\\d+/\\d+\\b", s)`,
    validatorCode: `__passed = result == ['1/6','3/8','10/2']\n__details = f"Expected ['1/6','3/8','10/2'], got {result}"`,
  },
  {
    title: 'Normalize Whitespace',
    prompt: 'Replace multiple spaces in text="a   b    c" with a single space.',
    starterCode: `import re\ntext = "a   b    c"\n# your code here\nresult = None`,
    expectedLabel: '"a b c"',
    solution: `import re\ntext = "a   b    c"\nresult = re.sub(r"\\s+", " ", text).strip()`,
    validatorCode: `__passed = result == 'a b c'\n__details = f"Expected 'a b c', got {result}"`,
  },
]

const pandasTemplates = [
  {
    title: 'Mean Return',
    prompt: 'Create DataFrame from returns [0.01,-0.02,0.03,0.00], store mean in result.',
    starterCode: `import pandas as pd\nreturns = [0.01,-0.02,0.03,0.00]\n# your code here\nresult = None`,
    expectedLabel: '0.005',
    solution: `import pandas as pd\ndf = pd.DataFrame({'ret': [0.01,-0.02,0.03,0.00]})\nresult = float(df['ret'].mean())`,
    validatorCode: `__passed = abs(float(result) - 0.005) < 1e-10\n__details = f"Expected 0.005, got {result}"`,
  },
  {
    title: 'Count Positive Returns',
    prompt: 'Given returns=[-0.01,0.03,0.07,-0.02,0.05], count positives in result.',
    starterCode: `import pandas as pd\nreturns = [-0.01,0.03,0.07,-0.02,0.05]\n# your code here\nresult = None`,
    expectedLabel: '3',
    solution: `import pandas as pd\ndf = pd.DataFrame({'ret': [-0.01,0.03,0.07,-0.02,0.05]})\nresult = int((df['ret'] > 0).sum())`,
    validatorCode: `__passed = int(result) == 3\n__details = f"Expected 3, got {result}"`,
  },
  {
    title: 'Max Drawdown',
    prompt: 'For equity=[100,105,102,108,101], compute max drawdown (decimal).',
    starterCode: `import pandas as pd\nequity = [100,105,102,108,101]\n# your code here\nresult = None`,
    expectedLabel: '0.0648 (approx)',
    solution: `import pandas as pd\ns = pd.Series([100,105,102,108,101], dtype='float64')\nresult = float(((s.cummax() - s) / s.cummax()).max())`,
    validatorCode: `__passed = abs(float(result) - 0.0648148148) < 1e-6\n__details = f"Expected ~0.0648148148, got {result}"`,
  },
  {
    title: 'Sector Mean Return',
    prompt: 'For sector=["tech","tech","bank"], ret=[0.1,0.2,0.3], return mean dict by sector.',
    starterCode: `import pandas as pd\n# your code here\nresult = None`,
    expectedLabel: '{"bank":0.3, "tech":0.15}',
    solution: `import pandas as pd\ndf = pd.DataFrame({'sector':['tech','tech','bank'], 'ret':[0.1,0.2,0.3]})\nresult = df.groupby('sector')['ret'].mean().round(4).to_dict()`,
    validatorCode: `__passed = result == {'bank':0.3,'tech':0.15}\n__details = "Expected {'bank':0.3,'tech':0.15}, got " + str(result)`,
  },
  {
    title: 'Rolling Volatility',
    prompt: 'For returns=[0.1,0.2,0.1], compute rolling std window=2 with ddof=0 and return last value.',
    starterCode: `import pandas as pd\nreturns = [0.1,0.2,0.1]\n# your code here\nresult = None`,
    expectedLabel: '0.05',
    solution: `import pandas as pd\ns = pd.Series([0.1,0.2,0.1], dtype='float64')\nresult = float(s.rolling(2).std(ddof=0).iloc[-1])`,
    validatorCode: `__passed = abs(float(result) - 0.05) < 1e-10\n__details = f"Expected 0.05, got {result}"`,
  },
]

export const codingProblemsByTopic = {
  sorting: makeProblems('sorting', sortingTemplates),
  regex: makeProblems('regex', regexTemplates),
  pandas: makeProblems('pandas', pandasTemplates),
}

export const codingProblems = [
  ...codingProblemsByTopic.sorting,
  ...codingProblemsByTopic.regex,
  ...codingProblemsByTopic.pandas,
]
