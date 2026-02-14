import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="gradient-hero min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 animate-fade-in">
        <div className="flex items-center gap-3 animate-float">
          <Shield className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground glow-text">
          IncidentLens
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-md text-center">
          AI-Powered Incident Investigation Engine
        </p>

        <div className="flex gap-4 mt-4">
          <Button
            size="lg"
            className="gradient-accent text-primary-foreground font-semibold px-8 hover:opacity-90 transition-opacity"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border text-foreground hover:bg-secondary px-8"
            onClick={() => navigate("/login")}
          >
            Sign In
          </Button>
        </div>
      </div>

      {/* Bottom subtle line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  );
};

export default Landing;
