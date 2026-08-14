# Auth Registration Components (HU-FE-006)

This folder contains modular, documented React components used to implement the multi-step user registration flow.

Components:
- `RegisterForm` — Multi-step form that coordinates all steps, validations, and submission to `/auth/register`.
- `ProgressIndicator` — Visual step indicator used by the form.
- `PasswordStrengthMeter` — Simple strength meter that evaluates password complexity.
- `CaptchaStub` — Small placeholder component that simulates CAPTCHA verification (replace with real CAPTCHA provider in production).
- `Confirmation` — UI shown after successful registration, instructing the user to verify email.
- `ActivationPage` — Page that consumes an activation token from the query string and calls `/auth/verify-email` and `/membership/create`.

Usage:
Import `RegisterForm` in your registration route or page:

```tsx
import { RegisterForm } from './features/auth/components'

export const RegisterPage = () => <RegisterForm />
```

Notes and integration:
- Client API calls use `src/features/auth/services/api.ts`. Set `VITE_API_BASE` environment variable to point to your backend API.
- The `CaptchaStub` intentionally emits a fake token. Integrate a real CAPTCHA (e.g. Google reCAPTCHA) and wire `captchaToken` before submitting.
- Backend errors returned as `{ errors: [{ field, message }] }` are shown next to corresponding fields when possible.
- The form enforces the frontend validation requirements from HU-FE-006, including password rules and required consent fields.

Acceptance criteria implemented:
- Client-side validation before send (all required fields, email and phone format, password policy, consents).
- Backend errors are mapped to fields when the backend returns `{ errors: [{ field, message }] }`.
- After successful registration the UI shows a confirmation instructing the user to verify email.
- Activation link handling is implemented in `ActivationPage` and calls `/auth/verify-email`.

Next steps (optional):
- Replace `CaptchaStub` with a real CAPTCHA provider and pass its token into the payload.
- Improve styling to match app design (current implementation uses minimal inline styles).
