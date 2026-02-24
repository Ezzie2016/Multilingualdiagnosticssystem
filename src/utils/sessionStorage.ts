import { supabase } from "../lib/supabase";
import type { DiagnosticResult } from "../App";

export async function saveSession(result: DiagnosticResult, userId: string) {
  const { error } = await supabase.from("diagnostic_sessions").upsert({
    id: result.id,
    user_id: userId,
    language: result.language,
    symptoms: result.symptoms,
    entities: result.entities,
    diagnoses: result.diagnoses,
    patient_profile: result.patientProfile ?? null,
    clinician_review: result.clinicianReview ?? null,
    audit_trail: result.auditTrail ?? [],
  });
  if (error) console.error("Failed to save session:", error.message);
}

export async function loadSessions(): Promise<DiagnosticResult[]> {
  const { data, error } = await supabase
    .from("diagnostic_sessions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load sessions:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    timestamp: new Date(row.created_at),
    language: row.language,
    symptoms: row.symptoms,
    entities: row.entities,
    diagnoses: row.diagnoses,
    patientProfile: row.patient_profile,
    clinicianReview: row.clinician_review,
    auditTrail: (row.audit_trail ?? []).map((e: any) => ({
      ...e,
      timestamp: new Date(e.timestamp),
    })),
  }));
}

export async function deleteSession(id: string) {
  const { error } = await supabase
    .from("diagnostic_sessions")
    .delete()
    .eq("id", id);
  if (error) console.error("Failed to delete session:", error.message);
}
