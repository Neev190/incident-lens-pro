import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ChevronDown, ChevronUp, Download, RotateCcw, AlertTriangle, FileText, Activity, Lightbulb, ClipboardList, BarChart3 } from "lucide-react";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Section = ({ title, icon, children, defaultOpen = false }: SectionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card-elevated overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center gap-3 hover:bg-secondary/30 transition-colors"
      >
        {icon}
        <span className="text-sm font-semibold text-foreground flex-1 text-left">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-6 pb-5 text-sm text-secondary-foreground leading-relaxed border-t border-border pt-4">{children}</div>}
    </div>
  );
};

const ConfidenceBadge = ({ value }: { value: number }) => {
  const color = value >= 80 ? "text-success" : value >= 50 ? "text-warning" : "text-destructive";
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${color} bg-secondary px-2 py-0.5 rounded-full`}>
      <BarChart3 className="w-3 h-3" />
      {value}% confidence
    </span>
  );
};

const Results = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-lg font-bold text-foreground">IncidentLens</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
            <RotateCcw className="w-4 h-4 mr-1" /> New Investigation
          </Button>
          <Button size="sm" className="gradient-accent text-primary-foreground hover:opacity-90">
            <Download className="w-4 h-4 mr-1" /> Export PDF
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Investigation Results</h1>
          <div className="flex items-center gap-3">
            <ConfidenceBadge value={87} />
            <span className="text-sm text-muted-foreground">Completed in 9.8 seconds</span>
          </div>
        </div>

        <div className="space-y-3">
          <Section title="Incident Summary" icon={<FileText className="w-4 h-4 text-primary" />} defaultOpen>
            <p>
              A cascading failure originating from the API Gateway service caused elevated latency and 5xx errors across
              multiple downstream services between 14:23 UTC and 15:07 UTC on February 14, 2026. Approximately 12% of
              requests during this window were affected.
            </p>
          </Section>

          <Section title="Observed Symptoms" icon={<Activity className="w-4 h-4 text-warning" />}>
            <ul className="list-disc list-inside space-y-1">
              <li>HTTP 502/504 errors spiking to 340 req/min on the API Gateway</li>
              <li>Connection pool saturation on the primary PostgreSQL cluster (max_connections hit)</li>
              <li>Memory utilization on auth-service pods exceeding 92%</li>
              <li>Increased p99 latency from 120ms baseline to 4,200ms</li>
            </ul>
          </Section>

          <Section title="Evidence Used" icon={<ClipboardList className="w-4 h-4 text-info" />}>
            <ul className="list-disc list-inside space-y-1">
              <li>Application logs: api-gateway-2026-02-14.txt (2,340 entries parsed)</li>
              <li>Runbook: incident-response-database.pdf (12 pages analyzed)</li>
              <li>Dashboard screenshot: grafana-overview.png (metrics extracted via OCR)</li>
            </ul>
          </Section>

          <Section title="Ranked Root Causes" icon={<AlertTriangle className="w-4 h-4 text-destructive" />}>
            <div className="space-y-4">
              {[
                { cause: "Connection pool exhaustion due to long-running queries from batch job", confidence: 87 },
                { cause: "Memory leak in auth-service causing cascading timeouts", confidence: 62 },
                { cause: "Misconfigured retry policy amplifying request volume", confidence: 41 },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs font-bold text-muted-foreground mt-0.5">#{i + 1}</span>
                  <div className="flex-1">
                    <p className="text-foreground">{item.cause}</p>
                    <ConfidenceBadge value={item.confidence} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Recommended Remediation Steps" icon={<Lightbulb className="w-4 h-4 text-success" />}>
            <ol className="list-decimal list-inside space-y-2">
              <li>Immediately terminate the long-running batch query (PID 48291) on the primary database</li>
              <li>Increase <code className="bg-muted px-1 rounded text-xs">max_connections</code> from 100 to 200 and configure PgBouncer connection pooling</li>
              <li>Restart auth-service pods to clear memory leak (rolling restart recommended)</li>
              <li>Update retry policy to implement exponential backoff with jitter (max 3 retries)</li>
              <li>Add connection pool monitoring alerts at 80% utilization threshold</li>
            </ol>
          </Section>

          <Section title="Post-Incident Report Draft" icon={<FileText className="w-4 h-4 text-muted-foreground" />}>
            <div className="space-y-3">
              <p><strong>Impact:</strong> 12% of API requests returned errors over a 44-minute window. No data loss occurred.</p>
              <p><strong>Root Cause:</strong> An unoptimized batch analytics query held open 87 database connections for 23+ minutes, exhausting the connection pool and starving the API Gateway of database access.</p>
              <p><strong>Resolution:</strong> Batch query was terminated, connection limits were increased, and auth-service pods were recycled. Full recovery confirmed at 15:07 UTC.</p>
              <p><strong>Follow-up Actions:</strong> Implement query timeout limits, add PgBouncer, create runbook for connection pool incidents, schedule batch jobs to off-peak hours.</p>
            </div>
          </Section>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            className="gradient-accent text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            onClick={() => navigate("/dashboard")}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Start New Investigation
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Results;
