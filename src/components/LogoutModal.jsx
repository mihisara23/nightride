const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    animation: 'fadeIn 0.2s ease',
    padding: '20px',
  },
  modal: {
    background: 'rgba(17, 24, 39, 0.9)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '28px',
    maxWidth: '340px',
    width: '100%',
    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
    animation: 'scaleIn 0.25s ease',
    textAlign: 'center',
  },
  icon: {
    fontSize: '2.5rem',
    marginBottom: '16px',
    display: 'block',
  },
  title: {
    color: 'var(--text-primary)',
    fontSize: '1.15rem',
    fontWeight: 700,
    marginBottom: '8px',
  },
  message: {
    color: 'var(--text-muted)',
    fontSize: '0.88rem',
    marginBottom: '24px',
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
}

export default function LogoutModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <span style={styles.icon}>👋</span>
        <h3 style={styles.title}>Sign out?</h3>
        <p style={styles.message}>
          You'll need to sign in again to access your bookings.
        </p>
        <div style={styles.actions}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" style={{ flex: 1 }} onClick={onConfirm}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}