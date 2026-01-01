'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Plus, FileText, Clock, AlertTriangle, Share2, MoreVertical,
    Trash2, RefreshCw, Eye, Sparkles, TrendingUp, Search, Filter, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { getSeverityColor, getStatusColor, formatRelativeTime, getIncidentTypeLabel } from '@/lib/utils';
import { useIncidentStore, type Draft } from '@/stores/incidentStore';
import { toast } from 'sonner';

// Demo incidents for display when no real data
const demoIncidents = [
    {
        id: 'demo-1',
        title: 'Database Connection Pool Exhaustion',
        incident_type: 'OUTAGE',
        severity: 'CRITICAL',
        status: 'FINAL',
        start_time: '2025-01-15T09:15:00Z',
        end_time: '2025-01-15T10:02:00Z',
        shared_count: 5,
        created_at: '2025-01-15T10:30:00Z',
        isDemo: true,
    },
    {
        id: 'demo-2',
        title: 'Payment Gateway Timeout Issues',
        incident_type: 'OUTAGE',
        severity: 'HIGH',
        status: 'GENERATED',
        start_time: '2025-01-10T14:23:00Z',
        end_time: '2025-01-10T15:45:00Z',
        shared_count: 2,
        created_at: '2025-01-10T16:00:00Z',
        isDemo: true,
    },
];

export default function DashboardPage() {
    const router = useRouter();
    const {
        incidents: storeIncidents,
        drafts,
        deleteIncident,
        deleteDraft,
        loadDraft,
        updateIncident
    } = useIncidentStore();

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [severityFilter, setSeverityFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<{ id: string; type: 'incident' | 'draft' } | null>(null);
    const [isRegenerating, setIsRegenerating] = useState<string | null>(null);

    // Combine store incidents with demo incidents
    const allIncidents = useMemo(() => [
        ...storeIncidents.map(i => ({ ...i, isDemo: false })),
        ...demoIncidents
    ], [storeIncidents]);

    // Filtered incidents
    const filteredIncidents = useMemo(() => {
        return allIncidents.filter(incident => {
            // Search filter
            if (searchQuery && !incident.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            // Severity filter
            if (severityFilter !== 'all' && incident.severity !== severityFilter) {
                return false;
            }
            // Status filter
            if (statusFilter !== 'all' && incident.status !== statusFilter) {
                return false;
            }
            // Type filter
            if (typeFilter !== 'all' && incident.incident_type !== typeFilter) {
                return false;
            }
            return true;
        });
    }, [allIncidents, searchQuery, severityFilter, statusFilter, typeFilter]);

    const hasActiveFilters = searchQuery || severityFilter !== 'all' || statusFilter !== 'all' || typeFilter !== 'all';

    const clearFilters = () => {
        setSearchQuery('');
        setSeverityFilter('all');
        setStatusFilter('all');
        setTypeFilter('all');
    };

    const stats = [
        {
            label: 'Total Incidents',
            value: String(allIncidents.length),
            icon: FileText,
            gradient: 'from-blue-500 to-blue-600',
            bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900'
        },
        {
            label: 'Avg. Resolution',
            value: '34m',
            icon: Clock,
            gradient: 'from-emerald-500 to-emerald-600',
            bgGradient: 'from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900'
        },
        {
            label: 'Critical This Month',
            value: String(allIncidents.filter(i => i.severity === 'CRITICAL').length),
            icon: AlertTriangle,
            gradient: 'from-rose-500 to-rose-600',
            bgGradient: 'from-rose-50 to-rose-100 dark:from-rose-950 dark:to-rose-900'
        },
        {
            label: 'Drafts Saved',
            value: String(drafts.length),
            icon: TrendingUp,
            gradient: 'from-amber-500 to-amber-600',
            bgGradient: 'from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900'
        },
    ];

    const handleView = (incidentId: string) => {
        router.push(`/dashboard/incidents/${incidentId}`);
    };

    const handleDelete = (id: string, type: 'incident' | 'draft', isDemo: boolean = false) => {
        if (isDemo) {
            toast.error('Cannot delete demo incidents');
            return;
        }
        setSelectedItem({ id, type });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (selectedItem) {
            if (selectedItem.type === 'incident') {
                deleteIncident(selectedItem.id);
                toast.success('Incident deleted');
            } else {
                deleteDraft(selectedItem.id);
                toast.success('Draft deleted');
            }
        }
        setDeleteDialogOpen(false);
        setSelectedItem(null);
    };

    const handleLoadDraft = (draftId: string) => {
        loadDraft(draftId);
        router.push('/dashboard/new');
        toast.success('Draft loaded - continue editing');
    };

    const handleRegenerate = async (incidentId: string, isDemo: boolean) => {
        if (isDemo) {
            toast.error('Cannot regenerate demo incidents');
            return;
        }

        setIsRegenerating(incidentId);
        const toastId = toast.loading('Regenerating postmortem...');

        try {
            const incident = storeIncidents.find(i => i.id === incidentId);
            if (!incident) throw new Error('Incident not found');

            const response = await fetch('/api/incidents/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: incident.title,
                    incident_type: incident.incident_type,
                    severity: incident.severity,
                    start_time: incident.start_time,
                    end_time: incident.end_time,
                    timeline: incident.timeline,
                    root_cause: incident.root_cause,
                    impact: incident.impact,
                    resolution: incident.resolution,
                }),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to regenerate');

            updateIncident(incidentId, {
                action_items: result.data?.actionItems || [],
                report_markdown: result.data?.reportMarkdown || '',
                status: 'GENERATED',
            });

            toast.success('Postmortem regenerated!', { id: toastId });
            router.push(`/dashboard/incidents/${incidentId}`);
        } catch (error: unknown) {
            const err = error as { message?: string };
            toast.error(err.message || 'Failed to regenerate', { id: toastId });
        } finally {
            setIsRegenerating(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <DashboardHeader title="Dashboard" />

            <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                        </div>
                                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient}`}>
                                            <stat.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Search & Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6"
                >
                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                        <CardContent className="py-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search Input */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search incidents..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                    />
                                </div>

                                {/* Filters */}
                                <div className="flex gap-3 flex-wrap">
                                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                                        <SelectTrigger className="w-[130px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                            <SelectValue placeholder="Severity" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Severity</SelectItem>
                                            <SelectItem value="CRITICAL">Critical</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="LOW">Low</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger className="w-[130px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="DRAFT">Draft</SelectItem>
                                            <SelectItem value="GENERATED">Generated</SelectItem>
                                            <SelectItem value="FINAL">Final</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                                        <SelectTrigger className="w-[130px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                            <SelectValue placeholder="Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Types</SelectItem>
                                            <SelectItem value="OUTAGE">Outage</SelectItem>
                                            <SelectItem value="SECURITY">Security</SelectItem>
                                            <SelectItem value="DEPLOYMENT">Deployment</SelectItem>
                                            <SelectItem value="DATA">Data</SelectItem>
                                            <SelectItem value="OTHER">Other</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {hasActiveFilters && (
                                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500">
                                            <X className="w-4 h-4 mr-1" />
                                            Clear
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                                    Showing {filteredIncidents.length} of {allIncidents.length} incidents
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Drafts Section */}
                {drafts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Saved Drafts</h2>
                                <Badge variant="outline" className="text-amber-600 border-amber-300">
                                    {drafts.length}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {drafts.map((draft: Draft) => (
                                <Card
                                    key={draft.id}
                                    className="border-0 shadow-sm bg-white dark:bg-gray-900 cursor-pointer hover:shadow-md transition-shadow"
                                    onClick={() => handleLoadDraft(draft.id)}
                                >
                                    <CardContent className="pt-5 pb-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white truncate mb-1">
                                                    {draft.title || 'Untitled Draft'}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Step {draft.currentStep} of 5 • {formatRelativeTime(draft.updatedAt)}
                                                </p>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleLoadDraft(draft.id); }}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Continue Editing
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(draft.id, 'draft'); }}
                                                        className="text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete Draft
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="mt-3">
                                            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Draft
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Generated Incidents Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Generated Incidents</h2>
                        </div>
                        <Link href="/dashboard/new">
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
                                <Plus className="w-4 h-4 mr-2" />
                                New Incident
                            </Button>
                        </Link>
                    </div>

                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 overflow-hidden">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredIncidents.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Filter className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {hasActiveFilters ? 'No incidents match your filters' : 'No incidents yet'}
                                    </p>
                                    {hasActiveFilters && (
                                        <Button variant="link" onClick={clearFilters} className="mt-2">
                                            Clear filters
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                filteredIncidents.map((incident, index) => (
                                    <motion.div
                                        key={incident.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + index * 0.05 }}
                                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 group"
                                    >
                                        <div className="flex items-start justify-between">
                                            <Link
                                                href={`/dashboard/incidents/${incident.id}`}
                                                className="flex-1 cursor-pointer"
                                            >
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                                        {incident.title}
                                                    </h3>
                                                    <Badge className={getSeverityColor(incident.severity)}>
                                                        {incident.severity}
                                                    </Badge>
                                                    <Badge className={getStatusColor(incident.status)}>
                                                        {incident.status}
                                                    </Badge>
                                                    {incident.isDemo && (
                                                        <Badge variant="outline" className="text-gray-400 border-gray-200 dark:border-gray-700 text-xs">
                                                            Demo
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <span>{getIncidentTypeLabel(incident.incident_type)}</span>
                                                    <span>•</span>
                                                    <span>{formatRelativeTime(incident.created_at)}</span>
                                                    {incident.shared_count > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center">
                                                                <Share2 className="w-3 h-3 mr-1" />
                                                                {incident.shared_count} shares
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </Link>

                                            {/* Actions Menu */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem onClick={() => handleView(incident.id)}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleRegenerate(incident.id, incident.isDemo)}
                                                        disabled={isRegenerating === incident.id}
                                                    >
                                                        <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating === incident.id ? 'animate-spin' : ''}`} />
                                                        Regenerate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(incident.id, 'incident', incident.isDemo)}
                                                        className="text-red-600 focus:text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete {selectedItem?.type === 'draft' ? 'Draft' : 'Incident'}?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the {selectedItem?.type}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
