import React from 'react'
import { verifyEmail } from '../../services/api'

// ActivationPage reads the `token` query parameter from the URL
// and calls the verify-email endpoint. Uses `window.location` to avoid
// adding a dependency on `react-router-dom` for a simple page.
export const ActivationPage: React.FC = () => {
  const token = new URLSearchParams(window.location.search).get('token') || ''
  const [status, setStatus] = React.useState<string>(
    token ? 'Verifying...' : 'Activation token missing in link.',
  )

  React.useEffect(() => {
    if (!token) return

    void verifyEmail(token).then((res) => {
      if (!res.ok) {
        setStatus(res.message || 'Activation failed')
        return
      }
      setStatus('Account activated. You can now log in.')
    })
  }, [token])

  return (
    <div style={{ padding: 20 }}>
      <h2>Account Activation</h2>
      <p>{status}</p>
    </div>
  )
}
