import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { routes } from '../data/routes'
import BottomNav from '../components/BottomNav'
import { Clock, Phone, ArrowRight, CreditCard, Minus, Plus, MapPin, ArrowLeft, StickyNote } from 'lucide-react'

/* ── Styles ── */
const s = {
  page: { padding: '24px 20px 96px', minHeight: '100vh', animation: 'fadeIn 0.4s ease forwards' },
  greeting: { marginBottom: '6px', fontSize: '26px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.3px' },
  emailSmall: { fontSize: '13px', color: '#6b7280', marginBottom: '28px', fontWeight: 400 },
  sectionTitle: { fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '16px', letterSpacing: '0.3px' },
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600,
    color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px',
    padding: '6px 0', fontFamily: "'Inter',system-ui,sans-serif",
  },

  /* ── Route cards ── */
  routeCard: {
    background: '#1a2035', border: '1px solid #2d3748', borderRadius: '18px',
    padding: '18px', marginBottom: '12px', cursor: 'pointer',
    transition: 'all 0.25s ease', position: 'relative',
  },
  routeCardActive: {
    borderColor: '#00C9A7', boxShadow: '0 0 0 2px rgba(0,201,167,0.15)', background: 'rgba(0,201,167,0.04)',
  },
  routeName: { fontSize: '16px', fontWeight: 700, color: '#ffffff', marginBottom: '12px' },
  routeMeta: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' },
  routeMetaItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8', fontWeight: 500 },
  priceBadge: {
    background: 'rgba(0,201,167,0.12)', color: '#00C9A7', fontSize: '15px', fontWeight: 800,
    padding: '4px 12px', borderRadius: '10px',
  },
  stopsList: { display: 'flex', flexDirection: 'column', gap: '0' },
  stopRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0', fontSize: '13px' },
  stopDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#6b7280', flexShrink: 0 },
  stopLine: { width: '1px', height: '12px', background: '#2d3748', marginLeft: '3.5px' },
  stopName: { color: '#e2e8f0', fontWeight: 600, minWidth: '80px' },
  stopTime: { color: '#6b7280', fontWeight: 500 },
  seatsRow: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' },
  seatsText: { fontSize: '12px', fontWeight: 600 },
  seatsOk: { color: '#94a3b8' },
  seatsLow: { color: '#FF6B35' },

  /* ── Stop selector (step 2) ── */
  stopSelector: { marginBottom: '28px' },
  stopLineWrap: {
    position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '32px 0 0', marginBottom: '8px',
  },
  trackLine: {
    position: 'absolute', top: '44px', left: '24px', right: '24px', height: '4px',
    background: '#2d3748', borderRadius: '2px', zIndex: 0,
  },
  trackFill: {
    position: 'absolute', height: '4px', background: '#00C9A7', borderRadius: '2px', zIndex: 1,
    transition: 'all 0.35s ease',
  },
  trackFillError: { background: '#ef4444' },
  stopCol: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2,
    cursor: 'pointer', flex: 1, minWidth: 0,
  },
  stopDotLarge: {
    width: '28px', height: '28px', borderRadius: '50%', border: '3px solid #2d3748',
    background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.25s ease', marginBottom: '10px',
  },
  stopDotBoarding: { borderColor: '#00C9A7', background: 'rgba(0,201,167,0.15)' },
  stopDotDropoff: { borderColor: '#FF6B35', background: 'rgba(255,107,53,0.15)' },
  stopDotInSegment: { borderColor: '#00C9A7', background: 'rgba(0,201,167,0.08)' },
  stopLabel: { fontSize: '12px', fontWeight: 700, color: '#e2e8f0', textAlign: 'center', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' },
  stopTimeLabel: { fontSize: '11px', color: '#6b7280', fontWeight: 500, textAlign: 'center' },
  stopTag: {
    fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
    marginTop: '6px', padding: '2px 8px', borderRadius: '6px', textAlign: 'center',
  },
  boardingTag: { background: 'rgba(0,201,167,0.15)', color: '#00C9A7' },
  dropoffTag: { background: 'rgba(255,107,53,0.15)', color: '#FF6B35' },
  stopInstruction: { fontSize: '14px', color: '#94a3b8', textAlign: 'center', margin: '16px 0 8px', fontWeight: 500 },
  stopError: { fontSize: '13px', color: '#ef4444', textAlign: 'center', margin: '8px 0', fontWeight: 600 },
  selectedPriceBox: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'rgba(0,201,167,0.06)', border: '1px solid rgba(0,201,167,0.12)',
    borderRadius: '14px', padding: '14px 16px', marginTop: '16px', marginBottom: '4px',
  },
  selectedPriceLabel: { fontSize: '14px', color: '#00C9A7', fontWeight: 600 },
  selectedPriceValue: { fontSize: '22px', color: '#00C9A7', fontWeight: 800 },
  confirmStopsBtn: {
    width: '100%', padding: '14px', borderRadius: '50px', fontSize: '15px', fontWeight: 700,
    border: 'none', cursor: 'pointer', marginTop: '16px',
    fontFamily: "'Inter',system-ui,sans-serif", letterSpacing: '0.3px',
    background: 'linear-gradient(135deg,#00C9A7,#00E4C1)', color: '#0d1117',
    boxShadow: '0 4px 20px rgba(0,201,167,0.25)', transition: 'all 0.25s ease',
  },
  resetBtn: {
    display: 'inline-block', marginTop: '12px', fontSize: '13px', color: '#94a3b8',
    background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
    fontFamily: "'Inter',system-ui,sans-serif", textDecoration: 'underline',
  },

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
  input: { width: '100%', padding: '15px 16px 15px 44px', fontSize: '15px', color: '#ffffff', background: '#151b28', border: '1px solid #2d3748', borderRadius: '14px', outline: 'none', fontFamily: "'Inter',system-ui,sans-serif", transition: 'all 0.25s ease', boxSizing: 'border-box' },
  textareaWrap: { position: 'relative', marginBottom: '16px' },
  textarea: {
    width: '100%', padding: '15px 16px 15px 44px', fontSize: '15px', color: '#ffffff',
    background: '#151b28', border: '1px solid #2d3748', borderRadius: '14px', outline: 'none',
    fontFamily: "'Inter',system-ui,sans-serif", transition: 'all 0.25s ease', resize: 'vertical',
    minHeight: '80px', boxSizing: 'border-box',
  },

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

/* ── Helpers ── */
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

function getSegmentPrice(route, fromIdx, toIdx) {
  const from = route.stops[fromIdx].name
  const to = route.stops[toIdx].name
  const key = `${from}-${to}`
  return route.segmentPrices[key] ?? route.price
}

/* ── Render stops with dots & lines ── */
function RouteStops({ stops }) {
  return (
    <div style={s.stopsList}>
      {stops.map((stop, i) => (
        <div key={i}>
          <div style={s.stopRow}>
            <div style={s.stopDot} />
            <span style={s.stopName}>{stop.name}</span>
            <span style={s.stopTime}>{stop.time}</span>
          </div>
          {i < stops.length - 1 && <div style={s.stopLine} />}
        </div>
      ))}
    </div>
  )
}

/* ── Main Component ── */
export default function BookRide() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [selectedRouteId, setSelectedRouteId] = useState(null)
  const [boardingIdx, setBoardingIdx] = useState(null)
  const [dropoffIdx, setDropoffIdx] = useState(null)
  const [stopsError, setStopsError] = useState('')
  const [seatsCount, setSeatsCount] = useState(1)
  const [travelDate, setTravelDate] = useState(getNext7Days()[0].iso)
  const [contact, setContact] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focus, setFocus] = useState(null)

  const hour = new Date().getHours()
  const greeting = hour >= 17 ? 'Good evening' : hour >= 12 ? 'Good afternoon' : 'Good morning'
  const dates = getNext7Days()
  const activeRoute = routes.find((r) => r.id === selectedRouteId)

  /* Reset deeper state when route changes */
  useEffect(() => {
    setBoardingIdx(null)
    setDropoffIdx(null)
    setStopsError('')
    setSeatsCount(1)
  }, [selectedRouteId])

  /* Reset seats when stops change */
  useEffect(() => {
    setSeatsCount(1)
  }, [boardingIdx, dropoffIdx])

  /* Calculate price */
  const segmentPrice = (activeRoute && boardingIdx !== null && dropoffIdx !== null)
    ? getSegmentPrice(activeRoute, boardingIdx, dropoffIdx)
    : 0
  const totalPrice = segmentPrice * seatsCount
  const maxSeats = activeRoute?.maxSeats ?? 1

  /* ── Stop click handler ── */
  const handleStopClick = (idx) => {
    setStopsError('')

    if (boardingIdx === null) {
      /* First click → boarding */
      setBoardingIdx(idx)
      setDropoffIdx(null)
    } else if (dropoffIdx === null) {
      if (idx === boardingIdx) {
        setStopsError('Please select different stops')
        return
      }
      if (idx < boardingIdx) {
        setStopsError('Drop-off must be after boarding')
        return
      }
      setDropoffIdx(idx)
    } else {
      /* Both selected → reset and start fresh */
      setBoardingIdx(idx)
      setDropoffIdx(null)
    }
  }

  const resetStops = () => {
    setBoardingIdx(null)
    setDropoffIdx(null)
    setStopsError('')
  }

  const stopsConfirmed = boardingIdx !== null && dropoffIdx !== null && !stopsError

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!activeRoute) { setError('Please select a route'); return }
    if (!stopsConfirmed) { setError('Please select your boarding and drop-off stops'); return }
    if (!contact.trim()) { setError('Please enter your contact number'); return }

    setLoading(true)
    try {
      const { data, error: dbError } = await supabase
        .from('bookings')
        .insert([{
          user_email: user.email,
          route_name: activeRoute.name,
          pickup_stop: activeRoute.stops[boardingIdx].name,
          dropoff_stop: activeRoute.stops[dropoffIdx].name,
          departure_time: activeRoute.departure,
          departure_time_display: activeRoute.stops[boardingIdx].time,
          arrival_time: activeRoute.stops[dropoffIdx].time,
          contact_number: contact.trim(),
          price: totalPrice,
          travel_date: travelDate,
          seats_count: seatsCount,
          notes: notes.trim() || null,
        }])
        .select()
        .single()

      if (dbError) { setError(dbError.message); return }
      navigate('/confirmation', { state: { booking: data } })
    } catch {
      setError('Failed to create booking. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const inpStyle = (f) => ({ ...s.input, ...(focus === f ? { borderColor: '#00C9A7', boxShadow: '0 0 0 3px rgba(0,201,167,0.15)' } : {}) })
  const taStyle = (f) => ({ ...s.textarea, ...(focus === f ? { borderColor: '#00C9A7', boxShadow: '0 0 0 3px rgba(0,201,167,0.15)' } : {}) })

  /* ── Track fill position for stop line ── */
  const getTrackFill = () => {
    if (boardingIdx === null) return null
    const n = activeRoute.stops.length
    const pct = 100 / (n - 1)
    const left = boardingIdx * pct
    const right = dropoffIdx !== null ? dropoffIdx * pct : boardingIdx * pct
    const isError = !!stopsError
    return {
      ...s.trackFill,
      left: `${left}%`,
      width: `${right - left}%`,
      ...(isError ? s.trackFillError : {}),
    }
  }

  /* ── Check if stop is in selected segment ── */
  const isInSegment = (idx) => {
    if (boardingIdx === null || dropoffIdx === null) return false
    return idx >= boardingIdx && idx <= dropoffIdx
  }

  return (
    <>
      <div style={s.page}>
        <h1 style={s.greeting}>{greeting} 👋</h1>
        <p style={s.emailSmall}>{user?.email}</p>

        {/* ════════════ STEP 1: Route cards ════════════ */}
        {step === 1 && (
          <>
            <h2 style={s.sectionTitle}>Where are you headed?</h2>
            {routes.map((route) => (
              <div
                key={route.id}
                style={s.routeCard}
                onClick={() => { setSelectedRouteId(route.id); setStep(2) }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00C9A7'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#2d3748'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <div style={s.routeName}>{route.name}</div>
                <div style={s.routeMeta}>
                  <div style={s.routeMetaItem}>
                    <Clock size={14} />
                    <span>Departs {route.departure}</span>
                  </div>
                  <div style={s.priceBadge}>${route.price}</div>
                </div>
                <RouteStops stops={route.stops} />
                <div style={s.seatsRow}>
                  <span style={{ ...s.seatsText, ...(route.seats <= 2 ? s.seatsLow : s.seatsOk) }}>
                    {route.seats <= 2 ? `${route.seats} seats left — filling fast!` : `${route.seats} seats left`}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ════════════ STEP 2: Stop selector ════════════ */}
        {step === 2 && activeRoute && (
          <>
            <button style={s.backBtn} onClick={() => { setStep(1); resetStops() }}>
              <ArrowLeft size={16} /> Back to routes
            </button>

            <h2 style={s.sectionTitle}>Select your stops</h2>
            <div style={{ ...s.routeCard, cursor: 'default', marginBottom: '20px' }}>
              <div style={s.routeName}>{activeRoute.name}</div>
              <div style={s.routeMeta}>
                <div style={s.routeMetaItem}>
                  <Clock size={14} />
                  <span>Departs {activeRoute.departure}</span>
                </div>
                <div style={s.priceBadge}>${activeRoute.price}</div>
              </div>
            </div>

            <div style={s.stopSelector}>
              {/* Horizontal stop line */}
              <div style={s.stopLineWrap}>
                <div style={s.trackLine} />
                {boardingIdx !== null && <div style={getTrackFill()} />}
                {activeRoute.stops.map((stop, i) => {
                  const isBoarding = i === boardingIdx
                  const isDropoff = i === dropoffIdx
                  const inSeg = isInSegment(i)
                  let dotStyle = { ...s.stopDotLarge }
                  if (isBoarding) dotStyle = { ...dotStyle, ...s.stopDotBoarding }
                  else if (isDropoff) dotStyle = { ...dotStyle, ...s.stopDotDropoff }
                  else if (inSeg) dotStyle = { ...dotStyle, ...s.stopDotInSegment }

                  return (
                    <div key={i} style={s.stopCol} onClick={() => handleStopClick(i)}>
                      <div style={dotStyle}>
                        {isBoarding && <MapPin size={14} color="#00C9A7" />}
                        {isDropoff && <MapPin size={14} color="#FF6B35" />}
                      </div>
                      <span style={s.stopLabel}>{stop.name}</span>
                      <span style={s.stopTimeLabel}>{stop.time}</span>
                      {isBoarding && <span style={{ ...s.stopTag, ...s.boardingTag }}>Boarding here</span>}
                      {isDropoff && <span style={{ ...s.stopTag, ...s.dropoffTag }}>Getting off here</span>}
                    </div>
                  )
                })}
              </div>

              {/* Instruction / error */}
              {stopsError && <div style={s.stopError}>{stopsError}</div>}
              {!stopsError && boardingIdx === null && (
                <div style={s.stopInstruction}>Tap your boarding stop</div>
              )}
              {!stopsError && boardingIdx !== null && dropoffIdx === null && (
                <div style={s.stopInstruction}>Now tap your drop-off stop</div>
              )}

              {/* Reset link */}
              {(boardingIdx !== null) && (
                <div style={{ textAlign: 'center' }}>
                  <button style={s.resetBtn} onClick={resetStops}>Reset selection</button>
                </div>
              )}

              {/* Price preview */}
              {stopsConfirmed && (
                <div style={s.selectedPriceBox}>
                  <span style={s.selectedPriceLabel}>
                    {activeRoute.stops[boardingIdx].name} → {activeRoute.stops[dropoffIdx].name}
                  </span>
                  <span style={s.selectedPriceValue}>${segmentPrice}</span>
                </div>
              )}
            </div>

            {/* Confirm stops button */}
            {stopsConfirmed && (
              <button
                style={s.confirmStopsBtn}
                onClick={() => setStep(3)}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,201,167,0.4)' }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,201,167,0.25)' }}
              >
                Confirm stops
              </button>
            )}
          </>
        )}

        {/* ════════════ STEP 3: Details & submit ════════════ */}
        {step === 3 && activeRoute && stopsConfirmed && (
          <>
            <button style={s.backBtn} onClick={() => setStep(2)}>
              <ArrowLeft size={16} /> Change stops
            </button>

            {/* Trip summary */}
            <div style={{ ...s.routeCard, cursor: 'default', marginBottom: '20px' }}>
              <div style={s.routeName}>{activeRoute.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '14px', color: '#00C9A7', fontWeight: 700 }}>
                  {activeRoute.stops[boardingIdx].name}
                </span>
                <ArrowRight size={14} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#FF6B35', fontWeight: 700 }}>
                  {activeRoute.stops[dropoffIdx].name}
                </span>
              </div>
              <div style={s.routeMeta}>
                <div style={s.routeMetaItem}>
                  <Clock size={14} />
                  <span>Departs {activeRoute.departure}</span>
                </div>
                <div style={s.priceBadge}>${segmentPrice}/seat</div>
              </div>
            </div>

            {/* Date chips */}
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

            {/* Seats counter */}
            <h2 style={s.sectionTitle}>How many seats?</h2>
            <div style={s.counterWrap}>
              <div>
                <div style={s.counterLabel}>Seats</div>
                <div style={s.counterSub}>Max {maxSeats} for this route</div>
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
                  style={{ ...s.counterBtn, ...(seatsCount >= maxSeats ? s.counterBtnDisabled : {}) }}
                  onClick={() => setSeatsCount((c) => Math.min(maxSeats, c + 1))}
                  disabled={seatsCount >= maxSeats}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Price breakdown */}
            <div style={s.priceBreakdown}>
              <span style={s.priceBreakdownText}>
                {seatsCount} seat{seatsCount > 1 ? 's' : ''} × ${segmentPrice}
              </span>
              <span style={s.priceBreakdownTotal}>${totalPrice}</span>
            </div>

            {/* Contact & notes form */}
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

              <div style={s.textareaWrap}>
                <div style={{ ...s.inputIcon, top: '18px', transform: 'none' }}><StickyNote size={18} /></div>
                <textarea
                  placeholder="Notes for the driver (optional)"
                  value={notes} onChange={(e) => setNotes(e.target.value)}
                  onFocus={() => setFocus('notes')} onBlur={() => setFocus(null)}
                  style={taStyle('notes')}
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
                {loading ? <><span className="spinner" /> Booking...</> : `Book for $${totalPrice}`}
              </button>
            </form>
          </>
        )}
      </div>
      <BottomNav />
    </>
  )
}