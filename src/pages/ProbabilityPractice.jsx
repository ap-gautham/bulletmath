import { useEffect, useMemo, useState } from 'react'
import {
  buildRandomSession,
  buildStaticSession,
} from '../data/probabilityQuestions'

const formatStopwatch = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function ProbabilityPractice() {
  const [mode, setMode] = useState('static')
  const [sessionQuestions, setSessionQuestions] = useState(() => buildStaticSession(10))
  const [index, setIndex] = useState(0)
  const [revealedHints, setRevealedHints] = useState(() => new Set())
  const [revealedSolutions, setRevealedSolutions] = useState(() => new Set())
  const [stopwatchOn, setStopwatchOn] = useState(false)
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0)

  const activeQuestion = sessionQuestions[index]

  const progressText = useMemo(
    () => `${index + 1} / ${sessionQuestions.length}`,
    [index, sessionQuestions.length],
  )

  useEffect(() => {
    if (!stopwatchOn) {
      return undefined
    }

    const timer = setInterval(() => {
      setStopwatchSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [stopwatchOn])

  const startSession = (sessionMode) => {
    const nextQuestions =
      sessionMode === 'random' ? buildRandomSession(10) : buildStaticSession(10)
    setSessionQuestions(nextQuestions)
    setIndex(0)
    setRevealedHints(new Set())
    setRevealedSolutions(new Set())
  }

  const handleModeChange = (sessionMode) => {
    setMode(sessionMode)
    startSession(sessionMode)
  }

  const revealHint = () => {
    setRevealedHints((prev) => new Set(prev).add(activeQuestion.id))
  }

  const revealSolution = () => {
    setRevealedSolutions((prev) => new Set(prev).add(activeQuestion.id))
  }

  const stopwatchLabel = stopwatchOn
    ? `Time ${formatStopwatch(stopwatchSeconds)}`
    : 'Start'

  return (
    <section className="page probability-page">
      <div className="probability-header">
        <div className="page-title-wrap">
          <h2>Probability Practice</h2>
          <p>
            Choose static or random mode. Static uses a curated set in random order;
            random mode generates fresh variants each session.
          </p>
        </div>
        <button
          type="button"
          className={stopwatchOn ? 'chip chip-active' : 'chip'}
          onClick={() => {
            if (stopwatchOn) {
              setStopwatchOn(false)
              setStopwatchSeconds(0)
            } else {
              setStopwatchSeconds(0)
              setStopwatchOn(true)
            }
          }}
        >
          <span className="stopwatch-button-content">
            <span className="stopwatch-emoji">⏱</span>
            <span className="stopwatch-line">{stopwatchLabel}</span>
            <span className="stopwatch-subline">{stopwatchOn ? '(Stop)' : '(Start)'}</span>
          </span>
        </button>
      </div>

      <div className="mode-toggle">
        <button
          type="button"
          className={mode === 'static' ? 'chip chip-active' : 'chip'}
          onClick={() => handleModeChange('static')}
        >
          Static Practice
        </button>
        <button
          type="button"
          className={mode === 'random' ? 'chip chip-active' : 'chip'}
          onClick={() => handleModeChange('random')}
        >
          Random Practice
        </button>
        <button type="button" className="chip" onClick={() => startSession(mode)}>
          New Session
        </button>
      </div>

      <article className="practice-card">
        <div className="practice-meta">
          <span>Question {progressText}</span>
          <span className="mode-badge">{mode === 'random' ? 'Random' : 'Static'}</span>
        </div>
        <h3>{activeQuestion.question}</h3>

        <div className="practice-actions">
          <button type="button" className="button-link" onClick={revealHint}>
            Show Hint
          </button>
          <button type="button" className="button-link" onClick={revealSolution}>
            Show Solution
          </button>
        </div>

        {revealedHints.has(activeQuestion.id) && (
          <p className="hint-box">Hint: {activeQuestion.hint}</p>
        )}

        {revealedSolutions.has(activeQuestion.id) && (
          <p className="solution-box">Solution: {activeQuestion.solution}</p>
        )}

      </article>

      <div className="probability-pager-outside">
        <button
          type="button"
          className="ghost-button"
          onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
          disabled={index === 0}
          aria-label="Previous question"
        >
          ← Previous
        </button>
        <button
          type="button"
          className="ghost-button"
          onClick={() =>
            setIndex((prev) => Math.min(sessionQuestions.length - 1, prev + 1))
          }
          disabled={index === sessionQuestions.length - 1}
          aria-label="Next question"
        >
          Next →
        </button>
      </div>
    </section>
  )
}

export default ProbabilityPractice
