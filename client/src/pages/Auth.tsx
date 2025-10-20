import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import AuthForm from "@/components/AuthForm";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot-password" | "verify-email" | "reset-password">("login");
  const [userEmail, setUserEmail] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Registration successful!",
        description: "Please check your email for a verification code.",
      });
      setUserEmail(variables.email);
      setMode("verify-email");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      const response = await apiRequest("POST", "/api/auth/verify-email", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Verification failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email verified!",
        description: "You can now sign in.",
      });
      setMode("login");
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "Login successful.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await apiRequest("POST", "/api/auth/forgot-password", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Request failed");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Reset code sent",
        description: "Check your email for the password reset code.",
      });
      setUserEmail(variables.email);
      setMode("reset-password");
    },
    onError: (error: Error) => {
      toast({
        title: "Request failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { email: string; code: string; newPassword: string }) => {
      const response = await apiRequest("POST", "/api/auth/reset-password", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Reset failed");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password reset successful!",
        description: "You can now sign in with your new password.",
      });
      setMode("login");
    },
    onError: (error: Error) => {
      toast({
        title: "Reset failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: any) => {
    if (mode === "signup") {
      registerMutation.mutate({ name: data.name, email: data.email, password: data.password });
    } else if (mode === "login") {
      loginMutation.mutate({ email: data.email, password: data.password });
    } else if (mode === "verify-email") {
      verifyEmailMutation.mutate({ email: userEmail || data.email, code: data.verificationCode });
    } else if (mode === "forgot-password") {
      forgotPasswordMutation.mutate({ email: data.email });
    } else if (mode === "reset-password") {
      resetPasswordMutation.mutate({ 
        email: userEmail || data.email, 
        code: data.verificationCode, 
        newPassword: data.password 
      });
    }
  };

  const isLoading = registerMutation.isPending || loginMutation.isPending || 
                    verifyEmailMutation.isPending || forgotPasswordMutation.isPending ||
                    resetPasswordMutation.isPending;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <AuthForm
        mode={mode}
        onSubmit={handleSubmit}
        onModeChange={setMode}
        isLoading={isLoading}
        savedEmail={userEmail}
      />
    </div>
  );
}
