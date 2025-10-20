import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "login" | "signup" | "forgot-password" | "verify-email" | "reset-password";

interface AuthFormProps {
  mode?: AuthMode;
  onSubmit?: (data: any) => void;
  onModeChange?: (mode: AuthMode) => void;
  isLoading?: boolean;
  savedEmail?: string;
}

export default function AuthForm({ mode = "login", onSubmit, onModeChange, isLoading = false, savedEmail = "" }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: savedEmail,
    password: "",
    verificationCode: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`${mode} submitted:`, formData);
    onSubmit?.(formData);
  };

  const titles = {
    login: "Welcome Back",
    signup: "Create Account",
    "forgot-password": "Reset Password",
    "verify-email": "Verify Email",
    "reset-password": "Reset Password",
  };

  const descriptions = {
    login: "Sign in to your SmartShop account",
    signup: "Start shopping smarter today",
    "forgot-password": "We'll send you a reset code",
    "verify-email": "Enter the code sent to your email",
    "reset-password": "Enter your reset code and new password",
  };

  return (
    <Card className="w-full max-w-md" data-testid={`card-auth-${mode}`}>
      <CardHeader>
        <CardTitle>{titles[mode]}</CardTitle>
        <CardDescription>{descriptions[mode]}</CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-9"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-name"
                />
              </div>
            </div>
          )}

          {mode !== "verify-email" && mode !== "reset-password" && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  data-testid="input-email"
                  required
                />
              </div>
            </div>
          )}

          {(mode === "verify-email" || mode === "reset-password") && (
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                placeholder="123456"
                className="text-center text-lg font-mono tracking-widest"
                maxLength={6}
                value={formData.verificationCode}
                onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                data-testid="input-verification-code"
                required
              />
            </div>
          )}

          {(mode === "login" || mode === "signup" || mode === "reset-password") && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  data-testid="input-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" data-testid="button-submit" disabled={isLoading}>
            {isLoading ? "Loading..." : (
              <>
                {mode === "login" && "Sign In"}
                {mode === "signup" && "Create Account"}
                {mode === "forgot-password" && "Send Reset Code"}
                {mode === "verify-email" && "Verify Email"}
                {mode === "reset-password" && "Reset Password"}
              </>
            )}
          </Button>

          <div className="flex w-full flex-col gap-2 text-center text-sm">
            {mode === "login" && (
              <>
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => onModeChange?.("forgot-password")}
                  data-testid="link-forgot-password"
                >
                  Forgot password?
                </button>
                <div>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => onModeChange?.("signup")}
                    data-testid="link-signup"
                  >
                    Sign up
                  </button>
                </div>
              </>
            )}

            {mode === "signup" && (
              <div>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => onModeChange?.("login")}
                  data-testid="link-login"
                >
                  Sign in
                </button>
              </div>
            )}

            {(mode === "forgot-password" || mode === "verify-email" || mode === "reset-password") && (
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => onModeChange?.("login")}
                data-testid="link-back-to-login"
              >
                Back to login
              </button>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
