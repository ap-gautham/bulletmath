import { useMemo, useState } from 'react'
import { codingProblems, codingProblemsByTopic } from '../data/codingProblems'
import { getRuntimeState, initPyodide, runPythonSnippet } from '../utils/pyodideRunner'

const topicOrder = ['sorting', 'regex', 'pandas']

function CodingPractice() {
  const [activeProblemId, setActiveProblemId] = useState(codingProblems[0].id)
  const [code, setCode] = useState(codingProblems[0].starterCode)
  const [runtimeStatus, setRuntimeStatus] = useState(getRuntimeState())
  const [execution, setExecution] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

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

      <div className="coding-grid">
        <aside className="problem-list">
          <h3>Problems</h3>
          {topicOrder.map((topicKey) => (
            <div key={topicKey} className="problem-group">
              <h4 className="problem-group-title">{topicKey}</h4>
              {codingProblemsByTopic[topicKey].map((problem) => (
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
                  <span>{problem.title}</span>
                  <small>
                    {problem.topic} · {problem.difficulty}
                  </small>
                </button>
              ))}
            </div>
          ))}
        </aside>

        {activeProblem && (
          <article className="editor-wrap">
            <h3>{activeProblem.title}</h3>
            <p>{activeProblem.prompt}</p>
            <p className="expected-output">Expected shape: {activeProblem.expectedLabel}</p>

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
