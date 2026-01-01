'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Shield,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Users,
    Calendar
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock incident data - same as detail page
const mockIncident = {
    id: '1',
    title: 'Database Connection Pool Exhaustion',
    incident_type: 'OUTAGE',
    severity: 'CRITICAL',
    status: 'FINAL',
    start_time: '2025-01-15T09:15:00Z',
    end_time: '2025-01-15T10:02:00Z',
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
    root_cause: 'The root cause was identified as database connection pool exhaustion. A deployment on January 14th included a new feature that introduced several inefficient database queries. When traffic increased by 40% during the morning peak, the combination of slow query execution times and increased request volume caused the connection pool to become exhausted.',
    impact: 'Approximately 2,400 unique users experienced failed API requests. 47 minutes of degraded service affecting all API endpoints. Estimated revenue impact: $3,200 in failed transactions. 23 support tickets opened during the incident window. No data loss or security implications.',
    resolution: 'Immediately increased database connection pool limit from 100 to 200. Deployed query optimizations to reduce execution time by 60%. Added database query indexes for the affected queries. Verified system stability through load testing.',
    action_items: [
        { id: '1', action: 'Implement connection pool usage alerting (>80% threshold)', owner: 'DevOps', priority: 'P0' as const },
        { id: '2', action: 'Add query execution time monitoring dashboard', owner: 'Platform Team', priority: 'P0' as const },
        { id: '3', action: 'Document emergency connection pool procedures in runbook', owner: 'SRE Lead', priority: 'P1' as const },
        { id: '4', action: 'Schedule quarterly capacity planning review', owner: 'Engineering Manager', priority: 'P1' as const },
    ],
};

export default function PublicIncidentPage() {
    const params = useParams();
    const incident = mockIncident;

    // Increment shared_count would happen here via API

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                            AEGIS <span className="text-blue-600">INCIDENTS</span>
                        </span>
                    </Link>
                    <Link href="/signup">
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                            Create Your Own
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
                        Incident Postmortem
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        {incident.title}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            January 15, 2025
                        </div>
                        <span>•</span>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            47 minutes
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center text-gray-600 mb-1">
                            <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                            Severity
                        </div>
                        <div className="font-semibold text-gray-900">Critical</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center text-gray-600 mb-1">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                            Duration
                        </div>
                        <div className="font-semibold text-gray-900">47 minutes</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center text-gray-600 mb-1">
                            <Users className="w-4 h-4 mr-2 text-purple-500" />
                            Affected Users
                        </div>
                        <div className="font-semibold text-gray-900">~2,400</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="flex items-center text-gray-600 mb-1">
                            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                            Status
                        </div>
                        <div className="font-semibold text-gray-900">Resolved</div>
                    </div>
                </motion.div>

                {/* Executive Summary */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold text-blue-900 mb-3">Executive Summary</h2>
                    <p className="text-blue-800 leading-relaxed">
                        On January 15th, 2025, our primary API experienced a 47-minute outage beginning at 09:15 UTC.
                        The incident was caused by database connection pool exhaustion, triggered by a surge in traffic
                        combined with inefficient database queries introduced in a recent deployment. Approximately
                        2,400 customers experienced failed API requests during this period. The issue was resolved by
                        increasing connection pool limits and deploying query optimizations. No data loss occurred.
                    </p>
                </motion.section>

                {/* Timeline */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
                    <div className="space-y-4">
                        {incident.timeline.map((item, index) => (
                            <div key={item.id} className="flex items-start">
                                <div className="flex-shrink-0 w-16 text-sm font-mono text-gray-500">
                                    {item.timestamp}
                                </div>
                                <div className="flex-shrink-0 w-8 flex justify-center">
                                    <div className={`w-3 h-3 rounded-full mt-1.5 ${index === incident.timeline.length - 1
                                            ? 'bg-green-500'
                                            : index === 0
                                                ? 'bg-red-500'
                                                : 'bg-blue-500'
                                        }`} />
                                </div>
                                <div className="text-gray-700">{item.description}</div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Root Cause */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Root Cause Analysis</h2>
                    <p className="text-gray-700 leading-relaxed">{incident.root_cause}</p>
                </motion.section>

                {/* Impact */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Impact Assessment</h2>
                    <p className="text-gray-700 leading-relaxed">{incident.impact}</p>
                </motion.section>

                {/* Resolution */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Resolution</h2>
                    <p className="text-gray-700 leading-relaxed">{incident.resolution}</p>
                </motion.section>

                {/* Action Items */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl border border-gray-200 p-6 mb-8"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Action Items</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Action</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Owner</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
                                </tr>
                            </thead>
                            <tbody>
                                {incident.action_items.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100">
                                        <td className="py-3 px-4 text-gray-700">{item.action}</td>
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
                </motion.section>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center"
                >
                    <h2 className="text-2xl font-bold text-white mb-3">
                        Create professional postmortems like this
                    </h2>
                    <p className="text-blue-100 mb-6">
                        AEGIS INCIDENTS helps you generate executive-ready incident documentation in minutes.
                    </p>
                    <Link href="/signup">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                            Get Started Free
                        </Button>
                    </Link>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 mt-12 py-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">
                        Generated with{' '}
                        <Link href="/" className="text-blue-600 hover:underline">
                            AEGIS INCIDENTS
                        </Link>
                    </p>
                </div>
            </footer>
        </div>
    );
}
