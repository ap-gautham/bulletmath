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

const readGlobal = (pyodide, name) => {
  if (!pyodide.globals.has(name)) {
    return null
  }
  const proxy = pyodide.globals.get(name)
  return tryConvertPyProxy(proxy)
}

export const runPythonSnippet = async (code, validatorCode = '') => {
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
    await pyodide.runPythonAsync('globals().pop("__passed", None)')
    await pyodide.runPythonAsync('globals().pop("__details", None)')
    await pyodide.runPythonAsync(code)

    if (validatorCode.trim()) {
      await pyodide.runPythonAsync(validatorCode)
    }

    const result = readGlobal(pyodide, 'result')
    const validatorPassed = readGlobal(pyodide, '__passed')
    const validatorDetails = readGlobal(pyodide, '__details')

    return {
      ok: true,
      stdout: stdout.join('\n').trim(),
      stderr: stderr.join('\n').trim(),
      result,
      validatorPassed,
      validatorDetails: validatorDetails ?? '',
      error: '',
    }
  } catch (error) {
    return {
      ok: false,
      stdout: stdout.join('\n').trim(),
      stderr: stderr.join('\n').trim(),
      result: null,
      validatorPassed: false,
      validatorDetails: '',
      error: String(error),
    }
  }
}
