'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Clock,
    AlertTriangle,
    Share2,
    Download,
    CheckCircle2,
    Copy,
    Loader2,
    Mail,
    MessageSquare,
    ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { getSeverityColor, getStatusColor, formatDate, downloadMarkdown, copyToClipboard } from '@/lib/utils';
import { generateIncidentPDF } from '@/lib/pdf';
import { toast } from 'sonner';
import { useIncidentStore } from '@/stores/incidentStore';
import type { Incident } from '@/types';

// Demo incident data for IDs demo-1, demo-2
const demoIncidents: Record<string, Incident> = {
    'demo-1': {
        id: 'demo-1',
        organization_id: '',
        title: 'Database Connection Pool Exhaustion',
        incident_type: 'OUTAGE',
        severity: 'CRITICAL',
        status: 'FINAL',
        start_time: '2025-01-15T09:15:00Z',
        end_time: '2025-01-15T10:02:00Z',
        shared_count: 5,
        created_at: '2025-01-15T10:30:00Z',
        finalized_at: null,
        timeline: [
            { id: '1', timestamp: '09:15', description: 'Monitoring alerts triggered for elevated API response times' },
            { id: '2', timestamp: '09:18', description: 'On-call engineer acknowledged alert and began investigation' },
            { id: '3', timestamp: '09:23', description: 'Database connection errors observed in application logs' },
            { id: '4', timestamp: '09:31', description: 'Customer reports began arriving via support channels' },
            { id: '5', timestamp: '09:35', description: 'Connection pool exhaustion identified as root cause' },
            { id: '6', timestamp: '09:42', description: 'Emergency pool limit increase deployed' },
            { id: '7', timestamp: '09:55', description: 'Patch deployed to production' },
            { id: '8', timestamp: '10:02', description: 'API response times normalized; incident resolved' },
        ],
        root_cause: 'The root cause was identified as database connection pool exhaustion. A deployment on January 14th included a new feature that introduced several inefficient database queries.',
        impact: 'Approximately 2,400 unique users experienced failed API requests. 47 minutes of degraded service affecting all API endpoints. Estimated revenue impact: $3,200 in failed transactions.',
        resolution: 'Immediately increased database connection pool limit from 100 to 200. Deployed query optimizations to reduce execution time by 60%. Added database query indexes for the affected queries.',
        action_items: [
            { id: '1', action: 'Implement connection pool usage alerting (>80% threshold)', owner: 'DevOps', priority: 'P0' as const, completed: false },
            { id: '2', action: 'Add query execution time monitoring dashboard', owner: 'Platform Team', priority: 'P0' as const, completed: false },
            { id: '3', action: 'Document emergency connection pool procedures in runbook', owner: 'SRE Lead', priority: 'P1' as const, completed: true },
            { id: '4', action: 'Schedule quarterly capacity planning review', owner: 'Engineering Manager', priority: 'P1' as const, completed: false },
        ],
        report_markdown: `# Database Connection Pool Exhaustion

## Executive Summary
On January 15th, 2025, our primary API experienced a 47-minute outage beginning at 09:15 UTC. The incident was caused by database connection pool exhaustion, triggered by a surge in traffic combined with inefficient database queries introduced in a recent deployment.

## Incident Overview
| Field | Value |
|-------|-------|
| Type | Service Outage |
| Severity | Critical |
| Duration | 47 minutes |
| Detection | Automated monitoring |

## Timeline
- **09:15** - Monitoring alerts triggered for elevated API response times
- **09:18** - On-call engineer acknowledged alert and began investigation
- **09:23** - Database connection errors observed in application logs
- **09:31** - Customer reports began arriving via support channels
- **09:35** - Connection pool exhaustion identified as root cause
- **09:42** - Emergency pool limit increase deployed
- **09:55** - Patch deployed to production
- **10:02** - API response times normalized; incident resolved

## Root Cause Analysis
The root cause was identified as database connection pool exhaustion. A deployment on January 14th included a new feature that introduced several inefficient database queries.

## Impact Assessment
- Approximately 2,400 unique users experienced failed API requests
- 47 minutes of degraded service affecting all API endpoints
- Estimated revenue impact: $3,200 in failed transactions

## Resolution
1. Immediately increased database connection pool limit from 100 to 200
2. Deployed query optimizations to reduce execution time by 60%
3. Added database query indexes for the affected queries

## Action Items
| Action | Owner | Priority |
|--------|-------|----------|
| Implement connection pool alerting | DevOps | P0 |
| Add query monitoring dashboard | Platform Team | P0 |
| Document emergency procedures | SRE Lead | P1 |
| Schedule capacity planning review | Engineering Manager | P1 |

---
*Generated by AEGIS INCIDENTS*
`,
    },
    'demo-2': {
        id: 'demo-2',
        organization_id: '',
        title: 'Payment Gateway Timeout Issues',
        incident_type: 'OUTAGE',
        severity: 'HIGH',
        status: 'GENERATED',
        start_time: '2025-01-10T14:23:00Z',
        end_time: '2025-01-10T15:45:00Z',
        shared_count: 2,
        created_at: '2025-01-10T16:00:00Z',
        finalized_at: null,
        timeline: [
            { id: '1', timestamp: '14:23', description: 'Payment failures detected' },
            { id: '2', timestamp: '15:45', description: 'Issue resolved' },
        ],
        root_cause: 'Payment gateway provider experienced internal issues.',
        impact: 'Failed payments for ~500 customers.',
        resolution: 'Waited for provider resolution and added fallback handling.',
        action_items: [],
        report_markdown: '# Payment Gateway Timeout Issues\n\nPayment gateway experienced timeout issues.',
    },
};

export default function IncidentDetailPage() {
    const params = useParams();
    const incidentId = params.id as string;
    const [activeTab, setActiveTab] = useState('overview');
    const { incidents: storeIncidents } = useIncidentStore();
    const [incident, setIncident] = useState<Incident | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // First check store for generated incidents
        const storeIncident = storeIncidents.find(i => i.id === incidentId);
        if (storeIncident) {
            setIncident(storeIncident);
            setIsLoading(false);
            return;
        }

        // Then check demo incidents
        if (demoIncidents[incidentId]) {
            setIncident(demoIncidents[incidentId]);
            setIsLoading(false);
            return;
        }

        // Not found
        setIsLoading(false);
    }, [incidentId, storeIncidents]);

    const handleCopyMarkdown = async () => {
        if (!incident) return;
        try {
            await copyToClipboard(incident.report_markdown);
            toast.success('Copied to clipboard');
        } catch {
            toast.error('Failed to copy');
        }
    };

    const handleDownload = async () => {
        if (!incident) return;
        const toastId = toast.loading('Generating PDF...');
        try {
            await generateIncidentPDF(incident);
            toast.success('PDF downloaded successfully', { id: toastId });
        } catch (error) {
            toast.error('Failed to generate PDF', { id: toastId });
            console.error('PDF generation error:', error);
        }
    };

    const handleShare = () => {
        if (!incident) return;
        const shareUrl = `${window.location.origin}/public/incident/${incident.id}`;
        copyToClipboard(shareUrl);
        toast.success('Share link copied to clipboard');
    };

    const handleEmailShare = () => {
        if (!incident) return;
        const shareUrl = `${window.location.origin}/public/incident/${incident.id}`;
        const subject = encodeURIComponent(`Incident Postmortem: ${incident.title}`);
        const body = encodeURIComponent(`Here is the incident postmortem for "${incident.title}":\n\n${shareUrl}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
        toast.success('Email draft opened');
    };

    const handleSlackShare = () => {
        if (!incident) return;
        const shareUrl = `${window.location.origin}/public/incident/${incident.id}`;
        const message = `📋 *Incident Postmortem: ${incident.title}*\n\n${shareUrl}`;
        copyToClipboard(message);
        toast.success('Slack message copied! Paste in Slack.');
    };

    const handleWhatsAppShare = () => {
        if (!incident) return;
        const shareUrl = `${window.location.origin}/public/incident/${incident.id}`;
        const text = encodeURIComponent(`📋 Incident Postmortem: ${incident.title}\n\n${shareUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
        toast.success('Opening WhatsApp...');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!incident) {
        return (
            <div className="min-h-screen">
                <DashboardHeader title="Incident Not Found" />
                <div className="p-6">
                    <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Link>
                    <Card className="border-gray-200">
                        <CardContent className="py-12 text-center">
                            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Incident Not Found</h2>
                            <p className="text-gray-600">The incident you&apos;re looking for doesn&apos;t exist.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Calculate duration
    const startTime = new Date(incident.start_time);
    const endTime = incident.end_time ? new Date(incident.end_time) : new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMins = Math.round(durationMs / 60000);

    return (
        <div className="min-h-screen">
            <DashboardHeader title="Incident Details" />

            <div className="p-6">
                {/* Back link */}
                <Link href="/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">{incident.title}</h1>
                                <Badge className={getSeverityColor(incident.severity)}>
                                    {incident.severity}
                                </Badge>
                                <Badge className={getStatusColor(incident.status)}>
                                    {incident.status}
                                </Badge>
                            </div>
                            <p className="text-gray-600">
                                {formatDate(incident.start_time)} • Duration: {durationMins} minutes
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                        <ChevronDown className="w-4 h-4 ml-2" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={handleShare}>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Link
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleEmailShare}>
                                        <Mail className="w-4 h-4 mr-2" />
                                        Share via Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleSlackShare}>
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Copy for Slack
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleWhatsAppShare}>
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Share via WhatsApp
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="outline" onClick={handleDownload}>
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
                >
                    <Card className="border-gray-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Duration</p>
                                    <p className="text-xl font-bold text-gray-900">{durationMins} min</p>
                                </div>
                                <Clock className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Severity</p>
                                    <p className="text-xl font-bold text-gray-900">{incident.severity}</p>
                                </div>
                                <AlertTriangle className="w-8 h-8 text-amber-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Action Items</p>
                                    <p className="text-xl font-bold text-gray-900">{incident.action_items?.length || 0}</p>
                                </div>
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-gray-200">
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Times Shared</p>
                                    <p className="text-xl font-bold text-gray-900">{incident.shared_count}</p>
                                </div>
                                <Share2 className="w-8 h-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="timeline">Timeline</TabsTrigger>
                            <TabsTrigger value="analysis">Analysis</TabsTrigger>
                            <TabsTrigger value="actions">Action Items</TabsTrigger>
                            <TabsTrigger value="report">Full Report</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview">
                            <Card className="border-gray-200">
                                <CardContent className="pt-6 space-y-6">
                                    {/* Root Cause */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Root Cause</h3>
                                        <p className="text-gray-700">{incident.root_cause || 'Not specified'}</p>
                                    </div>

                                    {/* Impact */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Impact</h3>
                                        <p className="text-gray-700">{incident.impact || 'Not specified'}</p>
                                    </div>

                                    {/* Resolution */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Resolution</h3>
                                        <p className="text-gray-700">{incident.resolution || 'Not specified'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="timeline">
                            <Card className="border-gray-200">
                                <CardContent className="pt-6">
                                    {incident.timeline && incident.timeline.length > 0 ? (
                                        <div className="space-y-4">
                                            {incident.timeline.map((entry, index) => (
                                                <div key={entry.id} className="flex items-start">
                                                    <div className="flex-shrink-0 w-16 text-sm font-mono text-gray-500">
                                                        {entry.timestamp}
                                                    </div>
                                                    <div className="flex-shrink-0 w-8 flex justify-center">
                                                        <div className={`w-3 h-3 rounded-full mt-1.5 ${index === incident.timeline!.length - 1
                                                            ? 'bg-green-500'
                                                            : index === 0
                                                                ? 'bg-red-500'
                                                                : 'bg-blue-500'
                                                            }`} />
                                                    </div>
                                                    <div className="text-gray-700">{entry.description}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No timeline entries</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="analysis">
                            <Card className="border-gray-200">
                                <CardContent className="pt-6 space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Root Cause Analysis</h3>
                                        <p className="text-gray-700 leading-relaxed">{incident.root_cause || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Impact Assessment</h3>
                                        <p className="text-gray-700 leading-relaxed">{incident.impact || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Resolution Steps</h3>
                                        <p className="text-gray-700 leading-relaxed">{incident.resolution || 'Not specified'}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="actions">
                            <Card className="border-gray-200">
                                <CardContent className="pt-6">
                                    {incident.action_items && incident.action_items.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Owner</th>
                                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {incident.action_items.map((item) => (
                                                        <tr key={item.id} className="border-b border-gray-100">
                                                            <td className="py-3 px-4">
                                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${item.completed ? 'bg-green-100' : 'bg-gray-100'
                                                                    }`}>
                                                                    {item.completed ? (
                                                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                                    ) : (
                                                                        <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className={`py-3 px-4 ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                                                {item.action}
                                                            </td>
                                                            <td className="py-3 px-4 text-gray-600">{item.owner}</td>
                                                            <td className="py-3 px-4">
                                                                <Badge className={
                                                                    item.priority === 'P0'
                                                                        ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                                                        : item.priority === 'P1'
                                                                            ? 'bg-orange-100 text-orange-800 hover:bg-orange-100'
                                                                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                                                }>
                                                                    {item.priority}
                                                                </Badge>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-8">No action items</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="report">
                            <Card className="border-gray-200">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold text-gray-900">Full Markdown Report</h3>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="outline" size="sm" onClick={handleCopyMarkdown}>
                                                <Copy className="w-4 h-4 mr-2" />
                                                Copy
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={handleDownload}>
                                                <Download className="w-4 h-4 mr-2" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-6 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                                        {incident.report_markdown || 'No report generated yet.'}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
}
