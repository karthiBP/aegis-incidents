import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import type { WizardFormData, ActionItem } from '@/types';
import { LIMITS, generateId } from '@/types';

// Lazy initialization of OpenAI client (avoids build-time errors)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
    if (!process.env.OPENAI_API_KEY) {
        return null;
    }
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    return openaiClient;
}

// System prompts for AI generation
const SYSTEM_PROMPTS = {
    timeline: `You are a professional incident documentation specialist.
Enhance the following timeline entries for clarity:
- Fix grammar and punctuation
- Ensure consistent formatting
- Use past tense
- DO NOT add information that wasn't provided
- Keep entries concise but clear
Return the enhanced timeline as a JSON array of objects with 'timestamp' and 'description' keys.`,

    actionItems: `Based on this incident, generate 3-5 SPECIFIC action items.

Rules:
- Each item must start with a verb
- Each item must be concrete and actionable
- Assign an OWNER ROLE (not a person name)
- Assign priority: P0 (critical), P1 (high), P2 (medium)

Return as JSON array with objects containing: action, owner, priority
Do NOT include vague items like "Improve monitoring" or "Prevent future incidents"`,

    postmortem: `Generate a professional incident postmortem in Markdown.

Structure:
# [Incident Title]

## Executive Summary
2-3 sentences, non-technical, suitable for executives.

## Incident Overview
| Field | Value |
|-------|-------|
Brief table with type, severity, duration, detection method.

## Timeline
Formatted timeline with timestamps.

## Root Cause Analysis
Clear explanation of what caused the incident.

## Impact Assessment
Quantified impact on users, business, and services.

## Resolution
Steps taken to resolve the incident.

## Action Items
Table with Action, Owner, Priority columns.

## Lessons Learned
What went well and what could be improved.

Tone: Calm, professional, accountability-focused, zero blame language.
Focus on facts and improvements, not individuals.`
};

// Rate limiting map (in production, use Redis)
const rateLimitMap = new Map<string, number>();

function checkRateLimit(userId: string): boolean {
    const lastGeneration = rateLimitMap.get(userId);
    if (!lastGeneration) return true;
    return Date.now() - lastGeneration >= LIMITS.REGENERATION_COOLDOWN_MS;
}

function setRateLimit(userId: string): void {
    rateLimitMap.set(userId, Date.now());
}

export async function POST(request: NextRequest) {
    try {
        const body: WizardFormData = await request.json();

        // TODO: Get actual user ID from session
        const userId = 'mock-user-id';

        // Check rate limit
        if (!checkRateLimit(userId)) {
            return NextResponse.json(
                { success: false, error: 'Please wait 30 seconds before regenerating' },
                { status: 429 }
            );
        }

        // Validate input sizes
        if (body.timeline && body.timeline.length > LIMITS.MAX_TIMELINE_ENTRIES) {
            return NextResponse.json(
                { success: false, error: 'Too many timeline entries' },
                { status: 400 }
            );
        }

        // Build context for AI
        const incidentContext = {
            title: body.title,
            type: body.incident_type,
            severity: body.severity,
            startTime: body.start_time,
            endTime: body.end_time,
            timeline: body.timeline,
            rootCause: body.root_cause,
            resolution: body.resolution,
            impact: body.impact,
            logs: body.logs?.slice(0, 1000), // Truncate optional fields
            commits: body.commits?.slice(0, 1000),
            slackMessages: body.slack_messages?.slice(0, 1000),
        };

        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            // Return mock data for development
            const mockActionItems: ActionItem[] = [
                { id: generateId(), action: 'Implement connection pool usage alerting (>80% threshold)', owner: 'DevOps', priority: 'P0', completed: false },
                { id: generateId(), action: 'Add query execution time monitoring dashboard', owner: 'Platform Team', priority: 'P0', completed: false },
                { id: generateId(), action: 'Document emergency procedures in runbook', owner: 'SRE Lead', priority: 'P1', completed: false },
                { id: generateId(), action: 'Schedule quarterly capacity planning review', owner: 'Engineering Manager', priority: 'P1', completed: false },
            ];

            const mockReport = `# ${body.title}

## Executive Summary
On ${new Date(body.start_time).toLocaleDateString()}, our service experienced an incident that affected operations. The team responded quickly to identify and resolve the issue. This document outlines the timeline, root cause, and action items to prevent recurrence.

## Incident Overview
| Field | Value |
|-------|-------|
| Type | ${body.incident_type} |
| Severity | ${body.severity} |
| Start Time | ${new Date(body.start_time).toLocaleString()} |
| End Time | ${body.end_time ? new Date(body.end_time).toLocaleString() : 'N/A'} |

## Timeline
${body.timeline?.map(t => `- **${t.timestamp}** - ${t.description}`).join('\n') || 'No timeline entries provided.'}

## Root Cause Analysis
${body.root_cause || 'Root cause analysis pending.'}

## Impact Assessment
${body.impact || 'Impact assessment pending.'}

## Resolution
${body.resolution || 'Resolution details pending.'}

## Action Items
| Action | Owner | Priority |
|--------|-------|----------|
${mockActionItems.map(a => `| ${a.action} | ${a.owner} | ${a.priority} |`).join('\n')}

## Lessons Learned
### What went well
- Team responded promptly to the incident
- Clear communication during the incident

### What could be improved
- Monitoring could be enhanced to detect issues earlier
- Documentation of procedures could be improved

---
*Generated by AEGIS INCIDENTS*
`;

            setRateLimit(userId);

            return NextResponse.json({
                success: true,
                data: {
                    actionItems: mockActionItems,
                    reportMarkdown: mockReport,
                    enhanced_timeline: body.timeline,
                },
            });
        }

        // Generate with OpenAI
        const openai = getOpenAIClient();
        if (!openai) {
            return NextResponse.json(
                { success: false, error: 'OpenAI API key not configured' },
                { status: 500 }
            );
        }

        try {
            // 1. Generate action items
            const actionItemsResponse = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPTS.actionItems },
                    { role: 'user', content: JSON.stringify(incidentContext) },
                ],
                max_tokens: 1000,
                temperature: 0.7,
                response_format: { type: 'json_object' },
            });

            let actionItems: ActionItem[] = [];
            try {
                const parsed = JSON.parse(actionItemsResponse.choices[0].message.content || '{}');
                actionItems = (parsed.items || parsed.action_items || []).map((item: { action: string; owner: string; priority: string }) => ({
                    id: generateId(),
                    action: item.action,
                    owner: item.owner,
                    priority: item.priority as 'P0' | 'P1' | 'P2',
                    completed: false,
                }));
            } catch (e) {
                console.error('Failed to parse action items:', e);
            }

            // 2. Generate full postmortem report
            const reportResponse = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPTS.postmortem },
                    {
                        role: 'user',
                        content: `Generate a postmortem for this incident:\n${JSON.stringify(incidentContext)}\n\nAction Items:\n${JSON.stringify(actionItems)}`
                    },
                ],
                max_tokens: 4000,
                temperature: 0.7,
            });

            const reportMarkdown = reportResponse.choices[0].message.content || '';

            setRateLimit(userId);

            return NextResponse.json({
                success: true,
                data: {
                    actionItems,
                    reportMarkdown,
                    enhanced_timeline: body.timeline, // Could enhance this too
                },
            });

        } catch (aiError: unknown) {
            console.error('OpenAI API error:', aiError);

            // Check for specific error types
            const error = aiError as { status?: number; message?: string };
            if (error.status === 429) {
                return NextResponse.json(
                    { success: false, error: 'AI service is busy. Please try again in a moment.' },
                    { status: 503 }
                );
            }

            return NextResponse.json(
                { success: false, error: 'Failed to generate postmortem. Please try again.' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Error generating postmortem:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate postmortem' },
            { status: 500 }
        );
    }
}
