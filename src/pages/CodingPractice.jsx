import { useMemo, useState } from 'react'
import { codingProblems, codingProblemsByTopic } from '../data/codingProblems'
import { getRuntimeState, initPyodide, runPythonSnippet } from '../utils/pyodideRunner'

const topicOrder = ['sorting', 'regex', 'pandas']

function CodingPractice() {
  const [selectedTopic, setSelectedTopic] = useState(topicOrder[0])
  const [activeProblemId, setActiveProblemId] = useState(codingProblems[0].id)
  const [code, setCode] = useState(codingProblems[0].starterCode)
  const [runtimeStatus, setRuntimeStatus] = useState(getRuntimeState())
  const [execution, setExecution] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [showExpected, setShowExpected] = useState(false)
  const [showProblemList, setShowProblemList] = useState(true)

  const activeProblem = useMemo(
    () => codingProblems.find((item) => item.id === activeProblemId),
    [activeProblemId],
  )

  const switchProblem = (problemId) => {
    const next = codingProblems.find((item) => item.id === problemId)
    if (!next) {
      return
    }
    setActiveProblemId(problemId)
    setCode(next.starterCode)
    setExecution(null)
    setShowSolution(false)
    setShowExpected(false)

    if (next.topic !== selectedTopic) {
      setSelectedTopic(next.topic)
    }
  }

  const topicProblems = codingProblemsByTopic[selectedTopic]
  const activeIndexInTopic = Math.max(
    0,
    topicProblems.findIndex((item) => item.id === activeProblemId),
  )

  const switchTopic = (topic) => {
    setSelectedTopic(topic)
    const next = codingProblemsByTopic[topic][0]
    if (next) {
      switchProblem(next.id)
    }
  }

  const jumpToProblem = (rawIndex) => {
    const n = Number(rawIndex)
    if (!Number.isInteger(n)) {
      return
    }
    const clamped = Math.min(Math.max(1, n), topicProblems.length)
    switchProblem(topicProblems[clamped - 1].id)
  }

  const prepareRuntime = async () => {
    try {
      setRuntimeStatus('loading')
      await initPyodide()
      setRuntimeStatus('ready')
    } catch {
      setRuntimeStatus('error')
    }
  }

  const runCode = async () => {
    if (!activeProblem) {
      return
    }

    setIsRunning(true)
    setExecution(null)

    try {
      const output = await runPythonSnippet(code, activeProblem.validatorCode)
      const didPass = output.ok && output.validatorPassed === true

      setExecution({
        ...output,
        didPass,
      })
      setRuntimeStatus(getRuntimeState())
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <section className="page coding-page">
      <div className="page-title-wrap">
        <h2>Coding Practice Lab</h2>
        <p>
          Solve concept-first Python tasks on sorting, regex, and pandas. Run code
          directly in-browser with Pyodide.
        </p>
      </div>

      <div className="mode-toggle">
        {topicOrder.map((topic) => (
          <button
            key={topic}
            type="button"
            className={selectedTopic === topic ? 'chip chip-active' : 'chip'}
            onClick={() => switchTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="coding-toolbar">
        <button
          type="button"
          className="ghost-button"
          onClick={() => setShowProblemList((prev) => !prev)}
        >
          {showProblemList ? 'Hide Problem List' : 'Show Problem List'}
        </button>
      </div>

      <div className={`coding-grid ${showProblemList ? '' : 'coding-grid-list-hidden'}`}>
        {showProblemList && (
          <aside className="problem-list">
            <h3>{selectedTopic} problems</h3>
            <div className="problem-group">
              {topicProblems.map((problem, index) => (
                <button
                  type="button"
                  key={problem.id}
                  className={
                    activeProblemId === problem.id
                      ? 'problem-item problem-item-active'
                      : 'problem-item'
                  }
                  onClick={() => switchProblem(problem.id)}
                >
                  <span>
                    {index + 1}. {problem.title}
                  </span>
                  <small>{problem.difficulty}</small>
                </button>
              ))}
            </div>
          </aside>
        )}

        {activeProblem && (
          <article className="editor-wrap">
            <div className="problem-jump-row">
              <label htmlFor="problem-number" className="field-label">
                Problem #
              </label>
              <input
                id="problem-number"
                className="answer-input"
                type="number"
                min="1"
                max={topicProblems.length}
                value={activeIndexInTopic + 1}
                onChange={(event) => jumpToProblem(event.target.value)}
              />
            </div>
            <h3>{activeProblem.title}</h3>
            <p>{activeProblem.prompt}</p>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setShowExpected(true)}
              disabled={showExpected}
            >
              {showExpected ? 'Hint Shown' : 'Give me a hint'}
            </button>
            <p className={showExpected ? 'expected-output' : 'expected-output expected-hidden'}>
              Expected shape: {activeProblem.expectedLabel}
            </p>

            <textarea
              className="code-editor"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              spellCheck={false}
            />

            <div className="practice-actions">
              <button
                type="button"
                className="button-link"
                onClick={prepareRuntime}
                disabled={runtimeStatus === 'loading'}
              >
                {runtimeStatus === 'ready' ? 'Runtime Ready' : 'Prepare Runtime'}
              </button>
              <button
                type="button"
                className="button-link"
                onClick={runCode}
                disabled={isRunning || runtimeStatus === 'loading'}
              >
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setShowSolution((prev) => !prev)}
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button>
            </div>

            <p className="runtime-pill">Runtime status: {runtimeStatus}</p>

            {showSolution && (
              <pre className="output-box">
                <code>{activeProblem.solution}</code>
              </pre>
            )}

            {execution && (
              <div className="execution-panel">
                <p>
                  Result:{' '}
                  <span className={execution.didPass ? 'status-ok' : 'status-miss'}>
                    {execution.didPass ? 'Pass' : 'Not Yet'}
                  </span>
                </p>
                {execution.validatorDetails && !execution.didPass && (
                  <p className="hint-box">Validator: {execution.validatorDetails}</p>
                )}
                <pre className="output-box">
                  <code>
                    {'stdout:\n'}
                    {execution.stdout || '(empty)'}
                    {'\n\nstderr:\n'}
                    {execution.stderr || '(empty)'}
                    {'\n\nresult variable:\n'}
                    {JSON.stringify(execution.result, null, 2)}
                    {execution.error ? `\n\nerror:\n${execution.error}` : ''}
                  </code>
                </pre>
              </div>
            )}
          </article>
        )}
      </div>
    </section>
  )
}

export default CodingPractice
