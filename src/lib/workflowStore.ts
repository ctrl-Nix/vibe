import { WorkflowPayload } from "@/types";

export function setWorkflowPayload(payload: WorkflowPayload): void {
  localStorage.setItem("vibe_workflow", JSON.stringify(payload));
}

export function getWorkflowPayload(): WorkflowPayload | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem("vibe_workflow");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WorkflowPayload;
  } catch {
    return null;
  }
}

export function clearWorkflowPayload(): void {
  localStorage.removeItem("vibe_workflow");
}

// Payload older than 10 minutes is stale — ignore it
export function isPayloadFresh(payload: WorkflowPayload): boolean {
  return Date.now() - payload.timestamp < 10 * 60 * 1000;
}
