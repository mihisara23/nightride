import { Link, useLocation } from 'react-router-dom'
import { Home, Receipt, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import LogoutModal from './LogoutModal'
import { useAuth } from '../context/AuthContext'

const s = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '430px',
    height: '72px',
    background: '#161b22',
    borderTop: '1px solid #21262d',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 100,
    paddingBottom: '4px',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    padding: '8px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.3px',
  },
}

export default function BottomNav() {
  const location = useLocation()
  const { signOut } = useAuth()
  const [showLogout, setShowLogout] = useState(false)

  const isActive = (path) => location.pathname === path

  const activeColor = '#00C9A7'
  const inactiveColor = '#6b7280'

  const items = [
    { path: '/book', icon: Home, label: 'Home' },
    { path: '/my-bookings', icon: Receipt, label: 'My Trips' },
    { action: 'profile', icon: User, label: 'Profile' },
  ]

  const handleLogout = async () => {
    try { await signOut() } catch (e) { console.error(e) }
    setShowLogout(false)
  }

  return (
    <>
      <nav style={s.nav}>
        {items.map((item) => {
          const active = item.path ? isActive(item.path) : false
          const color = active ? activeColor : inactiveColor
          const Icon = item.icon

          if (item.action === 'profile') {
            return (
              <button
                key="profile"
                style={s.item}
                onClick={() => setShowLogout(true)}
              >
                <Icon size={22} color={inactiveColor} />
                <span style={{ ...s.label, color: inactiveColor }}>{item.label}</span>
              </button>
            )
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              style={s.item}
            >
              <Icon size={22} color={color} strokeWidth={active ? 2.5 : 2} />
              <span style={{ ...s.label, color }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <LogoutModal
        isOpen={showLogout}
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
      />
    </>
  )
}