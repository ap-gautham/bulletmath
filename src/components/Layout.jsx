import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-shell">
        <Outlet />
      </main>
      <footer className="site-footer">
        <p>Built for fast arithmetic, probability reasoning, and coding fluency.</p>
      </footer>
    </div>
  )
}

export default Layout
