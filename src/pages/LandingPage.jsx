import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.svg'

const styles = {
  /* ===== Hero ===== */
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    inset: 0,
    background:
      'radial-gradient(ellipse at 50% 20%, rgba(0, 201, 167, 0.08) 0%, transparent 55%), ' +
      'radial-gradient(ellipse at 80% 60%, rgba(255, 107, 53, 0.04) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
  heroContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '80px 24px 60px',
    position: 'relative',
    zIndex: 1,
  },
  heroLogo: {
    width: '56px',
    height: '56px',
    marginBottom: '24px',
    filter: 'drop-shadow(0 0 24px rgba(0, 201, 167, 0.3))',
    animation: 'fadeIn 0.6s ease forwards',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 7vw, 3.2rem)',
    fontWeight: 900,
    color: 'var(--text-primary)',
    letterSpacing: '-0.04em',
    lineHeight: 1.12,
    maxWidth: '520px',
    marginBottom: '16px',
    animation: 'fadeIn 0.6s ease 0.1s both',
  },
  heroTitleAccent: {
    color: 'var(--brand)',
    display: 'block',
  },
  heroSubtitle: {
    color: 'var(--text-muted)',
    fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
    fontWeight: 400,
    maxWidth: '400px',
    lineHeight: 1.6,
    marginBottom: '36px',
    animation: 'fadeIn 0.6s ease 0.2s both',
  },
  heroButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '56px',
    animation: 'fadeIn 0.6s ease 0.3s both',
  },

  /* ===== Stats ===== */
  statsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    animation: 'fadeIn 0.6s ease 0.4s both',
  },
  stat: {
    flex: 1,
    textAlign: 'center',
    padding: '20px 16px',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  },
  statLast: {
    borderRight: 'none',
  },
  statValue: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--brand)',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
    marginTop: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },

  /* ===== Features ===== */
  featuresSection: {
    padding: '60px 24px 80px',
  },
  featuresLabel: {
    textAlign: 'center',
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--brand)',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: '10px',
  },
  featuresTitle: {
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em',
    marginBottom: '40px',
  },
  featuresGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    maxWidth: '430px',
    margin: '0 auto',
  },
  featureCard: {
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    gap: '18px',
    alignItems: 'flex-start',
    transition: 'all 0.25s ease',
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.4rem',
    flexShrink: 0,
  },
  featureText: {},
  featureTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: '4px',
  },
  featureDesc: {
    fontSize: '0.88rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    margin: 0,
  },

  /* ===== Footer ===== */
  footer: {
    textAlign: 'center',
    padding: '24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
  },
}

const features = [
  {
    icon: '🛡️',
    iconBg: 'rgba(0, 201, 167, 0.1)',
    title: 'Safe & Verified',
    desc: 'All rides are for verified La Trobe students. Travel with peace of mind late at night.',
  },
  {
    icon: '💰',
    iconBg: 'rgba(255, 107, 53, 0.1)',
    title: 'Affordable Fares',
    desc: 'Shared rides starting from just $4. Much cheaper than ride-share apps.',
  },
  {
    icon: '⚡',
    iconBg: 'rgba(0, 201, 167, 0.1)',
    title: 'Quick & Reliable',
    desc: 'Book in 30 seconds. Consistent departure times every night from campus.',
  },
]

export default function LandingPage() {
  const { user } = useAuth()

  // Redirect logged-in users to book page
  if (user) {
    return <Navigate to="/book" replace />
  }

  return (
    <div style={styles.hero}>
      <div style={styles.heroBg} />

      {/* ===== Hero Content ===== */}
      <div style={styles.heroContent}>
        <img src={logo} alt="NightRide" style={styles.heroLogo} />

        <h1 style={styles.heroTitle}>
          Safe Late-Night Rides
          <span style={styles.heroTitleAccent}>for La Trobe Students</span>
        </h1>

        <p style={styles.heroSubtitle}>
          Book your shared shuttle from Bundoora Campus in 30 seconds
        </p>

        <div style={styles.heroButtons}>
          <Link to="/register" className="btn btn-teal" style={{ textDecoration: 'none', padding: '15px 32px', fontSize: '1rem' }}>
            Book a Ride
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ textDecoration: 'none', padding: '15px 32px', fontSize: '1rem' }}>
            Sign In
          </Link>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <div style={styles.statValue}>5 Routes</div>
            <div style={styles.statLabel}>Destinations</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statValue}>From $4</div>
            <div style={styles.statLabel}>Per ride</div>
          </div>
          <div style={{ ...styles.stat, ...styles.statLast }}>
            <div style={styles.statValue}>9PM – 12AM</div>
            <div style={styles.statLabel}>Nightly</div>
          </div>
        </div>
      </div>

      {/* ===== Features ===== */}
      <div style={styles.featuresSection}>
        <div style={styles.featuresLabel}>Why NightRide</div>
        <h2 style={styles.featuresTitle}>Built for Students</h2>

        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                ...styles.featureCard,
                animation: `fadeIn 0.5s ease ${0.5 + i * 0.1}s both`,
              }}
            >
              <div style={{ ...styles.featureIcon, background: f.iconBg }}>
                {f.icon}
              </div>
              <div style={styles.featureText}>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Footer ===== */}
      <div style={styles.footer}>
        © 2026 NightRide · La Trobe University Bundoora
      </div>
    </div>
  )
}