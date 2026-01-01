'use client';

import { useIncidentStore } from '@/stores/incidentStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { LIMITS } from '@/types';

export function Step3RootCause() {
    const { wizardData, updateWizardData, nextStep, prevStep } = useIncidentStore();

    const rootCauseLength = (wizardData.root_cause || '').length;
    const resolutionLength = (wizardData.resolution || '').length;
    const isValid = wizardData.root_cause && wizardData.resolution;

    return (
        <Card className="border-gray-200 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Root Cause & Resolution</CardTitle>
                <CardDescription>
                    Explain what caused the incident and how it was resolved.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Root Cause */}
                <div className="space-y-2">
                    <Label htmlFor="root_cause" className="text-base">
                        Root Cause <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="root_cause"
                        value={wizardData.root_cause || ''}
                        onChange={(e) => {
                            if (e.target.value.length <= LIMITS.MAX_TEXT_LENGTH) {
                                updateWizardData({ root_cause: e.target.value });
                            }
                        }}
                        placeholder="Describe the root cause of the incident. What specifically caused the problem? (e.g., A deployment introduced inefficient database queries that caused connection pool exhaustion under peak load.)"
                        className="min-h-[150px] resize-none"
                    />
                    <div className="flex justify-between text-sm">
                        <p className="text-gray-500">
                            Be specific about technical causes, not just symptoms.
                        </p>
                        <span className={rootCauseLength > LIMITS.MAX_TEXT_LENGTH * 0.9 ? 'text-amber-600' : 'text-gray-400'}>
                            {rootCauseLength}/{LIMITS.MAX_TEXT_LENGTH}
                        </span>
                    </div>
                </div>

                {/* Resolution */}
                <div className="space-y-2">
                    <Label htmlFor="resolution" className="text-base">
                        Resolution <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="resolution"
                        value={wizardData.resolution || ''}
                        onChange={(e) => {
                            if (e.target.value.length <= LIMITS.MAX_TEXT_LENGTH) {
                                updateWizardData({ resolution: e.target.value });
                            }
                        }}
                        placeholder="Describe what was done to fix the issue. What steps were taken to resolve it? (e.g., Increased connection pool limits from 100 to 200, deployed query optimizations, added database indexes.)"
                        className="min-h-[150px] resize-none"
                    />
                    <div className="flex justify-between text-sm">
                        <p className="text-gray-500">
                            List the immediate actions taken to restore service.
                        </p>
                        <span className={resolutionLength > LIMITS.MAX_TEXT_LENGTH * 0.9 ? 'text-amber-600' : 'text-gray-400'}>
                            {resolutionLength}/{LIMITS.MAX_TEXT_LENGTH}
                        </span>
                    </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Writing tips</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Focus on facts, not blame</li>
                        <li>• Be specific about what failed and why</li>
                        <li>• Include any contributing factors</li>
                    </ul>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={prevStep}>
                        <ArrowLeft className="mr-2 w-4 h-4" />
                        Back
                    </Button>
                    <Button
                        onClick={nextStep}
                        disabled={!isValid}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                        Next: Impact
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
