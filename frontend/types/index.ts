export type Severity = "low" | "medium" | "high";

export interface SymptomInput {
  name: string;
  severity: Severity;
}

export interface DiagnosisRequest {
  patient: {
    name: string;
    age?: number;
    gender?: string;
  };
  symptoms: SymptomInput[];
}

export interface PredictionResult {
  disease: string;
  probability: number;
  rule_score: number;
  ml_score: number;
  matched_symptoms: string[];
  recommendation: string;
  explanation: string;
}

export interface DiagnosisResponse {
  top_prediction: PredictionResult;
  alternatives: PredictionResult[];
  red_flags: string[];
  session_id: number;
}

export interface HistoryRecord {
  id: number;
  patient_name: string;
  predicted_disease: string;
  probability: number;
  created_at: string;
}

// ── Auth ─────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ── Email report ─────────────────────────────────────────────

export interface EmailReportRequest {
  patient: {
    name: string;
    age?: number;
    gender?: string;
  };
  symptoms: SymptomInput[];
  recipient_email: string;
}
