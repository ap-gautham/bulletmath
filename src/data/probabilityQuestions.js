const shuffleArray = (items) => {
  const list = [...items]
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

export const staticProbabilityQuestions = [
  {
    id: 'sp-1',
    question: 'A fair coin is tossed 3 times. What is the probability of exactly 2 heads?',
    hint: 'Count favorable outcomes and divide by total outcomes.',
    solution: 'Total outcomes = 2^3 = 8. Exactly 2 heads can happen in C(3,2)=3 ways, so probability is 3/8.',
  },
  {
    id: 'sp-2',
    question: 'A die is rolled twice. What is P(sum >= 10)?',
    hint: 'List ordered pairs giving sums 10, 11, and 12.',
    solution: 'Favorable pairs: (4,6),(5,5),(6,4),(5,6),(6,5),(6,6) = 6 out of 36, so 1/6.',
  },
  {
    id: 'sp-3',
    question: 'A stock moves up with probability 0.55 each day independently. What is P(two up days in a row)?',
    hint: 'Multiply independent probabilities.',
    solution: '0.55 x 0.55 = 0.3025.',
  },
  {
    id: 'sp-4',
    question: 'P(A)=0.4, P(B)=0.5, and A,B independent. What is P(A or B)?',
    hint: 'Use inclusion-exclusion with P(A and B)=P(A)P(B).',
    solution: 'P(A or B)=0.4 + 0.5 - (0.4x0.5)=0.7.',
  },
  {
    id: 'sp-5',
    question: 'A box has 6 red and 4 blue balls. Draw 2 without replacement. Probability both are red?',
    hint: 'Use sequential multiplication.',
    solution: '(6/10) x (5/9) = 30/90 = 1/3.',
  },
  {
    id: 'sp-6',
    question: 'A test is 95% sensitive and 90% specific. Disease prevalence is 2%. What is P(disease | positive)?',
    hint: 'Apply Bayes theorem with numerator and full positive probability denominator.',
    solution: 'Numerator = 0.95x0.02=0.019. Denominator = 0.019 + (0.10x0.98)=0.117. Posterior = 0.019/0.117 ~= 0.1624.',
  },
  {
    id: 'sp-7',
    question: 'Pick a random permutation of numbers 1..4. What is probability 1 appears before 2?',
    hint: 'Symmetry between labels 1 and 2.',
    solution: 'By symmetry, either 1 comes before 2 or vice versa, each with probability 1/2.',
  },
  {
    id: 'sp-8',
    question: 'In 5 independent Bernoulli trials with p=0.2, what is expected number of successes?',
    hint: 'For Binomial(n,p), expectation is np.',
    solution: 'E[X]=np=5x0.2=1.',
  },
  {
    id: 'sp-9',
    question: 'Var(X) for X~Binomial(20, 0.3)?',
    hint: 'Use np(1-p).',
    solution: 'Variance = 20x0.3x0.7 = 4.2.',
  },
  {
    id: 'sp-10',
    question: 'A strategy wins with probability 0.48 each trade. Probability of at least one win in 3 trades?',
    hint: 'Compute complement of zero wins.',
    solution: '1 - (0.52)^3 = 1 - 0.140608 = 0.859392.',
  },
  {
    id: 'sp-11',
    question: 'Two fair dice. Conditional probability first die is 6 given total is 9?',
    hint: 'List outcomes summing to 9, then count where first die is 6.',
    solution: 'Sum=9 outcomes: (3,6),(4,5),(5,4),(6,3). One has first die 6 => 1/4.',
  },
  {
    id: 'sp-12',
    question: 'Random variable X takes values {1,2,3} each with probability 1/3. Compute E[X^2].',
    hint: 'Weighted average of squares.',
    solution: '(1^2 + 2^2 + 3^2)/3 = (1+4+9)/3 = 14/3.',
  },
  {
    id: 'sp-13',
    question: 'A fair coin is tossed until first head. What is expected toss count?',
    hint: 'Geometric distribution with p=0.5.',
    solution: 'Expectation of Geometric(p) on trials-until-success is 1/p = 2.',
  },
  {
    id: 'sp-14',
    question: 'If daily returns are iid with mean 0.1% and variance 0.04%^2, what is expected 5-day return (simple sum approximation)?',
    hint: 'Linearity of expectation.',
    solution: '5 x 0.1% = 0.5%.',
  },
  {
    id: 'sp-15',
    question: 'Same setup as above: approximate variance of 5-day summed return?',
    hint: 'Independent variances add.',
    solution: '5 x 0.04%^2 = 0.008%^2.',
  },
  {
    id: 'sp-16',
    question: 'Choose 2 cards from a 52-card deck without replacement. Probability both are aces?',
    hint: 'Use combinations or sequential draw.',
    solution: '(4/52) x (3/51) = 12/2652 = 1/221.',
  },
  {
    id: 'sp-17',
    question: 'A random variable has P(X=0)=0.7 and P(X=3)=0.3. Compute E[X].',
    hint: 'Discrete expectation sum x p(x).',
    solution: 'E[X]=0x0.7 + 3x0.3 = 0.9.',
  },
  {
    id: 'sp-18',
    question: 'If P(A|B)=0.6 and P(B)=0.25, find P(A and B).',
    hint: 'Rearrange conditional probability formula.',
    solution: 'P(A and B)=P(A|B)P(B)=0.6x0.25=0.15.',
  },
  {
    id: 'sp-19',
    question: 'For independent events A and B, if P(A)=0.2 and P(A or B)=0.68, what is P(B)?',
    hint: 'Use P(A or B)=P(A)+P(B)-P(A)P(B).',
    solution: '0.68=0.2+P(B)-0.2P(B)=0.2+0.8P(B). Thus P(B)=0.6.',
  },
  {
    id: 'sp-20',
    question: 'A fair 6-sided die: what is P(rolling a prime number)?',
    hint: 'Prime faces are 2,3,5.',
    solution: '3 favorable outcomes out of 6, so probability is 1/2.',
  },
]

export const buildStaticSession = (count = 10) =>
  shuffleArray(staticProbabilityQuestions).slice(0, count)

const makeRandomQuestion = () => {
  const template = Math.floor(Math.random() * 6)

  if (template === 0) {
    const p = Number((Math.floor(Math.random() * 6 + 2) / 10).toFixed(1))
    return {
      id: `rp-${crypto.randomUUID()}`,
      question: `A model predicts correctly with probability ${p}. If two predictions are independent, what is probability both are correct?`,
      hint: 'Multiply probabilities for independent events.',
      solution: `${p} x ${p} = ${(p * p).toFixed(4)}.`,
    }
  }

  if (template === 1) {
    const n = Math.floor(Math.random() * 8) + 4
    const p = Number((Math.floor(Math.random() * 5 + 2) / 10).toFixed(1))
    return {
      id: `rp-${crypto.randomUUID()}`,
      question: `Let X~Binomial(${n}, ${p}). What is E[X]?`,
      hint: 'Expectation of Binomial(n,p) is np.',
      solution: `E[X]=${n}x${p}=${(n * p).toFixed(2)}.`,
    }
  }

  if (template === 2) {
    const red = Math.floor(Math.random() * 6) + 4
    const blue = Math.floor(Math.random() * 6) + 3
    return {
      id: `rp-${crypto.randomUUID()}`,
      question: `A bag has ${red} red and ${blue} blue chips. Draw 2 without replacement. Probability both are blue?`,
      hint: 'Multiply first and second draw probabilities.',
      solution: `(${blue}/${red + blue}) x (${blue - 1}/${red + blue - 1}) = ${((blue / (red + blue)) * ((blue - 1) / (red + blue - 1))).toFixed(4)}.`,
    }
  }

  if (template === 3) {
    const pA = Number((Math.floor(Math.random() * 5 + 2) / 10).toFixed(1))
    const pB = Number((Math.floor(Math.random() * 5 + 2) / 10).toFixed(1))
    return {
      id: `rp-${crypto.randomUUID()}`,
      question: `Events A and B are independent with P(A)=${pA}, P(B)=${pB}. Compute P(A or B).`,
      hint: 'Use inclusion-exclusion for independent events.',
      solution: `${pA} + ${pB} - ${pA * pB} = ${(pA + pB - pA * pB).toFixed(4)}.`,
    }
  }

  if (template === 4) {
    const fail = Number((Math.floor(Math.random() * 5 + 1) / 10).toFixed(1))
    return {
      id: `rp-${crypto.randomUUID()}`,
      question: `A process fails each run with probability ${fail}. What is probability of at least one failure in 3 runs?`,
      hint: 'Use complement of zero failures.',
      solution: `1 - (1-${fail})^3 = ${(1 - (1 - fail) ** 3).toFixed(4)}.`,
    }
  }

  const sum = Math.floor(Math.random() * 5) + 7
  let favorable = 0
  for (let i = 1; i <= 6; i += 1) {
    for (let j = 1; j <= 6; j += 1) {
      if (i + j >= sum) {
        favorable += 1
      }
    }
  }
  return {
    id: `rp-${crypto.randomUUID()}`,
    question: `Two fair dice are rolled. What is P(sum >= ${sum})?`,
    hint: 'Count favorable ordered outcomes over 36 total.',
    solution: `${favorable}/36 = ${(favorable / 36).toFixed(4)}.`,
  }
}

export const buildRandomSession = (count = 10) =>
  Array.from({ length: count }, () => makeRandomQuestion())
