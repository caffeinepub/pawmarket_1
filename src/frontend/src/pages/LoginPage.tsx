import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, PawPrint } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export function LoginPage() {
  const { login, isLoggingIn, identity, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      void navigate({ to: "/dashboard/parent" });
    }
  }, [identity, navigate]);

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      data-ocid="login.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl shadow-card p-8 w-full max-w-md text-center"
        data-ocid="login.modal"
      >
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
          <PawPrint className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Welcome back
        </h1>
        <p className="text-muted-foreground mb-8">
          Sign in to manage your pets, bookings, and service listings.
        </p>

        {isInitializing ? (
          <div className="flex justify-center" data-ocid="login.loading_state">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Button
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
            data-ocid="login.submit_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Connecting...
              </>
            ) : (
              "Login with Internet Identity"
            )}
          </Button>
        )}

        <p className="mt-6 text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-primary font-medium hover:underline"
          >
            Register here
          </a>
        </p>
      </motion.div>
    </main>
  );
}
