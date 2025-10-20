import { useState } from 'react';
import AuthForm from '../AuthForm';

export default function AuthFormExample() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot-password" | "verify-email">("login");

  return (
    <AuthForm
      mode={mode}
      onSubmit={(data) => console.log('Submitted:', data)}
      onModeChange={setMode}
    />
  );
}
