let pyodideInstance = null
let runtimeState = 'idle'

const CDN_INDEX = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/'

const toSerializable = (value) => {
  if (value === null || value === undefined) {
    return value
  }
  if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
    return value
  }
  if (Array.isArray(value)) {
    return value.map(toSerializable)
  }
  if (typeof value === 'object') {
    const out = {}
    Object.entries(value).forEach(([key, nested]) => {
      out[key] = toSerializable(nested)
    })
    return out
  }
  return String(value)
}

const tryConvertPyProxy = (pyProxy) => {
  if (!pyProxy) {
    return null
  }

  if (typeof pyProxy.toJs === 'function') {
    try {
      const converted = pyProxy.toJs({ dict_converter: Object.fromEntries })
      return toSerializable(converted)
    } catch {
      return toSerializable(pyProxy.toString())
    } finally {
      if (typeof pyProxy.destroy === 'function') {
        pyProxy.destroy()
      }
    }
  }

  return toSerializable(pyProxy)
}

export const getRuntimeState = () => runtimeState

export const initPyodide = async () => {
  if (pyodideInstance) {
    return pyodideInstance
  }

  runtimeState = 'loading'
  const { loadPyodide } = await import(
    'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs'
  )

  pyodideInstance = await loadPyodide({
    indexURL: CDN_INDEX,
  })

  await pyodideInstance.loadPackage(['micropip', 'numpy', 'pandas'])
  runtimeState = 'ready'
  return pyodideInstance
}

export const runPythonSnippet = async (code) => {
  const pyodide = await initPyodide()
  const stdout = []
  const stderr = []

  pyodide.setStdout({
    batched: (text) => {
      stdout.push(text)
    },
  })

  pyodide.setStderr({
    batched: (text) => {
      stderr.push(text)
    },
  })

  try {
    await pyodide.runPythonAsync('globals().pop("result", None)')
    await pyodide.runPythonAsync(code)

    let result = null
    if (pyodide.globals.has('result')) {
      const pyResult = pyodide.globals.get('result')
      result = tryConvertPyProxy(pyResult)
    }

    return {
      ok: true,
      stdout: stdout.join('\n').trim(),
      stderr: stderr.join('\n').trim(),
      result,
      error: '',
    }
  } catch (error) {
    return {
      ok: false,
      stdout: stdout.join('\n').trim(),
      stderr: stderr.join('\n').trim(),
      result: null,
      error: String(error),
    }
  }
}
