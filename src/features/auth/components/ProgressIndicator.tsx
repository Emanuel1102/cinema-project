import React from 'react'

interface Props {
  steps: string[]
  current: number
}

export const ProgressIndicator: React.FC<Props> = ({ steps, current }) => {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              background: i <= current ? '#1e90ff' : '#ddd',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {i + 1}
          </div>
          <div style={{ minWidth: 80, color: i <= current ? '#111' : '#666' }}>{s}</div>
        </div>
      ))}
    </div>
  )
}
