import React from 'react'
import { verifyEmail, createMembership } from '../services/api'

// ActivationPage reads the `token` query parameter from the URL
// and calls the verify-email endpoint. Uses `window.location` to avoid
// adding a dependency on `react-router-dom` for a simple page.
export const ActivationPage: React.FC = () => {
  const [status, setStatus] = React.useState<string>('Verifying...')

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token') || ''
    if (!token) {
      setStatus('Activation token missing in link.')
      return
    }
    ;(async () => {
      const res = await verifyEmail(token)
      if (!res.ok) {
        setStatus(res.message || 'Activation failed')
        return
      }
      setStatus('Account activated. Creating membership...')
      // Try to create membership; backend may ignore if not needed
      await createMembership((res as any).userId || '')
      setStatus('Account activated. You can now log in.')
    })()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Account Activation</h2>
      <p>{status}</p>
    </div>
  )
}
