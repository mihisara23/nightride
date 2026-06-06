import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { pickupStops } from '../data/routes'
import BottomNav from '../components/BottomNav'
import { Clock, Phone, Bus, ArrowRight, CreditCard, Minus, Plus } from 'lucide-react'

const s = {
  page: { padding: '24px 20px 96px', minHeight: '100vh', animation: 'fadeIn 0.4s ease forwards' },
  greeting: { marginBottom: '6px', fontSize: '26px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.3px' },
  emailSmall: { fontSize: '13px', color: '#6b7280', marginBottom: '28px', fontWeight: 400 },
  sectionTitle: { fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '16px', letterSpacing: '0.3px' },

  /* ── Date chips ── */
  dateScroll: { display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', marginBottom: '24px', scrollbarWidth: 'none' },
  dateChip: {
    flexShrink: 0, padding: '10px 18px', borderRadius: '50px', fontSize: '13px', fontWeight: 600,
    border: '1px solid #2d3748', background: '#1a2035', color: '#94a3b8', cursor: 'pointer',
    transition: 'all 0.25s ease', fontFamily: "'Inter',system-ui,sans-serif", textAlign: 'center', minWidth: '80px',
  },
  dateChipActive: {
    background: '#00C9A7', color: '#ffffff', borderColor: '#00C9A7',
    boxShadow: '0 4px 16px rgba(0,201,167,0.3)',
  },
  dateChipDay: { fontSize: '15px', fontWeight: 700, display: 'block' },
  dateChipLabel: { fontSize: '11px', opacity: 0.85, display: 'block', marginTop: '2px' },

  /* ── Route cards ── */
  routeCard: {
    background: '#1a2035', border: '1px solid #2d3748', borderRadius: '18px',
    padding: '18px', marginBottom: '12px', cursor: 'pointer',
    transition: 'all 0.25s ease', position: 'relative',
  },
  routeCardActive: {
    borderColor: '#00C9A7', boxShadow: '0 0 0 2px rgba(0,201,167,0.15)', background: 'rgba(0,201,167,0.04)',
  },
  routeTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' },
  routePath: { display: 'flex', alignItems: 'center', gap: '8px' },
  routeCity: { fontSize: '15px', fontWeight: 700, color: '#ffffff' },
  arrowIcon: { color: '#00C9A7' },
  busIcon: { color: '#6b7280' },
  routeBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  routeTime: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8', fontWeight: 500 },
  priceBadge: {
    background: 'rgba(0,201,167,0.12)', color: '#00C9A7', fontSize: '15px', fontWeight: 800,
    padding: '4px 12px', borderRadius: '10px',
  },
  seatsRow: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' },
  seatsText: { fontSize: '12px', fontWeight: 600 },
  seatsOk: { color: '#94a3b8' },
  seatsLow: { color: '#FF6B35' },

  /* ── Seats counter ── */
  counterSection: { marginTop: '24px', marginBottom: '4px' },
  counterWrap: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#1a2035', border: '1px solid #2d3748', borderRadius: '18px', padding: '18px',
  },
  counterLabel: { fontSize: '15px', fontWeight: 700, color: '#ffffff' },
  counterSub: { fontSize: '12px', color: '#6b7280', marginTop: '2px' },
  counterControls: { display: 'flex', alignItems: 'center', gap: '16px' },
  counterBtn: {
    width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #2d3748',
    background: '#151b28', color: '#ffffff', fontSize: '18px', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease',
    fontFamily: "'Inter',system-ui,sans-serif",
  },
  counterBtnDisabled: { opacity: 0.35, cursor: 'not-allowed' },
  counterValue: { fontSize: '22px', fontWeight: 800, color: '#ffffff', minWidth: '28px', textAlign: 'center' },

  /* ── Price breakdown ── */
  priceBreakdown: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'rgba(0,201,167,0.06)', border: '1px solid rgba(0,201,167,0.12)',
    borderRadius: '14px', padding: '14px 16px', marginTop: '16px', marginBottom: '4px',
  },
  priceBreakdownText: { fontSize: '14px', color: '#00C9A7', fontWeight: 600 },
  priceBreakdownTotal: { fontSize: '20px', color: '#00C9A7', fontWeight: 800 },

  /* ── Form ── */
  formSection: { marginTop: '24px' },
  inputWrap: { position: 'relative', marginBottom: '16px' },
  inputIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none', display: 'flex', alignItems: 'center' },
  input: { width: '100%', padding: '15px 16px 15px 44px', fontSize: '15px', color: '#ffffff', background: '#151b28', border: '1px solid #2d3748', borderRadius: '14px', outline: 'none', fontFamily: "'Inter',system-ui,sans-serif", transition: 'all 0.25s ease' },

  payNote: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.15)',
    borderRadius: '14px', padding: '14px 16px', marginBottom: '20px',
  },
  payText: { fontSize: '13px', color: '#FF6B35', fontWeight: 600 },

  pill: {
    width: '100%', padding: '16px', borderRadius: '50px', fontSize: '16px', fontWeight: 700,
    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', transition: 'all 0.25s ease', fontFamily: "'Inter',system-ui,sans-serif", letterSpacing: '0.3px',
    background: 'linear-gradient(135deg,#FF6B35,#FF8F5E)', color: '#ffffff', boxShadow: '0 4px 20px rgba(255,107,53,0.25)',
  },
}


/* ── Build next-7-days array ── */
function getNext7Days() {
  const days = []
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    days.push({
      date: d,
      iso: d.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()],
      sub: `${d.getDate()} ${monthNames[d.getMonth()]}`,
    })
  }
  return days
}

export default function BookRide() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [seatsCount, setSeatsCount] = useState(1)
  const [travelDate, setTravelDate] = useState(getNext7Days()[0].iso)
  const [contact, setContact] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focus, setFocus] = useState(null)

  const hour = new Date().getHours()
  const greeting = hour >= 17 ? 'Good evening' : hour >= 12 ? 'Good afternoon' : 'Good morning'

  const dates = getNext7Days()
  const activeRoute = pickupStops.find((r) => r.id === selectedRoute)
  const maxForRoute = activeRoute ? activeRoute.maxSeats : 1

  /* Reset seats when route changes */
  useEffect(() => {
    setSeatsCount(1)
  }, [selectedRoute])

  const totalPrice = activeRoute ? activeRoute.price * seatsCount : 0

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!selectedRoute) { setError('Please select a route'); return }
    if (!contact.trim()) { setError('Please enter your contact number'); return }

    setLoading(true)
    const route = pickupStops.find((r) => r.id === selectedRoute)
    try {
      const { data, error: dbError } = await supabase
        .from('bookings')
        .insert([{
          user_email: user.email,
          pickup_stop: `${route.from} → ${route.to}`,
          departure_time: route.time,
          arrival_time: route.arrival,
          contact_number: contact.trim(),
          price: totalPrice,
          travel_date: travelDate,
          seats_count: seatsCount,
        }])
        .select()
        .single()

      if (dbError) { setError(dbError.message); return }
      navigate('/confirmation', { state: { booking: data } })
    } catch { setError('Failed to create booking. Try again.') }
    finally { setLoading(false) }
  }

  const inpStyle = (f) => ({ ...s.input, ...(focus === f ? { borderColor: '#00C9A7', boxShadow: '0 0 0 3px rgba(0,201,167,0.15)' } : {}) })

  return (
    <>
      <div style={s.page}>
        <h1 style={s.greeting}>{greeting} 👋</h1>
        <p style={s.emailSmall}>{user?.email}</p>

        {/* ── Date chips ── */}
        <h2 style={s.sectionTitle}>When are you travelling?</h2>
        <div style={s.dateScroll}>
          {dates.map((d) => {
            const active = travelDate === d.iso
            return (
              <div
                key={d.iso}
                style={{ ...s.dateChip, ...(active ? s.dateChipActive : {}) }}
                onClick={() => setTravelDate(d.iso)}
              >
                <span style={s.dateChipDay}>{d.label}</span>
                <span style={s.dateChipLabel}>{d.sub}</span>
              </div>
            )
          })}
        </div>

        {/* ── Route cards ── */}
        <h2 style={s.sectionTitle}>Where are you headed?</h2>

        {pickupStops.map((route) => {
          const active = selectedRoute === route.id
          const low = route.seats <= 2
          return (
            <div
              key={route.id}
              style={{ ...s.routeCard, ...(active ? s.routeCardActive : {}) }}
              onClick={() => setSelectedRoute(route.id)}
            >
              <div style={s.routeTop}>
                <div style={s.routePath}>
                  <span style={s.routeCity}>{route.from}</span>
                  <ArrowRight size={16} style={s.arrowIcon} />
                  <span style={s.routeCity}>{route.to}</span>
                </div>
                <Bus size={18} style={s.busIcon} />
              </div>
              <div style={s.routeBottom}>
                <div style={s.routeTime}>
                  <Clock size={14} />
                  Leaves {route.time}
                </div>
                <div style={s.priceBadge}>${route.price}</div>
              </div>
              <div style={s.seatsRow}>
                <span style={{ ...s.seatsText, ...(low ? s.seatsLow : s.seatsOk) }}>
                  {low ? `${route.seats} seats left — filling fast!` : `${route.seats} seats left`}
                </span>
              </div>
            </div>
          )
        })}

        {/* ── Seats counter (visible when route selected) ── */}
        {activeRoute && (
          <div style={s.counterSection}>
            <h2 style={s.sectionTitle}>How many seats?</h2>
            <div style={s.counterWrap}>
              <div>
                <div style={s.counterLabel}>Seats</div>
                <div style={s.counterSub}>Max {maxForRoute} for this route</div>
              </div>
              <div style={s.counterControls}>
                <button
                  type="button"
                  style={{ ...s.counterBtn, ...(seatsCount <= 1 ? s.counterBtnDisabled : {}) }}
                  onClick={() => setSeatsCount((c) => Math.max(1, c - 1))}
                  disabled={seatsCount <= 1}
                >
                  <Minus size={18} />
                </button>
                <span style={s.counterValue}>{seatsCount}</span>
                <button
                  type="button"
                  style={{ ...s.counterBtn, ...(seatsCount >= maxForRoute ? s.counterBtnDisabled : {}) }}
                  onClick={() => setSeatsCount((c) => Math.min(maxForRoute, c + 1))}
                  disabled={seatsCount >= maxForRoute}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Price breakdown ── */}
        {activeRoute && (
          <div style={s.priceBreakdown}>
            <span style={s.priceBreakdownText}>
              {seatsCount} seat{seatsCount > 1 ? 's' : ''} × ${activeRoute.price}
            </span>
            <span style={s.priceBreakdownTotal}>${totalPrice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={s.formSection}>
          {error && <div className="error-box">{error}</div>}

          <div style={s.inputWrap}>
            <div style={s.inputIcon}><Phone size={18} /></div>
            <input
              type="tel" placeholder="Your contact number"
              value={contact} onChange={(e) => setContact(e.target.value)}
              onFocus={() => setFocus('phone')} onBlur={() => setFocus(null)}
              style={inpStyle('phone')} required
            />
          </div>

          <div style={s.payNote}>
            <CreditCard size={18} color="#FF6B35" />
            <span style={s.payText}>Pay the driver when you board. Cash only.</span>
          </div>

          <button
            type="submit" style={{ ...s.pill, ...(loading ? { opacity: 0.7 } : {}) }} disabled={loading}
            onMouseOver={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,107,53,0.4)' } }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,107,53,0.25)' }}
          >
            {loading ? <><span className="spinner" /> Booking...</> : 'Grab a seat'}
          </button>
        </form>
      </div>
      <BottomNav />
    </>
  )
}