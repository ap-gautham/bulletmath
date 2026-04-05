const gcd = (a, b) => {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    ;[x, y] = [y, x % y]
  }
  return x || 1
}

const simplifyFraction = (num, den) => {
  const d = gcd(num, den)
  const sign = den < 0 ? -1 : 1
  return [(num / d) * sign, Math.abs(den / d)]
}

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const randomChoice = (list) => list[Math.floor(Math.random() * list.length)]

const fractionDenominators = [
  ...Array.from({ length: 14 }, (_, index) => index + 2),
  4,
  16,
  64,
  9,
  27,
  81,
  6,
  36,
  216,
  6,
  36,
  7,
]

const getAdaptiveDecimalPlaces = (value) => {
  const abs = Math.abs(value)
  if (abs >= 1) {
    return 1
  }

  const fractional = abs.toFixed(8).split('.')[1] || ''
  const firstNonZeroIndex = fractional.search(/[1-9]/)
  if (firstNonZeroIndex === -1) {
    return 1
  }

  return Math.min(firstNonZeroIndex + 1, 6)
}

const withIntegerAnswer = (topic, prompt, value) => ({
  topic,
  prompt,
  answerKind: 'integer',
  expectedValue: value,
  answerDisplay: String(value),
  inputHint: 'Enter an integer only.',
})

const withDecimalAnswer = (topic, prompt, value, decimalPlaces = 2) => ({
  topic,
  prompt,
  answerKind: 'decimal',
  decimalPlaces,
  expectedValue: Number(value.toFixed(decimalPlaces)),
  answerDisplay: Number(value.toFixed(decimalPlaces)).toFixed(decimalPlaces),
  inputHint: `Enter a decimal with exactly ${decimalPlaces} digits after the decimal point.`,
})

const withFractionAnswer = (topic, prompt, numerator, denominator) => {
  const [n, d] = simplifyFraction(numerator, denominator)
  return {
    topic,
    prompt,
    answerKind: 'fraction',
    expectedFraction: `${n}/${d}`,
    expectedValue: n / d,
    answerDisplay: `${n}/${d}`,
    inputHint: 'Enter a simplified fraction only, in the form a/b.',
  }
}

const buildAdditionQuestion = (profile) => {
  const a = randomInt(profile.minInt, profile.maxInt)
  const b = randomInt(profile.minInt, profile.maxInt)
  return withIntegerAnswer('addition', `${a} + ${b}`, a + b)
}

const buildSubtractionQuestion = (profile) => {
  const a = randomInt(profile.minInt, profile.maxInt)
  const b = randomInt(profile.minInt, profile.maxInt)
  return withIntegerAnswer('subtraction', `${a} - ${b}`, a - b)
}

const buildMultiplicationQuestion = (profile) => {
  const a = randomInt(profile.minMult, profile.maxMult)
  const b = randomInt(profile.minMult, profile.maxMult)
  return withIntegerAnswer('multiplication', `${a} × ${b}`, a * b)
}

const buildDivisionQuestion = (profile) => {
  const exact = Math.random() < profile.divisionExactRate
  const divisor = randomInt(2, profile.maxDivisor)

  if (exact) {
    const quotient = randomInt(profile.minDivQuotient, profile.maxDivQuotient)
    const dividend = divisor * quotient
    return withIntegerAnswer('division', `${dividend} / ${divisor}`, quotient)
  }

  const quotient = randomInt(profile.minDivQuotient, profile.maxDivQuotient)
  const remainder = randomInt(1, divisor - 1)
  const dividend = divisor * quotient + remainder
  const value = dividend / divisor
  return withDecimalAnswer(
    'division',
    `${dividend} / ${divisor}`,
    value,
    getAdaptiveDecimalPlaces(value),
  )
}

const buildFractionDecimalSimple = () => {
  const denominator = randomChoice([3, 4, 5, 6, 7, 8, 9, 11, 12, 13])
  const value = 1 / denominator
  return withDecimalAnswer(
    'simple-fraction',
    `1/${denominator}`,
    value,
    getAdaptiveDecimalPlaces(value),
  )
}

const buildFractionDecimalComplex = () => {
  const denominator = randomChoice(fractionDenominators)
  const numerator = randomInt(1, Math.max(2, denominator - 1))
  const [n, d] = simplifyFraction(numerator, denominator)
  const value = n / d
  return withDecimalAnswer(
    'complex-fraction',
    `${n}/${d}`,
    value,
    getAdaptiveDecimalPlaces(value),
  )
}

const buildFractionOpsQuestion = () => {
  const d1 = randomChoice([2, 3, 4, 5, 6, 8, 10, 12])
  const d2 = randomChoice([2, 3, 4, 5, 6, 8, 10, 12])
  const n1 = randomInt(1, d1 - 1)
  const n2 = randomInt(1, d2 - 1)
  const op = randomChoice(['+', '-', '×'])

  if (op === '×') {
    return withFractionAnswer('fractions', `${n1}/${d1} × ${n2}/${d2}`, n1 * n2, d1 * d2)
  }

  const lcm = (d1 * d2) / gcd(d1, d2)
  const left = (lcm / d1) * n1
  const right = (lcm / d2) * n2
  const num = op === '+' ? left + right : left - right
  return withFractionAnswer('fractions', `${n1}/${d1} ${op} ${n2}/${d2}`, num, lcm)
}

const buildFractionsQuestion = () => {
  const roll = Math.random()
  if (roll < 0.35) {
    return buildFractionDecimalSimple()
  }
  if (roll < 0.7) {
    return buildFractionDecimalComplex()
  }
  return buildFractionOpsQuestion()
}

const factorial = (n) => {
  if (n <= 1) {
    return 1
  }
  let total = 1
  for (let i = 2; i <= n; i += 1) {
    total *= i
  }
  return total
}

const buildCombinationQuestion = () => {
  const n = randomInt(5, 15)
  const r = randomInt(2, Math.min(5, n - 1))
  return withIntegerAnswer('combination', `${n}C${r}`, factorial(n) / (factorial(r) * factorial(n - r)))
}

const buildFractionDivisionQuestion = () => {
  const whole = randomInt(2, 20)
  const numerator = randomChoice([1, 2, 3, 4, 5])
  const denominator = randomChoice([2, 3, 4, 5, 6, 8])
  return withFractionAnswer(
    'fraction-division',
    `${whole} ÷ (${numerator}/${denominator})`,
    whole * denominator,
    numerator,
  )
}

const buildDecimalsQuestion = () => {
  const a = randomInt(10, 999) / 10
  const b = randomInt(10, 999) / 10
  const op = randomChoice(['+', '-', '×'])

  if (op === '+') {
    const value = a + b
    return withDecimalAnswer(
      'decimals',
      `${a.toFixed(1)} + ${b.toFixed(1)}`,
      value,
      getAdaptiveDecimalPlaces(value),
    )
  }
  if (op === '-') {
    const value = a - b
    return withDecimalAnswer(
      'decimals',
      `${a.toFixed(1)} - ${b.toFixed(1)}`,
      value,
      getAdaptiveDecimalPlaces(value),
    )
  }
  const value = a * b
  return withDecimalAnswer(
    'decimals',
    `${a.toFixed(1)} × ${b.toFixed(1)}`,
    value,
    getAdaptiveDecimalPlaces(value),
  )
}

const buildProbabilityDivisionQuestion = () => {
  const style = randomChoice(['dice', 'cards', 'walk'])

  if (style === 'dice') {
    const power = randomChoice([2, 3])
    const value = 1 / (6 ** power)
    return withDecimalAnswer(
      'probability-division',
      `1/6^${power}`,
      value,
      getAdaptiveDecimalPlaces(value),
    )
  }

  if (style === 'cards') {
    const value = 1 / 52
    return withDecimalAnswer(
      'probability-division',
      '1/52',
      value,
      getAdaptiveDecimalPlaces(value),
    )
  }

  const steps = randomChoice([4, 5, 6])
  const value = 1 / (2 ** steps)
  return withDecimalAnswer(
    'probability-division',
    `1/2^${steps}`,
    value,
    getAdaptiveDecimalPlaces(value),
  )
}

const topicBuilders = {
  addition: buildAdditionQuestion,
  subtraction: buildSubtractionQuestion,
  multiplication: buildMultiplicationQuestion,
  division: buildDivisionQuestion,
  fractions: buildFractionsQuestion,
  combination: buildCombinationQuestion,
  'fraction-division': buildFractionDivisionQuestion,
  decimals: buildDecimalsQuestion,
  'probability-division': buildProbabilityDivisionQuestion,
}

export const levelConfigs = {
  easy: {
    label: 'Easy',
    timeLimit: 60,
    minInt: 10,
    maxInt: 999,
    minMult: 2,
    maxMult: 25,
    maxDivisor: 25,
    minDivQuotient: 2,
    maxDivQuotient: 40,
    divisionExactRate: 0.95,
    topics: ['addition', 'subtraction', 'multiplication', 'division'],
  },
  medium: {
    label: 'Medium',
    timeLimit: 60,
    minInt: 100,
    maxInt: 9999,
    minMult: 8,
    maxMult: 55,
    maxDivisor: 40,
    minDivQuotient: 6,
    maxDivQuotient: 120,
    divisionExactRate: 0.75,
    topics: [
      'addition',
      'subtraction',
      'multiplication',
      'division',
      'fractions',
      'combination',
      'fraction-division',
      'probability-division',
    ],
  },
  difficult: {
    label: 'Difficult',
    timeLimit: 60,
    minInt: 500,
    maxInt: 15000,
    minMult: 12,
    maxMult: 99,
    maxDivisor: 70,
    minDivQuotient: 10,
    maxDivQuotient: 180,
    divisionExactRate: 0.5,
    topics: [
      'addition',
      'subtraction',
      'multiplication',
      'division',
      'fractions',
      'combination',
      'fraction-division',
      'decimals',
      'probability-division',
    ],
  },
  boss: {
    label: 'Boss Mode',
    timeLimit: 60,
    minInt: 900,
    maxInt: 30000,
    minMult: 20,
    maxMult: 140,
    maxDivisor: 120,
    minDivQuotient: 15,
    maxDivQuotient: 260,
    divisionExactRate: 0.5,
    topics: [
      'addition',
      'subtraction',
      'multiplication',
      'division',
      'fractions',
      'combination',
      'fraction-division',
      'decimals',
      'probability-division',
    ],
  },
}

export const customTemplates = [
  {
    id: 'speed-core',
    label: 'Speed Core',
    timeLimit: 60,
    sessionType: 'timed',
    questionCount: 10,
    focusMode: 'custom',
    topics: ['addition', 'subtraction', 'multiplication'],
  },
  {
    id: 'fraction-reflex',
    label: 'Fraction Focus',
    timeLimit: 60,
    sessionType: 'timed',
    questionCount: 10,
    focusMode: 'fractions',
    topics: ['fractions'],
  },
  {
    id: 'probability-drill',
    label: 'Probability Division Drill',
    timeLimit: 60,
    sessionType: 'timed',
    questionCount: 10,
    focusMode: 'custom',
    topics: ['probability-division', 'division', 'decimals'],
  },
  {
    id: 'quant-mix',
    label: 'Quant Mix',
    timeLimit: 60,
    sessionType: 'timed',
    questionCount: 12,
    focusMode: 'all',
    topics: [
      'addition',
      'subtraction',
      'multiplication',
      'division',
      'fractions',
      'combination',
      'fraction-division',
      'decimals',
      'probability-division',
    ],
  },
  {
    id: 'combo-sprint',
    label: 'Combination Sprint',
    timeLimit: 60,
    sessionType: 'count',
    questionCount: 10,
    focusMode: 'combinations',
    topics: ['combination'],
  },
]

const parseInteger = (input) => {
  if (!/^-?\d+$/.test(input)) {
    return null
  }
  return Number(input)
}

const parseDecimal = (input, places) => {
  const regex = new RegExp(`^-?\\d+\\.\\d{${places}}$`)
  if (!regex.test(input)) {
    return null
  }
  return Number(input)
}

const parseFraction = (input) => {
  const match = input.match(/^\s*(-?\d+)\s*\/\s*(-?\d+)\s*$/)
  if (!match) {
    return null
  }
  const n = Number(match[1])
  const d = Number(match[2])
  if (d === 0) {
    return null
  }
  const [sn, sd] = simplifyFraction(n, d)
  return `${sn}/${sd}`
}

export const generateQuestion = (settings) => {
  const pool = settings.topics.length ? settings.topics : levelConfigs.easy.topics
  const chosen = randomChoice(pool)
  const builder = topicBuilders[chosen] || buildAdditionQuestion
  return {
    ...builder(settings),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  }
}

export const checkAnswer = (question, rawInput) => {
  const input = rawInput.trim()
  if (!input) {
    return false
  }

  if (question.answerKind === 'integer') {
    const parsed = parseInteger(input)
    return parsed !== null && parsed === question.expectedValue
  }

  if (question.answerKind === 'decimal') {
    const parsed = parseDecimal(input, question.decimalPlaces)
    return (
      parsed !== null
      && parsed.toFixed(question.decimalPlaces)
        === question.expectedValue.toFixed(question.decimalPlaces)
    )
  }

  if (question.answerKind === 'fraction') {
    const normalized = parseFraction(input)
    return normalized !== null && normalized === question.expectedFraction
  }

  return false
}
