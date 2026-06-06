import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const styles = {
  page: {
    flex: 1,
    padding: '24px 20px 40px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  headerLeft: {},
  title: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em',
    marginBottom: '2px',
  },
  count: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: 400,
  },
  bookingCard: {
    background: 'var(--glass-bg)',
    backdropFilter: 'var(--glass-blur)',
    WebkitBackdropFilter: 'var(--glass-blur)',
    border: '1px solid var(--glass-border)',
    borderRadius: '16px',
    padding: '18px 20px',
    marginBottom: '12px',
    transition: 'all 0.25s ease',
  },
  bookingTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },
  route: {
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    fontWeight: 700,
  },
  priceBadge: {
    background: 'var(--brand-dim)',
    color: 'var(--brand)',
    padding: '4px 12px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  bookingGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  detailLabel: {
    color: 'var(--text-muted)',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 600,
  },
  detailValue: {
    color: 'var(--text-secondary)',
    fontSize: '0.88rem',
    fontWeight: 500,
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '20px',
    display: 'block',
    opacity: 0.7,
  },
  emptyTitle: {
    color: 'var(--text-primary)',
    fontSize: '1.2rem',
    fontWeight: 700,
    marginBottom: '8px',
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    marginBottom: '28px',
    lineHeight: 1.5,
  },
  loadingWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
}

export default function MyBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [user])

  const fetchBookings = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error: dbError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false })

      if (dbError) {
        setError(dbError.message)
        return
      }

      setBookings(data || [])
    } catch (err) {
      setError('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-AU', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div className="spinner" style={{ width: '28px', height: '28px' }} />
      </div>
    )
  }

  return (
    <div style={styles.page} className="fade-in">
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>My Bookings</h1>
          <p style={styles.count}>
            {bookings.length} ride{bookings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/book" className="btn btn-teal" style={{ textDecoration: 'none', padding: '10px 18px', fontSize: '0.85rem' }}>
          + New Ride
        </Link>
      </div>

      {error && <div className="error-box">{error}</div>}

      {bookings.length === 0 ? (
        <div className="card" style={styles.emptyState}>
          <span style={styles.emptyIcon}>🌙</span>
          <h3 style={styles.emptyTitle}>No bookings yet</h3>
          <p style={styles.emptyText}>
            You haven't booked any rides yet. Book your first shuttle ride!
          </p>
          <Link to="/book" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Book a Ride
          </Link>
        </div>
      ) : (
        bookings.map((booking, index) => (
          <div
            key={booking.id}
            className="fade-in"
            style={{
              ...styles.bookingCard,
              animationDelay: `${index * 0.06}s`,
            }}
          >
            <div style={styles.bookingTop}>
              <span style={styles.route}>{booking.pickup_stop}</span>
              <span style={styles.priceBadge}>${booking.price}</span>
            </div>

            <div style={styles.bookingGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Departure</span>
                <span style={styles.detailValue}>{booking.departure_time}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Contact</span>
                <span style={styles.detailValue}>{booking.contact_number}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Booked</span>
                <span style={styles.detailValue}>{formatDate(booking.created_at)}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Payment</span>
                <span style={{ ...styles.detailValue, color: 'var(--action)' }}>Cash</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}