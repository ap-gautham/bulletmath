import { Link } from 'react-router-dom'

const tracks = [
  {
    title: 'Quick Mental Math Challenge',
    body: 'Timed drills for arithmetic speed: fractions, decimals, probability-style numbers, and fast multiplication.',
    cta: 'Start Math Challenge',
    href: '/mental-math',
  },
  {
    title: 'Probability Practice',
    body: 'Work through interview-style probability prompts with hints and clean, concise solutions.',
    cta: 'Practice Probability',
    href: '/probability',
  },
  {
    title: 'Coding Practice (Python)',
    body: 'Solve focused coding tasks on sorting, regex, and pandas with in-browser execution.',
    cta: 'Open Coding Lab',
    href: '/coding',
  },
]

function Landing() {
  return (
    <section className="page landing-page">
      <div className="hero-card">
        <p className="eyebrow">Quant Interview Sprint</p>
        <h2>Train the exact skills used in quant trading and research screens.</h2>
        <p>
          BulletMath is built for high-frequency practice: short sessions, tight
          feedback loops, and practical difficulty levels.
        </p>
      </div>

      <div className="track-grid">
        {tracks.map((track) => (
          <article className="track-card" key={track.title}>
            <h3>{track.title}</h3>
            <p>{track.body}</p>
            <Link className="button-link" to={track.href}>
              {track.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Landing
