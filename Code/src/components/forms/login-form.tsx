
"use client";

import { useReducer, useEffect } from "react";
import { useAuth, initiateEmailSignIn } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Image from "next/image";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type FormState = {
  message: string;
  status: "idle" | "submitting" | "success" | "error";
  errors?: Record<string, string[] | undefined> | null;
};

const initialState: FormState = {
  message: "",
  status: "idle",
  errors: null,
};

function formReducer(state: FormState, action: Partial<FormState>): FormState {
  return { ...state, ...action };
}

function SubmitButton({ status }: { status: FormState['status'] }) {
  return (
    <Button type="submit" className="w-full" disabled={status === 'submitting'}>
      {status === 'submitting' ? "Signing in..." : "Sign In"}
    </Button>
  );
}

export function LoginForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (formData: FormData) => {
    dispatch({ status: "submitting", errors: null });

    const validatedFields = loginFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      dispatch({
        message: "Invalid form data. Please try again.",
        status: "error",
        errors: fieldErrors,
      });
      return;
    }
    
    initiateEmailSignIn(auth, validatedFields.data.email, validatedFields.data.password)
        .then(() => {
            dispatch({
                message: 'Login successful!',
                status: 'success',
            });
        })
        .catch((error) => {
            let errorMessage = "An unknown error occurred.";
            switch (error.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                case "auth/invalid-credential":
                    errorMessage = "Invalid email or password.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Please enter a valid email address.";
                    break;
                default:
                    errorMessage = "Failed to sign in. Please try again later.";
                    break;
            }
             dispatch({
                message: errorMessage,
                status: 'error',
            });
        });
  };

  useEffect(() => {
    if (state.status === "success") {
      toast({
        title: "Login Successful",
        description: "Redirecting you to the dashboard...",
      });
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    }
    if (state.status === "error" && state.message && !state.errors) {
         toast({
            title: "Login Failed",
            description: state.message,
            variant: "destructive",
        });
    }
  }, [state.status, state.message, state.errors, router, toast]);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 text-center p-8 transition-opacity duration-500 animate-fade-in">
        <div className="relative flex items-center justify-center h-20 w-20">
          <div className="absolute h-full w-full bg-primary/20 rounded-full animate-ping delay-500"></div>
          <div className="relative bg-background rounded-full p-4 shadow-inner flex items-center justify-center">
            <Image
              src="https://digitiful.net/wp-content/uploads/elementor/thumbs/DG-05-1-r9tunke78cyiykbizacfpfcdwqz7outsg8xjrtvb4a.png"
              alt="Digitiful Logo"
              width={36}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </div>
        </div>
        <p className="text-muted-foreground animate-pulse">Authenticating...</p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
         {state.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
         {state.errors?.password && (
            <p className="text-xs text-destructive">{state.errors.password[0]}</p>
        )}
      </div>
       {state.status === 'error' && state.message && !state.errors && (
        <div className="flex items-center gap-2 text-sm text-destructive p-3 bg-destructive/10 rounded-md border border-destructive/20">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{state.message}</p>
        </div>
      )}
      <SubmitButton status={state.status} />
    </form>
  );
}
