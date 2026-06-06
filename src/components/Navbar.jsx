import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LogoutModal from './LogoutModal'
import logo from '../assets/logo.svg'

const s = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    height: '60px',
    background: 'rgba(17, 24, 39, 0.7)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexShrink: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
  },
  logoImg: {
    width: '28px',
    height: '28px',
  },
  brandText: {
    fontSize: '1.1rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em',
  },
  brandAccent: {
    color: 'var(--brand)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  navLink: {
    padding: '8px 14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  navLinkActive: {
    color: 'var(--brand)',
  },
  activeDot: {
    position: 'absolute',
    bottom: '2px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: 'var(--brand)',
  },
  publicLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  signInBtn: {
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    backgroundColor: 'transparent',
    border: '1px solid rgba(255,255,255,0.15)',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
  },
  registerBtn: {
    padding: '7px 16px',
    borderRadius: '8px',
    fontSize: '0.82rem',
    fontWeight: 700,
    color: '#0a0e1a',
    background: 'var(--grad-teal)',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
  },
  logoutBtn: {
    padding: '6px 14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.78rem',
    fontWeight: 700,
    color: 'var(--danger)',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
}

export default function Navbar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await signOut()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      setLoggingOut(false)
      setShowLogoutModal(false)
    }
  }

  return (
    <>
      <nav style={s.nav}>
        <Link to={user ? '/book' : '/'} style={s.brand}>
          <img src={logo} alt="NightRide" style={s.logoImg} />
          <span style={s.brandText}>
            Night<span style={s.brandAccent}>Ride</span>
          </span>
        </Link>

        {user ? (
          /* ===== Logged-in Nav ===== */
          <>
            <div style={s.links}>
              <Link
                to="/book"
                style={{
                  ...s.navLink,
                  ...(isActive('/book') ? s.navLinkActive : {}),
                }}
              >
                Book
                {isActive('/book') && <span style={s.activeDot} />}
              </Link>
              <Link
                to="/my-bookings"
                style={{
                  ...s.navLink,
                  ...(isActive('/my-bookings') ? s.navLinkActive : {}),
                }}
              >
                Rides
                {isActive('/my-bookings') && <span style={s.activeDot} />}
              </Link>
            </div>
            <button
              style={s.logoutBtn}
              onClick={() => setShowLogoutModal(true)}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'var(--danger)'
                e.target.style.color = '#ffffff'
                e.target.style.borderColor = 'var(--danger)'
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
                e.target.style.color = 'var(--danger)'
                e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          /* ===== Public Nav ===== */
          <div style={s.publicLinks}>
            <Link to="/login" style={s.signInBtn}>
              Sign In
            </Link>
            <Link to="/register" style={s.registerBtn}>
              Register
            </Link>
          </div>
        )}
      </nav>

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  )
}