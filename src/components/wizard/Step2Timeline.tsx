'use client';

import { useState } from 'react';
import { useIncidentStore } from '@/stores/incidentStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, ArrowLeft, Plus, Trash2, GripVertical, AlertCircle } from 'lucide-react';
import { LIMITS } from '@/types';

export function Step2Timeline() {
    const { wizardData, updateWizardData, addTimelineEntry, removeTimelineEntry, updateTimelineEntry, nextStep, prevStep } = useIncidentStore();
    const [newTime, setNewTime] = useState('');
    const [newDescription, setNewDescription] = useState('');

    const timeline = wizardData.timeline || [];
    const canAddMore = timeline.length < LIMITS.MAX_TIMELINE_ENTRIES;

    const handleAddEntry = () => {
        if (newTime && newDescription) {
            addTimelineEntry({
                timestamp: newTime,
                description: newDescription,
            });
            setNewTime('');
            setNewDescription('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && newTime && newDescription) {
            e.preventDefault();
            handleAddEntry();
        }
    };

    return (
        <Card className="border-gray-200 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl">Timeline</CardTitle>
                <CardDescription>
                    Document the sequence of events during the incident. This is the most important part!
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Add new entry */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Add Timeline Entry</h3>
                    <div className="flex gap-3">
                        <Input
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-32"
                            placeholder="Time"
                        />
                        <Input
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="What happened? (e.g., API errors increased)"
                            className="flex-1"
                        />
                        <Button
                            onClick={handleAddEntry}
                            disabled={!newTime || !newDescription || !canAddMore}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                    {!canAddMore && (
                        <div className="flex items-center mt-2 text-amber-600 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Maximum {LIMITS.MAX_TIMELINE_ENTRIES} entries reached
                        </div>
                    )}
                </div>

                {/* Timeline entries */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                            Timeline Events ({timeline.length}/{LIMITS.MAX_TIMELINE_ENTRIES})
                        </h3>
                    </div>

                    {timeline.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500">No timeline entries yet.</p>
                            <p className="text-sm text-gray-400">Add events in the order they occurred.</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {timeline.map((entry, index) => (
                                <div
                                    key={entry.id}
                                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg group hover:border-gray-300 transition-colors"
                                >
                                    <div className="text-gray-400 cursor-move">
                                        <GripVertical className="w-4 h-4" />
                                    </div>
                                    <div className="w-20 flex-shrink-0">
                                        <Input
                                            type="time"
                                            value={entry.timestamp}
                                            onChange={(e) => updateTimelineEntry(entry.id, { timestamp: e.target.value })}
                                            className="text-sm font-mono"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <Input
                                            value={entry.description}
                                            onChange={(e) => updateTimelineEntry(entry.id, { description: e.target.value })}
                                            className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                                        />
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeTimelineEntry(entry.id)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Tips for a good timeline</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Start with when the issue was first detected</li>
                        <li>• Include key milestones: detection, diagnosis, fix deployed, resolved</li>
                        <li>• Don&apos;t worry about perfect wording—AI will help polish it</li>
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
                        disabled={timeline.length === 0}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                        Next: Root Cause
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
