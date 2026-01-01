'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    LayoutDashboard,
    Settings,
    LogOut,
    Plus,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Clock,
    Sparkles,
    Trash2,
    BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useIncidentStore, type Draft } from '@/stores/incidentStore';
import { toast } from 'sonner';

export function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [draftsOpen, setDraftsOpen] = useState(true);
    const [incidentsOpen, setIncidentsOpen] = useState(true);

    const { incidents, drafts, loadDraft, deleteDraft, resetWizard } = useIncidentStore();

    const handleSignOut = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleLoadDraft = (draftId: string) => {
        loadDraft(draftId);
        router.push('/dashboard/new');
        toast.success('Draft loaded');
    };

    const handleDeleteDraft = (e: React.MouseEvent, draftId: string) => {
        e.stopPropagation();
        deleteDraft(draftId);
        toast.success('Draft deleted');
    };

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={cn(
                "fixed left-0 top-0 bottom-0 z-40 bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Logo */}
            <div className={cn(
                "h-16 flex items-center border-b border-gray-200 px-4",
                collapsed ? "justify-center" : "justify-between"
            )}>
                <Link href="/dashboard" className="flex items-center space-x-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    {!collapsed && (
                        <span className="text-lg font-bold text-gray-900">
                            AEGIS
                        </span>
                    )}
                </Link>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors",
                        collapsed && "absolute -right-3 top-6 bg-white border border-gray-200 shadow-sm"
                    )}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-1">
                <Link href="/dashboard">
                    <div className={cn(
                        "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200",
                        pathname === '/dashboard'
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                        collapsed && "justify-center px-2"
                    )}>
                        <LayoutDashboard className={cn("w-5 h-5 flex-shrink-0", !collapsed && "mr-3")} />
                        {!collapsed && <span className="font-medium">Dashboard</span>}
                    </div>
                </Link>

                <Link href="/dashboard/new">
                    <div className={cn(
                        "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200",
                        pathname === '/dashboard/new'
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                        collapsed && "justify-center px-2"
                    )}>
                        <Plus className={cn("w-5 h-5 flex-shrink-0", !collapsed && "mr-3")} />
                        {!collapsed && <span className="font-medium">New Incident</span>}
                    </div>
                </Link>

                <Link href="/dashboard/analytics">
                    <div className={cn(
                        "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200",
                        pathname === '/dashboard/analytics'
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
                        collapsed && "justify-center px-2"
                    )}>
                        <BarChart3 className={cn("w-5 h-5 flex-shrink-0", !collapsed && "mr-3")} />
                        {!collapsed && <span className="font-medium">Analytics</span>}
                    </div>
                </Link>

                <Link href="/settings">
                    <div className={cn(
                        "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200",
                        pathname === '/settings'
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white",
                        collapsed && "justify-center px-2"
                    )}>
                        <Settings className={cn("w-5 h-5 flex-shrink-0", !collapsed && "mr-3")} />
                        {!collapsed && <span className="font-medium">Settings</span>}
                    </div>
                </Link>
            </nav>

            {/* Drafts & Incidents Sections (only when not collapsed) */}
            {!collapsed && (
                <div className="flex-1 overflow-y-auto sidebar-scroll px-3">
                    {/* Drafts Section */}
                    <div className="mt-4">
                        <button
                            onClick={() => setDraftsOpen(!draftsOpen)}
                            className="flex items-center justify-between w-full py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                            <span className="flex items-center">
                                <Clock className="w-3.5 h-3.5 mr-2" />
                                Drafts
                                {drafts.length > 0 && (
                                    <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-700 rounded-full">
                                        {drafts.length}
                                    </span>
                                )}
                            </span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", draftsOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {draftsOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-1 pb-2">
                                        {drafts.length === 0 ? (
                                            <p className="text-xs text-gray-400 px-2 py-2">No drafts yet</p>
                                        ) : (
                                            drafts.map((draft: Draft) => (
                                                <div
                                                    key={draft.id}
                                                    onClick={() => handleLoadDraft(draft.id)}
                                                    className="group flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer hover:bg-amber-50 transition-colors"
                                                >
                                                    <div className="flex items-center min-w-0 flex-1">
                                                        <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700 truncate">
                                                            {draft.title || 'Untitled'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={(e) => handleDeleteDraft(e, draft.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-all"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Generated Incidents Section */}
                    <div className="mt-2">
                        <button
                            onClick={() => setIncidentsOpen(!incidentsOpen)}
                            className="flex items-center justify-between w-full py-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700"
                        >
                            <span className="flex items-center">
                                <Sparkles className="w-3.5 h-3.5 mr-2" />
                                Generated
                                {incidents.length > 0 && (
                                    <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-700 rounded-full">
                                        {incidents.length}
                                    </span>
                                )}
                            </span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", incidentsOpen && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                            {incidentsOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-1 pb-2">
                                        {incidents.length === 0 ? (
                                            <p className="text-xs text-gray-400 px-2 py-2">No incidents yet</p>
                                        ) : (
                                            incidents.map((incident) => (
                                                <Link
                                                    key={incident.id}
                                                    href={`/dashboard/incidents/${incident.id}`}
                                                >
                                                    <div className={cn(
                                                        "flex items-center px-2 py-2 rounded-lg cursor-pointer transition-colors",
                                                        pathname === `/dashboard/incidents/${incident.id}`
                                                            ? "bg-blue-50 text-blue-700"
                                                            : "hover:bg-gray-100"
                                                    )}>
                                                        <span className={cn(
                                                            "w-2 h-2 rounded-full mr-2 flex-shrink-0",
                                                            incident.status === 'FINAL' ? 'bg-green-500' : 'bg-blue-500'
                                                        )} />
                                                        <span className="text-sm text-gray-700 truncate">
                                                            {incident.title}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Sign Out */}
            <div className="p-3 border-t border-gray-200 mt-auto">
                <Button
                    variant="ghost"
                    onClick={handleSignOut}
                    className={cn(
                        "w-full text-gray-600 hover:text-gray-900",
                        collapsed ? "px-2 justify-center" : "justify-start"
                    )}
                >
                    <LogOut className={cn("w-5 h-5", !collapsed && "mr-3")} />
                    {!collapsed && "Sign Out"}
                </Button>
            </div>
        </motion.aside>
    );
}
