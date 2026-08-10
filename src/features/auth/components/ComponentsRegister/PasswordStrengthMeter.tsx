import React from 'react'

interface Props {
  password: string
}

function scorePassword(pw: string) {
  let score = 0
  if (!pw) return 0
  if (pw.length >= 10) score += 2
  if (/[A-Z]/.test(pw)) score += 1
  if (/[a-z]/.test(pw)) score += 1
  if (/[0-9]/.test(pw)) score += 1
  if (/[^A-Za-z0-9]/.test(pw)) score += 1
  return Math.min(score, 6)
}

export const PasswordStrengthMeter: React.FC<Props> = ({ password }) => {
  const score = scorePassword(password)
  const percent = Math.round((score / 6) * 100)
  const color = score <= 2 ? '#e74c3c' : score <= 4 ? '#f1c40f' : '#2ecc71'
  return (
    <div>
      <div style={{ height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: color }} />
      </div>
      <div style={{ fontSize: 12, color: '#444', marginTop: 6 }}>
        {password ? (percent < 50 ? 'Weak' : percent < 80 ? 'Medium' : 'Strong') : 'Enter a password'}
      </div>
    </div>
  )
}
