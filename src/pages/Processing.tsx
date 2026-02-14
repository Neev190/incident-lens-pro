import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, CheckCircle2, Loader2 } from "lucide-react";

const STEPS = [
  { label: "Parsing logs", duration: 1500 },
  { label: "Retrieving runbook context", duration: 2000 },
  { label: "Analyzing metrics", duration: 2500 },
  { label: "Ranking hypotheses", duration: 2000 },
  { label: "Generating remediation plan", duration: 1800 },
];

const Processing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= STEPS.length) {
      const timeout = setTimeout(() => navigate("/results"), 800);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, STEPS[currentStep].duration);

    return () => clearTimeout(timeout);
  }, [currentStep, navigate]);

  return (
    <div className="gradient-hero min-h-screen flex flex-col items-center justify-center px-4">
      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        {/* Animated glow ring */}
        <div className="relative mb-10">
          <div className="w-20 h-20 rounded-full border-2 border-primary/30 flex items-center justify-center animate-pulse-glow">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute inset-0 w-20 h-20 rounded-full bg-primary/10 blur-xl animate-pulse-glow" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2 animate-fade-in">
          Investigating Incident…
        </h1>
        <p className="text-muted-foreground text-sm mb-10 animate-fade-in">
          IncidentLens is analyzing your data
        </p>

        {/* Steps */}
        <div className="w-full space-y-4">
          {STEPS.map((step, index) => {
            const isComplete = index < currentStep;
            const isActive = index === currentStep;

            return (
              <div
                key={index}
                className={`card-elevated px-5 py-4 flex items-center gap-4 transition-all duration-500 ${
                  isActive ? "border-primary/50 glow-primary" : ""
                } ${index <= currentStep ? "opacity-100" : "opacity-30"}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-border flex-shrink-0" />
                )}
                <span className={`text-sm font-medium ${isComplete ? "text-success" : isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Processing;
