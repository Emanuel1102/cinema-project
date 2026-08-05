import React from 'react'
import { RegisterForm } from '../../components'

export const RegisterPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <h1>Create an account</h1>
      <p>Please fill the form to create your account and access digital membership.</p>
      <RegisterForm />
    </div>
  )
}
