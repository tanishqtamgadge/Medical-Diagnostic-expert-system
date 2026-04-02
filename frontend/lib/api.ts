import type {
  DiagnosisRequest,
  DiagnosisResponse,
  EmailReportRequest,
  HistoryRecord,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

// ── Helpers ──────────────────────────────────────────────────

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Auth ─────────────────────────────────────────────────────

export async function register(payload: RegisterRequest): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Registration failed.");
  }
  return res.json();
}

export async function login(payload: LoginRequest): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Login failed.");
  }
  return res.json();
}

export async function fetchMe(): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error("Not authenticated.");
  return res.json();
}

// ── Diagnosis ────────────────────────────────────────────────

export async function createDiagnosis(payload: DiagnosisRequest): Promise<DiagnosisResponse> {
  const res = await fetch(`${API_BASE}/diagnosis`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create diagnosis.");
  return res.json();
}

export async function fetchHistory(): Promise<HistoryRecord[]> {
  const res = await fetch(`${API_BASE}/history`, {
    cache: "no-store",
    headers: { ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error("Failed to load diagnosis history.");
  return res.json();
}

export async function downloadReport(payload: DiagnosisRequest): Promise<Blob> {
  const res = await fetch(`${API_BASE}/diagnosis/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to download report.");
  return res.blob();
}

// ── Email report ─────────────────────────────────────────────

export async function emailReport(payload: EmailReportRequest): Promise<void> {
  const res = await fetch(`${API_BASE}/diagnosis/email-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? "Failed to send email report.");
  }
}
