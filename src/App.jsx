import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CodingPractice from './pages/CodingPractice'
import Landing from './pages/Landing'
import MentalMathChallenge from './pages/MentalMathChallenge'
import ProbabilityPractice from './pages/ProbabilityPractice'
import './App.css'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="mental-math" element={<MentalMathChallenge />} />
          <Route path="probability" element={<ProbabilityPractice />} />
          <Route path="coding" element={<CodingPractice />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
