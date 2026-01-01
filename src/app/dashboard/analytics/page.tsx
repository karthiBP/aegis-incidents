'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { ArrowLeft, TrendingUp, Clock, AlertTriangle, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useIncidentStore } from '@/stores/incidentStore';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
const SEVERITY_COLORS = {
    CRITICAL: '#ef4444',
    HIGH: '#f97316',
    MEDIUM: '#eab308',
    LOW: '#22c55e'
};

// Demo data for visualization
const demoMonthlyData = [
    { month: 'Aug', incidents: 4, resolved: 4 },
    { month: 'Sep', incidents: 6, resolved: 5 },
    { month: 'Oct', incidents: 3, resolved: 3 },
    { month: 'Nov', incidents: 8, resolved: 7 },
    { month: 'Dec', incidents: 5, resolved: 5 },
    { month: 'Jan', incidents: 2, resolved: 2 },
];

const demoResolutionData = [
    { time: '<15m', count: 12 },
    { time: '15-30m', count: 18 },
    { time: '30-60m', count: 8 },
    { time: '1-2h', count: 5 },
    { time: '>2h', count: 3 },
];

export default function AnalyticsPage() {
    const { incidents } = useIncidentStore();

    // Calculate severity distribution
    const severityData = useMemo(() => {
        const counts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };

        // Add demo data
        counts.CRITICAL = 1;
        counts.HIGH = 1;

        // Add store incidents
        incidents.forEach(inc => {
            if (inc.severity in counts) {
                counts[inc.severity as keyof typeof counts]++;
            }
        });

        return Object.entries(counts).map(([name, value]) => ({
            name,
            value,
            color: SEVERITY_COLORS[name as keyof typeof SEVERITY_COLORS]
        }));
    }, [incidents]);

    // Calculate type distribution
    const typeData = useMemo(() => {
        const counts: Record<string, number> = {
            OUTAGE: 2, // Demo data
            SECURITY: 0,
            DEPLOYMENT: 0,
            DATA: 0,
            OTHER: 0
        };

        incidents.forEach(inc => {
            if (inc.incident_type in counts) {
                counts[inc.incident_type]++;
            }
        });

        return Object.entries(counts)
            .filter(([, value]) => value > 0)
            .map(([name, value]) => ({ name, value }));
    }, [incidents]);

    const stats = [
        {
            title: 'Total Incidents',
            value: incidents.length + 2, // Including demo
            subtext: 'All time',
            icon: AlertTriangle,
            color: 'text-blue-600'
        },
        {
            title: 'Avg. Resolution Time',
            value: '34m',
            subtext: 'Last 30 days',
            icon: Clock,
            color: 'text-emerald-600'
        },
        {
            title: 'Improvement',
            value: '+23%',
            subtext: 'vs last month',
            icon: TrendingUp,
            color: 'text-green-600'
        },
        {
            title: 'MTTR',
            value: '47m',
            subtext: 'Mean time to resolve',
            icon: Zap,
            color: 'text-amber-600'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <DashboardHeader title="Analytics" />

            <div className="p-6">
                {/* Back Button */}
                <Link href="/dashboard">
                    <Button variant="ghost" className="mb-6 text-gray-600 dark:text-gray-400">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </Button>
                </Link>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                                            <p className="text-xs text-gray-400 mt-1">{stat.subtext}</p>
                                        </div>
                                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Incidents Over Time */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                            <CardHeader>
                                <CardTitle className="text-lg">Incidents Over Time</CardTitle>
                                <CardDescription>Monthly incident count and resolution</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={demoMonthlyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                                            <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#fff'
                                                }}
                                            />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="incidents"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                dot={{ fill: '#3b82f6' }}
                                                name="Incidents"
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="resolved"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                dot={{ fill: '#10b981' }}
                                                name="Resolved"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Severity Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                            <CardHeader>
                                <CardTitle className="text-lg">Severity Distribution</CardTitle>
                                <CardDescription>Incidents by severity level</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={severityData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {severityData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#fff'
                                                }}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Resolution Time Distribution */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                            <CardHeader>
                                <CardTitle className="text-lg">Resolution Time</CardTitle>
                                <CardDescription>Distribution of time to resolve</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={demoResolutionData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                                            <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#fff'
                                                }}
                                            />
                                            <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Incident Types */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card className="border-0 shadow-sm bg-white dark:bg-gray-900">
                            <CardHeader>
                                <CardTitle className="text-lg">Incident Types</CardTitle>
                                <CardDescription>Breakdown by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={typeData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                                            <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                                            <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={100} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1f2937',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#fff'
                                                }}
                                            />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                                {typeData.map((_, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
