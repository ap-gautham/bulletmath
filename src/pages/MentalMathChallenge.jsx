import { useEffect, useMemo, useState } from 'react'
import {
  checkAnswer,
  generateQuestion,
  levelConfigs,
} from '../utils/mathGenerators'

const topicLabelMap = {
  addition: 'Addition',
  subtraction: 'Subtraction',
  multiplication: 'Multiplication',
  division: 'Division',
  'simple-fraction': 'Simple Fractions',
  'complex-fraction': 'Complex Fractions',
  combination: 'Combinations (nCr)',
  decimals: 'Decimals',
  'probability-division': 'Probability Ratios',
}

const topicOptions = [
  { key: 'addition', label: 'Addition' },
  { key: 'subtraction', label: 'Subtraction' },
  { key: 'multiplication', label: 'Multiplication' },
  { key: 'division', label: 'Division' },
  { key: 'simple-fraction', label: 'Simple Fractions' },
  { key: 'complex-fraction', label: 'Complex Fractions' },
  { key: 'combination', label: 'Combinations (nCr)' },
  { key: 'decimals', label: 'Decimals' },
  { key: 'probability-division', label: 'Probability Ratios' },
]

const profileDefaults = {
  minInt: 100,
  maxInt: 9999,
  minMult: 8,
  maxMult: 55,
  maxDivisor: 40,
  minDivQuotient: 5,
  maxDivQuotient: 120,
  divisionExactRate: 0.75,
}

const initialCustomSettings = {
  timeLimit: 60,
  questionCount: 10,
  sessionType: 'timed',
  topics: ['simple-fraction', 'complex-fraction', 'combination'],
}

const resolveCustomTopics = (customSettings) =>
  (customSettings.topics.length > 0 ? customSettings.topics : ['addition', 'multiplication'])

const buildChallengeSettings = (mode, preset, customSettings) => {
  if (mode === 'preset') {
    return {
      ...levelConfigs[preset],
      sessionType: 'timed',
      questionCount: 0,
    }
  }

  const topicPool = resolveCustomTopics(customSettings)

  return {
    label: 'Custom Mode',
    ...profileDefaults,
    timeLimit: Math.max(30, Number(customSettings.timeLimit)),
    questionCount: Math.max(1, Number(customSettings.questionCount || 10)),
    sessionType: customSettings.sessionType,
    topics: topicPool,
  }
}

const getFormatMeta = (question) => {
  if (question.answerKind === 'integer') {
    return { text: 'Integer', className: 'format-integer' }
  }
  if (question.answerKind === 'fraction') {
    return { text: 'Fraction', className: 'format-fraction' }
  }
  if (question.answerKind === 'decimal' && question.decimalPlaces === 1) {
    return { text: 'Decimal (1dp)', className: 'format-decimal-1' }
  }
  return { text: `Decimal (${question.decimalPlaces}dp)`, className: 'format-decimal-2' }
}

const shuffle = (items) => {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

const buildFractionDistractors = (value) => {
  const [numText, denText] = value.split('/')
  const n = Number(numText)
  const d = Number(denText)
  return [
    `${n + 1}/${d}`,
    `${n - 1 === 0 ? n + 2 : n - 1}/${d}`,
    `${n}/${d + 1}`,
    `${n}/${Math.max(2, d - 1)}`,
    `${n + 2}/${d + 1}`,
  ].filter((item) => item !== value && !item.includes('/0'))
}

const buildChoices = (question) => {
  const correct = question.answerDisplay
  const distractors = new Set()

  if (question.answerKind === 'integer') {
    const base = Number(question.expectedValue)
    ;[1, -1, 2, -2, 5, -5, 10, -10].forEach((offset) => {
      distractors.add(String(base + offset))
    })
  }

  if (question.answerKind === 'decimal') {
    const places = question.decimalPlaces
    const base = Number(question.expectedValue)
    const step = 10 ** -places
    ;[1, -1, 2, -2, 3, -3, 4, -4].forEach((offset) => {
      distractors.add((base + (offset * step)).toFixed(places))
    })
  }

  if (question.answerKind === 'fraction') {
    buildFractionDistractors(correct).forEach((item) => distractors.add(item))
  }

  const wrong = [...distractors].filter((item) => item !== correct)
  while (wrong.length < 3) {
    if (question.answerKind === 'fraction') {
      const [n, d] = correct.split('/').map(Number)
      wrong.push(`${n + wrong.length + 1}/${d + (wrong.length % 2) + 1}`)
    } else if (question.answerKind === 'decimal') {
      const places = question.decimalPlaces
      const bump = (wrong.length + 5) * (10 ** -places)
      wrong.push((Number(question.expectedValue) + bump).toFixed(places))
    } else {
      wrong.push(String(Number(question.expectedValue) + (wrong.length + 6)))
    }
  }

  return shuffle([correct, ...wrong.slice(0, 3)])
}

function MentalMathChallenge() {
  const [setupMode, setSetupMode] = useState('preset')
  const [selectedPreset, setSelectedPreset] = useState('easy')
  const [customSettings, setCustomSettings] = useState(initialCustomSettings)
  const [answerMode, setAnswerMode] = useState('free')

  const [status, setStatus] = useState('setup')
  const [activeSettings, setActiveSettings] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [questionElapsedSec, setQuestionElapsedSec] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [userInput, setUserInput] = useState('')
  const [choiceOptions, setChoiceOptions] = useState([])
  const [attempted, setAttempted] = useState([])

  const totalCorrect = useMemo(
    () => attempted.filter((item) => item.isCorrect).length,
    [attempted],
  )

  const averageTime = useMemo(() => {
    if (attempted.length === 0) {
      return 0
    }
    const total = attempted.reduce((sum, item) => sum + (item.timeTakenSec || 0), 0)
    return total / attempted.length
  }, [attempted])

  const accuracy = useMemo(() => {
    if (attempted.length === 0) {
      return 0
    }
    return Math.round((totalCorrect / attempted.length) * 100)
  }, [attempted.length, totalCorrect])

  useEffect(() => {
    if (status !== 'running' || activeSettings?.sessionType !== 'timed') {
      return undefined
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setStatus('finished')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [activeSettings?.sessionType, status])

  useEffect(() => {
    if (status !== 'running' || !currentQuestion) {
      return undefined
    }

    const ticker = setInterval(() => {
      setQuestionElapsedSec((prev) => Number((prev + 0.1).toFixed(2)))
    }, 100)

    return () => clearInterval(ticker)
  }, [currentQuestion, status])

  const startChallenge = () => {
    const settings = {
      ...buildChallengeSettings(setupMode, selectedPreset, customSettings),
      answerMode,
    }
    const firstQuestion = generateQuestion(settings)
    setActiveSettings(settings)
    setAttempted([])
    setUserInput('')
    setCurrentQuestion(firstQuestion)
    setQuestionElapsedSec(0)
    setChoiceOptions(answerMode === 'multiple-choice' ? buildChoices(firstQuestion) : [])
    setTimeLeft(settings.sessionType === 'timed' ? settings.timeLimit : 0)
    setStatus('running')
  }

  const recordAttempt = (answerText, wasSkipped = false) => {
    if (!currentQuestion || !activeSettings) {
      return
    }

    const isCorrect = !wasSkipped && checkAnswer(currentQuestion, answerText)
    const elapsed = questionElapsedSec
    const nextAttempt = {
      prompt: currentQuestion.prompt,
      userAnswer: wasSkipped ? 'Skipped' : answerText.trim() || 'Blank',
      correctAnswer: currentQuestion.answerDisplay,
      isCorrect,
      timeTakenSec: elapsed,
    }
    const nextAttempted = [...attempted, nextAttempt]
    setAttempted(nextAttempted)

    if (
      activeSettings.sessionType === 'count'
      && nextAttempted.length >= activeSettings.questionCount
    ) {
      setStatus('finished')
      setCurrentQuestion(null)
      setChoiceOptions([])
      return
    }

    const nextQuestion = generateQuestion(activeSettings)
    setCurrentQuestion(nextQuestion)
    setQuestionElapsedSec(0)
    setChoiceOptions(
      activeSettings.answerMode === 'multiple-choice' ? buildChoices(nextQuestion) : [],
    )
    setUserInput('')
  }


  const toggleTopic = (topic) => {
    setCustomSettings((prev) => {
      const exists = prev.topics.includes(topic)
      if (exists) {
        return { ...prev, topics: prev.topics.filter((item) => item !== topic) }
      }
      return { ...prev, topics: [...prev.topics, topic] }
    })
  }

  if (status === 'running' && currentQuestion && activeSettings) {
    const formatMeta = getFormatMeta(currentQuestion)
    const topicLabel = currentQuestion.topic.replaceAll('-', ' ').toUpperCase()

    return (
      <section className="page mental-page">
        <div className="challenge-header">
          <h2>{activeSettings.label} Mental Math</h2>
          <p>
            Follow the answer format exactly for each prompt. Only one format is
            accepted: integer, decimal, or simplified fraction.
          </p>
          <p>
            Mode:{' '}
            {activeSettings.answerMode === 'multiple-choice'
              ? 'Multiple Choice'
              : 'Free Answer'}
          </p>
        </div>

        <div className="metric-row">
          <article className="metric-card">
            <span>
              {activeSettings.sessionType === 'timed'
                ? 'Time Left'
                : 'Questions Left'}
            </span>
            <strong>
              {activeSettings.sessionType === 'timed'
                ? `${timeLeft}s`
                : Math.max(activeSettings.questionCount - attempted.length, 0)}
            </strong>
          </article>
          <article className="metric-card">
            <span>Attempted</span>
            <strong>{attempted.length}</strong>
          </article>
          <article className="metric-card">
            <span>Correct</span>
            <strong>{totalCorrect}</strong>
          </article>
        </div>

        <article className="question-card">
          <p className="question-title">
            {topicLabel}{' '}
            <span className={`format-badge ${formatMeta.className}`}>
              Format: {formatMeta.text}
            </span>
          </p>
          <h3>{currentQuestion.prompt}</h3>
          {activeSettings.answerMode === 'multiple-choice' ? (
            <div className="choice-grid" role="group" aria-label="Multiple choice options">
              {choiceOptions.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  className="choice-button"
                  onClick={() => recordAttempt(choice)}
                >
                  {choice}
                </button>
              ))}
            </div>
          ) : (
            <form
              className="question-form"
              onSubmit={(event) => {
                event.preventDefault()
                recordAttempt(userInput)
              }}
            >
              <input
                value={userInput}
                onChange={(event) => setUserInput(event.target.value)}
                placeholder="Type your answer"
                className="answer-input"
                autoFocus
              />
              <button type="submit" className="button-link">
                Submit
              </button>
            </form>
          )}

          <div
            className={
              activeSettings.answerMode === 'multiple-choice'
                ? 'question-form question-actions question-actions-after-choices'
                : 'question-form question-actions'
            }
          >
            <button
              type="button"
              className="ghost-button"
              onClick={() => recordAttempt('', true)}
            >
              Skip
            </button>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setStatus('finished')}
            >
              End Test
            </button>
          </div>
        </article>
      </section>
    )
  }

  if (status === 'finished') {
    return (
      <section className="page mental-page">
        <div className="page-title-wrap">
          <h2>Challenge Results</h2>
          <p>
            Score: {totalCorrect}/{attempted.length} ({accuracy}% accuracy)
          </p>
          <p>Average response time: {averageTime.toFixed(2)}s per question</p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
                <th>Time</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {attempted.map((entry, index) => (
                <tr key={`${entry.prompt}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{entry.prompt}</td>
                  <td>{entry.userAnswer}</td>
                  <td>{entry.correctAnswer}</td>
                  <td>{entry.timeTakenSec.toFixed(2)}s</td>
                  <td>
                    <span
                      className={entry.isCorrect ? 'status-ok' : 'status-miss'}
                    >
                      {entry.isCorrect ? 'Correct' : 'Wrong'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="result-actions">
          <button type="button" className="button-link" onClick={startChallenge}>
            Retry Same Setup
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => setStatus('setup')}
          >
            Back to Setup
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="page mental-page">
      <div className="page-title-wrap">
        <h2>Quick Mental Math Challenge</h2>
        <p>
          Timed practice for arithmetic speed, probability-style number fluency,
          fractions, and division reflexes.
        </p>
      </div>

      <div className="setup-stack">
        <div className="mode-toggle">
          <button
            type="button"
            className={setupMode === 'preset' ? 'chip chip-active' : 'chip'}
            onClick={() => setSetupMode('preset')}
          >
            Preset Levels
          </button>
          <button
            type="button"
            className={setupMode === 'custom' ? 'chip chip-active' : 'chip'}
            onClick={() => setSetupMode('custom')}
          >
            Custom Mode
          </button>
        </div>

        <div className="mode-toggle">
          <button
            type="button"
            className={answerMode === 'free' ? 'chip chip-active' : 'chip'}
            onClick={() => setAnswerMode('free')}
          >
            Free Mode
          </button>
          <button
            type="button"
            className={answerMode === 'multiple-choice' ? 'chip chip-active' : 'chip'}
            onClick={() => setAnswerMode('multiple-choice')}
          >
            Multiple Choice
          </button>
        </div>

        {setupMode === 'preset' ? (
          <div className="preset-grid">
            {Object.entries(levelConfigs).map(([key, config]) => (
              <button
                key={key}
                type="button"
                className={
                  selectedPreset === key ? 'preset-card preset-active' : 'preset-card'
                }
                onClick={() => setSelectedPreset(key)}
              >
                <h3>{config.label}</h3>
                <p>{config.timeLimit}s timer</p>
                <p>{config.topics.map((topic) => topicLabelMap[topic] || topic).join(', ')}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="custom-wrap">
            <label className="field-label">Challenge structure</label>
            <div className="mode-toggle">
              <button
                type="button"
                className={
                  customSettings.sessionType === 'timed' ? 'chip chip-active' : 'chip'
                }
                onClick={() =>
                  setCustomSettings((prev) => ({
                    ...prev,
                    sessionType: 'timed',
                  }))
                }
              >
                Timed Session
              </button>
              <button
                type="button"
                className={
                  customSettings.sessionType === 'count' ? 'chip chip-active' : 'chip'
                }
                onClick={() =>
                  setCustomSettings((prev) => ({
                    ...prev,
                    sessionType: 'count',
                  }))
                }
              >
                Fixed Question Count
              </button>
            </div>

            {customSettings.sessionType === 'timed' ? (
              <>
                <label className="field-label" htmlFor="time-limit">
                  Time Limit (seconds)
                </label>
                <input
                  id="time-limit"
                  className="answer-input"
                  type="number"
                  min="30"
                  value={customSettings.timeLimit}
                  onChange={(event) =>
                    setCustomSettings((prev) => ({
                      ...prev,
                      timeLimit: Number(event.target.value),
                    }))
                  }
                />
              </>
            ) : (
              <>
                <label className="field-label" htmlFor="question-count">
                  Number of Questions
                </label>
                <input
                  id="question-count"
                  className="answer-input"
                  type="number"
                  min="1"
                  value={customSettings.questionCount}
                  onChange={(event) =>
                    setCustomSettings((prev) => ({
                      ...prev,
                      questionCount: Number(event.target.value),
                    }))
                  }
                />
              </>
            )}

            <div className="topic-grid">
              {topicOptions.map((topic) => (
                <label key={topic.key} className="topic-option">
                  <input
                    type="checkbox"
                    checked={customSettings.topics.includes(topic.key)}
                    onChange={() => toggleTopic(topic.key)}
                  />
                  <span>{topic.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <button type="button" className="button-link setup-start-button" onClick={startChallenge}>
        Start Challenge
      </button>
    </section>
  )
}

export default MentalMathChallenge
