import React from 'react'

interface Props {
  onVerify: (token: string) => void
}

export const CaptchaStub: React.FC<Props> = ({ onVerify }) => {
  const [checked, setChecked] = React.useState(false)
  return (
    <div style={{ marginTop: 8 }}>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            setChecked(e.target.checked)
            onVerify(e.target.checked ? 'stub-token' : '')
          }}
        />
        <span>I'm not a robot (captcha stub)</span>
      </label>
    </div>
  )
}
