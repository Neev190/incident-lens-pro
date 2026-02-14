import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Plus, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleInvestigate = () => {
    if (query.trim() || files.length > 0) {
      navigate("/processing");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      if (!query) setQuery(Array.from(e.target.files).map(f => f.name).join(", "));
    }
  };

  return (
    <div className="gradient-hero min-h-screen flex flex-col items-center justify-center px-4 relative">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] animate-pulse-glow pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl animate-fade-in">
        <div className="flex items-center gap-3 mb-12">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
            IncidentLens
          </h1>
        </div>

        {/* Search bar */}
        <div className="w-full group">
          <div className="relative flex items-center w-full rounded-full border border-border bg-secondary/50 transition-all duration-300 group-hover:border-primary/40 group-hover:glow-primary focus-within:border-primary/50 focus-within:glow-primary">
            <input type="file" ref={fileRef} multiple className="hidden" onChange={handleFileChange} />

            <button
              onClick={() => fileRef.current?.click()}
              className="flex-shrink-0 ml-2 p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Attach files"
            >
              <Plus className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvestigate()}
              placeholder="Upload your issue"
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground py-4 px-2 text-base"
            />

            <button
              onClick={handleInvestigate}
              className="flex-shrink-0 mr-2 p-2.5 rounded-full gradient-accent text-primary-foreground hover:opacity-90 transition-opacity"
              aria-label="Investigate"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
