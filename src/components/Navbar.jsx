import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/mental-math', label: 'Mental Math' },
  { to: '/probability', label: 'Probability' },
  { to: '/coding', label: 'Coding Practice' },
]

function Navbar() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-wrap">
          <p className="brand-kicker">Quant Prep Lab</p>
          <h1 className="brand-title">BulletMath</h1>
        </div>
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
      </div>
    </header>
  )
}

export default Navbar
