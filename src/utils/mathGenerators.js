const gcd = (a, b) => {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    ;[x, y] = [y, x % y]
  }
  return x || 1
}

const simplifyFraction = (num, den) => {
  const divisor = gcd(num, den)
  return [num / divisor, den / divisor]
}

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const randomChoice = (list) => list[Math.floor(Math.random() * list.length)]

const randomSign = () => (Math.random() < 0.5 ? -1 : 1)

const toFixedSmart = (value, decimals = 4) => {
  const asNumber = Number(value)
  return Number(asNumber.toFixed(decimals))
}

const buildAdditionQuestion = (profile) => {
  const a = randomInt(profile.minInt, profile.maxInt)
  const b = randomInt(profile.minInt, profile.maxInt)
  return {
    topic: 'addition',
    prompt: `${a} + ${b}`,
    answer: a + b,
    tolerance: 0,
  }
}

const buildSubtractionQuestion = (profile) => {
  const a = randomInt(profile.minInt, profile.maxInt)
  const b = randomInt(profile.minInt, profile.maxInt)
  return {
    topic: 'subtraction',
    prompt: `${a} - ${b}`,
    answer: a - b,
    tolerance: 0,
  }
}

const buildMultiplicationQuestion = (profile) => {
  const a = randomSign() * randomInt(profile.minMult, profile.maxMult)
  const b = randomInt(profile.minMult, profile.maxMult)
  return {
    topic: 'multiplication',
    prompt: `${a} × ${b}`,
    answer: a * b,
    tolerance: 0,
  }
}

const buildDivisionQuestion = (profile) => {
  const divisor = randomInt(2, profile.maxDivisor)
  const quotient = randomInt(profile.minDivQuotient, profile.maxDivQuotient)
  const includeRemainder = Math.random() < profile.remainderRate

  if (includeRemainder) {
    const remainder = randomInt(1, divisor - 1)
    const dividend = divisor * quotient + remainder
    return {
      topic: 'division',
      prompt: `${dividend} / ${divisor}`,
      answer: toFixedSmart(dividend / divisor),
      tolerance: 0.01,
    }
  }

  return {
    topic: 'division',
    prompt: `${divisor * quotient} / ${divisor}`,
    answer: quotient,
    tolerance: 0,
  }
}

const buildFractionQuestion = () => {
  const d1 = randomChoice([2, 3, 4, 5, 6, 8, 10, 12])
  const d2 = randomChoice([2, 3, 4, 5, 6, 8, 10, 12])
  const n1 = randomInt(1, d1 - 1)
  const n2 = randomInt(1, d2 - 1)
  const operator = randomChoice(['+', '-', '×'])

  if (operator === '×') {
    const productN = n1 * n2
    const productD = d1 * d2
    const [sn, sd] = simplifyFraction(productN, productD)
    return {
      topic: 'fractions',
      prompt: `${n1}/${d1} × ${n2}/${d2}`,
      answer: sn / sd,
      tolerance: 0.001,
      answerDisplay: `${sn}/${sd}`,
    }
  }

  const lcm = (d1 * d2) / gcd(d1, d2)
  const scaled1 = (lcm / d1) * n1
  const scaled2 = (lcm / d2) * n2
  const numer = operator === '+' ? scaled1 + scaled2 : scaled1 - scaled2
  const [sn, sd] = simplifyFraction(numer, lcm)

  return {
    topic: 'fractions',
    prompt: `${n1}/${d1} ${operator} ${n2}/${d2}`,
    answer: sn / sd,
    tolerance: 0.001,
    answerDisplay: `${sn}/${sd}`,
  }
}

const buildDecimalQuestion = (profile) => {
  const a = toFixedSmart(randomInt(10, 300) / randomChoice([10, 100]))
  const b = toFixedSmart(randomInt(10, 300) / randomChoice([10, 100]))
  const operator = randomChoice(['+', '-', '×'])

  if (operator === '+') {
    return {
      topic: 'decimals',
      prompt: `${a} + ${b}`,
      answer: toFixedSmart(a + b, profile.decimalPlaces),
      tolerance: 0.01,
    }
  }
  if (operator === '-') {
    return {
      topic: 'decimals',
      prompt: `${a} - ${b}`,
      answer: toFixedSmart(a - b, profile.decimalPlaces),
      tolerance: 0.01,
    }
  }

  return {
    topic: 'decimals',
    prompt: `${a} × ${b}`,
    answer: toFixedSmart(a * b, profile.decimalPlaces),
    tolerance: 0.02,
  }
}

const buildRoundingQuestion = () => {
  const numerator = randomInt(5, 95)
  const denominator = randomChoice([8, 9, 11, 12, 13, 16, 19])
  const precision = randomChoice([2, 3])
  const value = numerator / denominator
  return {
    topic: 'rounding',
    prompt: `Round ${numerator}/${denominator} to ${precision} decimals`,
    answer: Number(value.toFixed(precision)),
    tolerance: 10 ** -precision,
  }
}

const buildProbabilityNumberQuestion = () => {
  const p = randomChoice([0.05, 0.1, 0.2, 0.25, 0.3, 0.4, 0.6, 0.8])
  const q = randomChoice([0.1, 0.15, 0.2, 0.25, 0.35, 0.5, 0.75])
  const style = randomChoice(['multiply', 'complement', 'percentage'])

  if (style === 'multiply') {
    return {
      topic: 'probability-numbers',
      prompt: `If P(A)=${p} and P(B)=${q} independent, compute P(A and B)`,
      answer: Number((p * q).toFixed(4)),
      tolerance: 0.001,
    }
  }

  if (style === 'complement') {
    return {
      topic: 'probability-numbers',
      prompt: `If success chance is ${p}, what is failure chance?`,
      answer: Number((1 - p).toFixed(4)),
      tolerance: 0.0001,
    }
  }

  return {
    topic: 'probability-numbers',
    prompt: `Convert ${(p * 100).toFixed(0)}% to decimal`,
    answer: p,
    tolerance: 0.0001,
  }
}

const topicBuilders = {
  addition: buildAdditionQuestion,
  subtraction: buildSubtractionQuestion,
  multiplication: buildMultiplicationQuestion,
  division: buildDivisionQuestion,
  fractions: buildFractionQuestion,
  decimals: buildDecimalQuestion,
  rounding: buildRoundingQuestion,
  'probability-numbers': buildProbabilityNumberQuestion,
}

export const levelConfigs = {
  easy: {
    label: 'Easy',
    timeLimit: 120,
    minInt: 1,
    maxInt: 30,
    minMult: 2,
    maxMult: 12,
    maxDivisor: 12,
    minDivQuotient: 2,
    maxDivQuotient: 20,
    remainderRate: 0.2,
    decimalPlaces: 2,
    topics: ['addition', 'subtraction', 'multiplication', 'division'],
  },
  medium: {
    label: 'Medium',
    timeLimit: 150,
    minInt: 5,
    maxInt: 70,
    minMult: 5,
    maxMult: 20,
    maxDivisor: 18,
    minDivQuotient: 4,
    maxDivQuotient: 35,
    remainderRate: 0.35,
    decimalPlaces: 3,
    topics: ['addition', 'subtraction', 'multiplication', 'division', 'fractions'],
  },
  difficult: {
    label: 'Difficult',
    timeLimit: 180,
    minInt: 20,
    maxInt: 150,
    minMult: 8,
    maxMult: 45,
    maxDivisor: 25,
    minDivQuotient: 8,
    maxDivQuotient: 60,
    remainderRate: 0.5,
    decimalPlaces: 3,
    topics: [
      'addition',
      'subtraction',
      'multiplication',
      'division',
      'fractions',
      'decimals',
      'rounding',
    ],
  },
  boss: {
    label: 'Boss Mode',
    timeLimit: 210,
    minInt: 50,
    maxInt: 280,
    minMult: 12,
    maxMult: 65,
    maxDivisor: 35,
    minDivQuotient: 15,
    maxDivQuotient: 85,
    remainderRate: 0.65,
    decimalPlaces: 4,
    topics: [
      'addition',
      'subtraction',
      'multiplication',
      'division',
      'fractions',
      'decimals',
      'rounding',
      'probability-numbers',
    ],
  },
}

export const customTemplates = [
  {
    id: 'speed-core',
    label: 'Speed Core',
    timeLimit: 90,
    topics: ['addition', 'subtraction', 'multiplication'],
  },
  {
    id: 'fraction-reflex',
    label: 'Fraction Reflex',
    timeLimit: 120,
    topics: ['fractions', 'rounding'],
  },
  {
    id: 'probability-drill',
    label: 'Probability Drill',
    timeLimit: 120,
    topics: ['probability-numbers', 'division', 'decimals'],
  },
  {
    id: 'quant-mix',
    label: 'Quant Mix',
    timeLimit: 180,
    topics: [
      'addition',
      'subtraction',
      'multiplication',
      'division',
      'fractions',
      'decimals',
      'probability-numbers',
    ],
  },
]

export const parseNumericInput = (rawInput) => {
  const input = rawInput.trim()
  if (!input) {
    return null
  }

  if (input.includes('/')) {
    const [left, right] = input.split('/').map((part) => part.trim())
    const numerator = Number(left)
    const denominator = Number(right)
    if (!Number.isNaN(numerator) && !Number.isNaN(denominator) && denominator !== 0) {
      return numerator / denominator
    }
  }

  const cleaned = input.replace('%', '')
  const parsed = Number(cleaned)
  if (Number.isNaN(parsed)) {
    return null
  }

  if (input.endsWith('%')) {
    return parsed / 100
  }

  return parsed
}

export const generateQuestion = (settings) => {
  const pool = settings.topics.length ? settings.topics : levelConfigs.easy.topics
  const chosenTopic = randomChoice(pool)
  const builder = topicBuilders[chosenTopic] || buildAdditionQuestion
  const question = builder(settings)

  return {
    ...question,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    answerDisplay: question.answerDisplay ?? String(question.answer),
  }
}

export const checkAnswer = (question, input) => {
  const numeric = parseNumericInput(input)
  if (numeric === null) {
    return false
  }

  const difference = Math.abs(numeric - question.answer)
  return difference <= (question.tolerance ?? 0)
}
