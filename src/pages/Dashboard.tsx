import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Upload, FileText, Image, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const MOCK_INCIDENTS = [
  { id: 1, title: "API Gateway Timeout", status: "resolved", date: "2026-02-13" },
  { id: 2, title: "Database Connection Pool Exhaustion", status: "investigating", date: "2026-02-14" },
  { id: 3, title: "Memory Leak in Auth Service", status: "resolved", date: "2026-02-10" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleInvestigate = () => {
    navigate("/processing");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold text-foreground">IncidentLens</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/")}>
          Sign Out
        </Button>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Welcome */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to IncidentLens</h1>
          <p className="text-muted-foreground">Upload incident data to begin investigation.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Area */}
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div
              className={`card-elevated p-10 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer ${
                isDragging ? "border-primary glow-primary" : ""
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                multiple
                accept=".txt,.pdf,.png,.jpg,.jpeg,.log,.csv"
                className="hidden"
                onChange={handleFileInput}
              />
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Drag & drop files here
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse
              </p>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Logs (.txt)</span>
                <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Runbooks (.pdf)</span>
                <span className="flex items-center gap-1"><Image className="w-3 h-3" /> Screenshots (.png/.jpg)</span>
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="card-elevated px-4 py-3 flex items-center gap-3">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)}KB</span>
                  </div>
                ))}
              </div>
            )}

            <Button
              className="mt-6 w-full gradient-accent text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              size="lg"
              disabled={files.length === 0}
              onClick={handleInvestigate}
            >
              Investigate Incident
            </Button>
          </div>

          {/* Recent Incidents */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Recent Incidents
            </h2>
            <div className="space-y-3">
              {MOCK_INCIDENTS.map((inc) => (
                <div key={inc.id} className="card-elevated p-4">
                  <h3 className="text-sm font-medium text-foreground mb-2">{inc.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-xs">
                      {inc.status === "resolved" ? (
                        <><CheckCircle2 className="w-3 h-3 text-success" /><span className="text-success">Resolved</span></>
                      ) : (
                        <><AlertCircle className="w-3 h-3 text-warning" /><span className="text-warning">Investigating</span></>
                      )}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />{inc.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
