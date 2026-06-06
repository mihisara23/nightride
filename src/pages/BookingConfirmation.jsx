import { useLocation, Link, Navigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { CheckCircle, MapPin, Clock, Phone, DollarSign, ArrowRight } from 'lucide-react'

const s = {
  page: { padding: '24px 20px 96px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'fadeIn 0.4s ease forwards' },

  checkCircle: {
    width: '96px', height: '96px', borderRadius: '50%',
    background: 'rgba(0,201,167,0.1)', border: '3px solid #00C9A7',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '24px', marginTop: '32px',
    animation: 'scaleIn 0.5s ease 0.1s both, pulseGlow 2.5s ease-in-out 0.6s infinite',
  },
  heading: { fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '4px', letterSpacing: '0.3px', textAlign: 'center' },
  subtitle: { fontSize: '15px', color: '#94a3b8', marginBottom: '32px', textAlign: 'center', fontWeight: 400 },

  card: {
    width: '100%', background: '#1a2035', border: '1px solid #2d3748',
    borderRadius: '18px', padding: '24px', marginBottom: '28px',
    animation: 'slideUp 0.5s ease 0.3s both',
  },
  detailRow: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  timeRow: { display: 'flex', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  timeCol: { flex: 1, display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,201,167,0.04)', borderRadius: '14px', padding: '14px' },
  detailRowLast: { borderBottom: 'none' },
  detailIcon: { width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  detailLabel: { fontSize: '12px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' },
  detailValue: { fontSize: '15px', color: '#ffffff', fontWeight: 700 },

  /* Progress bar */
  progressSection: { width: '100%', marginBottom: '32px', animation: 'slideUp 0.5s ease 0.4s both' },
  progressTitle: { fontSize: '13px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px', textAlign: 'center' },
  progressTrack: { position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '0' },
  progressLineContainer: { position: 'absolute', top: '18px', left: '18px', right: '18px', height: '3px', zIndex: 0 },
  progressBgLine: { width: '100%', height: '3px', background: '#2d3748', borderRadius: '2px' },
  progressFillLine: { position: 'absolute', top: 0, left: 0, height: '3px', background: '#00C9A7', borderRadius: '2px', animation: 'progressFill 1s ease 0.5s both' },
  stepCol: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '33.333%', position: 'relative', zIndex: 2 },
  stepDot: { width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepDone: { background: '#00C9A7', boxShadow: '0 0 12px rgba(0,201,167,0.3)' },
  stepPending: { background: '#2d3748' },
  stepLabel: { fontSize: '12px', fontWeight: 600, marginTop: '10px', textAlign: 'center', lineHeight: '1.3' },

  buttons: { width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'slideUp 0.5s ease 0.5s both' },
  pill: {
    width: '100%', padding: '16px', borderRadius: '50px', fontSize: '16px', fontWeight: 700,
    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', transition: 'all 0.25s ease', fontFamily: "'Inter',system-ui,sans-serif", letterSpacing: '0.3px', textDecoration: 'none',
  },
  tealPill: { background: 'linear-gradient(135deg,#00C9A7,#00E4C1)', color: '#0d1117', boxShadow: '0 4px 20px rgba(0,201,167,0.25)' },
  outlinePill: { background: 'transparent', color: '#ffffff', border: '1.5px solid #2d3748' },
}

export default function BookingConfirmation() {
  const { state } = useLocation()

  if (!state?.booking) return <Navigate to="/book" replace />

  const { booking } = state

  const steps = [
    { label: 'Booked', done: true },
    { label: 'Driver Assigned', done: false },
    { label: 'On the Way', done: false },
  ]

  return (
    <>
      <div style={s.page}>
        <div style={s.checkCircle}>
          <CheckCircle size={48} color="#00C9A7" strokeWidth={2.5} />
        </div>

        <h1 style={s.heading}>You're all set!</h1>
        <p style={s.subtitle}>Your ride is confirmed</p>

        <div style={s.card}>
          <div style={s.detailRow}>
            <div style={{ ...s.detailIcon, background: 'rgba(0,201,167,0.1)' }}>
              <MapPin size={20} color="#00C9A7" />
            </div>
            <div>
              <div style={s.detailLabel}>Route</div>
              <div style={s.detailValue}>{booking.pickup_stop}</div>
            </div>
          </div>
          <div style={s.timeRow}>
            <div style={s.timeCol}>
              <div style={{ ...s.detailIcon, background: 'rgba(0,201,167,0.1)' }}>
                <Clock size={20} color="#00C9A7" />
              </div>
              <div>
                <div style={s.detailLabel}>Departure</div>
                <div style={s.detailValue}>{booking.departure_time}</div>
              </div>
            </div>
            <div style={s.timeCol}>
              <div style={{ ...s.detailIcon, background: 'rgba(0,201,167,0.1)' }}>
                <ArrowRight size={20} color="#00C9A7" />
              </div>
              <div>
                <div style={s.detailLabel}>Arrival</div>
                <div style={s.detailValue}>{booking.arrival_time}</div>
              </div>
            </div>
          </div>
          <div style={s.detailRow}>
            <div style={{ ...s.detailIcon, background: 'rgba(0,201,167,0.1)' }}>
              <Phone size={20} color="#00C9A7" />
            </div>
            <div>
              <div style={s.detailLabel}>Contact</div>
              <div style={s.detailValue}>{booking.contact_number}</div>
            </div>
          </div>
          <div style={{ ...s.detailRow, ...s.detailRowLast }}>
            <div style={{ ...s.detailIcon, background: 'rgba(0,201,167,0.1)' }}>
              <DollarSign size={20} color="#00C9A7" />
            </div>
            <div>
              <div style={s.detailLabel}>Price</div>
              <div style={{ ...s.detailValue, color: '#00C9A7' }}>${booking.price}</div>
            </div>
          </div>
        </div>

        <div style={s.progressSection}>
          <div style={s.progressTitle}>Trip Status</div>
          <div style={s.progressTrack}>
            <div style={s.progressLine} />
            <div style={{ ...s.progressFill, width: '33%' }} />
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ ...s.stepDot, ...(step.done ? s.stepDone : s.stepPending) }}>
                  {step.done && <CheckCircle size={18} color="#0d1117" strokeWidth={3} />}
                </div>
                <span style={{ ...s.stepLabel, color: step.done ? '#00C9A7' : '#6b7280' }}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={s.buttons}>
          <Link to="/book" style={{ textDecoration: 'none' }}>
            <button
              type="button" style={{ ...s.pill, ...s.tealPill }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,201,167,0.4)' }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,201,167,0.25)' }}
            >
              Book another ride
            </button>
          </Link>
          <Link to="/my-bookings" style={{ textDecoration: 'none' }}>
            <button
              type="button" style={{ ...s.pill, ...s.outlinePill }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = '#2d3748'; e.currentTarget.style.background = 'transparent' }}
            >
              Your trips
            </button>
          </Link>
        </div>
      </div>
      <BottomNav />
    </>
  )
}