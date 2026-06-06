import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import logo from '../assets/logo.svg'

const s = {
  wrapper: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  blobs: {
    position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none',
  },
  b1: { position: 'absolute', top: '-15%', left: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,167,0.15) 0%, transparent 65%)', filter: 'blur(40px)', animation: 'blobFloat1 14s ease-in-out infinite' },
  b2: { position: 'absolute', top: '35%', right: '-12%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,167,0.1) 0%, transparent 60%)', filter: 'blur(50px)', animation: 'blobFloat2 18s ease-in-out infinite' },
  b3: { position: 'absolute', bottom: '-5%', left: '25%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.07) 0%, transparent 60%)', filter: 'blur(40px)', animation: 'blobFloat3 20s ease-in-out infinite' },
  content: { position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px 32px' },
  logoImg: { width: '72px', height: '72px', marginBottom: '20px', filter: 'drop-shadow(0 0 28px rgba(0,201,167,0.3))' },
  brandName: { fontSize: '48px', fontWeight: 900, color: '#ffffff', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '8px' },
  brandAccent: { color: '#00C9A7' },
  tagline: { color: '#ffffff', fontSize: '16px', fontWeight: 500, marginBottom: '4px', opacity: 0.9 },
  subtitle: { color: '#6b7280', fontSize: '14px', fontWeight: 400, marginBottom: '28px' },
  dotsRow: { display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', transition: 'all 0.3s' },
  dotActive: { width: '24px', borderRadius: '4px', background: '#00C9A7', boxShadow: '0 0 10px rgba(0,201,167,0.4)', animation: 'dotPulse 2s ease-in-out infinite' },
  card: { width: '100%', maxWidth: '380px', background: 'rgba(26,32,53,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '28px 24px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', animation: 'slideUp 0.5s ease 0.2s both' },
  inputWrap: { position: 'relative', marginBottom: '14px' },
  inputIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none', display: 'flex', alignItems: 'center' },
  input: { width: '100%', padding: '15px 16px 15px 44px', fontSize: '15px', color: '#ffffff', background: '#151b28', border: '1px solid #2d3748', borderRadius: '14px', outline: 'none', fontFamily: "'Inter',system-ui,sans-serif", transition: 'all 0.25s ease' },
  eyeBtn: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px', display: 'flex', transition: 'color 0.2s' },
  pill: { width: '100%', padding: '16px', borderRadius: '50px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.25s ease', fontFamily: "'Inter',system-ui,sans-serif", letterSpacing: '0.3px' },
  tealPill: { background: 'linear-gradient(135deg,#00C9A7,#00E4C1)', color: '#0d1117', boxShadow: '0 4px 20px rgba(0,201,167,0.25)', marginBottom: '0' },
  divider: { display: 'flex', alignItems: 'center', gap: '14px', margin: '20px 0' },
  divLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' },
  divText: { fontSize: '13px', color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' },
}

export default function Login() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focus, setFocus] = useState(null)

  if (user) return <Navigate to="/book" replace />

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (err) { setError(err.message); return }
      navigate('/book')
    } catch { setError('Something went wrong. Try again.') }
    finally { setLoading(false) }
  }

  const inpStyle = (f) => ({ ...s.input, ...(focus === f ? { borderColor: '#00C9A7', boxShadow: '0 0 0 3px rgba(0,201,167,0.15)' } : {}) })

  return (
    <div style={s.wrapper}>
      <div style={s.blobs}>
        <div style={s.b1} /><div style={s.b2} /><div style={s.b3} />
      </div>
      <div style={s.content}>
        <img src={logo} alt="NightRide" style={s.logoImg} />
        <div style={s.brandName}>Night<span style={s.brandAccent}>Ride</span></div>
        <p style={s.tagline}>Getting home just got easier.</p>
        <p style={s.subtitle}>Shared shuttles running late night from Bundoora</p>

        <div style={s.dotsRow}>
          <span style={s.dot} />
          <span style={{ ...s.dot, ...s.dotActive }} />
          <span style={s.dot} />
        </div>

        <div style={s.card}>
          {error && <div className="error-box">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div style={s.inputWrap}>
              <div style={s.inputIcon}><Mail size={18} /></div>
              <input type="email" placeholder="your.email@latrobe.edu.au" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocus('email')} onBlur={() => setFocus(null)} style={inpStyle('email')} required autoFocus />
            </div>
            <div style={s.inputWrap}>
              <div style={s.inputIcon}><Lock size={18} /></div>
              <input type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setFocus('pw')} onBlur={() => setFocus(null)} style={inpStyle('pw')} required minLength={6} />
              <button type="button" style={s.eyeBtn} onClick={() => setShowPw(!showPw)} onMouseOver={(e) => { e.currentTarget.style.color = '#00C9A7' }} onMouseOut={(e) => { e.currentTarget.style.color = '#6b7280' }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="submit" style={{ ...s.pill, ...s.tealPill, ...(loading ? { opacity: 0.7 } : {}) }} disabled={loading}
              onMouseOver={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,201,167,0.4)' } }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,201,167,0.25)' }}>
              {loading ? <><span className="spinner" style={{ borderColor: 'rgba(13,17,23,0.3)', borderTopColor: '#0d1117' }} /> Signing in...</> : "Let's go"}
            </button>
          </form>

          <div style={s.divider}>
            <div style={s.divLine} /><span style={s.divText}>or</span><div style={s.divLine} />
          </div>

          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button type="button" style={s.pill}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,107,53,0.35)' }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,107,53,0.2)' }}>
              Create an account
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}