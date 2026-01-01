'use client';

import { useState } from 'react';
import { useIncidentStore } from '@/stores/incidentStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowRight } from 'lucide-react';
import type { IncidentType, Severity } from '@/types';

const incidentTypes: { value: IncidentType; label: string }[] = [
    { value: 'OUTAGE', label: 'Service Outage' },
    { value: 'SECURITY', label: 'Security Incident' },
    { value: 'DEPLOYMENT', label: 'Deployment Issue' },
    { value: 'DATA', label: 'Data Incident' },
    { value: 'OTHER', label: 'Other' },
];

const severityLevels: { value: Severity; label: string; description: string }[] = [
    { value: 'CRITICAL', label: 'Critical', description: 'Complete service outage' },
    { value: 'HIGH', label: 'High', description: 'Major functionality impacted' },
    { value: 'MEDIUM', label: 'Medium', description: 'Partial degradation' },
    { value: 'LOW', label: 'Low', description: 'Minor issue, workaround available' },
];

export function Step1Basics() {
    const { wizardData, updateWizardData, nextStep } = useIncidentStore();
    const [customType, setCustomType] = useState('');

    const handleNext = () => {
        if (wizardData.title && wizardData.incident_type && wizardData.severity && wizardData.start_time) {
            // If OTHER is selected, save the custom type in the title or description
            if (wizardData.incident_type === 'OTHER' && customType) {
                updateWizardData({ custom_type: customType });
            }
            nextStep();
        }
    };

    const isValid = wizardData.title && wizardData.incident_type && wizardData.severity && wizardData.start_time;

    return (
        <Card className="border-gray-200 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Incident Basics</CardTitle>
                <CardDescription>
                    Start by providing the essential details about this incident.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-base">
                        Incident Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="title"
                        placeholder="e.g., Database Connection Pool Exhaustion"
                        value={wizardData.title || ''}
                        onChange={(e) => updateWizardData({ title: e.target.value })}
                        className="h-12"
                    />
                    <p className="text-sm text-gray-500">
                        A clear, descriptive title for this incident.
                    </p>
                </div>

                {/* Incident Type */}
                <div className="space-y-2">
                    <Label htmlFor="type" className="text-base">
                        Incident Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={wizardData.incident_type || ''}
                        onValueChange={(value) => updateWizardData({ incident_type: value as IncidentType })}
                    >
                        <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select incident type" />
                        </SelectTrigger>
                        <SelectContent>
                            {incidentTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Custom type input when OTHER is selected */}
                    {wizardData.incident_type === 'OTHER' && (
                        <div className="mt-3">
                            <Label htmlFor="custom_type" className="text-sm text-gray-600">
                                Specify the incident type
                            </Label>
                            <Input
                                id="custom_type"
                                placeholder="e.g., Network latency issue, Third-party service failure..."
                                value={customType}
                                onChange={(e) => setCustomType(e.target.value)}
                                className="h-10 mt-1"
                            />
                        </div>
                    )}
                </div>

                {/* Severity */}
                <div className="space-y-2">
                    <Label className="text-base">
                        Severity <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                        {severityLevels.map((level) => (
                            <button
                                key={level.value}
                                onClick={() => updateWizardData({ severity: level.value })}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${wizardData.severity === level.value
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="font-semibold text-gray-900">{level.label}</div>
                                <div className="text-sm text-gray-500">{level.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="start_time" className="text-base">
                            Start Time <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="start_time"
                            type="datetime-local"
                            value={wizardData.start_time || ''}
                            onChange={(e) => updateWizardData({ start_time: e.target.value })}
                            className="h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="end_time" className="text-base">
                            End Time <span className="text-gray-400">(optional)</span>
                        </Label>
                        <Input
                            id="end_time"
                            type="datetime-local"
                            value={wizardData.end_time || ''}
                            onChange={(e) => updateWizardData({ end_time: e.target.value })}
                            className="h-12"
                        />
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleNext}
                        disabled={!isValid}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                        Next: Timeline
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
