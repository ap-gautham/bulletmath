import { useEffect, useMemo, useState } from 'react'
import {
  checkAnswer,
  customTemplates,
  generateQuestion,
  levelConfigs,
} from '../utils/mathGenerators'

const topicOptions = [
  { key: 'addition', label: 'Addition' },
  { key: 'subtraction', label: 'Subtraction' },
  { key: 'multiplication', label: 'Multiplication' },
  { key: 'division', label: 'Division' },
  { key: 'fractions', label: 'Fractions' },
  { key: 'fraction-division', label: 'Divide by Fractions' },
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
  topics: ['addition', 'division', 'fractions', 'probability-division'],
}

const buildChallengeSettings = (mode, preset, customSettings) => {
  if (mode === 'preset') {
    return levelConfigs[preset]
  }

  const topicPool =
    customSettings.topics.length > 0
      ? customSettings.topics
      : ['addition', 'multiplication']

  return {
    label: 'Custom Mode',
    ...profileDefaults,
    timeLimit: Math.max(30, Number(customSettings.timeLimit)),
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

function MentalMathChallenge() {
  const [setupMode, setSetupMode] = useState('preset')
  const [selectedPreset, setSelectedPreset] = useState('easy')
  const [customSettings, setCustomSettings] = useState(initialCustomSettings)

  const [status, setStatus] = useState('setup')
  const [activeSettings, setActiveSettings] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [userInput, setUserInput] = useState('')
  const [attempted, setAttempted] = useState([])

  const totalCorrect = useMemo(
    () => attempted.filter((item) => item.isCorrect).length,
    [attempted],
  )

  const accuracy = useMemo(() => {
    if (attempted.length === 0) {
      return 0
    }
    return Math.round((totalCorrect / attempted.length) * 100)
  }, [attempted.length, totalCorrect])

  useEffect(() => {
    if (status !== 'running') {
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
  }, [status])

  const startChallenge = () => {
    const settings = buildChallengeSettings(
      setupMode,
      selectedPreset,
      customSettings,
    )
    setActiveSettings(settings)
    setAttempted([])
    setUserInput('')
    setCurrentQuestion(generateQuestion(settings))
    setTimeLeft(settings.timeLimit)
    setStatus('running')
  }

  const recordAttempt = (answerText, wasSkipped = false) => {
    if (!currentQuestion || !activeSettings) {
      return
    }

    const isCorrect = !wasSkipped && checkAnswer(currentQuestion, answerText)
    setAttempted((prev) => [
      ...prev,
      {
        prompt: currentQuestion.prompt,
        userAnswer: wasSkipped ? 'Skipped' : answerText.trim() || 'Blank',
        correctAnswer: currentQuestion.answerDisplay,
        isCorrect,
      },
    ])

    setCurrentQuestion(generateQuestion(activeSettings))
    setUserInput('')
  }

  const applyTemplate = (templateId) => {
    const template = customTemplates.find((item) => item.id === templateId)
    if (!template) {
      return
    }

    setCustomSettings({
      timeLimit: template.timeLimit,
      topics: template.topics,
    })
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
        </div>

        <div className="metric-row">
          <article className="metric-card">
            <span>Time Left</span>
            <strong>{timeLeft}s</strong>
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
              (Format: {formatMeta.text})
            </span>
          </p>
          <h3>{currentQuestion.prompt}</h3>
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
          </form>
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
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
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
              <p>{config.topics.join(', ')}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="custom-wrap">
          <div className="custom-templates">
            {customTemplates.map((template) => (
              <button
                type="button"
                className="chip"
                key={template.id}
                onClick={() => applyTemplate(template.id)}
              >
                {template.label}
              </button>
            ))}
          </div>

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

      <button type="button" className="button-link" onClick={startChallenge}>
        Start Challenge
      </button>
    </section>
  )
}

export default MentalMathChallenge
