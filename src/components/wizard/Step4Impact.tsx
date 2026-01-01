'use client';

import { useIncidentStore } from '@/stores/incidentStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Users, DollarSign, AlertTriangle } from 'lucide-react';
import { LIMITS } from '@/types';

export function Step4Impact() {
    const { wizardData, updateWizardData, nextStep, prevStep } = useIncidentStore();

    const impactLength = (wizardData.impact || '').length;
    const isValid = wizardData.impact && wizardData.impact.length > 10;

    return (
        <Card className="border-gray-200 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Impact Assessment</CardTitle>
                <CardDescription>
                    Describe who was affected and the business impact of this incident.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Impact prompts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <Users className="w-6 h-6 text-blue-600 mb-2" />
                        <h4 className="font-medium text-gray-900 mb-1">Users Affected</h4>
                        <p className="text-sm text-gray-600">How many users/customers were impacted?</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <AlertTriangle className="w-6 h-6 text-amber-600 mb-2" />
                        <h4 className="font-medium text-gray-900 mb-1">Service Impact</h4>
                        <p className="text-sm text-gray-600">What functionality was unavailable?</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <DollarSign className="w-6 h-6 text-green-600 mb-2" />
                        <h4 className="font-medium text-gray-900 mb-1">Business Impact</h4>
                        <p className="text-sm text-gray-600">Revenue, reputation, or other costs?</p>
                    </div>
                </div>

                {/* Impact textarea */}
                <div className="space-y-2">
                    <Label htmlFor="impact" className="text-base">
                        Impact Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="impact"
                        value={wizardData.impact || ''}
                        onChange={(e) => {
                            if (e.target.value.length <= LIMITS.MAX_TEXT_LENGTH) {
                                updateWizardData({ impact: e.target.value });
                            }
                        }}
                        placeholder={`Example:
• Approximately 2,400 unique users experienced failed API requests
• 47 minutes of degraded service affecting all API endpoints  
• Estimated revenue impact: $3,200 in failed transactions
• 23 support tickets opened during the incident window
• No data loss or security implications`}
                        className="min-h-[200px] resize-none"
                    />
                    <div className="flex justify-between text-sm">
                        <p className="text-gray-500">
                            Include quantifiable metrics where possible.
                        </p>
                        <span className={impactLength > LIMITS.MAX_TEXT_LENGTH * 0.9 ? 'text-amber-600' : 'text-gray-400'}>
                            {impactLength}/{LIMITS.MAX_TEXT_LENGTH}
                        </span>
                    </div>
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
                        Next: Additional Context
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
