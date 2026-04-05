import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/mental-math', label: 'Mental Math' },
  { to: '/probability', label: 'Probability' },
  { to: '/coding', label: 'Coding Practice' },
]

function Navbar() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('bulletmath-theme')
    return saved === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('bulletmath-theme', next)
  }

  const switchTarget = theme === 'light' ? 'dark' : 'light'

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-wrap">
          <p className="brand-kicker">Quant Prep Lab</p>
          <h1 className="brand-title">BulletMath</h1>
        </div>
        <div className="header-controls">
          <nav className="site-nav" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'nav-link nav-link-active' : 'nav-link'
                }
                end={item.to === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            className={theme === 'light' ? 'theme-toggle theme-toggle-light' : 'theme-toggle theme-toggle-dark'}
            onClick={toggleTheme}
            title={`Switch to ${switchTarget} mode`}
            aria-label={`Switch to ${switchTarget} mode`}
          >
            💡
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
