import { useState } from "react";
import AuthForm from "@/components/AuthForm";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot-password" | "verify-email">("login");

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthForm
        mode={mode}
        onSubmit={(data) => console.log('Auth submitted:', data)}
        onModeChange={setMode}
      />
    </div>
  );
}
