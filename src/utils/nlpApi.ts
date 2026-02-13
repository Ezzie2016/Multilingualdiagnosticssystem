import type { DiagnosticResult, Language } from '../App';

interface AnalyzeApiResponse extends Omit<DiagnosticResult, 'timestamp'> {
  timestamp: string | number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function analyzeSymptomsViaApi(symptoms: string, language: Language): Promise<DiagnosticResult> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ symptoms, language })
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as AnalyzeApiResponse;

  return {
    ...payload,
    timestamp: new Date(payload.timestamp)
  };
}
