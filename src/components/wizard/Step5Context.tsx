'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIncidentStore } from '@/stores/incidentStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Sparkles, Loader2, AlertCircle, CheckCircle2, Save } from 'lucide-react';
import { LIMITS, generateId } from '@/types';
import type { Incident } from '@/types';
import { toast } from 'sonner';

export function Step5Context() {
    const router = useRouter();
    const {
        wizardData,
        updateWizardData,
        prevStep,
        generationState,
        setGenerationState,
        canRegenerate,
        markGenerated,
        resetWizard,
        addIncident,
        saveDraft,
    } = useIncidentStore();

    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!canRegenerate()) {
            setError('Please wait before regenerating. A 30-second cooldown is in effect.');
            return;
        }

        setGenerationState('loading');
        setError(null);

        try {
            // Call the generation API
            const response = await fetch('/api/incidents/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(wizardData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate postmortem');
            }

            // Mark generation time for rate limiting
            markGenerated();
            setGenerationState('success');

            // Create the incident object
            const newIncident: Incident = {
                id: generateId(),
                organization_id: '', // Will be filled by backend
                title: wizardData.title || 'Untitled Incident',
                incident_type: wizardData.incident_type || 'OTHER',
                severity: wizardData.severity || 'MEDIUM',
                start_time: wizardData.start_time || new Date().toISOString(),
                end_time: wizardData.end_time || null,
                timeline: wizardData.timeline || [],
                root_cause: wizardData.root_cause || '',
                impact: wizardData.impact || '',
                resolution: wizardData.resolution || '',
                action_items: result.data?.actionItems || [],
                report_markdown: result.data?.reportMarkdown || '',
                status: 'GENERATED',
                finalized_at: null,
                shared_count: 0,
                created_at: new Date().toISOString(),
            };

            // Add to store
            addIncident(newIncident);

            // Reset wizard
            resetWizard();

            // Navigate to the new incident
            router.push(`/dashboard/incidents/${newIncident.id}`);

        } catch (err: unknown) {
            setGenerationState('error');
            const error = err as { message?: string };
            setError(error.message || 'Failed to generate postmortem. Please try again.');
        }
    };

    const handleSaveDraft = () => {
        saveDraft(wizardData.title || 'Untitled Draft');
        toast.success('Draft saved! You can continue later from the sidebar.');
        resetWizard();
        router.push('/dashboard');
    };

    const logsLength = (wizardData.logs || '').length;
    const commitsLength = (wizardData.commits || '').length;
    const slackLength = (wizardData.slack_messages || '').length;

    return (
        <Card className="border-gray-200 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Additional Context (Optional)</CardTitle>
                <CardDescription>
                    Optionally paste any supporting context. These fields are not required but can help AI generate better insights.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Logs */}
                <div className="space-y-2">
                    <Label htmlFor="logs" className="text-base">
                        Relevant Logs <span className="text-gray-400">(optional)</span>
                    </Label>
                    <Textarea
                        id="logs"
                        value={wizardData.logs || ''}
                        onChange={(e) => {
                            if (e.target.value.length <= LIMITS.MAX_TEXT_LENGTH) {
                                updateWizardData({ logs: e.target.value });
                            }
                        }}
                        placeholder="Paste any relevant log entries..."
                        className="min-h-[100px] resize-none font-mono text-sm"
                    />
                    <div className="flex justify-end text-sm">
                        <span className={logsLength > LIMITS.MAX_TEXT_LENGTH * 0.9 ? 'text-amber-600' : 'text-gray-400'}>
                            {logsLength}/{LIMITS.MAX_TEXT_LENGTH}
                        </span>
                    </div>
                </div>

                {/* Commits */}
                <div className="space-y-2">
                    <Label htmlFor="commits" className="text-base">
                        Related Commits <span className="text-gray-400">(optional)</span>
                    </Label>
                    <Textarea
                        id="commits"
                        value={wizardData.commits || ''}
                        onChange={(e) => {
                            if (e.target.value.length <= LIMITS.MAX_TEXT_LENGTH) {
                                updateWizardData({ commits: e.target.value });
                            }
                        }}
                        placeholder="Paste relevant commit messages or PR descriptions..."
                        className="min-h-[100px] resize-none font-mono text-sm"
                    />
                    <div className="flex justify-end text-sm">
                        <span className={commitsLength > LIMITS.MAX_TEXT_LENGTH * 0.9 ? 'text-amber-600' : 'text-gray-400'}>
                            {commitsLength}/{LIMITS.MAX_TEXT_LENGTH}
                        </span>
                    </div>
                </div>

                {/* Slack messages */}
                <div className="space-y-2">
                    <Label htmlFor="slack" className="text-base">
                        Slack/Communication <span className="text-gray-400">(optional)</span>
                    </Label>
                    <Textarea
                        id="slack"
                        value={wizardData.slack_messages || ''}
                        onChange={(e) => {
                            if (e.target.value.length <= LIMITS.MAX_TEXT_LENGTH) {
                                updateWizardData({ slack_messages: e.target.value });
                            }
                        }}
                        placeholder="Paste relevant Slack messages or communication..."
                        className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end text-sm">
                        <span className={slackLength > LIMITS.MAX_TEXT_LENGTH * 0.9 ? 'text-amber-600' : 'text-gray-400'}>
                            {slackLength}/{LIMITS.MAX_TEXT_LENGTH}
                        </span>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                        <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Success message */}
                {generationState === 'success' && (
                    <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
                        <CheckCircle2 className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>Postmortem generated successfully! Redirecting...</span>
                    </div>
                )}

                {/* Generation preview */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                        <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">Ready to Generate</h3>
                    </div>
                    <p className="text-gray-700 mb-4">
                        Click the button below to generate your professional incident postmortem.
                        The AI will create executive summary, timeline analysis, root cause explanation,
                        impact assessment, and specific action items.
                    </p>
                    <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                            Executive-ready format
                        </div>
                        <div className="flex items-center">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                            Blame-free, professional tone
                        </div>
                        <div className="flex items-center">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                            Actionable improvement items
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={prevStep} disabled={generationState === 'loading'}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                    </Button>
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={handleSaveDraft}
                            disabled={generationState === 'loading'}
                            className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"
                        >
                            <Save className="mr-2 w-4 h-4" />
                            Save as Draft
                        </Button>
                        <Button
                            onClick={handleGenerate}
                            disabled={generationState === 'loading'}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 shadow-lg shadow-blue-500/25"
                        >
                            {generationState === 'loading' ? (
                                <>
                                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 w-4 h-4" />
                                    Generate Postmortem
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
