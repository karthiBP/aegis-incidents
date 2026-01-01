// Types for AEGIS INCIDENTS

export type Plan = 'FREE' | 'PAY_PER_USE' | 'SUBSCRIPTION';
export type IncidentType = 'OUTAGE' | 'SECURITY' | 'DEPLOYMENT' | 'DATA' | 'OTHER';
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'DRAFT' | 'GENERATED' | 'FINAL';
export type GenerationState = 'idle' | 'loading' | 'success' | 'partial' | 'error' | 'timeout';

export interface Organization {
    id: string;
    user_id: string;
    name: string;
    plan: Plan;
    created_at: string;
}

export interface TimelineEntry {
    id: string;
    timestamp: string;
    description: string;
}

export interface ActionItem {
    id: string;
    action: string;
    owner: string;
    priority: 'P0' | 'P1' | 'P2';
    completed: boolean;
}

export interface Incident {
    id: string;
    organization_id: string;
    title: string;
    incident_type: IncidentType;
    severity: Severity;
    start_time: string;
    end_time: string | null;
    timeline: TimelineEntry[];
    root_cause: string;
    impact: string;
    resolution: string;
    action_items: ActionItem[];
    report_markdown: string;
    status: IncidentStatus;
    finalized_at: string | null;
    shared_count: number;
    created_at: string;
    // Optional context fields
    logs?: string;
    commits?: string;
    slack_messages?: string;
}

// Wizard step data types
export interface WizardStep1Data {
    title: string;
    incident_type: IncidentType;
    severity: Severity;
    start_time: string;
    end_time: string;
}

export interface WizardStep2Data {
    timeline: TimelineEntry[];
}

export interface WizardStep3Data {
    root_cause: string;
    resolution: string;
}

export interface WizardStep4Data {
    impact: string;
}

export interface WizardStep5Data {
    logs: string;
    commits: string;
    slack_messages: string;
}

export interface WizardFormData extends WizardStep1Data, WizardStep2Data, WizardStep3Data, WizardStep4Data, WizardStep5Data { }

// API response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Input validation limits
export const LIMITS = {
    MAX_TIMELINE_ENTRIES: 20,
    MAX_TEXT_LENGTH: 2000,
    MAX_TITLE_LENGTH: 200,
    REGENERATION_COOLDOWN_MS: 30000,
} as const;

// Helper function
export function generateId(): string {
    return crypto.randomUUID();
}

