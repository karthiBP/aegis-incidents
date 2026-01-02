'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIncidentStore } from '@/stores/incidentStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { ArrowLeft, Sparkles, Loader2, AlertCircle, CheckCircle2, Save, RefreshCw, Check, Eye } from 'lucide-react';
import { LIMITS, generateId } from '@/types';
import type { Incident, ActionItem } from '@/types';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface GeneratedData {
    reportMarkdown: string;
    actionItems: ActionItem[];
}

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
    const [showPreview, setShowPreview] = useState(false);
    const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const handleGenerate = async (isRegenerate = false) => {
        if (!canRegenerate() && !isRegenerate) {
            setError('Please wait before regenerating. A 30-second cooldown is in effect.');
            return;
        }

        if (isRegenerate) {
            setIsRegenerating(true);
        } else {
            setGenerationState('loading');
        }
        setError(null);

        try {
            // Call the generation API
            const response = await fetch('/api/incidents/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...wizardData,
                    // Add regeneration hint to get different output
                    regenerate: isRegenerate,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to generate postmortem');
            }

            // Mark generation time for rate limiting
            markGenerated();
            setGenerationState('success');

            // Store the generated data for preview
            setGeneratedData({
                reportMarkdown: result.data?.reportMarkdown || '',
                actionItems: result.data?.actionItems || [],
            });

            // Show the preview modal
            setShowPreview(true);

        } catch (err: unknown) {
            setGenerationState('error');
            const error = err as { message?: string };
            setError(error.message || 'Failed to generate postmortem. Please try again.');
        } finally {
            setIsRegenerating(false);
        }
    };

    const handleConfirmSave = () => {
        if (!generatedData) return;

        // Create the incident object
        const newIncident: Incident = {
            id: generateId(),
            organization_id: '',
            title: wizardData.title || 'Untitled Incident',
            incident_type: wizardData.incident_type || 'OTHER',
            severity: wizardData.severity || 'MEDIUM',
            start_time: wizardData.start_time || new Date().toISOString(),
            end_time: wizardData.end_time || null,
            timeline: wizardData.timeline || [],
            root_cause: wizardData.root_cause || '',
            impact: wizardData.impact || '',
            resolution: wizardData.resolution || '',
            action_items: generatedData.actionItems,
            report_markdown: generatedData.reportMarkdown,
            status: 'GENERATED',
            finalized_at: null,
            shared_count: 0,
            created_at: new Date().toISOString(),
        };

        // Add to store
        addIncident(newIncident);

        // Reset wizard
        resetWizard();

        // Close modal
        setShowPreview(false);

        toast.success('Incident report saved successfully!');

        // Navigate to the new incident
        router.push(`/dashboard/incidents/${newIncident.id}`);
    };

    const handleRegenerate = () => {
        handleGenerate(true);
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
        <>
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

                    {/* Generation preview card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                            <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">Ready to Generate</h3>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Click the button below to generate your professional incident postmortem.
                            You&apos;ll see a preview before saving, with the option to regenerate if needed.
                        </p>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex items-center">
                                <Eye className="w-4 h-4 text-blue-500 mr-2" />
                                Preview before saving
                            </div>
                            <div className="flex items-center">
                                <RefreshCw className="w-4 h-4 text-blue-500 mr-2" />
                                Option to regenerate
                            </div>
                            <div className="flex items-center">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                                Blame-free, professional tone
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
                                onClick={() => handleGenerate(false)}
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

            {/* Preview Modal */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-xl">
                            <Eye className="w-5 h-5 mr-2 text-blue-600" />
                            Report Preview
                        </DialogTitle>
                        <DialogDescription>
                            Review your generated postmortem report. Click &quot;Save&quot; to confirm or &quot;Regenerate&quot; for a different version.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                        <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg p-6 prose prose-sm dark:prose-invert max-w-none">
                            {/* Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                                <span className="text-5xl font-bold text-blue-500/10 dark:text-blue-400/10 whitespace-nowrap transform rotate-[-30deg] select-none">
                                    AEGIS INCIDENTS
                                </span>
                            </div>

                            {generatedData?.reportMarkdown ? (
                                <ReactMarkdown>{generatedData.reportMarkdown}</ReactMarkdown>
                            ) : (
                                <p className="text-gray-500">No report content available.</p>
                            )}
                        </div>

                        {/* Action Items Preview */}
                        {generatedData?.actionItems && generatedData.actionItems.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Action Items:</h4>
                                <ul className="space-y-2">
                                    {generatedData.actionItems.map((item, idx) => (
                                        <li key={idx} className="flex items-start space-x-2 text-sm">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.priority === 'P0' ? 'bg-red-100 text-red-700' :
                                                item.priority === 'P1' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {item.priority}
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300">{item.action}</span>
                                            {item.owner && (
                                                <span className="text-gray-500">({item.owner})</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={handleRegenerate}
                            disabled={isRegenerating}
                            className="flex-1 sm:flex-none"
                        >
                            {isRegenerating ? (
                                <>
                                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                    Regenerating...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="mr-2 w-4 h-4" />
                                    Regenerate
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={handleConfirmSave}
                            disabled={isRegenerating}
                            className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                            <Check className="mr-2 w-4 h-4" />
                            Save Report
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
