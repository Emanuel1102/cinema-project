import React from 'react'

interface Props {
  email: string
}

export const Confirmation: React.FC<Props> = ({ email }) => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Registration complete</h2>
      <p>
        We have created your account. Please check <strong>{email}</strong> for a verification link to
        activate your account.
      </p>
      <p>If you don't receive the email, check your spam folder or request another verification link.</p>
    </div>
  )
}
