import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import logo from '../assets/logo.svg'

const s = {
  wrapper: { position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  blobs: { position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' },
  b1: { position: 'absolute', top: '-10%', right: '-10%', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 65%)', filter: 'blur(40px)', animation: 'blobFloat2 14s ease-in-out infinite' },
  b2: { position: 'absolute', bottom: '20%', left: '-12%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,167,0.12) 0%, transparent 60%)', filter: 'blur(50px)', animation: 'blobFloat1 18s ease-in-out infinite' },
  b3: { position: 'absolute', top: '50%', right: '20%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,167,0.08) 0%, transparent 60%)', filter: 'blur(35px)', animation: 'blobFloat3 22s ease-in-out infinite' },
  content: { position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px 32px' },
  logoImg: { width: '64px', height: '64px', marginBottom: '16px', filter: 'drop-shadow(0 0 28px rgba(0,201,167,0.3))' },
  title: { fontSize: '28px', fontWeight: 800, color: '#ffffff', marginBottom: '4px', letterSpacing: '0.3px' },
  subtitle: { color: '#6b7280', fontSize: '14px', fontWeight: 400, marginBottom: '28px' },
  card: { width: '100%', maxWidth: '380px', background: 'rgba(26,32,53,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '28px 24px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)', animation: 'slideUp 0.5s ease 0.15s both' },
  inputWrap: { position: 'relative', marginBottom: '14px' },
  inputIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none', display: 'flex', alignItems: 'center' },
  input: { width: '100%', padding: '15px 16px 15px 44px', fontSize: '15px', color: '#ffffff', background: '#151b28', border: '1px solid #2d3748', borderRadius: '14px', outline: 'none', fontFamily: "'Inter',system-ui,sans-serif", transition: 'all 0.25s ease' },
  eyeBtn: { position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px', display: 'flex', transition: 'color 0.2s' },
  pill: { width: '100%', padding: '16px', borderRadius: '50px', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.25s ease', fontFamily: "'Inter',system-ui,sans-serif", letterSpacing: '0.3px' },
  footer: { textAlign: 'center', marginTop: '20px' },
  linkText: { color: '#94a3b8', fontSize: '14px', fontWeight: 400 },
}

export default function Register() {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [focus, setFocus] = useState(null)

  if (user) return <Navigate to="/book" replace />

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true)
    try {
      const { error: err } = await supabase.auth.signUp({ email: email.trim(), password })
      if (err) { setError(err.message); return }
      setSuccess('Check your email to confirm your account!')
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
        <h1 style={s.title}>Create Account</h1>
        <p style={s.subtitle}>Join NightRide — it takes 30 seconds</p>

        <div style={s.card}>
          {error && <div className="error-box">{error}</div>}
          {success && <div style={{ padding: '12px 16px', background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.25)', borderRadius: '14px', color: '#00C9A7', fontSize: '14px', marginBottom: 16, fontWeight: 500 }}>{success}</div>}
          <form onSubmit={handleSubmit}>
            <div style={s.inputWrap}>
              <div style={s.inputIcon}><Mail size={18} /></div>
              <input type="email" placeholder="your.email@latrobe.edu.au" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocus('email')} onBlur={() => setFocus(null)} style={inpStyle('email')} required autoFocus />
            </div>
            <div style={s.inputWrap}>
              <div style={s.inputIcon}><Lock size={18} /></div>
              <input type={showPw ? 'text' : 'password'} placeholder="Create a password (6+ chars)" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setFocus('pw')} onBlur={() => setFocus(null)} style={inpStyle('pw')} required minLength={6} />
              <button type="button" style={s.eyeBtn} onClick={() => setShowPw(!showPw)} onMouseOver={(e) => { e.currentTarget.style.color = '#00C9A7' }} onMouseOut={(e) => { e.currentTarget.style.color = '#6b7280' }}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="submit" style={{ ...s.pill, background: 'linear-gradient(135deg,#FF6B35,#FF8F5E)', color: '#ffffff', boxShadow: '0 4px 20px rgba(255,107,53,0.25)', marginTop: '4px' }} disabled={loading}
              onMouseOver={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,107,53,0.4)' } }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,107,53,0.25)' }}>
              {loading ? <><span className="spinner" /> Creating...</> : 'Create Account'}
            </button>
          </form>
        </div>

        <div style={s.footer}>
          <span style={s.linkText}>Already have an account? </span>
          <Link to="/login" style={{ fontSize: '14px' }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}