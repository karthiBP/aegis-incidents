import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
    WizardFormData,
    TimelineEntry,
    Incident,
    GenerationState,
    IncidentType,
    Severity
} from '@/types';
import { generateId, LIMITS } from '@/types';

// Draft type for saving incomplete incidents
export interface Draft {
    id: string;
    title: string;
    wizardData: Partial<WizardFormData>;
    currentStep: number;
    createdAt: string;
    updatedAt: string;
}

interface IncidentStore {
    // Wizard state
    currentStep: number;
    wizardData: Partial<WizardFormData>;

    // Generation state
    generationState: GenerationState;
    generationError: string | null;
    lastGenerationTime: number | null;

    // Current incident being viewed/edited
    currentIncident: Incident | null;

    // Incidents list
    incidents: Incident[];

    // Drafts list
    drafts: Draft[];

    // Actions - Wizard
    setCurrentStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateWizardData: (data: Partial<WizardFormData>) => void;
    resetWizard: () => void;

    // Actions - Timeline
    addTimelineEntry: (entry: Omit<TimelineEntry, 'id'>) => void;
    updateTimelineEntry: (id: string, updates: Partial<TimelineEntry>) => void;
    removeTimelineEntry: (id: string) => void;
    reorderTimeline: (fromIndex: number, toIndex: number) => void;

    // Actions - Generation
    setGenerationState: (state: GenerationState) => void;
    setGenerationError: (error: string | null) => void;
    canRegenerate: () => boolean;
    markGenerated: () => void;

    // Actions - Incidents
    setCurrentIncident: (incident: Incident | null) => void;
    setIncidents: (incidents: Incident[]) => void;
    addIncident: (incident: Incident) => void;
    updateIncident: (id: string, updates: Partial<Incident>) => void;
    deleteIncident: (id: string) => void;

    // Actions - Drafts
    saveDraft: (title?: string) => string;
    loadDraft: (draftId: string) => void;
    deleteDraft: (draftId: string) => void;
    updateDraft: (draftId: string) => void;
}

const initialWizardData: Partial<WizardFormData> = {
    title: '',
    incident_type: 'OUTAGE' as IncidentType,
    severity: 'MEDIUM' as Severity,
    start_time: '',
    end_time: '',
    timeline: [],
    root_cause: '',
    resolution: '',
    impact: '',
    logs: '',
    commits: '',
    slack_messages: '',
};

export const useIncidentStore = create<IncidentStore>()(
    persist(
        (set, get) => ({
            // Initial state
            currentStep: 1,
            wizardData: { ...initialWizardData },
            generationState: 'idle',
            generationError: null,
            lastGenerationTime: null,
            currentIncident: null,
            incidents: [],
            drafts: [],

            // Wizard actions
            setCurrentStep: (step) => set({ currentStep: step }),

            nextStep: () => {
                const { currentStep } = get();
                if (currentStep < 5) {
                    set({ currentStep: currentStep + 1 });
                }
            },

            prevStep: () => {
                const { currentStep } = get();
                if (currentStep > 1) {
                    set({ currentStep: currentStep - 1 });
                }
            },

            updateWizardData: (data) => set((state) => ({
                wizardData: { ...state.wizardData, ...data }
            })),

            resetWizard: () => set({
                currentStep: 1,
                wizardData: { ...initialWizardData },
                generationState: 'idle',
                generationError: null,
            }),

            // Timeline actions
            addTimelineEntry: (entry) => {
                const { wizardData } = get();
                const timeline = wizardData.timeline || [];

                if (timeline.length >= LIMITS.MAX_TIMELINE_ENTRIES) {
                    return;
                }

                set((state) => ({
                    wizardData: {
                        ...state.wizardData,
                        timeline: [...timeline, { ...entry, id: generateId() }]
                    }
                }));
            },

            updateTimelineEntry: (id, updates) => set((state) => ({
                wizardData: {
                    ...state.wizardData,
                    timeline: (state.wizardData.timeline || []).map(entry =>
                        entry.id === id ? { ...entry, ...updates } : entry
                    )
                }
            })),

            removeTimelineEntry: (id) => set((state) => ({
                wizardData: {
                    ...state.wizardData,
                    timeline: (state.wizardData.timeline || []).filter(entry => entry.id !== id)
                }
            })),

            reorderTimeline: (fromIndex, toIndex) => set((state) => {
                const timeline = [...(state.wizardData.timeline || [])];
                const [removed] = timeline.splice(fromIndex, 1);
                timeline.splice(toIndex, 0, removed);
                return {
                    wizardData: { ...state.wizardData, timeline }
                };
            }),

            // Generation actions
            setGenerationState: (generationState) => set({ generationState }),

            setGenerationError: (generationError) => set({ generationError }),

            canRegenerate: () => {
                const { lastGenerationTime } = get();
                if (!lastGenerationTime) return true;
                return Date.now() - lastGenerationTime >= LIMITS.REGENERATION_COOLDOWN_MS;
            },

            markGenerated: () => set({ lastGenerationTime: Date.now() }),

            // Incidents actions
            setCurrentIncident: (currentIncident) => set({ currentIncident }),

            setIncidents: (incidents) => set({ incidents }),

            addIncident: (incident) => set((state) => ({
                incidents: [incident, ...state.incidents]
            })),

            updateIncident: (id, updates) => set((state) => ({
                incidents: state.incidents.map(inc =>
                    inc.id === id ? { ...inc, ...updates } : inc
                ),
                currentIncident: state.currentIncident?.id === id
                    ? { ...state.currentIncident, ...updates }
                    : state.currentIncident
            })),

            deleteIncident: (id) => set((state) => ({
                incidents: state.incidents.filter(inc => inc.id !== id),
                currentIncident: state.currentIncident?.id === id ? null : state.currentIncident
            })),

            // Draft actions
            saveDraft: (title?: string) => {
                const { wizardData, currentStep, drafts } = get();
                const draftId = generateId();
                const now = new Date().toISOString();

                const newDraft: Draft = {
                    id: draftId,
                    title: title || wizardData.title || 'Untitled Draft',
                    wizardData: { ...wizardData },
                    currentStep,
                    createdAt: now,
                    updatedAt: now,
                };

                set({ drafts: [newDraft, ...drafts] });
                return draftId;
            },

            loadDraft: (draftId: string) => {
                const { drafts } = get();
                const draft = drafts.find(d => d.id === draftId);

                if (draft) {
                    set({
                        wizardData: { ...draft.wizardData },
                        currentStep: draft.currentStep,
                        generationState: 'idle',
                        generationError: null,
                    });
                }
            },

            deleteDraft: (draftId: string) => set((state) => ({
                drafts: state.drafts.filter(d => d.id !== draftId)
            })),

            updateDraft: (draftId: string) => {
                const { wizardData, currentStep, drafts } = get();
                const now = new Date().toISOString();

                set({
                    drafts: drafts.map(d =>
                        d.id === draftId
                            ? {
                                ...d,
                                title: wizardData.title || d.title,
                                wizardData: { ...wizardData },
                                currentStep,
                                updatedAt: now,
                            }
                            : d
                    )
                });
            },
        }),
        {
            name: 'aegis-incidents-store',
            partialize: (state) => ({
                wizardData: state.wizardData,
                currentStep: state.currentStep,
                incidents: state.incidents,
                drafts: state.drafts,
            }),
        }
    )
);
