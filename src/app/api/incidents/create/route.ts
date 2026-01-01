import { NextRequest, NextResponse } from 'next/server';
import type { WizardFormData } from '@/types';
import { LIMITS } from '@/types';

// Validation helper
function validateIncidentData(data: Partial<WizardFormData>): { valid: boolean; error?: string } {
    // Required fields
    if (!data.title || data.title.length === 0) {
        return { valid: false, error: 'Title is required' };
    }
    if (data.title.length > LIMITS.MAX_TITLE_LENGTH) {
        return { valid: false, error: `Title must be less than ${LIMITS.MAX_TITLE_LENGTH} characters` };
    }

    if (!data.incident_type) {
        return { valid: false, error: 'Incident type is required' };
    }

    if (!data.severity) {
        return { valid: false, error: 'Severity is required' };
    }

    if (!data.start_time) {
        return { valid: false, error: 'Start time is required' };
    }

    // Timeline validation
    if (!data.timeline || data.timeline.length === 0) {
        return { valid: false, error: 'At least one timeline entry is required' };
    }
    if (data.timeline.length > LIMITS.MAX_TIMELINE_ENTRIES) {
        return { valid: false, error: `Maximum ${LIMITS.MAX_TIMELINE_ENTRIES} timeline entries allowed` };
    }

    // Text length validations
    if (data.root_cause && data.root_cause.length > LIMITS.MAX_TEXT_LENGTH) {
        return { valid: false, error: `Root cause must be less than ${LIMITS.MAX_TEXT_LENGTH} characters` };
    }
    if (data.resolution && data.resolution.length > LIMITS.MAX_TEXT_LENGTH) {
        return { valid: false, error: `Resolution must be less than ${LIMITS.MAX_TEXT_LENGTH} characters` };
    }
    if (data.impact && data.impact.length > LIMITS.MAX_TEXT_LENGTH) {
        return { valid: false, error: `Impact must be less than ${LIMITS.MAX_TEXT_LENGTH} characters` };
    }

    return { valid: true };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const validation = validateIncidentData(body);
        if (!validation.valid) {
            return NextResponse.json(
                { success: false, error: validation.error },
                { status: 400 }
            );
        }

        // TODO: Get user session and organization
        // const supabase = await createClient();
        // const { data: { user } } = await supabase.auth.getUser();

        // For now, create a mock incident
        const incident = {
            id: crypto.randomUUID(),
            organization_id: 'mock-org-id',
            title: body.title,
            incident_type: body.incident_type,
            severity: body.severity,
            start_time: body.start_time,
            end_time: body.end_time || null,
            timeline: body.timeline || [],
            root_cause: body.root_cause || '',
            impact: body.impact || '',
            resolution: body.resolution || '',
            action_items: [],
            report_markdown: '',
            status: 'DRAFT',
            finalized_at: null,
            shared_count: 0,
            created_at: new Date().toISOString(),
        };

        // TODO: Save to Supabase
        // const { data, error } = await supabase
        //   .from('incidents')
        //   .insert(incident)
        //   .select()
        //   .single();

        return NextResponse.json({
            success: true,
            data: incident,
        });

    } catch (error) {
        console.error('Error creating incident:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create incident' },
            { status: 500 }
        );
    }
}
